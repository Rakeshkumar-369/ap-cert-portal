import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ap-navy/80 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-[#162a54] border border-ap-lavender/30 rounded-2xl p-8 shadow-2xl"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-2">Report Cyber Incident</h2>
          <p className="text-gray-400 text-sm mb-6">Your report helps us secure the state. Please provide details below.</p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold uppercase text-ap-lavender mb-2">Organization / Name</label>
              <input type="text" className="w-full bg-ap-navy/50 border border-ap-purple/30 rounded-lg p-3 focus:outline-none focus:border-ap-gold transition-colors" placeholder="e.g. Dept of Revenue" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-ap-lavender mb-2">Incident Type</label>
              <select className="w-full bg-ap-navy/50 border border-ap-purple/30 rounded-lg p-3 focus:outline-none focus:border-ap-gold transition-colors">
                <option>Phishing / Email Scam</option>
                <option>Ransomware</option>
                <option>Website Defacement</option>
                <option>Unauthorized Access</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-ap-lavender mb-2">Description</label>
              <textarea rows="4" className="w-full bg-ap-navy/50 border border-ap-purple/30 rounded-lg p-3 focus:outline-none focus:border-ap-gold transition-colors" placeholder="Briefly describe the threat..."></textarea>
            </div>
            
            <button className="w-full bg-ap-gold text-ap-navy font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all">
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