import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import Card from '../components/ui/Card';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Image as ImageIcon,
  Save,
  Download,
  ChevronDown,
  FileBarChart,
  Loader2,
  AlertCircle,
  X,
  User
} from 'lucide-react';
import {
  profilesAPI,
  galleryAPI,
  downloadsAPI,
  publicationsAPI,
  reportsAPI,
  API_BASE
} from '../services/api';

const getToken = () => localStorage.getItem('adminToken');

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#003366]">
              {activeTab === 'home' && "Home Page Assets"}
              {activeTab === 'resources' && "Resource Repository"}
              {activeTab === 'incidents' && "Incident Command"}
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
              AP-CERT Administrative Control
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-slate-500">Live Secure Session</span>
          </div>
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'home' && <HomeManagement />}
          {activeTab === 'resources' && <ResourcesManagement />}
          {activeTab === 'incidents' && <IncidentViewer />}
        </div>
      </div>
    </div>
  );
};

// ── Image components that use direct download URLs (inline serving) ──
const ProfileImage = ({ member }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = member?.id ? `${API_BASE}/api/profiles/${member.id}/download` : null;
  return (
    <div className="w-16 h-16 rounded-full border-2 border-ap-lavender overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
      {imgSrc && !imgError ? (
        <img src={imgSrc} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <User size={24} className="text-slate-400" />
      )}
    </div>
  );
};

