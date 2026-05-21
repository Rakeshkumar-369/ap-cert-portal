import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, User, Mail, FileUp, ShieldAlert, AlertCircle,
  Loader2, CheckCircle, Search, RefreshCw
} from 'lucide-react';
import { reportsAPI } from '../../services/api';

const ReportModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('form');
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState('');

  // Tracking state
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Report captcha state
  const [captcha, setCaptcha] = useState(null);
  const [captchaText, setCaptchaText] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Track captcha state
  const [trackCaptcha, setTrackCaptcha] = useState(null);
  const [trackCaptchaText, setTrackCaptchaText] = useState('');
  const [trackCaptchaLoading, setTrackCaptchaLoading] = useState(false);

  const fetchCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/captcha`);
      const data = await res.json();
      setCaptcha({ id: data.data.id, svg: data.data.svg });
      setCaptchaText('');
    } catch (err) {
      console.error('Captcha fetch error:', err);
    } finally {
      setCaptchaLoading(false);
    }
  };

  const fetchTrackCaptcha = async () => {
    setTrackCaptchaLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/captcha`);
      const data = await res.json();
      setTrackCaptcha({ id: data.data.id, svg: data.data.svg });
      setTrackCaptchaText('');
    } catch (err) {
      console.error('Track captcha fetch error:', err);
    } finally {
      setTrackCaptchaLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setName('');
      setEmail('');
      setCategoryId('');
      setDescription('');
      setFiles([]);
      setError('');
      setTrackInput('');
      setTrackResult(null);
      setTrackError('');
      setCaptcha(null);
      setCaptchaText('');
      setTrackCaptcha(null);
      setTrackCaptchaText('');

      const fetchCategories = async () => {
        setLoadingCat(true);
        try {
          const res = await reportsAPI.getCategories();
          setCategories(res.data || []);
          if (res.data && res.data.length > 0) {
            setCategoryId(res.data[0].id || res.data[0]._id);
          }
        } catch (err) {
          console.error('Failed to load categories:', err);
        } finally {
          setLoadingCat(false);
        }
      };

      fetchCategories();
      fetchCaptcha();
      fetchTrackCaptcha();
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !categoryId || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!captchaText || !captcha?.id) {
      setError('Please enter the captcha.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('incident_category_id', categoryId);
      formData.append('description_of_incident', description);
      formData.append('captchaId', captcha.id);
      formData.append('captchaText', captchaText);
      files.forEach((f) => formData.append('files', f));

      const res = await reportsAPI.submitIncident(formData);
      const tid = res.data?.[0]?.tracking_id || '';
      setTrackingId(tid);
      setStep('success');
    } catch (err) {
      // Show captcha 400 errors clearly
      const message = err.message || 'Failed to submit report. Please try again.';
      if (err.status === 400) {
        setError('Captcha error: ' + message);
      } else {
        setError(message);
      }
      fetchCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);

    if (!trackInput.trim()) {
      setTrackError('Please enter a tracking ID.');
      return;
    }

    if (!trackCaptchaText || !trackCaptcha?.id) {
      setTrackError('Please enter the captcha.');
      return;
    }

    setTrackingLoading(true);
    try {
      const res = await reportsAPI.checkStatus(trackInput.trim(), trackCaptcha.id, trackCaptchaText);
      setTrackResult(res.data || res);
    } catch (err) {
      // Show captcha 400 errors clearly
      const message = err.message || 'Tracking ID not found.';
      if (err.status === 400) {
        setTrackError('Captcha error: ' + message);
      } else {
        setTrackError(message);
      }
      fetchTrackCaptcha();
    } finally {
      setTrackingLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#002B5B]/30 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-t-8 border-[#00D4FF] overflow-y-auto max-h-[90vh] custom-scrollbar"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-[#002B5B] transition-colors">
            <X size={28} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#002B5B] rounded-2xl text-[#00D4FF] shadow-lg shadow-blue-900/20">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight">
                {step === 'track' ? 'Track Your Report' : 'Report Cyber Incident'}
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Official Disclosure Channel</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setStep('form')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${step === 'form' ? 'bg-[#002B5B] text-white' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}
            >
              <Send size={14} className="inline mr-1" /> New Report
            </button>
            <button
              onClick={() => { setStep('track'); fetchTrackCaptcha(); }}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${step === 'track' ? 'bg-[#002B5B] text-white' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}
            >
              <Search size={14} className="inline mr-1" /> Track Report
            </button>
          </div>

          {/* Success View */}
          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-black text-[#002B5B] uppercase tracking-tight mb-2">Report Submitted</h3>
              <p className="text-sm text-gray-500 mb-4">Your incident report has been filed. Save your tracking ID for future reference.</p>
              {trackingId && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Tracking ID</p>
                  <p className="text-lg font-mono font-bold text-[#002B5B]">{trackingId}</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="bg-[#002B5B] text-white font-black py-3 px-8 rounded-xl uppercase tracking-widest text-xs hover:bg-[#00D4FF] hover:text-[#002B5B] transition-all"
              >
                Close
              </button>
            </div>
          )}

          {/* Track View */}
          {step === 'track' && (
            <div>
              <form onSubmit={handleTrack} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">Tracking ID</label>
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm transition-all"
                    placeholder="Enter your tracking ID"
                  />
                </div>

                {/* Track Captcha */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">
                    Captcha <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-1 flex-1">
                      {trackCaptchaLoading ? (
                        <div className="h-[50px] flex items-center justify-center text-gray-400 text-xs">
                          <Loader2 size={14} className="animate-spin mr-1" /> Loading...
                        </div>
                      ) : trackCaptcha ? (
                        <div dangerouslySetInnerHTML={{ __html: trackCaptcha.svg }} />
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={fetchTrackCaptcha}
                      className="p-2 text-gray-400 hover:text-[#002B5B] transition-colors"
                      title="Refresh captcha"
                    >
                      <RefreshCw size={18} className={trackCaptchaLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={trackCaptchaText}
                    onChange={(e) => setTrackCaptchaText(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm transition-all"
                    placeholder="Enter captcha text"
                  />
                </div>

                {trackError && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                    <AlertCircle size={14} /> {trackError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="w-full bg-[#002B5B] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00D4FF] hover:text-[#002B5B] transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {trackingLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  Check Status
                </button>
              </form>

              {trackResult && (
                <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</span>
                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full $                  trackResult.incident_status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                      trackResult.incident_status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                      trackResult.incident_status === 'DISMISSED' ? 'bg-red-100 text-red-700' :
                      trackResult.incident_status === 'PENDING' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {trackResult.incident_status || 'Submitted'}
                    </span>
                  </div>
                  {trackResult.description && (
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Description</span>
                      <p className="text-sm text-gray-700">{trackResult.description}</p>
                    </div>
                  )}
                  {trackResult.incident_status && (
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Incident Status</span>
                      <p className="text-sm text-gray-700">{trackResult.incident_status}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form View */}
          {step === 'form' && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-3 py-3 focus:border-[#00D4FF] outline-none text-sm transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-3 py-3 focus:border-[#00D4FF] outline-none text-sm transition-all"
                      placeholder="email@domain.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">
                  Incident Type <span className="text-red-500">*</span>
                </label>
                {loadingCat ? (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 size={14} className="animate-spin" /> Loading categories...
                  </div>
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm"
                  >
                    {categories.length === 0 && <option value="">No categories available</option>}
                    {categories.map((cat) => (
                      <option key={cat.id || cat._id} value={cat.id || cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm transition-all resize-none"
                  placeholder="Describe the incident..."
                />
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">
                  Captcha <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-1 flex-1">
                    {captchaLoading ? (
                      <div className="h-[50px] flex items-center justify-center text-gray-400 text-xs">
                        <Loader2 size={14} className="animate-spin mr-1" /> Loading...
                      </div>
                    ) : captcha ? (
                      <div dangerouslySetInnerHTML={{ __html: captcha.svg }} />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="p-2 text-gray-400 hover:text-[#002B5B] transition-colors"
                    title="Refresh captcha"
                  >
                    <RefreshCw size={18} className={captchaLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
                <input
                  type="text"
                  value={captchaText}
                  onChange={(e) => setCaptchaText(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm transition-all"
                  placeholder="Enter captcha text"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">Evidence & Attachments</label>
                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#00D4FF] transition-all bg-slate-50/50 group cursor-pointer block">
                  <FileUp className="mx-auto text-slate-300 mb-2 group-hover:text-[#00D4FF] transition-colors" size={32} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload PDF, Word or Image Files</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {files.length > 0 && (
                    <p className="text-xs text-green-600 mt-2 font-bold">{files.length} file(s) selected</p>
                  )}
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#002B5B] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#00D4FF] hover:text-[#002B5B] transition-all shadow-xl uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {submitting ? 'Submitting...' : 'Submit Urgent Report'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;