// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { changePasswordValidation } = require('../validators/authValidator');
const authController = require('../controllers/authController');
const { loginValidation } = require('../validators/authValidator');
const { createRateLimiter } = require('../middleware/rateLimiter');
const { requireCaptcha } = require('../middleware/captchaMiddleware');
const loginLimiter = createRateLimiter(5, 15); // 5 attempts per 15 minutes

// Public routes
router.post('/login', requireCaptcha, loginLimiter, loginValidation, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post(
    '/change-password',
    authMiddleware,  // This ensures user is authenticated
    changePasswordValidation,
    authController.changePassword
);

module.exports = router;