// src/repositories/profileRepository.js
const pool = require('../config/db');

class ProfileRepository {
  async create({ name, designation, image_path, original_filename, file_size, mime_type, uploaded_by }) {
    const [result] = await pool.query(
      `INSERT INTO profiles (name, designation, image_path, original_filename, file_size, mime_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, designation, image_path, original_filename, file_size, mime_type, uploaded_by]
    );
    return { id: result.insertId };
  }

  async findAllActive(limit, offset) {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.designation, p.image_path, p.original_filename, p.file_size, p.mime_type,
              p.uploaded_by, u.name as uploader_name, p.created_at, p.updated_at
       FROM profiles p
       JOIN users u ON p.uploaded_by = u.id
       WHERE p.status = 'ACTIVE'
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async countAllActive() {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM profiles WHERE status = 'ACTIVE'"
    );
    return rows[0].total;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, u.name as uploader_name
       FROM profiles p
       JOIN users u ON p.uploaded_by = u.id
       WHERE p.id = ? AND p.status = 'ACTIVE'`,
      [id]
    );
    return rows[0];
  }

  async update(id, { name, designation, image_path, original_filename, file_size, mime_type }) {
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (designation !== undefined) { fields.push('designation = ?'); values.push(designation); }
    if (image_path !== undefined) { fields.push('image_path = ?'); values.push(image_path); }
    if (original_filename !== undefined) { fields.push('original_filename = ?'); values.push(original_filename); }
    if (file_size !== undefined) { fields.push('file_size = ?'); values.push(file_size); }
    if (mime_type !== undefined) { fields.push('mime_type = ?'); values.push(mime_type); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE profiles SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async softDelete(id) {
    const [result] = await pool.query(
      "UPDATE profiles SET status = 'DELETED' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new ProfileRepository();
