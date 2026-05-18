// src/repositories/authRepository.js
const pool = require('../config/db');
const logger = require('../utils/logger');
const crypto = require('crypto');


class AuthRepository {
  // Hash refresh token for storage
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Find user by email (only ACTIVE users)
  async findByEmail(email) {
    logger.debug(`    🗄️  [authRepository] Finding user by email: ${email}`);
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND status = ?',
      [email, 'ACTIVE']
    );
    return rows[0];
  }

  // Find user by ID (only ACTIVE users)
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ? AND status = ?',
      [id, 'ACTIVE']
    );
    return rows[0];
  }

  // Check if email is blocked and get details
  async getBlockedStatus(email) {
    const [rows] = await pool.query('SELECT * FROM blocked_users WHERE email = ?', [email]);
    return rows[0];
  }

  // Increment failed attempts or block user for an email
  async updateFailedLogin(email, isBlocked, blockTime) {
    const existing = await this.getBlockedStatus(email);

    if (existing) {
      if (isBlocked) {
        const query = 'UPDATE blocked_users SET attempts = attempts + 1, blocked_until = ? WHERE email = ?';
        await pool.query(query, [blockTime, email]);
        return { query, params: [blockTime, email] };
      } else {
        const query = 'UPDATE blocked_users SET attempts = attempts + 1 WHERE email = ?';
        await pool.query(query, [email]);
        return { query, params: [email] };
      }
    } else {
      const query = 'INSERT INTO blocked_users (email, attempts) VALUES (?, 1)';
      await pool.query(query, [email]);
      return { query, params: [email, 1] };
    }
  }

  // Reset attempts for an email
  async resetLoginAttempts(email) {
    const query = 'DELETE FROM blocked_users WHERE email = ?';
    await pool.query(query, [email]);
    return { query, params: [email] };
  }

  // Increment session version
  async incrementSessionVersion(userId) {
    const query = 'UPDATE users SET session_version = session_version + 1 WHERE id = ?';
    await pool.query(query, [userId]);
    return { query, params: [userId] };
  }

  // Get current session version
  async getSessionVersion(userId) {
    const [rows] = await pool.query('SELECT session_version FROM users WHERE id = ?', [userId]);
    return rows[0]?.session_version;
  }

  // --- REFRESH TOKEN METHODS ---

  // Save Refresh Token to DB (store HASH)
  async saveRefreshToken(userId, token, expiresAt) {
    logger.debug(`    🗄️  [authRepository] Saving refresh token for user: ${userId}`);
    const tokenHash = this.hashToken(token);
    const query = 'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
    await pool.query(query, [userId, tokenHash, expiresAt]);
    return { query, params: [userId, tokenHash, expiresAt] };
  }

  // Find Refresh Token by token (hash comparison)
  async findRefreshToken(token) {
    const tokenHash = this.hashToken(token);
    const [rows] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ?', 
      [tokenHash]
    );
    return rows[0];
  }

  // Delete specific Refresh Token
  async deleteRefreshToken(token) {
    const tokenHash = this.hashToken(token);
    const query = 'DELETE FROM refresh_tokens WHERE token = ?';
    await pool.query(query, [tokenHash]);
    return { query, params: [tokenHash] };
  }

  // Delete all Refresh Tokens for a user
  async deleteUserRefreshTokens(userId) {
    const query = 'DELETE FROM refresh_tokens WHERE user_id = ?';
    await pool.query(query, [userId]);
    return { query, params: [userId] };
  }

  // Update last login time
  async updateLastLoginTime(userId) {
    logger.debug(`    🗄️  [authRepository] Updating last login time for user: ${userId}`);
    const query = 'UPDATE users SET last_login_at = NOW() WHERE id = ?';
    const [result] = await pool.query(query, [userId]);
    return {
      success: result.affectedRows > 0,
      query,
      params: [userId]
    };
  }


  // Update password and increment session version
  async updatePassword(userId, newPasswordHash) {
    logger.debug(`    🗄️  [authRepository] Updating password for user: ${userId}`);
    const query = `UPDATE users
             SET password_hash = ?,
                 session_version = session_version + 1,
                 updated_at = NOW()
             WHERE id = ?`;
    const [result] = await pool.query(query, [newPasswordHash, userId]);

    if (result.affectedRows === 0) {
      throw new Error('Failed to update password');
    }

    const newSessionVersion = await this.getSessionVersion(userId);
    return {
      newSessionVersion,
      query,
      params: [newPasswordHash, userId]
    };
  }

  // Verify current password
  async verifyPassword(userId) {
    logger.debug(`    🗄️  [authRepository] Verifying password for user: ${userId}`);
    const [rows] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );
    return rows[0]?.password_hash;
  }
}

module.exports = new AuthRepository();