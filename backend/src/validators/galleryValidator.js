// src/validators/galleryValidator.js
const { body, param, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return next(new ApiError(400, firstError));
  }
  next();
};

const uploadImageValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be at most 255 characters')
    .trim()
    .escape(),

  body('caption')
    .notEmpty().withMessage('Caption is required')
    .isLength({ max: 500 }).withMessage('Caption must be at most 500 characters')
    .trim()
    .escape(),

  handleValidationErrors
];

const idValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer')
    .toInt(),

  handleValidationErrors
];

module.exports = { uploadImageValidation, idValidation };
