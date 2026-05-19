// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const {
  createProfileValidation,
  updateProfileValidation,
  idValidation
} = require('../validators/profileValidator');
const { uploadSingleFile, handleMulterError } = require('../middleware/fileUploadMiddleware');
const { validatePagination } = require('../validators/common');

// Public routes (unauthenticated)
router.get('/', validatePagination, profileController.listProfiles);
router.get('/:id', idValidation, profileController.getProfile);
router.get('/:id/download', idValidation, profileController.serveImage);

// Authenticated routes
router.post(
  '/',
  authMiddleware,
  uploadSingleFile,
  handleMulterError,
  createProfileValidation,
  profileController.createProfile
);

router.put(
  '/:id',
  authMiddleware,
  uploadSingleFile,
  handleMulterError,
  updateProfileValidation,
  profileController.updateProfile
);

router.delete(
  '/:id',
  authMiddleware,
  idValidation,
  profileController.deleteProfile
);

module.exports = router;
