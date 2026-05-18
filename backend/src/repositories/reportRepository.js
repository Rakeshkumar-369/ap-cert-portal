// src/repositories/reportRepository.js
const pool = require('../config/db');

class ReportRepository {
  // --- INCIDENT CATEGORIES ---

  async getActiveCategories() {
    const [rows] = await pool.query(
      "SELECT id, name, description FROM incident_categories WHERE status = 'ACTIVE' ORDER BY name"
    );
    return rows;
  }

  async getCategoryById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, description FROM incident_categories WHERE id = ? AND status = 'ACTIVE'",
      [id]
    );
    return rows[0];
  }

  // --- REPORTED INCIDENTS ---

  async createIncident({ name, email, incident_category_id, description_of_incident, tracking_id }) {
    const [result] = await pool.query(
      `INSERT INTO reported_incidents (name, email, incident_category_id, description_of_incident, tracking_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, incident_category_id, description_of_incident, tracking_id]
    );
    return { id: result.insertId, tracking_id };
  }

  async findByTrackingId(trackingId) {
    const [rows] = await pool.query(
      `SELECT ri.*, ic.name as category_name
       FROM reported_incidents ri
       JOIN incident_categories ic ON ri.incident_category_id = ic.id
       WHERE ri.tracking_id = ? AND ri.status = 'ACTIVE'`,
      [trackingId]
    );
    return rows[0];
  }

  // --- ATTACHMENTS ---

  async addAttachment({ incident_id, file_path, original_filename, file_size, mime_type }) {
    const [result] = await pool.query(
      `INSERT INTO reported_incident_attachments (incident_id, file_path, original_filename, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?)`,
      [incident_id, file_path, original_filename, file_size, mime_type]
    );
    return { id: result.insertId };
  }

  async getAttachmentsByIncidentId(incidentId) {
    const [rows] = await pool.query(
      `SELECT id, file_path, original_filename, file_size, mime_type, created_at
       FROM reported_incident_attachments WHERE incident_id = ?`,
      [incidentId]
    );
    return rows;
  }

  async getAttachmentById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM reported_incident_attachments WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // --- ADMIN: FIND BY ID ---

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT ri.*, ic.name as category_name
       FROM reported_incidents ri
       JOIN incident_categories ic ON ri.incident_category_id = ic.id
       WHERE ri.id = ?`,
      [id]
    );
    return rows[0];
  }

  // --- ADMIN: LIST WITH FILTERS ---

  async findAllWithFilters(filters, limit, offset) {
    let sql = `
      SELECT ri.*, ic.name as category_name
      FROM reported_incidents ri
      JOIN incident_categories ic ON ri.incident_category_id = ic.id
      WHERE 1=1`;
    const params = [];

    if (filters.status) {
      sql += ` AND ri.status = ?`;
      params.push(filters.status);
    }

    if (filters.incident_status) {
      sql += ` AND ri.incident_status = ?`;
      params.push(filters.incident_status);
    }

    if (filters.search) {
      sql += ` AND (ri.name LIKE ? OR ri.email LIKE ? OR ri.tracking_id LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    sql += ` ORDER BY ri.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  async countAllWithFilters(filters) {
    let sql = `
      SELECT COUNT(*) as total
      FROM reported_incidents ri
      WHERE 1=1`;
    const params = [];

    if (filters.status) {
      sql += ` AND ri.status = ?`;
      params.push(filters.status);
    }

    if (filters.incident_status) {
      sql += ` AND ri.incident_status = ?`;
      params.push(filters.incident_status);
    }

    if (filters.search) {
      sql += ` AND (ri.name LIKE ? OR ri.email LIKE ? OR ri.tracking_id LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  }

  // --- ADMIN: UPDATE STATUSES ---

  async updateIncidentStatus(id, incident_status) {
    const [result] = await pool.query(
      `UPDATE reported_incidents SET incident_status = ? WHERE id = ?`,
      [incident_status, id]
    );
    return result.affectedRows > 0;
  }

  async updateStatus(id, status) {
    const [result] = await pool.query(
      `UPDATE reported_incidents SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new ReportRepository();
