// src/routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const galleryController = require('../controllers/galleryController');
const { uploadImageValidation, idValidation } = require('../validators/galleryValidator');
const { uploadSingleFile, handleMulterError } = require('../middleware/fileUploadMiddleware');
const { validatePagination } = require('../validators/common');

// Public routes (unauthenticated)
router.get('/', validatePagination, galleryController.listImages);
router.get('/:id', idValidation, galleryController.getImage);
router.get('/:id/download', idValidation, galleryController.downloadImage);

// Authenticated routes
router.post(
  '/',
  authMiddleware,
  uploadSingleFile,
  handleMulterError,
  uploadImageValidation,
  galleryController.uploadImage
);

router.delete(
  '/:id',
  authMiddleware,
  idValidation,
  galleryController.deleteImage
);

module.exports = router;
