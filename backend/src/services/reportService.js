// src/services/reportService.js
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const reportRepo = require('../repositories/reportRepository');
const { processFileBuffer, ALLOWED_MIME_TYPES } = require('../utils/fileValidator');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/reported_incidents_attachments');

class ReportService {
  async getCategories() {
    return await reportRepo.getActiveCategories();
  }

  async submitIncident({ name, email, incident_category_id, description_of_incident, files }) {
    logger.debug(`  ⚙️ [reportService] Submitting incident report from: ${email}`);

    // Validate category exists
    const category = await reportRepo.getCategoryById(incident_category_id);
    if (!category) {
      throw new ApiError(400, 'Invalid incident category');
    }

    // Generate tracking ID
    const trackingId = uuidv4();

    // Create incident
    const incident = await reportRepo.createIncident({
      name,
      email,
      incident_category_id,
      description_of_incident,
      tracking_id: trackingId
    });

    // Process attachments
    const attachments = [];
    if (files && files.length > 0) {
      const incidentDir = path.join(UPLOAD_DIR, String(incident.id));
      
      for (const file of files) {
        const targetPath = path.join(incidentDir, `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
        
        const validation = await processFileBuffer(file, targetPath);
        
        await reportRepo.addAttachment({
          incident_id: incident.id,
          file_path: path.relative(path.join(__dirname, '../..'), targetPath).replace(/\\/g, '/'),
          original_filename: validation.originalName,
          file_size: validation.size,
          mime_type: ALLOWED_MIME_TYPES[validation.extension] || 'application/octet-stream'
        });

        attachments.push({
          original_filename: validation.originalName,
          size: validation.size
        });
      }
    }

    logger.debug(`  ✨ [reportService] Incident report submitted successfully. Tracking ID: ${trackingId}`);
    
    return {
      tracking_id: trackingId,
      attachments_count: attachments.length,
      message: 'Your incident report has been submitted successfully.'
    };
  }

  async getIncidentStatus(trackingId) {
    const incident = await reportRepo.findByTrackingId(trackingId);
    if (!incident) {
      throw new ApiError(404, 'Incident report not found');
    }

    const attachments = await reportRepo.getAttachmentsByIncidentId(incident.id);

    return {
      tracking_id: incident.tracking_id,
      incident_id: incident.id,
      category: incident.category_name,
      incident_status: incident.incident_status,
      description: incident.description_of_incident,
      submitted_at: incident.created_at,
      attachments: attachments.map(a => ({
        id: a.id,
        filename: a.original_filename,
        size: a.file_size,
        download_url: `/api/reports/${incident.tracking_id}/attachments/${a.id}/download`
      }))
    };
  }
}

module.exports = new ReportService();
