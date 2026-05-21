import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import {
  Eye,
  FileText,
  X,
  Download,
  Loader2,
  Search,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Filter,
  Clock,
  Calendar
} from 'lucide-react';
import { reportsAPI } from '../../services/api';

const getToken = () => localStorage.getItem('token');

const INCIDENT_STATUS_OPTIONS = [
  { value: '', label: 'All Incident Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_REVIEW', label: 'Under Review' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'DISMISSED', label: 'Dismissed' },
];

const REPORT_STATUS_OPTIONS = [
  { value: '', label: 'All Report Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DELETED', label: 'Deleted' },
];

const SkeletonRows = () => (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <tr key={i} className="animate-pulse">
        <td className="p-4"><div className="h-4 bg-slate-200 rounded w-24 mb-2" /><div className="h-3 bg-slate-100 rounded w-16" /></td>
        <td className="p-4"><div className="h-3 bg-slate-200 rounded w-20" /></td>
        <td className="p-4"><div className="h-5 bg-slate-200 rounded-full w-16" /></td>
        <td className="p-4"><div className="h-5 bg-slate-200 rounded-full w-16" /></td>
        <td className="p-4"><div className="h-3 bg-slate-200 rounded w-24" /></td>
        <td className="p-4"><div className="h-5 bg-slate-200 rounded w-8 ml-auto" /></td>
      </tr>
    ))}
  </>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return dateStr; }
};

