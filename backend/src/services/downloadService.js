// src/services/downloadService.js
const path = require('path');
const downloadRepo = require('../repositories/downloadRepository');
const { processFileBuffer, ALLOWED_MIME_TYPES } = require('../utils/fileValidator');
const ApiError = require('../utils/ApiError');
const auditService = require('./auditService');
const logger = require('../utils/logger');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/downloads');

class DownloadService {
  async uploadDownload({ title, description, file, uploadedBy, ipAddress }) {
    logger.debug(`  ⚙️ [downloadService] Uploading download by user: ${uploadedBy}`);

    const sanitizedName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const targetPath = path.join(UPLOAD_DIR, sanitizedName);

    const validation = await processFileBuffer(file, targetPath);

    const download = await downloadRepo.create({
      title,
      description: description || null,
      file_path: path.relative(path.join(__dirname, '../..'), targetPath).replace(/\\/g, '/'),
      original_filename: validation.originalName,
      file_size: validation.size,
      mime_type: ALLOWED_MIME_TYPES[validation.extension] || 'application/octet-stream',
      uploaded_by: uploadedBy
    });

    // Audit log
    await auditService.log({
      user_id: uploadedBy,
      module: 'DOWNLOADS',
      action: 'UPLOAD',
      table_name: 'downloads',
      affected_record_id: download.id,
      description: `Uploaded download: ${validation.originalName} (${validation.size} bytes)`,
      ip_address: ipAddress,
      executed_query: 'INSERT INTO downloads ...'
    });

    logger.debug(`  ✨ [downloadService] Download uploaded successfully. ID: ${download.id}`);
    return {
      id: download.id,
      title,
      filename: validation.originalName,
      file_size: validation.size,
      download_url: `/api/downloads/${download.id}/download`
    };
  }

  async listDownloads(limit, offset) {
    const downloads = await downloadRepo.findAllActive(limit, offset);
    const total = await downloadRepo.countAllActive();
    return {
      downloads: downloads.map(d => ({
        ...d,
        download_url: `/api/downloads/${d.id}/download`
      })),
      total
    };
  }

  async getDownload(id) {
    const download = await downloadRepo.findById(id);
    if (!download) {
      throw new ApiError(404, 'Download not found');
    }
    return {
      ...download,
      download_url: `/api/downloads/${download.id}/download`
    };
  }

  async updateDownload(id, { title, description }, userId, ipAddress) {
    const download = await downloadRepo.findById(id);
    if (!download) {
      throw new ApiError(404, 'Download not found');
    }

    await downloadRepo.update(id, { title, description });

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'DOWNLOADS',
      action: 'UPDATE',
      table_name: 'downloads',
      affected_record_id: id,
      description: `Updated download: ${download.title}`,
      ip_address: ipAddress,
      executed_query: 'UPDATE downloads SET title = ?, description = ? WHERE id = ?'
    });

    logger.debug(`  ✨ [downloadService] Download updated. ID: ${id}`);
    return { message: 'Download updated successfully' };
  }

  async deleteDownload(id, userId, ipAddress) {
    const download = await downloadRepo.findById(id);
    if (!download) {
      throw new ApiError(404, 'Download not found');
    }

    await downloadRepo.softDelete(id);

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'DOWNLOADS',
      action: 'DELETE',
      table_name: 'downloads',
      affected_record_id: id,
      description: `Deleted download: ${download.title}`,
      ip_address: ipAddress,
      executed_query: "UPDATE downloads SET status = 'DELETED' WHERE id = ?"
    });

    logger.debug(`  ✨ [downloadService] Download soft-deleted. ID: ${id}`);
    return { message: 'Download deleted successfully' };
  }
}

module.exports = new DownloadService();
