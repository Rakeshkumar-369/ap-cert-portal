import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, FileUp, ShieldAlert, AlertCircle } from 'lucide-react';

const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Light Backdrop with subtle blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#002B5B]/30 backdrop-blur-sm"
        />
        
        {/* Modal Content - Clean White Style */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-t-8 border-[#00D4FF] overflow-y-auto max-h-[90vh] custom-scrollbar"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-[#002B5B] transition-colors">
            <X size={28} />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#002B5B] rounded-2xl text-[#00D4FF] shadow-lg shadow-blue-900/20">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight">Report Cyber Incident</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Official Disclosure Channel</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm transition-all" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm transition-all" placeholder="email@domain.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">Incident Type</label>
              <select className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 focus:border-[#00D4FF] outline-none text-sm">
                <option>Phishing / Email Scam</option>
                <option>Ransomware Attack</option>
                <option>Unauthorized Access</option>
                <option>Website Defacement</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#002B5B] tracking-widest">Evidence & Attachments</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#00D4FF] transition-all bg-slate-50/50 group cursor-pointer">
                <FileUp className="mx-auto text-slate-300 mb-2 group-hover:text-[#00D4FF] transition-colors" size={32} />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload PDF, Word or Image Files</p>
              </div>
            </div>
            
            <button className="w-full bg-[#002B5B] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#00D4FF] hover:text-[#002B5B] transition-all shadow-xl uppercase tracking-widest text-xs">
              <Send size={18} /> Submit Urgent Report
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;