const IncidentViewer = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidentDetail, setIncidentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [updating, setUpdating] = useState(false);
  const [reportStatusUpdate, setReportStatusUpdate] = useState('');
  const [updatingReport, setUpdatingReport] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState(null);

  // Filter states
  const [filterIncidentStatus, setFilterIncidentStatus] = useState('');
  const [filterReportStatus, setFilterReportStatus] = useState('');

  const searchRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const buildParams = useCallback(() => {
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (filterIncidentStatus) params.incident_status = filterIncidentStatus;
    if (filterReportStatus) params.status = filterReportStatus;
    return params;
  }, [searchQuery, filterIncidentStatus, filterReportStatus]);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams();
      const res = await reportsAPI.listAll(getToken(), params);
      setIncidents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      showToast('Failed to load incidents', 'error');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [buildParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    if (value.trim()) {
      setIsSearching(true);
    }
    const timeout = setTimeout(() => {
      fetchIncidents();
    }, 400);
    setSearchTimeout(timeout);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchTimeout) clearTimeout(searchTimeout);
    setIsSearching(false);
    fetchIncidents();
    searchRef.current?.focus();
  };

  const handleFilterChange = (type, value) => {
    if (type === 'incident_status') setFilterIncidentStatus(value);
    if (type === 'status') setFilterReportStatus(value);
  };

  // Refetch when filters change
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  const handleViewDetail = async (inc) => {
    const id = inc.id || inc._id;
    if (selectedIncident === id) {
      setSelectedIncident(null);
      setIncidentDetail(null);
      return;
    }
    setSelectedIncident(id);
    setIncidentDetail(null);
    setDetailLoading(true);
    try {
      const res = await reportsAPI.checkStatus(inc.tracking_id);
      const detail = res.data?.[0] || res;
      setIncidentDetail(detail);
    } catch (err) {
      console.error('Failed to fetch incident details:', err);
      setIncidentDetail(inc);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownloadAttachment = async (attachmentId, filename) => {
    if (!incidentDetail?.tracking_id) return;
    setDownloadingFile(attachmentId);
    try {
      const res = await reportsAPI.downloadAttachment(
        incidentDetail.tracking_id,
        attachmentId
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download attachment:', err);
      alert('Failed to download file: ' + err.message);
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleUpdateStatus = async (id) => {
    if (!statusUpdate) return;
    setUpdating(true);
    try {
      await reportsAPI.updateIncidentStatus(id, statusUpdate, getToken());
      setStatusUpdate('');
      setSelectedIncident(null);
      setIncidentDetail(null);
      showToast('Incident status updated');
    } catch (err) {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
      fetchIncidents();
    }
  };

  const handleUpdateReportStatus = async (id) => {
    if (!reportStatusUpdate) return;
    setUpdatingReport(true);
    try {
      await reportsAPI.updateReportStatus(id, reportStatusUpdate, getToken());
      setReportStatusUpdate('');
      setSelectedIncident(null);
      setIncidentDetail(null);
      showToast('Report status updated');
    } catch (err) {
      showToast('Failed to update report status', 'error');
    } finally {
      setUpdatingReport(false);
      fetchIncidents();
    }
  };

  // ───── StatusBadge Component ─────

  const StatusBadge = ({ status, type }) => {
    let dotColor = 'bg-slate-400';
    let bg = 'bg-slate-100 text-slate-600 border-slate-200';

    if (type === 'incident') {
      switch (status) {
        case 'RESOLVED':
          dotColor = 'bg-emerald-500';
          bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          break;
        case 'IN_REVIEW':
          dotColor = 'bg-amber-400';
          bg = 'bg-amber-50 text-amber-700 border-amber-200';
          break;
        case 'PENDING':
          dotColor = 'bg-blue-500';
          bg = 'bg-blue-50 text-blue-700 border-blue-200';
          break;
        case 'DISMISSED':
          dotColor = 'bg-rose-500';
          bg = 'bg-rose-50 text-rose-700 border-rose-200';
          break;
        default:
          dotColor = 'bg-slate-400';
          bg = 'bg-slate-100 text-slate-600 border-slate-200';
      }
    } else {
      switch (status) {
        case 'ACTIVE':
          dotColor = 'bg-emerald-500';
          bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          break;
        case 'INACTIVE':
          dotColor = 'bg-orange-400';
          bg = 'bg-orange-50 text-orange-700 border-orange-200';
          break;
        case 'DELETED':
          dotColor = 'bg-rose-500';
          bg = 'bg-rose-50 text-rose-700 border-rose-200';
          break;
        default:
          dotColor = 'bg-slate-400';
          bg = 'bg-slate-100 text-slate-600 border-slate-200';
      }
    }

    return (
      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {status || 'N/A'}
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header + Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm">
          <Filter size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {incidents.length} Incident{incidents.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[9px] font-bold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">PENDING</span>
          <span className="text-[9px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">IN REVIEW</span>
          <span className="text-[9px] font-bold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">RESOLVED</span>
          <span className="text-[9px] font-bold px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200">DISMISSED</span>
        </div>
      </div>

      {/* Filters + Search Row */}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-ap-glow/40 focus-within:border-ap-glow shadow-sm">
            <div className="pl-4 pr-2 flex items-center">
              {isSearching ? (
                <Loader2 size={16} className="animate-spin text-ap-navy" />
              ) : (
                <Search size={16} className="text-slate-400" />
              )}
            </div>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by tracking ID, name, email..."
              className="flex-1 bg-transparent py-2.5 pr-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-3 py-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {isSearching && (
            <p className="mt-1 text-[10px] text-slate-400 font-medium animate-pulse flex items-center gap-1.5">
              <Loader2 size={10} className="animate-spin" />
              Searching...
            </p>
          )}
        </div>

        {/* Incident Status Filter */}
        <div className="relative min-w-[160px]">
          <select
            value={filterIncidentStatus}
            onChange={(e) => handleFilterChange('incident_status', e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-ap-glow/40 focus:border-ap-glow shadow-sm cursor-pointer"
          >
            {INCIDENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Report Status Filter */}
        <div className="relative min-w-[160px]">
          <select
            value={filterReportStatus}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-ap-glow/40 focus:border-ap-glow shadow-sm cursor-pointer"
          >
            {REPORT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gradient-to-r from-ap-navy to-[#1a3a6b]">
                <th className="p-4 text-[10px] font-black uppercase text-white/80 tracking-widest">ID & Reporter</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/80 tracking-widest">Category</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/80 tracking-widest hidden md:table-cell">Report Status</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/80 tracking-widest hidden md:table-cell">Incident Status</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/80 tracking-widest">Date</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/80 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <SkeletonRows />
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search size={28} className="text-slate-300" />
                      <span className="text-slate-800 text-xs font-bold uppercase tracking-widest">
                        {searchQuery || filterIncidentStatus || filterReportStatus
                          ? 'No incidents match your filters'
                          : 'No incidents reported yet'}
                      </span>
                      {(searchQuery || filterIncidentStatus || filterReportStatus) && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setFilterIncidentStatus('');
                            setFilterReportStatus('');
                          }}
                          className="text-[10px] text-ap-navy underline hover:no-underline mt-1"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {incidents.map((inc, idx) => {
                    const id = inc.id || inc._id;
                    const isSelected = selectedIncident === id;
                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.025 }}
                        className={`transition-all cursor-pointer ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        } ${
                          isSelected
                            ? 'bg-blue-50/70 hover:bg-blue-50'
                            : 'hover:bg-blue-50/30'
                        }`}
                        onClick={() => handleViewDetail(inc)}
                      >
                        <td className="p-4">
                          <div className="text-sm font-bold text-slate-800">{inc.tracking_id || `INC-${id}`}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{inc.name || inc.email || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-block text-xs text-slate-600 font-medium bg-slate-100 rounded-lg px-2.5 py-1">
                            {inc.category_name || inc.category_id || 'General'}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <StatusBadge status={inc.status} type="report" />
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <StatusBadge status={inc.incident_status} type="incident" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar size={12} className="text-slate-400" />
                            {formatDate(inc.submitted_at || inc.created_at || inc.updated_at)}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleViewDetail(inc); }}
                            className={`p-2 rounded-lg transition-all ${
                              isSelected
                                ? 'bg-white/90 text-ap-navy shadow-sm'
                                : 'text-slate-400 hover:text-ap-navy hover:bg-white/80'
                            }`}
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedIncident && (() => {
          const inc = incidents.find(i => (i.id || i._id) === selectedIncident);
          if (!inc) return null;
          const detail = incidentDetail;
          const attachments = detail?.attachments || [];

          const formatSize = (bytes) => {
            if (!bytes) return '';
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
          };

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="mt-6 border-ap-glow/30 shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-ap-navy to-[#1a3a6b] rounded-xl text-white shadow-sm">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">
                        {inc.tracking_id || `INC-${inc.id}`}
                      </h3>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Incident Details</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2">
                      <StatusBadge status={inc.incident_status} type="incident" />
                      <StatusBadge status={inc.status} type="report" />
                    </div>
                    <button
                      onClick={() => { setSelectedIncident(null); setIncidentDetail(null); }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {detailLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={24} className="animate-spin text-ap-navy" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading details...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Name</p>
                        <p className="text-sm font-bold text-slate-800">{inc.name || 'N/A'}</p>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Email</p>
                        <p className="text-sm font-bold text-slate-800 break-all">{inc.email || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2 bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Description</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{inc.description || detail?.description || 'N/A'}</p>
                      </div>
                      {inc.submitted_at && (
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Calendar size={10} /> Submitted
                          </p>
                          <p className="text-sm font-bold text-slate-800">
                            {new Date(inc.submitted_at).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Attachments */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2">
                        <FileText size={14} /> Attachments ({attachments.length})
                      </h4>
                      {attachments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200 hover:border-ap-glow/30 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="p-1.5 bg-ap-navy/5 rounded-lg shrink-0">
                                  <FileText size={14} className="text-ap-navy" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm text-slate-700 truncate font-medium">
                                    {att.filename || att.original_filename}
                                  </p>
                                  {att.size && (
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                      {formatSize(att.size)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleDownloadAttachment(
                                    att.id,
                                    att.filename || att.original_filename || `attachment-${att.id}`
                                  )
                                }
                                disabled={downloadingFile === att.id}
                                className="ml-3 bg-ap-navy text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-ap-navy/90 transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-sm"
                              >
                                {downloadingFile === att.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Download size={12} />
                                )}
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic bg-white rounded-xl px-4 py-3 border border-slate-200">
                          No attachments for this report.
                        </p>
                      )}
                    </div>

                    {/* Status Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      {/* Incident Status Update */}
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
                        <label className="text-[10px] font-black uppercase text-blue-700 tracking-widest block mb-3 flex items-center gap-2">
                          <ChevronDown size={12} />
                          Incident Status
                          <StatusBadge status={inc.incident_status} type="incident" />
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={statusUpdate}
                            onChange={(e) => setStatusUpdate(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all cursor-pointer"
                          >
                            <option value="">Change status...</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_REVIEW">Under Review</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="DISMISSED">Dismissed</option>
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(inc.id || inc._id)}
                            disabled={updating || !statusUpdate}
                            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                          >
                            {updating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                            Update
                          </button>
                        </div>
                      </div>

                      {/* Report Status Update */}
                      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-3 flex items-center gap-2">
                          <ChevronDown size={12} />
                          Report Status
                          <StatusBadge status={inc.status} type="report" />
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={reportStatusUpdate}
                            onChange={(e) => setReportStatusUpdate(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 transition-all cursor-pointer"
                          >
                            <option value="">Change status...</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="DELETED">Deleted</option>
                          </select>
                          <button
                            onClick={() => handleUpdateReportStatus(inc.id || inc._id)}
                            disabled={updatingReport || !reportStatusUpdate}
                            className="bg-slate-600 text-white px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                          >
                            {updatingReport ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default IncidentViewer;
