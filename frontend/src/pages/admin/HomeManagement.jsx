import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  AlertCircle,
  User,
  CheckCircle2,
  X,
  Upload,
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import {
  profilesAPI,
  galleryAPI,
  API_BASE
} from '../../services/api';

const getToken = () => localStorage.getItem('token');

/* ─── Loading Skeleton ─── */
const SkeletonRow = () => (
  <div className="animate-pulse flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="w-14 h-14 rounded-full bg-slate-200" />
    <div className="flex-1 space-y-2.5">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
    <div className="flex gap-2">
      <div className="w-8 h-8 bg-slate-200 rounded-lg" />
      <div className="w-8 h-8 bg-slate-200 rounded-lg" />
    </div>
  </div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="animate-pulse bg-slate-50 rounded-2xl border border-slate-100 p-4">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
        <div className="h-32 bg-slate-100 rounded-lg mb-3" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>
    ))}
  </div>
);

const ProfileImage = ({ member }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = member?.id ? `${API_BASE}/api/profiles/${member.id}/download` : null;
  return (
    <div className="w-14 h-14 rounded-full border-2 border-ap-glow/30 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
      {imgSrc && !imgError ? (
        <img src={imgSrc} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <User size={22} className="text-slate-400" />
      )}
    </div>
  );
};

const GalleryImage = ({ slide }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = slide?.download_url ? `${API_BASE}${slide.download_url}` : null;
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
      {imgSrc && !imgError ? (
        <img src={imgSrc} alt={slide?.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <ImageIcon size={32} className="text-slate-300" />
      )}
    </div>
  );
};

