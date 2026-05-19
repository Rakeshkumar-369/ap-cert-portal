// src/routes/cisaRoutes.js
const express = require('express');
const router = express.Router();
const cisaController = require('../controllers/cisaController');

// Public route - no auth required
router.get('/kev', cisaController.listKnownExploitedVulnerabilities);

module.exports = router;
