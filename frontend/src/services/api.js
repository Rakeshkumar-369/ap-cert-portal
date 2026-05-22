export const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Generic request helper for JSON endpoints
 */
async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    ...options,
  };
  // Merge headers: always set Content-Type, but let options.headers override
  config.headers = { 'Content-Type': 'application/json', ...config.headers };
  // Don't set Content-Type for FormData (let browser set boundary)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  const res = await fetch(`${API_BASE}${endpoint}`, config);
  if (!res.ok) {
    const err = new Error(`API Error: ${res.status}`);
    err.status = res.status;
    try {
      const json = await res.json();
      err.message = json.message || err.message;
    } catch {
      // ignore JSON parse errors and keep original error message
    }
    throw err;
  }
  // Handle file downloads
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res;
}

/**
 * Build query string from params object
 */
function qs(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.append(k, v);
  });
  const str = search.toString();
  return str ? `?${str}` : '';
}

// ──────────────────────────────────────────────
// Auth API
// ──────────────────────────────────────────────
export const authAPI = {
 login: (email, password, captchaId, captchaText) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, captchaId, captchaText }),
  }),

  refresh: () =>
    request('/api/auth/refresh', { method: 'POST' }),

  logout: (token) =>
    request('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
  // I think i will need to add token in header for logout API. Need to check backend code once. :)
  // sent undefined in the Auth header - check it again. :)
  changePassword: (currentPassword, newPassword, token) =>
    request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ──────────────────────────────────────────────
// Profiles API (Leadership)
// ──────────────────────────────────────────────
/**
 * Build a download URL for a download file (served through backend for security)
 */
export const downloadFileUrl = (doc) =>
  doc?.id ? `${API_BASE}/api/downloads/${doc.id}/download` : null;

/**
 * Build a download URL for a publication file (served through backend for security)
 */
export const publicationDownloadUrl = (pub) =>
  pub?.id ? `${API_BASE}/api/publications/${pub.id}/download` : null;

export const profilesAPI = {
  list: (limit = 50, offset = 0) =>
    request(`/api/profiles${qs({ limit, offset })}`),

  get: (id) =>
    request(`/api/profiles/${id}`),

  create: (formData, token) =>
    fetch(`${API_BASE}/api/profiles`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: 'include',
    }).then(handleResponse),

  update: (id, formData, token) =>
    fetch(`${API_BASE}/api/profiles/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: 'include',
    }).then(handleResponse),

  delete: (id, token) =>
    request(`/api/profiles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ──────────────────────────────────────────────
// Gallery API
// ──────────────────────────────────────────────
export const galleryAPI = {
  list: (limit = 50, offset = 0) =>
    request(`/api/gallery${qs({ limit, offset })}`),

  get: (id) =>
    request(`/api/gallery/${id}`),

  upload: (formData, token) =>
    fetch(`${API_BASE}/api/gallery`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: 'include',
    }).then(handleResponse),

  delete: (id, token) =>
    request(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ──────────────────────────────────────────────
// Downloads API
// ──────────────────────────────────────────────
export const downloadsAPI = {
  list: (limit = 50, offset = 0) =>
    request(`/api/downloads${qs({ limit, offset })}`),

  get: (id) =>
    request(`/api/downloads/${id}`),

  upload: (formData, token) =>
    fetch(`${API_BASE}/api/downloads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: 'include',
    }).then(handleResponse),

  update: (id, data, token) =>
    request(`/api/downloads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),

  delete: (id, token) =>
    request(`/api/downloads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ──────────────────────────────────────────────
// Publications API
// ──────────────────────────────────────────────
export const publicationsAPI = {
  list: (limit = 50, offset = 0) =>
    request(`/api/publications${qs({ limit, offset })}`),

  get: (id) =>
    request(`/api/publications/${id}`),

  upload: (formData, token) =>
    fetch(`${API_BASE}/api/publications`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: 'include',
    }).then(handleResponse),

  update: (id, data, token) =>
    request(`/api/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),

  delete: (id, token) =>
    request(`/api/publications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ──────────────────────────────────────────────
// CISA KEV API
// ──────────────────────────────────────────────
export const cisaAPI = {
  list: (limit = 10) =>
    request(`/api/cisa/kev${qs({ limit })}`),
};

// ──────────────────────────────────────────────
// CERT-In Vulnerabilities API
// ──────────────────────────────────────────────
export const vulnerabilityAPI = {
  list: (year = 2026, limit = 10) =>
    request(`/api/vulnerability/list${qs({ year, limit })}`),
};

// ──────────────────────────────────────────────
// Reports (Incidents) API
// ──────────────────────────────────────────────
export const reportsAPI = {
  getCategories: () =>
    request('/api/reports/categories'),

  submitIncident: (formData) =>
    fetch(`${API_BASE}/api/reports`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then(handleResponse),

 checkStatus: (trackingId, captchaId, captchaText) =>
  request('/api/reports/status', {
    method: 'POST',
    body: JSON.stringify({ tracking_id: trackingId, captchaId, captchaText }),
  }),

  listAll: (token, params = {}) =>
    request(`/api/reports/admin${qs(params)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateIncidentStatus: (id, incidentStatus, token) =>
    request(`/api/reports/admin/${id}/incident-status`, {
      method: 'PATCH',
      body: JSON.stringify({ incident_status: incidentStatus }),
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateReportStatus: (id, status, token) =>
    request(`/api/reports/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * Download an attachment file. Returns a fetch Response (blob).
   * Caller should use response.blob() and trigger download.
   */
  downloadAttachment: (trackingId, attachmentId, token) =>
    fetch(`${API_BASE}/api/reports/admin/attachments/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tracking_id: trackingId, attachment_id: attachmentId }),
      credentials: 'include',
    }).then(async (res) => {
      if (!res.ok) {
        const err = new Error(`Download failed: ${res.status}`);
        try {
          const json = await res.json();
          err.message = json.message || err.message;
        } catch {
          // ignore parsing errors
        }
        throw err;
      }
      return res;
    }),
};

// ──────────────────────────────────────────────
// Helper to handle fetch responses (for FormData uploads)
// ──────────────────────────────────────────────
async function handleResponse(res) {
  if (!res.ok) {
    const err = new Error(`API Error: ${res.status}`);
    err.status = res.status;
    try {
      const json = await res.json();
      err.message = json.message || err.message;
    } catch {
      // ignore parsing errors
    }
    throw err;
  }
  return res.json();
}
