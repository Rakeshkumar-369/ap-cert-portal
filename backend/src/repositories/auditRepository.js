// src/repositories/auditRepository.js
const pool = require('../config/db');

class AuditRepository {

// --- AUDIT LOGGING ---

  async createAuditLog({ user_id, module, action, table_name, affected_record_id, executed_query, description, ip_address }) {
    await pool.query(
      `INSERT INTO audit_logs
       (user_id, module, action, table_name, affected_record_id, executed_query, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, module, action, table_name, affected_record_id, executed_query, description, ip_address]
    );
  }
}

module.exports = new AuditRepository();