const HomeManagement = () => {
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState({ name: '', designation: '' });

  const [leaders, setLeaders] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // For adding new
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderPost, setNewLeaderPost] = useState('');
  const [newLeaderFile, setNewLeaderFile] = useState(null);
  const [newSlideFile, setNewSlideFile] = useState(null);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideDesc, setNewSlideDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      showToast('Profile updated successfully');
      await fetchData();
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      await profilesAPI.delete(id, getToken());
      showToast('Profile deleted');
      await fetchData();
    } catch (err) {
      showToast('Failed to delete profile', 'error');
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
      setFilePreview(null);
      showToast('Leader added successfully');
      await fetchData();
    } catch (err) {
      showToast('Failed to add leader', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await galleryAPI.delete(id, getToken());
      showToast('Slide deleted');
      await fetchData();
    } catch (err) {
      showToast('Failed to delete slide', 'error');
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
      setFilePreview(null);
      showToast('Slide added successfully');
      await fetchData();
    } catch (err) {
      showToast('Failed to add slide', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Toast Notification ─── */
  return (
    <div className="space-y-10 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading State ─── */}
      {loading && (
        <div className="space-y-10">
          <div><h3 className="text-ap-navy font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2"><User size={16} /> Leadership Profiles</h3><SkeletonRow /><SkeletonRow /><SkeletonRow /></div>
          <div><h3 className="text-slate-500 font-bold mb-5 text-sm uppercase tracking-widest">Carousel Assets</h3><SkeletonGrid /></div>
        </div>
      )}

      {/* ── Error State ─── */}
      {!loading && error && (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Failed to load data</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
            <button onClick={fetchData} className="mt-3 text-xs font-bold text-red-600 underline hover:no-underline">Retry</button>
          </div>
        </div>
      )}

      {/* ── Content ─── */}
      {!loading && !error && (
        <>
          {/* ─── Leadership Section ─── */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
              <div className="p-2 bg-ap-navy/10 rounded-lg">
                <User size={18} className="text-ap-navy" />
              </div>
              <h3 className="text-ap-navy font-bold text-sm uppercase tracking-widest">Leadership Profiles</h3>
              <span className="text-[10px] text-slate-400 font-bold ml-auto">{leaders.length} member{leaders.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {leaders.length === 0 && (
                <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl">
                  <User size={32} className="mx-auto mb-3 text-slate-300" />
                  No leadership profiles yet. Add one below.
                </div>
              )}
              {leaders.map((member) => {
                const memberId = member.id || member._id;
                const isEditing = editingId === memberId;
                return (
                  <motion.div
                    key={memberId}
                    layout
                    className={`rounded-2xl border transition-all ${
                      isEditing
                        ? 'border-ap-glow bg-blue-50/50 shadow-sm shadow-ap-glow/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 p-5">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <ProfileImage member={member} />
                        {isEditing ? (
                          <div className="flex gap-3 flex-1 flex-wrap">
                            <input
                              type="text"
                              value={editField.name}
                              onChange={(e) => setEditField(f => ({ ...f, name: e.target.value }))}
                              className="flex-1 min-w-[140px] bg-white border border-ap-glow/40 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-ap-glow/30 focus:border-ap-glow transition-all"
                              placeholder="Name"
                            />
                            <input
                              type="text"
                              value={editField.designation}
                              onChange={(e) => setEditField(f => ({ ...f, designation: e.target.value }))}
                              className="flex-1 min-w-[180px] bg-white border border-ap-glow/40 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-ap-glow/30 focus:border-ap-glow transition-all"
                              placeholder="Designation"
                            />
                          </div>
                        ) : (
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-800 truncate">{member.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">{member.designation}</div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(memberId)}
                              disabled={saving}
                              className="bg-ap-navy text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-ap-navy/90 transition-all disabled:opacity-50 shadow-sm"
                            >
                              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-slate-300 transition-all"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(member)}
                              className="p-2 text-slate-400 hover:text-ap-navy hover:bg-ap-navy/5 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(memberId)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Add New Leader ─── */}
            <div className="mt-6 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-5 flex items-center gap-2">
                <UserPlus size={14} />
                Add New Leader
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newLeaderName}
                  onChange={(e) => setNewLeaderName(e.target.value)}
                  placeholder="Full Name *"
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ap-glow/30 focus:border-ap-glow transition-all placeholder:text-slate-400"
                />
                <input
                  type="text"
                  value={newLeaderPost}
                  onChange={(e) => setNewLeaderPost(e.target.value)}
                  placeholder="Designation *"
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ap-glow/30 focus:border-ap-glow transition-all placeholder:text-slate-400"
                />
                <div className="relative md:col-span-2">
                  <input
                    type="file"
                    id="leader-file"
                    onChange={(e) => {
                      setNewLeaderFile(e.target.files[0]);
                      setFilePreview(e.target.files[0]?.name || null);
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="leader-file"
                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-500 cursor-pointer hover:border-ap-glow/50 transition-all"
                  >
                    <Upload size={14} className="text-slate-400" />
                    <span className="truncate">{filePreview || 'Upload photo (optional)'}</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddLeader}
                  disabled={saving || !newLeaderName || !newLeaderPost}
                  className="bg-ap-navy text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-ap-navy/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                  Add Leader
                </button>
              </div>
            </div>
          </section>

          {/* ─── Carousel Management ─── */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
              <div className="p-2 bg-ap-glow/10 rounded-lg">
                <LayoutDashboard size={18} className="text-ap-navy" />
              </div>
              <h3 className="text-ap-navy font-bold text-sm uppercase tracking-widest">Carousel Assets</h3>
              <span className="text-[10px] text-slate-400 font-bold ml-auto">{slides.length} slide{slides.length !== 1 ? 's' : ''}</span>
            </div>

            {slides.length === 0 && (
              <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl mb-6">
                <ImageIcon size={32} className="mx-auto mb-3 text-slate-300" />
                No slides yet. Add one below.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {slides.map((slide) => (
                <Card key={slide.id || slide._id} className="p-4 border-slate-200 hover:border-slate-300 group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-black text-ap-navy uppercase tracking-tight truncate pr-2">{slide.title}</span>
                    <button
                      onClick={() => handleDeleteSlide(slide.id || slide._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="h-28 bg-slate-100 rounded-xl mb-3 overflow-hidden border border-slate-100">
                    <GalleryImage slide={slide} />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{slide.description || slide.desc || 'No description'}</p>
                </Card>
              ))}
            </div>

            {/* ── Add New Slide ─── */}
            <div className="mt-6 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-5 flex items-center gap-2">
                <ImageIcon size={14} />
                Add New Slide
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="Title *"
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ap-glow/30 focus:border-ap-glow transition-all placeholder:text-slate-400"
                />
                <input
                  type="text"
                  value={newSlideDesc}
                  onChange={(e) => setNewSlideDesc(e.target.value)}
                  placeholder="Description"
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ap-glow/30 focus:border-ap-glow transition-all placeholder:text-slate-400"
                />
                <div>
                  <input
                    type="file"
                    id="slide-file"
                    onChange={(e) => {
                      setNewSlideFile(e.target.files[0]);
                      setFilePreview(e.target.files[0]?.name || null);
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="slide-file"
                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-500 cursor-pointer hover:border-ap-glow/50 transition-all"
                  >
                    <Upload size={14} className="text-slate-400" />
                    <span className="truncate">{filePreview || 'Upload image *'}</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddSlide}
                  disabled={saving || !newSlideTitle || !newSlideFile}
                  className="bg-ap-navy text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-ap-navy/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                  Add Slide
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomeManagement;
