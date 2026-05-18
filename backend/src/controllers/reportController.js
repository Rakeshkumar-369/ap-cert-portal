// src/controllers/reportController.js
const path = require('path');
const fs = require('fs');
const reportService = require('../services/reportService');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

// --- PUBLIC: Unauthenticated endpoints ---

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

// POST /api/reports/status — body: { tracking_id } (no URL exposure)
const checkStatus = async (req, res, next) => {
  const { tracking_id } = req.body;
  logger.debug(`➜ [reportController] Checking incident status via POST body`);
  try {
    const result = await reportService.checkStatus(tracking_id);
    res.json(ApiResponse.success('Incident status fetched successfully', [result]));
  } catch (error) {
    next(error);
  }
};

// POST /api/reports/attachments/download — body: { tracking_id, attachment_id }
const downloadAttachmentPost = async (req, res, next) => {
  const { tracking_id, attachment_id } = req.body;
  logger.debug(`➜ [reportController] Downloading attachment via POST body`);
  try {
    const { filePath, originalFilename } = await reportService.getAttachmentForDownload(tracking_id, attachment_id);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json(ApiResponse.error('File not found on server'));
    }

    res.download(filePath, originalFilename);
  } catch (error) {
    next(error);
  }
};

// --- ADMIN: Authenticated endpoints ---

// GET /api/reports/admin?status=&incident_status=&search=&limit=&offset=
const listReports = async (req, res, next) => {
  logger.debug('➜ [reportController] Admin listing all reports');
  try {
    const { limit, offset } = parsePagination(req.query.limit, req.query.offset);
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.incident_status) filters.incident_status = req.query.incident_status;
    if (req.query.search) filters.search = req.query.search;

    const { reports, total } = await reportService.listAll(filters, limit, offset);

    const meta = buildPaginationMeta(total, limit, offset, reports.length);
    res.json(ApiResponse.success('Reports fetched successfully', reports, meta));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/reports/admin/:id/incident-status — body: { incident_status }
const updateIncidentStatus = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { incident_status } = req.body;
  logger.debug(`➜ [reportController] Admin updating incident_status to ${incident_status} for report #${id}`);
  try {
    const result = await reportService.updateIncidentStatus(
      id,
      incident_status,
      req.user.id,
      req.ip || req.connection.remoteAddress
    );
    res.json(ApiResponse.success('Incident status updated successfully', [result]));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/reports/admin/:id/status — body: { status }
const updateReportStatus = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  logger.debug(`➜ [reportController] Admin updating status to ${status} for report #${id}`);
  try {
    const result = await reportService.updateReportStatus(
      id,
      status,
      req.user.id,
      req.ip || req.connection.remoteAddress
    );
    res.json(ApiResponse.success('Report status updated successfully', [result]));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  submitIncident,
  checkStatus,
  downloadAttachmentPost,
  listReports,
  updateIncidentStatus,
  updateReportStatus
};
