// src/services/profileService.js
const path = require('path');
const profileRepo = require('../repositories/profileRepository');
const { processFileBuffer, ALLOWED_MIME_TYPES } = require('../utils/fileValidator');
const ApiError = require('../utils/ApiError');
const auditService = require('./auditService');
const logger = require('../utils/logger');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/profiles');

class ProfileService {
  async createProfile({ name, designation, file, uploadedBy, ipAddress }) {
    logger.debug(`  ⚙️ [profileService] Creating profile by user: ${uploadedBy}`);

    let imagePath = null;
    let originalName = null;
    let fileSize = null;
    let mimeType = null;

    if (file) {
      const sanitizedName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const targetPath = path.join(UPLOAD_DIR, sanitizedName);
      const validation = await processFileBuffer(file, targetPath);

      imagePath = path.relative(path.join(__dirname, '../..'), targetPath).replace(/\\/g, '/');
      originalName = validation.originalName;
      fileSize = validation.size;
      mimeType = ALLOWED_MIME_TYPES[validation.extension] || 'image/jpeg';
    }

    const profile = await profileRepo.create({
      name,
      designation,
      image_path: imagePath,
      original_filename: originalName,
      file_size: fileSize,
      mime_type: mimeType,
      uploaded_by: uploadedBy
    });

    // Audit log
    await auditService.log({
      user_id: uploadedBy,
      module: 'PROFILES',
      action: 'CREATE',
      table_name: 'profiles',
      affected_record_id: profile.id,
      description: `Created profile: ${name} (${designation})`,
      ip_address: ipAddress,
      executed_query: 'INSERT INTO profiles ...'
    });

    logger.debug(`  ✨ [profileService] Profile created successfully. ID: ${profile.id}`);
    return {
      id: profile.id,
      name,
      designation,
      image_path: imagePath,
      original_filename: originalName,
      file_size: fileSize,
      mime_type: mimeType
    };
  }

  async listProfiles(limit, offset) {
    const profiles = await profileRepo.findAllActive(limit, offset);
    const total = await profileRepo.countAllActive();
    return { profiles, total };
  }

  async getProfile(id) {
    const profile = await profileRepo.findById(id);
    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }
    return profile;
  }

  async updateProfile(id, { name, designation, file }, userId, ipAddress) {
    const profile = await profileRepo.findById(id);
    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }

    const updates = { name, designation };

    if (file) {
      const sanitizedName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const targetPath = path.join(UPLOAD_DIR, sanitizedName);
      const validation = await processFileBuffer(file, targetPath);

      updates.image_path = path.relative(path.join(__dirname, '../..'), targetPath).replace(/\\/g, '/');
      updates.original_filename = validation.originalName;
      updates.file_size = validation.size;
      updates.mime_type = ALLOWED_MIME_TYPES[validation.extension] || 'image/jpeg';
    }

    await profileRepo.update(id, updates);

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'PROFILES',
      action: 'UPDATE',
      table_name: 'profiles',
      affected_record_id: id,
      description: `Updated profile: ${name}`,
      ip_address: ipAddress,
      executed_query: 'UPDATE profiles SET name = ?, designation = ? WHERE id = ?'
    });

    logger.debug(`  ✨ [profileService] Profile updated. ID: ${id}`);
    return { message: 'Profile updated successfully' };
  }

  async deleteProfile(id, userId, ipAddress) {
    const profile = await profileRepo.findById(id);
    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }

    await profileRepo.softDelete(id);

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'PROFILES',
      action: 'DELETE',
      table_name: 'profiles',
      affected_record_id: id,
      description: `Deleted profile: ${profile.name}`,
      ip_address: ipAddress,
      executed_query: "UPDATE profiles SET status = 'DELETED' WHERE id = ?"
    });

    logger.debug(`  ✨ [profileService] Profile soft-deleted. ID: ${id}`);
    return { message: 'Profile deleted successfully' };
  }
}

module.exports = new ProfileService();
