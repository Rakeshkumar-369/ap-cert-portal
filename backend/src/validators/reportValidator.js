// src/validators/reportValidator.js
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

const submitIncidentValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 255 }).withMessage('Name must be at most 255 characters')
    .trim()
    .escape(),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .trim(),

  body('incident_category_id')
    .notEmpty().withMessage('Incident category is required')
    .isInt({ min: 1 }).withMessage('Invalid incident category'),

  body('description_of_incident')
    .notEmpty().withMessage('Description of incident is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters')
    .trim()
    .escape(),

  handleValidationErrors
];

const trackingIdValidation = [
  param('trackingId')
    .notEmpty().withMessage('Tracking ID is required')
    .isUUID(4).withMessage('Invalid tracking ID format'),

  handleValidationErrors
];

const attachmentIdValidation = [
  param('attachmentId')
    .notEmpty().withMessage('Attachment ID is required')
    .isInt({ min: 1 }).withMessage('Invalid attachment ID'),

  handleValidationErrors
];

module.exports = { submitIncidentValidation, trackingIdValidation, attachmentIdValidation };
