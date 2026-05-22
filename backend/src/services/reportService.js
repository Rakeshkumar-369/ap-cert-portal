// src/services/reportService.js
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const reportRepo = require('../repositories/reportRepository');
const auditService = require('./auditService');
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

  // --- PUBLIC: Check incident status (POST with body, no URL exposure) ---

  async checkStatus(trackingId) {
    const incident = await reportRepo.findByTrackingId(trackingId);
    if (!incident) {
      throw new ApiError(404, 'Incident report not found');
    }

    return {
      incident_status: incident.incident_status,
      submitted_at: incident.created_at
    };
  }

  // --- PUBLIC: Download attachment (POST with body, no URL exposure) ---

  async getAttachmentForDownload(trackingId, attachmentId) {
    const incident = await reportRepo.findByTrackingId(trackingId);
    if (!incident) {
      throw new ApiError(404, 'Incident report not found');
    }

    const attachment = await reportRepo.getAttachmentById(parseInt(attachmentId));
    if (!attachment || attachment.incident_id !== incident.id) {
      throw new ApiError(404, 'Attachment not found');
    }

    const filePath = path.join(__dirname, '../..', attachment.file_path);
    return { filePath, originalFilename: attachment.original_filename };
  }

  // --- ADMIN: List all reports with pagination & filters ---

  async listAll(filters, limit, offset) {
    const total = await reportRepo.countAllWithFilters(filters);
    const rows = await reportRepo.findAllWithFilters(filters, limit, offset);

    // Batch-fetch attachments for all returned incident IDs
    const incidentIds = rows.map(r => r.id);
    const attachmentsMap = {};
    if (incidentIds.length > 0) {
      const allAttachments = await reportRepo.getAttachmentsByIncidentIds(incidentIds);
      for (const att of allAttachments) {
        if (!attachmentsMap[att.incident_id]) attachmentsMap[att.incident_id] = [];
        attachmentsMap[att.incident_id].push({
          id: att.id,
          filename: att.original_filename,
          size: att.file_size
        });
      }
    }

    const reports = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      category: r.category_name,
      tracking_id: r.tracking_id,
      status: r.status,
      incident_status: r.incident_status,
      description: r.description_of_incident,
      submitted_at: r.created_at,
      updated_at: r.updated_at,
      attachments: attachmentsMap[r.id] || []
    }));

    return { reports, total };
  }

  // --- ADMIN: Update incident status (PENDING / IN_REVIEW / RESOLVED / DISMISSED) ---

  async updateIncidentStatus(id, incident_status, userId, ipAddress) {
    const incident = await reportRepo.findById(id);
    if (!incident) {
      throw new ApiError(404, 'Incident report not found');
    }

    if (incident.status === 'DELETED') {
      throw new ApiError(400, 'Cannot update a deleted incident report');
    }

    const updated = await reportRepo.updateIncidentStatus(id, incident_status);
    if (!updated) {
      throw new ApiError(500, 'Failed to update incident status');
    }

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'reports',
      action: 'UPDATE_INCIDENT_STATUS',
      table_name: 'reported_incidents',
      affected_record_id: id,
      description: `Changed incident_status from ${incident.incident_status} to ${incident_status} for report #${id}`,
      ip_address: ipAddress
    });

    return { id, incident_status };
  }

  // --- ADMIN: Update report status (ACTIVE / INACTIVE / DELETED) ---

  async updateReportStatus(id, status, userId, ipAddress) {
    const incident = await reportRepo.findById(id);
    if (!incident) {
      throw new ApiError(404, 'Incident report not found');
    }

    // Deleted reports cannot be reactivated
    if (incident.status === 'DELETED') {
      throw new ApiError(400, 'Cannot change status of a deleted incident report. Deleted reports are permanent.');
    }

    const updated = await reportRepo.updateStatus(id, status);
    if (!updated) {
      throw new ApiError(500, 'Failed to update report status');
    }

    // Audit log
    await auditService.log({
      user_id: userId,
      module: 'reports',
      action: 'UPDATE_REPORT_STATUS',
      table_name: 'reported_incidents',
      affected_record_id: id,
      description: `Changed status from ${incident.status} to ${status} for report #${id}`,
      ip_address: ipAddress
    });

    return { id, status };
  }
}

module.exports = new ReportService();
