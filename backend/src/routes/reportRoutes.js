// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  submitIncidentValidation,
  checkStatusValidation,
  downloadAttachmentValidation,
  listReportsValidation,
  updateIncidentStatusValidation,
  updateStatusValidation
} = require('../validators/reportValidator');
const { uploadMultipleFiles, handleMulterError } = require('../middleware/fileUploadMiddleware');
const { requireCaptcha } = require('../middleware/captchaMiddleware');

// ===== PUBLIC ROUTES (Unauthenticated) =====
router.get('/categories', reportController.getCategories);
router.post(
  '/',
  requireCaptcha,
  uploadMultipleFiles,
  handleMulterError,
  submitIncidentValidation,
  reportController.submitIncident
);

// POST (not GET) — body: { tracking_id } prevents Wayback Machine URL capture
router.post('/status', requireCaptcha, checkStatusValidation, reportController.checkStatus);

// POST (not GET) — body: { tracking_id, attachment_id } prevents URL exposure
router.post('/attachments/download', downloadAttachmentValidation, reportController.downloadAttachmentPost);

// ===== ADMIN ROUTES (Authenticated) =====
router.get('/admin', authMiddleware, listReportsValidation, reportController.listReports);
router.patch('/admin/:id/incident-status', authMiddleware, updateIncidentStatusValidation, reportController.updateIncidentStatus);
router.patch('/admin/:id/status', authMiddleware, updateStatusValidation, reportController.updateReportStatus);

module.exports = router;
