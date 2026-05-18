// src/validators/authValidator.js
const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Common middleware to handle validation results.
 * This ensures that if any rules are violated, an ApiError is thrown before reaching the controller.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return next(new ApiError(400, firstError));
    }
    next();
};

// Validation rules for Login
const loginValidation = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

// Validation rules for Change Password
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('New password must be between 8 and 16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),
    
    body('confirmNewPassword')
        .notEmpty()
        .withMessage('Please confirm your new password')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match');
            }
            return true;
        }),

    handleValidationErrors
];

module.exports = {
    loginValidation,
    changePasswordValidation
};