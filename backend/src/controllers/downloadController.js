// src/controllers/downloadController.js
const path = require('path');
const fs = require('fs');
const downloadService = require('../services/downloadService');
const ApiResponse = require('../utils/ApiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const logger = require('../utils/logger');

const uploadDownload = async (req, res, next) => {
  logger.debug('➜ [downloadController] Uploading download');
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json(ApiResponse.error('No file provided', []));
    }

    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await downloadService.uploadDownload({
      title,
      description,
      file,
      uploadedBy: req.user.id,
      ipAddress
    });

    logger.debug(`✅ [downloadController] Download uploaded. ID: ${result.id}`);
    res.status(201).json(ApiResponse.success('Download uploaded successfully', [result]));
  } catch (error) {
    next(error);
  }
};

const listDownloads = async (req, res, next) => {
  logger.debug('➜ [downloadController] Listing downloads');
  try {
    const { limit, offset } = parsePagination(req.query.limit, req.query.offset);
    const { downloads, total } = await downloadService.listDownloads(limit, offset);

    res.json(ApiResponse.success('Downloads fetched successfully', downloads, {
      pagination: buildPaginationMeta(total, limit, offset, downloads.length)
    }));
  } catch (error) {
    next(error);
  }
};

const getDownload = async (req, res, next) => {
  logger.debug(`➜ [downloadController] Fetching download: ${req.params.id}`);
  try {
    const { id } = req.params;
    const download = await downloadService.getDownload(parseInt(id));
    res.json(ApiResponse.success('Download fetched successfully', [download]));
  } catch (error) {
    next(error);
  }
};

const updateDownload = async (req, res, next) => {
  logger.debug(`➜ [downloadController] Updating download: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await downloadService.updateDownload(
      parseInt(id),
      { title, description },
      req.user.id,
      ipAddress
    );
    res.json(ApiResponse.success(result.message, []));
  } catch (error) {
    next(error);
  }
};

const deleteDownload = async (req, res, next) => {
  logger.debug(`➜ [downloadController] Deleting download: ${req.params.id}`);
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await downloadService.deleteDownload(parseInt(id), req.user.id, ipAddress);
    res.json(ApiResponse.success(result.message, []));
  } catch (error) {
    next(error);
  }
};

const downloadFile = async (req, res, next) => {
  logger.debug(`➜ [downloadController] Downloading file: ${req.params.id}`);
  try {
    const { id } = req.params;
    const download = await downloadService.getDownload(parseInt(id));
    const filePath = path.join(__dirname, '../..', download.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json(ApiResponse.error('File not found on server'));
    }

    res.download(filePath, download.original_filename);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDownload,
  listDownloads,
  getDownload,
  downloadFile,
  updateDownload,
  deleteDownload
};
