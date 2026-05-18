// src/services/auditService.js
const auditRepository = require('../repositories/auditRepository');
const logger = require('../utils/logger');

class AuditService {
  async log(data) {
    try {
      await auditRepository.createAuditLog(data);
    } catch (err) {
      // Never break main flow because of audit failure
      logger.error('Failed to create audit log', { error: err, data });
    }
  }
}

module.exports = new AuditService();