const GalleryImage = ({ slide }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = slide?.download_url ? `${API_BASE}${slide.download_url}` : null;
  return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      {imgSrc && !imgError ? (
        <img src={imgSrc} alt={slide?.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <ImageIcon size={32} className="text-slate-300" />
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// Home Management (Leadership & Carousel)
// ──────────────────────────────────────────────
const HomeManagement = () => {
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState({ name: '', designation: '' });

  const [leaders, setLeaders] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For adding new
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderPost, setNewLeaderPost] = useState('');

  const [newLeaderFile, setNewLeaderFile] = useState(null);
  const [newSlideFile, setNewSlideFile] = useState(null);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideDesc, setNewSlideDesc] = useState('');

  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesRes, galleryRes] = await Promise.all([
        profilesAPI.list(50, 0),
        galleryAPI.list(50, 0),
      ]);
      setLeaders(profilesRes.data || []);
      setSlides(galleryRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEdit = (item) => {
    setEditingId(item.id || item._id);
    setEditField({ name: item.name, designation: item.designation });
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', editField.name);
      formData.append('designation', editField.designation);
      await profilesAPI.update(id, formData, getToken());
      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      await profilesAPI.delete(id, getToken());
      await fetchData();
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
  };

  const handleAddLeader = async () => {
    if (!newLeaderName || !newLeaderPost) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', newLeaderName);
      formData.append('designation', newLeaderPost);
      if (newLeaderFile) formData.append('file', newLeaderFile);
      await profilesAPI.create(formData, getToken());
      setNewLeaderName('');
      setNewLeaderPost('');
      setNewLeaderFile(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to add profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await galleryAPI.delete(id, getToken());
      await fetchData();
    } catch (err) {
      console.error('Failed to delete slide:', err);
    }
  };

  const handleAddSlide = async () => {
    if (!newSlideTitle || !newSlideFile) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', newSlideTitle);
      formData.append('caption', newSlideDesc);
      formData.append('file', newSlideFile);
      await galleryAPI.upload(formData, getToken());
      setNewSlideTitle('');
      setNewSlideDesc('');
      setNewSlideFile(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to add slide:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#003366]" />
        <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading assets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
        <AlertCircle size={18} className="text-red-500" />
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* ── Leadership Section ── */}
      <section>
        <h3 className="text-[#003366] font-bold mb-6 uppercase tracking-widest text-sm flex items-center gap-2">
          <ImageIcon size={18} /> Leadership Profiles
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {leaders.map((member) => {
            const memberId = member.id || member._id;
            return (
              <Card key={memberId} className={`transition-all ${editingId === memberId ? 'border-ap-gold bg-slate-50' : 'border-slate-200'}`}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">                      <div className="flex items-center gap-6 flex-1 w-full">
                    <ProfileImage member={member} />
                    {editingId === memberId ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input
                          type="text"
                          value={editField.name}
                          onChange={(e) => setEditField(f => ({ ...f, name: e.target.value }))}
                          className="bg-white border border-ap-purple/50 p-2 rounded text-sm text-slate-800"
                        />
                        <input
                          type="text"
                          value={editField.designation}
                          onChange={(e) => setEditField(f => ({ ...f, designation: e.target.value }))}
                          className="bg-white border border-ap-purple/50 p-2 rounded text-sm text-slate-800"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="text-lg font-bold text-slate-800">{member.name}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">{member.designation}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingId === memberId ? (
                      <>
                        <button
                          onClick={() => handleSave(memberId)}
                          disabled={saving}
                          className="bg-[#003366] hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={16} />}
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-300 transition-all">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(member)} className="text-slate-500 hover:text-[#003366] p-2 transition-colors">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(memberId)} className="text-slate-500 hover:text-red-500 p-2 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Add New Leader */}
        <div className="mt-6 p-4 border-2 border-dashed border-slate-200 rounded-2xl">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Add New Leader</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newLeaderName}
              onChange={(e) => setNewLeaderName(e.target.value)}
              placeholder="Name"
              className="bg-white border border-slate-200 p-2 rounded text-sm"
            />
            <input
              type="text"
              value={newLeaderPost}
              onChange={(e) => setNewLeaderPost(e.target.value)}
              placeholder="Post"
              className="bg-white border border-slate-200 p-2 rounded text-sm"
            />
            <input
              type="file"
              onChange={(e) => setNewLeaderFile(e.target.files[0])}
              className="text-sm"
            />
          </div>
          <button
            onClick={handleAddLeader}
            disabled={saving || !newLeaderName || !newLeaderPost}
            className="mt-3 bg-[#003366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#002244] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add Leader
          </button>
        </div>
      </section>

      {/* ── Carousel Management ── */}
      <section>
        <h3 className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-sm">Carousel Assets ({slides.length} Slides)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide) => (
            <Card key={slide.id || slide._id} className="border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-[#003366] uppercase tracking-tighter">{slide.title}</span>
                <button
                  onClick={() => handleDeleteSlide(slide.id || slide._id)}
                  className="text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="h-32 bg-slate-100 rounded-lg mb-4 overflow-hidden">
                <GalleryImage slide={slide} />
              </div>
              <p className="text-[10px] text-gray-500">{slide.description || slide.desc}</p>
            </Card>
          ))}
        </div>

        {/* Add New Slide */}
        <div className="mt-6 p-4 border-2 border-dashed border-slate-200 rounded-2xl">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Add New Slide</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newSlideTitle}
              onChange={(e) => setNewSlideTitle(e.target.value)}
              placeholder="Title"
              className="bg-white border border-slate-200 p-2 rounded text-sm"
            />
            <input
              type="text"
              value={newSlideDesc}
              onChange={(e) => setNewSlideDesc(e.target.value)}
              placeholder="Description"
              className="bg-white border border-slate-200 p-2 rounded text-sm"
            />
            <input
              type="file"
              onChange={(e) => setNewSlideFile(e.target.files[0])}
              className="text-sm"
            />
          </div>
          <button
            onClick={handleAddSlide}
            disabled={saving || !newSlideTitle || !newSlideFile}
            className="mt-3 bg-[#003366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#002244] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add Slide
          </button>
        </div>
      </section>
    </div>
  );
};

// ──────────────────────────────────────────────
// Resources Management (Downloads & Publications)
// ──────────────────────────────────────────────
const ResourcesManagement = () => {
  const [openSection, setOpenSection] = useState('downloads');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const [downloads, setDownloads] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New item form
  const [newName, setNewName] = useState('');
  const [newFile, setNewFile] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [downRes, pubRes] = await Promise.all([
        downloadsAPI.list(50, 0),
        publicationsAPI.list(50, 0),
      ]);
      setDownloads(downRes.data || []);
      setPublications(pubRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const startEdit = (item) => {
    setEditingId(item.id || item._id);
    setEditName(item.title || item.name);
  };

  const handleSave = async (id, type) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const api = type === 'download' ? downloadsAPI : publicationsAPI;
      await api.update(id, { title: editName }, getToken());
      setEditingId(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to update:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const api = type === 'download' ? downloadsAPI : publicationsAPI;
      await api.delete(id, getToken());
      await fetchData();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleAdd = async (type) => {
    if (!newName || !newFile) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', newName);
      formData.append('file', newFile);
      const api = type === 'download' ? downloadsAPI : publicationsAPI;
      await api.upload(formData, getToken());
      setNewName('');
      setNewFile(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to add:', err);
    } finally {
      setSaving(false);
    }
  };

  const renderFileList = (list, type) => (
    <div className="space-y-3 mt-4">
      {list.map((item) => {
        const itemId = item.id || item._id;
        return (
          <div key={itemId} className={`p-4 rounded-xl border transition-all ${editingId === itemId ? 'border-ap-gold bg-slate-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <FileText className="text-slate-500" size={18} />
                {editingId === itemId ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-white border border-ap-purple/50 p-2 rounded text-sm text-slate-800 flex-1"
                  />
                ) : (                    <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">{item.title || item.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono italic truncate">{item.title || item.name}</div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {editingId === itemId ? (
                  <button
                    onClick={() => handleSave(itemId, type)}
                    disabled={saving}
                    className="text-green-500 hover:text-slate-800 transition-all text-[10px] font-black uppercase flex items-center gap-1"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save
                  </button>
                ) : (
                  <>
                    <button onClick={() => startEdit(item)} className="text-gray-500 hover:text-[#003366] transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(itemId, type)} className="text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add new form */}
      {openSection === (type === 'download' ? 'downloads' : 'publications') && (
        <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`New ${type} name`}
            className="w-full bg-white border border-slate-200 p-2 rounded text-sm"
          />
          <input
            type="file"
            onChange={(e) => setNewFile(e.target.files[0])}
            className="text-sm"
          />
          <button
            onClick={() => handleAdd(type)}
            disabled={saving || !newName || !newFile}
            className="w-full py-2 bg-[#003366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#002244] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add New {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#003366]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Downloads */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <button onClick={() => setOpenSection(openSection === 'downloads' ? null : 'downloads')}
          className="w-full flex justify-between items-center p-6 bg-white/40 hover:bg-white/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-ap-gold/10 rounded-lg text-[#003366]">
              <Download size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Downloads</h3>
              <p className="text-[10px] text-gray-500 uppercase">SOPs & Guidelines</p>
            </div>
          </div>
          <ChevronDown className={`transition-transform duration-300 ${openSection === 'downloads' ? 'rotate-180 text-[#003366]' : 'text-gray-500'}`} />
        </button>
        {openSection === 'downloads' && (
          <div className="p-6 bg-white/20">
            {renderFileList(downloads, 'download')}
          </div>
        )}
      </div>

      {/* Publications */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <button onClick={() => setOpenSection(openSection === 'publications' ? null : 'publications')}
          className="w-full flex justify-between items-center p-6 bg-white/40 hover:bg-white/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-ap-lavender/10 rounded-lg text-slate-500">
              <FileBarChart size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Publications</h3>
              <p className="text-[10px] text-gray-500 uppercase">Annual Reports & Studies</p>
            </div>
          </div>
          <ChevronDown className={`transition-transform duration-300 ${openSection === 'publications' ? 'rotate-180 text-slate-500' : 'text-gray-500'}`} />
        </button>
        {openSection === 'publications' && (
          <div className="p-6 bg-white/20">
            {renderFileList(publications, 'publication')}
          </div>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Incident Viewer
// ──────────────────────────────────────────────
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

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportsAPI.listAll(getToken());
      setIncidents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

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
      // Fetch full details (including attachments) via the tracking endpoint
      const res = await reportsAPI.checkStatus(inc.tracking_id);
      const detail = res.data?.[0] || res;
      setIncidentDetail(detail);
    } catch (err) {
      console.error('Failed to fetch incident details:', err);
      // Fallback: use the list data
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
      await fetchIncidents();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
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
      await fetchIncidents();
    } catch (err) {
      console.error('Failed to update report status:', err);
    } finally {
      setUpdatingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#003366]" />
      </div>
    );
  }

  return (
    <div>
      <Card className="border-slate-200 p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ap-purple/10">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500">ID & Reporter</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500">Category</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500">Status</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ap-purple/10">
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                  No incidents reported yet.
                </td>
              </tr>
            ) : (
              incidents.map((inc) => (
                <tr key={inc.id || inc._id} className="hover:bg-slate-50 transition-all">
                  <td className="p-4">
                    <div className="text-sm font-bold">{inc.tracking_id || `INC-${inc.id}`}</div>
                    <div className="text-[10px] text-gray-500">{inc.email || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-xs">{inc.category_name || inc.category_id || 'General'}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      inc.incident_status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                      inc.incident_status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                      inc.incident_status === 'PENDING' ? 'bg-blue-100 text-blue-700' :
                      inc.incident_status === 'DISMISSED' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {inc.incident_status || inc.status || 'SUBMITTED'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleViewDetail(inc)}
                      className="text-[#003366] hover:scale-110 transition-transform"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Detail Panel */}
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
          <Card className="mt-6 border-ap-gold">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-black uppercase tracking-tight">{inc.tracking_id || `INC-${inc.id}`}</h3>
              <button onClick={() => { setSelectedIncident(null); setIncidentDetail(null); }} className="text-gray-400 hover:text-red-500">
                <X size={18} />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-[#003366]" />
                <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading details...</span>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {inc.name || 'N/A'}</p>
                <p><strong>Email:</strong> {inc.email || 'N/A'}</p>
                <p><strong>Description:</strong> {inc.description || detail?.description || 'N/A'}</p>

                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="pt-2">
                    <strong className="text-sm block mb-2">Attachments ({attachments.length})</strong>
                    <div className="space-y-2">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <FileText size={16} className="text-slate-400 shrink-0" />
                            <span className="text-sm text-slate-700 truncate font-medium">
                              {att.filename || att.original_filename}
                            </span>
                            {att.size ? (
                              <span className="text-[10px] text-gray-400 font-mono shrink-0">
                                ({formatSize(att.size)})
                              </span>
                            ) : null}
                          </div>
                          <button
                            onClick={() =>
                              handleDownloadAttachment(
                                att.id,
                                att.filename || att.original_filename || `attachment-${att.id}`
                              )
                            }
                            disabled={downloadingFile === att.id}
                            className="ml-3 bg-[#003366] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-[#002244] transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
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
                  </div>
                )}

                {attachments.length === 0 && !detailLoading && (
                  <p className="text-xs text-gray-400 italic">No attachments for this report.</p>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                    Incident Status (<span className="text-blue-600">{inc.incident_status || 'N/A'}</span>)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm"
                    >
                      <option value="">Select status...</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_REVIEW">Under Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="DISMISSED">Dismissed</option>
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(inc.id || inc._id)}
                      disabled={updating || !statusUpdate}
                      className="bg-[#003366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#002244] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {updating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Update
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                    Report Status (<span className="text-purple-600">{inc.status || 'N/A'}</span>)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={reportStatusUpdate}
                      onChange={(e) => setReportStatusUpdate(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm"
                    >
                      <option value="">Select status...</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DELETED">Deleted</option>
                    </select>
                    <button
                      onClick={() => handleUpdateReportStatus(inc.id || inc._id)}
                      disabled={updatingReport || !reportStatusUpdate}
                      className="bg-[#003366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#002244] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {updatingReport ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })()}
    </div>
  );
};

export default AdminDashboard;