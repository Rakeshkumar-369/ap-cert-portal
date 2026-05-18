import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ShieldCheck, MessageSquare, Search } from 'lucide-react';
import Card from '../components/ui/Card';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqData = [
    {
      id: 1,
      category: "General",
      question: "What is the primary role of AP-CERT?",
      answer: "AP-CERT (Andhra Pradesh Computer Emergency Response Team) is the nodal agency designated to handle cybersecurity incidents within the state. It coordinates response activities, provides early warnings on threats, and implements security measures for state-owned digital infrastructure."
    },
    {
      id: 2,
      category: "Reporting",
      question: "How do I report a cyber incident to AP-CERT?",
      answer: "Incidents can be reported via the 'Report Incident' button on this portal, which opens a secure disclosure form. Alternatively, you can email incident@apcert.gov.in or contact our 24/7 helpdesk for immediate assistance."
    },
    {
      id: 3,
      category: "Vulnerability",
      question: "What is the policy for Vulnerability Disclosure?",
      answer: "We follow a Responsible Disclosure Policy. Researchers are encouraged to report findings privately through our dedicated channel. We provide a reasonable timeframe for mitigation before any public disclosure is made."
    },
    {
      id: 4,
      category: "Support",
      question: "Does AP-CERT provide training for Government Officials?",
      answer: "Yes, AP-CERT conducts regular capacity-building workshops, webinars, and hands-on training sessions for IT staff across all government departments and state-owned entities."
    }
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-[#00D4FF]/10 rounded-full mb-4">
          <HelpCircle size={48} className="text-[#00D4FF]" />
        </div>
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">
          Help & <span className="text-[#00D4FF]">Support</span> Center
        </h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
          Comprehensive Guidance on AP-CERT Services & Security Policies
        </p>
      </div>

      {/* Search Interaction Logic */}
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <Search size={18} />
        </div>
        <input 
          type="text"
          placeholder="Search for questions, categories, or keywords..."
          className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent outline-none transition-all text-sm"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Accordion Logic with Framer Motion */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => (
          <Card key={faq.id} className="p-0 border-none shadow-md overflow-hidden bg-white">
            <button 
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black bg-slate-100 text-[#002B5B] px-2 py-1 rounded uppercase tracking-tighter">
                  {faq.category}
                </span>
                <h3 className="text-sm font-bold text-[#002B5B] uppercase tracking-tight group-hover:text-[#00D4FF] transition-colors">
                  {faq.question}
                </h3>
              </div>
              <ChevronDown 
                size={18} 
                className={`text-slate-300 transition-transform duration-300 ${activeIndex === idx ? 'rotate-180 text-[#00D4FF]' : ''}`} 
              />
            </button>
            
            <AnimatePresence>
              {activeIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 pt-0 border-t border-slate-50">
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-green-600 uppercase">
                      <ShieldCheck size={12} /> Verified by AP-CERT Security Analyst
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Support CTA Card */}
      <div className="mt-16 p-8 bg-[#002B5B] rounded-3xl relative overflow-hidden text-white shadow-xl">
        <div className="absolute top-0 right-0 w-1 h-full bg-[#00D4FF] shadow-[0_0_20px_#00D4FF]" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <MessageSquare size={32} className="text-[#00D4FF]" />
            <div>
              <h4 className="font-bold uppercase tracking-widest text-sm">Still have questions?</h4>
              <p className="text-[10px] text-slate-300 uppercase">Our 24/7 technical helpdesk is ready to assist you.</p>
            </div>
          </div>
          <button className="bg-[#00D4FF] text-[#002B5B] px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;