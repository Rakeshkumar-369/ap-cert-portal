// src/routes/downloadRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const downloadController = require('../controllers/downloadController');
const {
  uploadDownloadValidation,
  updateDownloadValidation,
  idValidation
} = require('../validators/downloadValidator');
const { uploadSingleFile, handleMulterError } = require('../middleware/fileUploadMiddleware');
const { validatePagination } = require('../validators/common');

// Public routes (unauthenticated)
router.get('/', validatePagination, downloadController.listDownloads);
router.get('/:id', idValidation, downloadController.getDownload);
router.get('/:id/download', idValidation, downloadController.downloadFile);

// Authenticated routes
router.post(
  '/',
  authMiddleware,
  uploadSingleFile,
  handleMulterError,
  uploadDownloadValidation,
  downloadController.uploadDownload
);

router.put(
  '/:id',
  authMiddleware,
  idValidation,
  updateDownloadValidation,
  downloadController.updateDownload
);

router.delete(
  '/:id',
  authMiddleware,
  idValidation,
  downloadController.deleteDownload
);

module.exports = router;
