import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, FileUp, ShieldAlert } from 'lucide-react';

const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ap-navy/90 backdrop-blur-md"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative w-full max-w-2xl bg-[#112240] border border-ap-lavender/30 rounded-3xl p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-ap-gold transition-colors">
            <X size={28} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="text-ap-gold" size={32} />
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Report Incident</h2>
          </div>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            As per CERT-In directions, please provide accurate details to facilitate rapid mitigation.
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Identity Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-ap-lavender tracking-widest">
                  <User size={14} /> Full Name
                </label>
                <input type="text" required className="w-full bg-ap-navy/50 border border-ap-purple/30 rounded-xl p-3 focus:outline-none focus:border-ap-gold transition-all text-sm" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-ap-lavender tracking-widest">
                  <Mail size={14} /> Email Address
                </label>
                <input type="email" required className="w-full bg-ap-navy/50 border border-ap-purple/30 rounded-xl p-3 focus:outline-none focus:border-ap-gold transition-all text-sm" placeholder="email@domain.com" />
              </div>
            </div>

            {/* Incident Details */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-ap-lavender tracking-widest">Incident Category</label>
              <select className="w-full bg-ap-navy/50 border border-ap-purple/30 rounded-xl p-3 focus:outline-none focus:border-ap-gold transition-all text-sm appearance-none">
                <option>Phishing / Email Scam</option>
                <option>Ransomware / Malware</option>
                <option>Website Defacement</option>
                <option>Unauthorized Access / Data Breach</option>
                <option>DDoS Attack</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-ap-lavender tracking-widest">Description of Incident</label>
              <textarea rows="4" className="w-full bg-ap-navy/50 border border-ap-purple/30 rounded-xl p-3 focus:outline-none focus:border-ap-gold transition-all text-sm" placeholder="Please describe the occurrence, including timestamps and affected systems[cite: 1]."></textarea>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-ap-lavender tracking-widest">
                <FileUp size={14} /> Attach Evidence (Photos, PDF, Word)
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  multiple 
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full bg-ap-navy/30 border-2 border-dashed border-ap-purple/30 group-hover:border-ap-gold rounded-xl p-8 transition-all text-center">
                  <p className="text-xs text-gray-400">
                    Drag and drop files or <span className="text-ap-gold font-bold">Browse</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-tighter">
                    Supported: JPG, PNG, PDF, DOCX (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-ap-gold text-ap-navy font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-ap-gold/10 uppercase tracking-widest text-xs">
              <Send size={18} />
              Submit Urgent Report
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportModal;