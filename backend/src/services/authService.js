// src/services/authService.js
const bcrypt = require('bcryptjs');
const authRepo = require('../repositories/authRepository');
const ApiError = require('../utils/ApiError');
const jwtHelper = require('../utils/jwtHelper');
const logger = require('../utils/logger');
const auditService = require('./auditService');

const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 5;
const FAKE_HASH = '$2a$10$X7YREkO9XG/vN.L1Z6Yq6.K7W6L5M4N3O2P1QzRySxTuUvVwWxXyY';

const login = async (email, password, ipAddress) => {
  logger.debug(`  ⚙️ [authService] Attempting login for: ${email}`);

  // Check if email is blocked
  const blockStatus = await authRepo.getBlockedStatus(email);
  if (blockStatus && blockStatus.blocked_until && new Date(blockStatus.blocked_until) > new Date()) {
    const timeLeft = Math.ceil((new Date(blockStatus.blocked_until) - new Date()) / 60000);
    throw new ApiError(403, `Account temporarily blocked, try after ${timeLeft} minutes`);
  }

  // Find user by email (constant-time comparison regardless of existence)
  const user = await authRepo.findByEmail(email);
  const hashToCompare = user ? user.password_hash : FAKE_HASH;
  const isValid = await bcrypt.compare(password, hashToCompare);

  // Handle failed login (same response for invalid email OR wrong password — prevents enumeration)
  if (!isValid || !user) {
    const attempts = (blockStatus?.attempts || 0) + 1;

    if (attempts >= MAX_ATTEMPTS) {
      const blockTime = new Date(new Date().getTime() + BLOCK_DURATION);
      await authRepo.updateFailedLogin(email, true, blockTime);
    } else {
      await authRepo.updateFailedLogin(email, false, null);
    }

    // Log failed attempt
    await auditService.log({
      user_id: user?.id,
      module: 'AUTH',
      action: 'LOGIN_FAILED',
      table_name: 'users',
      affected_record_id: user?.id,
      description: `Failed login attempt for email: ${email}`,
      ip_address: ipAddress
    });

    if (attempts >= MAX_ATTEMPTS) {
      throw new ApiError(403, `Account temporarily blocked. Try again after ${BLOCK_DURATION / 60000} minutes.`);
    }

    throw new ApiError(401, `Invalid credentials. ${MAX_ATTEMPTS - attempts} attempts remaining.`);
  }

  // Store last login time BEFORE updating it
  const lastLoginTime = user.last_login_at;

  // Success: Reset blocks and increment session version
  logger.debug(`  ✨ [authService] Authentication successful for: ${email}`);
  await authRepo.resetLoginAttempts(email);
  const incrementResult = await authRepo.incrementSessionVersion(user.id);
  await authRepo.updateLastLoginTime(user.id);

  const sessionVersion = await authRepo.getSessionVersion(user.id);

  // Delete all existing refresh tokens (single session policy)
  const deleteTokensResult = await authRepo.deleteUserRefreshTokens(user.id);

  // Generate tokens (simplified payload — no roles/departments)
  const payload = {
    sub: user.id,
    sv: sessionVersion
  };

  const accessToken = jwtHelper.generateToken(payload);
  const refreshToken = jwtHelper.generateRefreshToken(payload);

  // Store refresh token (hashed)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await authRepo.saveRefreshToken(user.id, refreshToken, expiresAt);

  const executedQueries = [
    incrementResult?.query,
    deleteTokensResult?.query
  ].filter(Boolean).join('; ');

  // Log successful login
  await auditService.log({
    user_id: user.id,
    module: 'AUTH',
    action: 'LOGIN_SUCCESS',
    table_name: 'users',
    affected_record_id: user.id,
    description: `Successful login for ${user.name} (${email})`,
    ip_address: ipAddress,
    executed_query: executedQueries || 'No queries executed'
  });

  const formattedLastLogin = lastLoginTime
    ? new Date(lastLoginTime).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', '')
    : null;

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      last_login: formattedLastLogin
    }
  };
};

