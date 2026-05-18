// src/controllers/galleryController.js
const path = require('path');
const fs = require('fs');
const galleryService = require('../services/galleryService');
const ApiResponse = require('../utils/ApiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const logger = require('../utils/logger');

const uploadImage = async (req, res, next) => {
  logger.debug(`➜ [galleryController] Uploading image`);
  try {
    const { title, alt_text } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json(ApiResponse.error('No image file provided', []));
    }

    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await galleryService.uploadImage({
      title,
      alt_text,
      file,
      uploadedBy: req.user.id,
      ipAddress
    });

    logger.debug(`✅ [galleryController] Image uploaded. ID: ${result.id}`);
    res.status(201).json(ApiResponse.success('Image uploaded successfully', [result]));
  } catch (error) {
    next(error);
  }
};

const listImages = async (req, res, next) => {
  logger.debug('➜ [galleryController] Listing images');
  try {
    const { limit, offset } = parsePagination(req.query.limit, req.query.offset);
    const { images, total } = await galleryService.listImages(limit, offset);

    res.json(ApiResponse.success('Images fetched successfully', images, {
      pagination: buildPaginationMeta(total, limit, offset, images.length)
    }));
  } catch (error) {
    next(error);
  }
};

const getImage = async (req, res, next) => {
  logger.debug(`➜ [galleryController] Fetching image: ${req.params.id}`);
  try {
    const { id } = req.params;
    const image = await galleryService.getImage(parseInt(id));
    res.json(ApiResponse.success('Image fetched successfully', [image]));
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  logger.debug(`➜ [galleryController] Deleting image: ${req.params.id}`);
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await galleryService.deleteImage(parseInt(id), req.user.id, ipAddress);
    res.json(ApiResponse.success(result.message, []));
  } catch (error) {
    next(error);
  }
};

const downloadImage = async (req, res, next) => {
  logger.debug(`➜ [galleryController] Downloading image: ${req.params.id}`);
  try {
    const { id } = req.params;
    const image = await galleryService.getImage(parseInt(id));
    const filePath = path.join(__dirname, '../..', image.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json(ApiResponse.error('File not found on server'));
    }

    res.download(filePath, image.original_filename);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, listImages, getImage, downloadImage, deleteImage };
