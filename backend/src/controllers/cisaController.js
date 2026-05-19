// src/controllers/cisaController.js
const cisaService = require('../services/cisaService');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

const listKnownExploitedVulnerabilities = async (req, res, next) => {
  logger.debug('➜ [cisaController] Listing known exploited vulnerabilities from CISA');
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { data, total } = await cisaService.fetchKnownExploitedVulnerabilities(limit);

    res.json(ApiResponse.success('Known exploited vulnerabilities fetched successfully', data, {
      source: 'CISA KEV',
      total,
      returned: data.length
    }));
  } catch (error) {
    next(error);
  }
};

module.exports = { listKnownExploitedVulnerabilities };
