import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Bell, Activity, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';

const AnnouncementRibbon = () => {
  const newsItems = [
    "OFFICIAL ANNOUNCEMENT: AP-CERT provides 24/7 proactive monitoring and incident response for all state-owned critical infrastructure.",
    "LATEST ALERT: Multiple Vulnerabilities detected in NGINX Products. Check the Alerts section for mitigation steps.",
    "MANDATE: designated under Section 70B of the IT Act, 2000 for handling cyber security incidents.",
    "NOTICE: Government officials are requested to follow the updated Password Policy 2026."
  ];

  return (
    <div className="w-full bg-[#003366] overflow-hidden py-4 relative group border-y border-[#00D4FF]/30 shadow-[0_0_20px_rgba(0,212,255,0.1)] rounded-2xl">
      
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#003366] to-transparent z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#003366] to-transparent z-10" />

      {/* Scrolling Content */}
      <div className="animate-scroll whitespace-nowrap flex items-center">
        {[...newsItems, ...newsItems].map((item, idx) => (
          <div key={idx} className="flex items-center mx-8">
            
            <span className="text-[#00D4FF] font-black uppercase tracking-widest text-[10px] mr-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse shadow-[0_0_8px_#00D4FF]" />
              IMPORTANT
            </span>

            <p className="text-white text-sm font-bold uppercase tracking-tight">
              {item}
            </p>

            <span className="ml-12 text-slate-500 font-black">
              / / /
            </span>

          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const alerts = [
    { id: "CIVN-2026-0239", date: "May 16, 2026", title: "Multiple Vulnerabilities in NGINX Products", isNew: true },
    { id: "CIVN-2026-0238", date: "May 15, 2026", title: "Multiple Vulnerabilities in PAN-OS", isNew: true },
    { id: "CIVN-2026-0237", date: "May 15, 2026", title: "Critical Flaws in Drupal Plugins", isNew: true },
    { id: "CIAD-2026-0023", date: "May 14, 2026", title: "Security Update for SAP Products", isNew: false }
  ];

  const activities = [
    { 
      title: "Software Supply Chain Attacks Targeting Open-Source Packages", 
      date: "April 02, 2026", 
      desc: "Compromises reported affecting npm, PyPI, and GitHub Actions registries.",
      isNew: true 
    },
    { 
      title: "RTO/eChallan Themed Android Malware Campaign", 
      date: "March 17, 2026", 
      desc: "Malware impersonating official RTO offices targeting sensitive user info.",
      isNew: false 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* 1. ANNOUNCEMENT RIBBON */}
      <AnnouncementRibbon />

      {/* 2. DUAL TABLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">

        {/* Latest Security Alerts */}
        <section className="space-y-6">
          
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="p-3 bg-[#003366] rounded-2xl text-[#00D4FF] shadow-lg">
              <Bell size={24} />
            </div>

            <h3 className="text-2xl font-black text-[#003366] uppercase tracking-tight">
              Latest Security Alerts
            </h3>
          </div>

          <div className="space-y-4">
            {alerts.map((alert, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 10 }}
                className="flex items-start gap-4 p-4 hover:bg-white hover:shadow-xl rounded-2xl transition-all group cursor-pointer border-l-2 border-transparent hover:border-l-[#00D4FF]"
              >
                <ChevronRight
                  className="text-slate-300 group-hover:text-[#00D4FF] mt-1"
                  size={18}
                />

                <div className="flex-1">
                  
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-[#003366] uppercase tracking-widest">
                      {alert.id}
                    </span>

                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      ({alert.date})
                    </span>

                    {alert.isNew && (
                      <span className="bg-[#00D4FF] text-[#003366] text-[8px] font-black px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,212,255,0.5)]">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-[#003366] transition-colors">
                    {alert.title}
                  </p>

                </div>
              </motion.div>
            ))}

            <button className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#003366] transition-colors border-t border-slate-50 mt-4">
              View All Alerts
              <ArrowRight size={12} className="inline ml-1" />
            </button>
          </div>
        </section>

        {/* Current Activities */}
        <section className="space-y-6">

          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="p-3 bg-[#003366] rounded-2xl text-[#00D4FF] shadow-lg">
              <Activity size={24} />
            </div>

            <h3 className="text-2xl font-black text-[#003366] uppercase tracking-tight">
              Current Activities
            </h3>
          </div>

          <div className="space-y-8">
            {activities.map((act, idx) => (
              <div
                key={idx}
                className="relative pl-6 border-l-2 border-slate-100 hover:border-l-[#003366] transition-colors group"
              >

                <div className="flex items-center gap-3 mb-2">
                  
                  <h4 className="text-sm font-black text-[#003366] uppercase leading-tight group-hover:text-[#00D4FF] transition-colors">
                    {act.title}
                  </h4>

                  {act.isNew && (
                    <span className="bg-[#00D4FF] text-[#003366] text-[8px] font-black px-2 py-0.5 rounded">
                      NEW
                    </span>
                  )}

                </div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  ({act.date})
                </p>

                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-3">
                  {act.desc}
                </p>

                <button className="text-[10px] font-black text-[#003366] uppercase tracking-widest flex items-center gap-1 hover:underline">
                  More
                  <ChevronRight size={10} />
                </button>

              </div>
            ))}

            <button className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#003366] transition-colors border-t border-slate-50 mt-4">
              View Archive
              <ArrowRight size={12} className="inline ml-1" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;