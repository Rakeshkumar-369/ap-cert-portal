// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { submitIncidentValidation, trackingIdValidation, attachmentIdValidation } = require('../validators/reportValidator');
const { uploadMultipleFiles, handleMulterError } = require('../middleware/fileUploadMiddleware');

// Public routes (unauthenticated)
router.get('/categories', reportController.getCategories);
router.post(
  '/',
  uploadMultipleFiles,
  handleMulterError,
  submitIncidentValidation,
  reportController.submitIncident
);
router.get('/:trackingId', trackingIdValidation, reportController.getIncidentStatus);
router.get('/:trackingId/attachments/:attachmentId/download', trackingIdValidation, attachmentIdValidation, reportController.downloadAttachment);

module.exports = router;
