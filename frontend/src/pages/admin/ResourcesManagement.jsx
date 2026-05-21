import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Save,
  Download,
  ChevronDown,
  FileBarChart,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import {
  downloadsAPI,
  publicationsAPI
} from '../../services/api';

const getToken = () => localStorage.getItem('token');

const SkeletonBlock = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-16 bg-slate-100 rounded-2xl" />
    <div className="h-16 bg-slate-100 rounded-2xl" />
  </div>
);

const ResourcesManagement = () => {
  const [openSection, setOpenSection] = useState('downloads');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [downloads, setDownloads] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [newName, setNewName] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      showToast('Failed to load resources', 'error');
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
      showToast('Updated successfully');
      await fetchData();
    } catch (err) {
      showToast('Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const api = type === 'download' ? downloadsAPI : publicationsAPI;
      await api.delete(id, getToken());
      showToast('Deleted successfully');
      await fetchData();
    } catch (err) {
      showToast('Failed to delete', 'error');
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
      setFilePreview(null);
      showToast(`${type === 'download' ? 'Download' : 'Publication'} added`);
      await fetchData();
    } catch (err) {
      showToast('Failed to add item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderFileList = (list, type) => (
    <div className="space-y-2 mt-4">
      {list.length === 0 && (
        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-xl">
          <FileText size={28} className="mx-auto mb-2 text-slate-300" />
          No {type === 'download' ? 'downloads' : 'publications'} yet.
        </div>
      )}
      <AnimatePresence>
        {list.map((item) => {
          const itemId = item.id || item._id;
          const isEditing = editingId === itemId;
          return (
            <motion.div
              key={itemId}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border transition-all ${
                isEditing
                  ? 'border-ap-glow bg-blue-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-ap-navy/5 rounded-lg shrink-0">
                    <FileText className="text-ap-navy" size={16} />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-white border border-ap-glow/40 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-ap-glow/30 transition-all"
                    />
                  ) : (
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-800 truncate">{item.title || item.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono truncate mt-0.5">{item.title || item.name}</div>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(itemId, type)}
                        disabled={saving}
                        className="bg-ap-navy text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-ap-navy/90 transition-all disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="bg-slate-200 text-slate-600 px-2.5 py-2 rounded-lg text-[10px] font-black hover:bg-slate-300 transition-all">
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-ap-navy hover:bg-ap-navy/5 rounded-lg transition-all">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(itemId, type)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add new form */}
      {openSection === (type === 'download' ? 'downloads' : 'publications') && (
        <div className="mt-4 p-5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
          <div className="flex gap-3 items-start">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`New ${type} name *`}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ap-glow/30 focus:border-ap-glow transition-all placeholder:text-slate-400"
            />
            <div className="shrink-0">
              <input
                type="file"
                id={`file-${type}`}
                onChange={(e) => {
                  setNewFile(e.target.files[0]);
                  setFilePreview(e.target.files[0]?.name || null);
                }}
                className="hidden"
              />
              <label
                htmlFor={`file-${type}`}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-500 cursor-pointer hover:border-ap-glow/50 transition-all"
              >
                <Upload size={14} className="text-slate-400" />
                <span className="truncate max-w-[140px]">{filePreview || 'Choose file'}</span>
              </label>
            </div>
          </div>
          <button
            onClick={() => handleAdd(type)}
            disabled={saving || !newName || !newFile}
            className="w-full py-2.5 bg-ap-navy text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-ap-navy/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
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
      <div className="space-y-6">
        <SkeletonBlock />
      </div>
    );
  }

  return (
    <div className="space-y-5 relative">
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
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Downloads Accordion */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => setOpenSection(openSection === 'downloads' ? null : 'downloads')}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-ap-navy/10 rounded-xl">
              <Download size={20} className="text-ap-navy" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Downloads</h3>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">{downloads.length} file{downloads.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              openSection === 'downloads' ? 'rotate-180 text-ap-navy' : 'text-slate-400'
            }`}
          />
        </button>
        <AnimatePresence>
          {openSection === 'downloads' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-slate-100">
                {renderFileList(downloads, 'download')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Publications Accordion */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => setOpenSection(openSection === 'publications' ? null : 'publications')}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-ap-glow/10 rounded-xl">
              <FileBarChart size={20} className="text-ap-navy" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Publications</h3>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">{publications.length} file{publications.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              openSection === 'publications' ? 'rotate-180 text-ap-navy' : 'text-slate-400'
            }`}
          />
        </button>
        <AnimatePresence>
          {openSection === 'publications' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-slate-100">
                {renderFileList(publications, 'publication')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourcesManagement;
