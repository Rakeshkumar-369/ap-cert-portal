// src/controllers/reportController.js
const path = require('path');
const fs = require('fs');
const reportService = require('../services/reportService');
const reportRepo = require('../repositories/reportRepository');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const getCategories = async (req, res, next) => {
  logger.debug('➜ [reportController] Fetching incident categories');
  try {
    const categories = await reportService.getCategories();
    res.json(ApiResponse.success('Categories fetched successfully', categories));
  } catch (error) {
    next(error);
  }
};

const submitIncident = async (req, res, next) => {
  logger.debug(`➜ [reportController] Submitting incident report`);
  try {
    const { name, email, incident_category_id, description_of_incident } = req.body;
    const files = req.files || [];

    const result = await reportService.submitIncident({
      name,
      email,
      incident_category_id: parseInt(incident_category_id),
      description_of_incident,
      files
    });

    logger.debug(`✅ [reportController] Incident submitted, tracking ID: ${result.tracking_id}`);
    res.status(201).json(ApiResponse.success(result.message, [{
      tracking_id: result.tracking_id,
      attachments_count: result.attachments_count
    }]));
  } catch (error) {
    next(error);
  }
};

const getIncidentStatus = async (req, res, next) => {
  logger.debug(`➜ [reportController] Fetching incident status: ${req.params.trackingId}`);
  try {
    const { trackingId } = req.params;
    const result = await reportService.getIncidentStatus(trackingId);
    res.json(ApiResponse.success('Incident status fetched successfully', [result]));
  } catch (error) {
    next(error);
  }
};

const downloadAttachment = async (req, res, next) => {
  logger.debug(`➜ [reportController] Downloading attachment: ${req.params.attachmentId}`);
  try {
    const { trackingId, attachmentId } = req.params;

    // Verify the incident exists
    const incident = await reportService.getIncidentStatus(trackingId);

    // Look up the attachment
    const attachment = await reportRepo.getAttachmentById(parseInt(attachmentId));
    if (!attachment || attachment.incident_id !== incident.incident_id) {
      throw new ApiError(404, 'Attachment not found');
    }

    const filePath = path.join(__dirname, '../..', attachment.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json(ApiResponse.error('File not found on server'));
    }

    res.download(filePath, attachment.original_filename);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, submitIncident, getIncidentStatus, downloadAttachment };
