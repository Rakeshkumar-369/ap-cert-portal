// src/services/publicationService.js
const path = require('path');
const publicationRepo = require('../repositories/publicationRepository');
const { processFileBuffer, ALLOWED_MIME_TYPES } = require('../utils/fileValidator');
const ApiError = require('../utils/ApiError');
const auditService = require('./auditService');
const logger = require('../utils/logger');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/publications');

class PublicationService {
  async uploadPublication({ title, description, file, uploadedBy, ipAddress }) {
    logger.debug(`  ⚙️ [publicationService] Uploading publication by user: ${uploadedBy}`);

    const sanitizedName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const targetPath = path.join(UPLOAD_DIR, sanitizedName);

    const validation = await processFileBuffer(file, targetPath);

    const publication = await publicationRepo.create({
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
      module: 'PUBLICATIONS',
      action: 'UPLOAD',
      table_name: 'publications',
      affected_record_id: publication.id,
      description: `Uploaded publication: ${validation.originalName} (${validation.size} bytes)`,
      ip_address: ipAddress,
      executed_query: 'INSERT INTO publications ...'
    });

    logger.debug(`  ✨ [publicationService] Publication uploaded successfully. ID: ${publication.id}`);
    return {
      id: publication.id,
      title,
      filename: validation.originalName,
      file_size: validation.size,
      download_url: `/api/publications/${publication.id}/download`
    };
  }

  async listPublications(limit, offset) {
    const publications = await publicationRepo.findAllPublished(limit, offset);
    const total = await publicationRepo.countAllPublished();
    return {
      publications: publications.map(pub => ({
        ...pub,
        download_url: `/api/publications/${pub.id}/download`
      })),
      total
    };
  }

  async getPublication(id) {
    const publication = await publicationRepo.findById(id);
    if (!publication) {
      throw new ApiError(404, 'Publication not found');
    }
    return {
      ...publication,
      download_url: `/api/publications/${publication.id}/download`
    };
  }

  async updatePublication(id, { title, description }, userId, ipAddress) {
    const publication = await publicationRepo.findById(id);
    if (!publication) {
      throw new ApiError(404, 'Publication not found');
    }

    await publicationRepo.update(id, { title, description });

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'PUBLICATIONS',
      action: 'UPDATE',
      table_name: 'publications',
      affected_record_id: id,
      description: `Updated publication: ${publication.title}`,
      ip_address: ipAddress,
      executed_query: 'UPDATE publications SET title = ?, description = ? WHERE id = ?'
    });

    logger.debug(`  ✨ [publicationService] Publication updated. ID: ${id}`);
    return { message: 'Publication updated successfully' };
  }

  async publishPublication(id, userId, ipAddress) {
    const publication = await publicationRepo.findById(id);
    if (!publication) {
      throw new ApiError(404, 'Publication not found');
    }

    await publicationRepo.publish(id);

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'PUBLICATIONS',
      action: 'PUBLISH',
      table_name: 'publications',
      affected_record_id: id,
      description: `Published publication: ${publication.title}`,
      ip_address: ipAddress,
      executed_query: "UPDATE publications SET is_published = TRUE, published_at = NOW() WHERE id = ?"
    });

    logger.debug(`  ✨ [publicationService] Publication published. ID: ${id}`);
    return { message: 'Publication published successfully' };
  }

  async deletePublication(id, userId, ipAddress) {
    const publication = await publicationRepo.findById(id);
    if (!publication) {
      throw new ApiError(404, 'Publication not found');
    }

    await publicationRepo.softDelete(id);

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'PUBLICATIONS',
      action: 'DELETE',
      table_name: 'publications',
      affected_record_id: id,
      description: `Deleted publication: ${publication.title}`,
      ip_address: ipAddress,
      executed_query: "UPDATE publications SET status = 'DELETED' WHERE id = ?"
    });

    logger.debug(`  ✨ [publicationService] Publication soft-deleted. ID: ${id}`);
    return { message: 'Publication deleted successfully' };
  }
}

module.exports = new PublicationService();
