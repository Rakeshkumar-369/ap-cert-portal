// src/controllers/publicationController.js
const path = require('path');
const fs = require('fs');
const publicationService = require('../services/publicationService');
const ApiResponse = require('../utils/ApiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const logger = require('../utils/logger');

const uploadPublication = async (req, res, next) => {
  logger.debug('➜ [publicationController] Uploading publication');
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json(ApiResponse.error('No file provided', []));
    }

    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await publicationService.uploadPublication({
      title,
      description,
      file,
      uploadedBy: req.user.id,
      ipAddress
    });

    logger.debug(`✅ [publicationController] Publication uploaded. ID: ${result.id}`);
    res.status(201).json(ApiResponse.success('Publication uploaded successfully', [result]));
  } catch (error) {
    next(error);
  }
};

const listPublications = async (req, res, next) => {
  logger.debug('➜ [publicationController] Listing publications');
  try {
    const { limit, offset } = parsePagination(req.query.limit, req.query.offset);
    const { publications, total } = await publicationService.listPublications(limit, offset);

    res.json(ApiResponse.success('Publications fetched successfully', publications, {
      pagination: buildPaginationMeta(total, limit, offset, publications.length)
    }));
  } catch (error) {
    next(error);
  }
};

const getPublication = async (req, res, next) => {
  logger.debug(`➜ [publicationController] Fetching publication: ${req.params.id}`);
  try {
    const { id } = req.params;
    const publication = await publicationService.getPublication(parseInt(id));
    res.json(ApiResponse.success('Publication fetched successfully', [publication]));
  } catch (error) {
    next(error);
  }
};

const updatePublication = async (req, res, next) => {
  logger.debug(`➜ [publicationController] Updating publication: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await publicationService.updatePublication(
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

const deletePublication = async (req, res, next) => {
  logger.debug(`➜ [publicationController] Deleting publication: ${req.params.id}`);
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await publicationService.deletePublication(parseInt(id), req.user.id, ipAddress);
    res.json(ApiResponse.success(result.message, []));
  } catch (error) {
    next(error);
  }
};

const downloadPublication = async (req, res, next) => {
  logger.debug(`➜ [publicationController] Downloading publication: ${req.params.id}`);
  try {
    const { id } = req.params;
    const publication = await publicationService.getPublication(parseInt(id));
    const filePath = path.join(__dirname, '../..', publication.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json(ApiResponse.error('File not found on server'));
    }

    res.download(filePath, publication.original_filename);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPublication,
  listPublications,
  getPublication,
  downloadPublication,
  updatePublication,
  deletePublication
};
