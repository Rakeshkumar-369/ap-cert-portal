// src/validators/common.js
const { query, param } = require('express-validator');

const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
    .toInt()
];

const validateId = (name = 'id') => [
  param(name)
    .isInt({ min: 1 })
    .withMessage(`${name} must be a positive integer`)
    .toInt()
];

module.exports = { validatePagination, validateId };