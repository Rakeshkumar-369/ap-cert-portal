// src/routes/publicationRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const publicationController = require('../controllers/publicationController');
const {
  uploadPublicationValidation,
  updatePublicationValidation,
  idValidation
} = require('../validators/publicationValidator');
const { uploadSingleFile, handleMulterError } = require('../middleware/fileUploadMiddleware');
const { validatePagination } = require('../validators/common');

// Public routes (unauthenticated)
router.get('/', validatePagination, publicationController.listPublications);
router.get('/:id', idValidation, publicationController.getPublication);
router.get('/:id/download', idValidation, publicationController.downloadPublication);

// Authenticated routes
router.post(
  '/',
  authMiddleware,
  uploadSingleFile,
  handleMulterError,
  uploadPublicationValidation,
  publicationController.uploadPublication
);

router.put(
  '/:id',
  authMiddleware,
  idValidation,
  updatePublicationValidation,
  publicationController.updatePublication
);

router.patch(
  '/:id/publish',
  authMiddleware,
  idValidation,
  publicationController.publishPublication
);

router.delete(
  '/:id',
  authMiddleware,
  idValidation,
  publicationController.deletePublication
);

module.exports = router;
