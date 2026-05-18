// src/services/galleryService.js
const path = require('path');
const galleryRepo = require('../repositories/galleryRepository');
const { processFileBuffer, ALLOWED_MIME_TYPES } = require('../utils/fileValidator');
const ApiError = require('../utils/ApiError');
const auditService = require('./auditService');
const logger = require('../utils/logger');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/gallery');

class GalleryService {
  async uploadImage({ title, caption, file, uploadedBy, ipAddress }) {
    logger.debug(`  ⚙️ [galleryService] Uploading image by user: ${uploadedBy}`);

    const sanitizedName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const targetPath = path.join(UPLOAD_DIR, sanitizedName);

    const validation = await processFileBuffer(file, targetPath);

    const galleryImage = await galleryRepo.create({
      title,
      caption: caption || null,
      file_path: path.relative(path.join(__dirname, '../..'), targetPath).replace(/\\/g, '/'),
      original_filename: validation.originalName,
      file_size: validation.size,
      mime_type: ALLOWED_MIME_TYPES[validation.extension] || 'image/jpeg',
      uploaded_by: uploadedBy
    });

    // Audit log
    await auditService.log({
      user_id: uploadedBy,
      module: 'GALLERY',
      action: 'UPLOAD',
      table_name: 'gallery',
      affected_record_id: galleryImage.id,
      description: `Uploaded image: ${validation.originalName} (${validation.size} bytes)`,
      ip_address: ipAddress,
      executed_query: 'INSERT INTO gallery ...'
    });

    logger.debug(`  ✨ [galleryService] Image uploaded successfully. ID: ${galleryImage.id}`);
    return {
      id: galleryImage.id,
      title,
      caption,
      filename: validation.originalName,
      file_size: validation.size,
      download_url: `/api/gallery/${galleryImage.id}/download`
    };
  }

  async listImages(limit, offset) {
    const images = await galleryRepo.findAllActive(limit, offset);
    const total = await galleryRepo.countAllActive();
    return {
      images: images.map(img => ({
        ...img,
        download_url: `/api/gallery/${img.id}/download`
      })),
      total
    };
  }

  async getImage(id) {
    const image = await galleryRepo.findById(id);
    if (!image) {
      throw new ApiError(404, 'Image not found');
    }
    return {
      ...image,
      download_url: `/api/gallery/${image.id}/download`
    };
  }

  async deleteImage(id, userId, ipAddress) {
    const image = await galleryRepo.findById(id);
    if (!image) {
      throw new ApiError(404, 'Image not found');
    }

    await galleryRepo.softDelete(id);

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'GALLERY',
      action: 'DELETE',
      table_name: 'gallery',
      affected_record_id: id,
      description: `Deleted image: ${image.original_filename}`,
      ip_address: ipAddress,
      executed_query: "UPDATE gallery SET status = 'DELETED' WHERE id = ?"
    });

    logger.debug(`  ✨ [galleryService] Image soft-deleted. ID: ${id}`);
    return { message: 'Image deleted successfully' };
  }
}

module.exports = new GalleryService();