const refreshAccessToken = async (receivedRefreshToken, ipAddress) => {
  logger.debug('  ⚙️ [authService] Attempting to rotate access token');

  try {
    // Verify refresh token
    const decoded = jwtHelper.verifyRefreshToken(receivedRefreshToken);
    
    // Find stored token (hash comparison happens in repo)
    const storedToken = await authRepo.findRefreshToken(receivedRefreshToken);

    if (!storedToken) {
      throw new ApiError(401, 'Refresh token not found or revoked');
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      // Capture the delete query for expired token
      const deleteResult = await authRepo.deleteRefreshToken(receivedRefreshToken);
      throw new ApiError(401, 'Refresh token expired');
    }

    // Get current session version
    const currentSessionVersion = await authRepo.getSessionVersion(decoded.sub);
    
    // Verify session version matches
    if (currentSessionVersion !== decoded.sv) {
      // Capture the delete query for invalid session
      const deleteResult = await authRepo.deleteRefreshToken(receivedRefreshToken);
      throw new ApiError(401, 'Session invalidated. Please login again.');
    }

    // Get user details
    const user = await authRepo.findById(decoded.sub);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Delete old refresh token
    const deleteResult = await authRepo.deleteRefreshToken(receivedRefreshToken);

    // Generate new tokens
    const payload = {
      sub: user.id,
      sv: currentSessionVersion
    };

    const newAccessToken = jwtHelper.generateToken(payload);
    const newRefreshToken = jwtHelper.generateRefreshToken(payload);

    // Save new refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const saveResult = await authRepo.saveRefreshToken(user.id, newRefreshToken, expiresAt);

    // Log token refresh
    await auditService.log({
      user_id: user.id,
      module: 'AUTH',
      action: 'TOKEN_REFRESH',
      table_name: 'refresh_tokens',
      affected_record_id: storedToken.id,
      description: `Token refreshed for ${user.name}`,
      ip_address: ipAddress,
      executed_query: `${deleteResult?.query}; ${saveResult?.query}`
    });

    logger.debug(`  ✨ [authService] Token rotation successful for: ${user.email}`);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  } catch (error) {
    logger.error(`  ❌ [authService] Rotation failed: ${error.message}`);
    throw new ApiError(401, 'Invalid refresh token');
  }
};

const logout = async (accessToken, refreshToken, ipAddress) => {
  try {
    const decoded = jwtHelper.decodeToken(accessToken);

    if (decoded && decoded.sub) {
      const incrementResult = await authRepo.incrementSessionVersion(decoded.sub);

      await auditService.log({
        user_id: decoded.sub,
        module: 'AUTH',
        action: 'LOGOUT',
        table_name: 'users',
        affected_record_id: decoded.sub,
        description: 'User logged out - session version incremented',
        ip_address: ipAddress,
        executed_query: incrementResult?.query
      });
    }

    if (refreshToken) {
      await authRepo.deleteRefreshToken(refreshToken);
    }

    logger.debug('  ✨ [authService] Logout successful - session version incremented');
  } catch (error) {
    logger.error(`  ❌ [authService] Logout error: ${error.message}`);
  }
};

// Change Password Service
const changePassword = async (userId, currentPassword, newPassword, ipAddress) => {
  logger.debug(`  ⚙️ [authService] Changing password for user: ${userId}`);

  const user = await authRepo.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const storedPasswordHash = await authRepo.verifyPassword(userId);
  const isValid = await bcrypt.compare(currentPassword, storedPasswordHash);

  if (!isValid) {
    await auditService.log({
      user_id: userId,
      module: 'AUTH',
      action: 'PASSWORD_CHANGE_FAILED',
      table_name: 'users',
      affected_record_id: userId,
      description: 'Failed password change attempt - incorrect current password',
      ip_address: ipAddress,
      executed_query: 'Password verification failed – no query executed'
    });

    throw new ApiError(401, 'Current password is incorrect');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  const { newSessionVersion, query: updateQuery } = await authRepo.updatePassword(userId, newPasswordHash);

  const deleteResult = await authRepo.deleteUserRefreshTokens(userId);

  await auditService.log({
    user_id: userId,
    module: 'AUTH',
    action: 'PASSWORD_CHANGE_SUCCESS',
    table_name: 'users',
    affected_record_id: userId,
    description: `Password changed successfully for ${user.name} (${user.email})`,
    ip_address: ipAddress,
    executed_query: `${updateQuery}; ${deleteResult?.query}`
  });

  logger.debug(`  ✨ [authService] Password changed successfully for user: ${userId}, new session version: ${newSessionVersion}`);

  return {
    message: 'Password changed successfully. Please login again with your new password.',
    sessionVersion: newSessionVersion
  };
};

module.exports = { login, refreshAccessToken, logout, changePassword };