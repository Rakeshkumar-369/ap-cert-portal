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

// --- NEW PUBLIC ENDPOINT VALIDATORS (POST body instead of URL params) ---

const checkStatusValidation = [
  body('tracking_id')
    .notEmpty().withMessage('Tracking ID is required')
    .isUUID(4).withMessage('Invalid tracking ID format'),

  handleValidationErrors
];

const downloadAttachmentValidation = [
  body('tracking_id')
    .notEmpty().withMessage('Tracking ID is required')
    .isUUID(4).withMessage('Invalid tracking ID format'),

  body('attachment_id')
    .notEmpty().withMessage('Attachment ID is required')
    .isInt({ min: 1 }).withMessage('Invalid attachment ID'),

  handleValidationErrors
];

// --- ADMIN ENDPOINT VALIDATORS ---

const listReportsValidation = [
  // Optional query params — validated if present
  (req, res, next) => {
    const { status, incident_status, search } = req.query;

    const validStatuses = ['ACTIVE', 'INACTIVE', 'DELETED'];
    if (status && !validStatuses.includes(status)) {
      return next(new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`));
    }

    const validIncidentStatuses = ['PENDING', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'];
    if (incident_status && !validIncidentStatuses.includes(incident_status)) {
      return next(new ApiError(400, `Invalid incident_status. Must be one of: ${validIncidentStatuses.join(', ')}`));
    }

    if (search && (typeof search !== 'string' || search.length > 255)) {
      return next(new ApiError(400, 'Search query must be at most 255 characters'));
    }

    next();
  }
];

const updateIncidentStatusValidation = [
  param('id')
    .notEmpty().withMessage('Report ID is required')
    .isInt({ min: 1 }).withMessage('Invalid report ID'),

  body('incident_status')
    .notEmpty().withMessage('Incident status is required')
    .isIn(['PENDING', 'IN_REVIEW', 'RESOLVED', 'DISMISSED']).withMessage('Invalid incident status. Must be: PENDING, IN_REVIEW, RESOLVED, or DISMISSED'),

  handleValidationErrors
];

const updateStatusValidation = [
  param('id')
    .notEmpty().withMessage('Report ID is required')
    .isInt({ min: 1 }).withMessage('Invalid report ID'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['ACTIVE', 'INACTIVE', 'DELETED']).withMessage('Invalid status. Must be: ACTIVE, INACTIVE, or DELETED'),

  handleValidationErrors
];

module.exports = {
  submitIncidentValidation,
  trackingIdValidation,
  attachmentIdValidation,
  checkStatusValidation,
  downloadAttachmentValidation,
  listReportsValidation,
  updateIncidentStatusValidation,
  updateStatusValidation
};
