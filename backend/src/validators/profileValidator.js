// src/validators/profileValidator.js
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

const createProfileValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 255 }).withMessage('Name must be at most 255 characters')
    .trim()
    .escape(),

  body('designation')
    .notEmpty().withMessage('Designation is required')
    .isLength({ max: 255 }).withMessage('Designation must be at most 255 characters')
    .trim()
    .escape(),

  handleValidationErrors
];

const updateProfileValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 255 }).withMessage('Name must be at most 255 characters')
    .trim()
    .escape(),

  body('designation')
    .notEmpty().withMessage('Designation is required')
    .isLength({ max: 255 }).withMessage('Designation must be at most 255 characters')
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

module.exports = {
  createProfileValidation,
  updateProfileValidation,
  idValidation
};
