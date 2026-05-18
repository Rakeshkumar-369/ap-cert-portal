import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const ads = [
  {
    id: 1,
    title: "Secure Your Digital Identity",
    desc: "Enable Multi-Factor Authentication (MFA) across all government portals.",
    tag: "ALERT",
    color: "bg-ap-purple"
  },
  {
    id: 2,
    title: "National Cyber Security Month",
    desc: "Join our webinar on protecting critical infrastructure on June 10th.",
    tag: "EVENT",
    color: "bg-ap-lavender"
  },
  {
    id: 3,
    title: "Report Phishing Immediately",
    desc: "Received a suspicious link? Forward it to report@apcert.gov.in",
    tag: "URGENT",
    color: "bg-ap-gold text-ap-navy"
  }
];

const AdScroller = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative h-48 md:h-64 overflow-hidden rounded-2xl border border-ap-purple/30 bg-gradient-to-r from-[#0E2148] to-[#1a2e5a]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col justify-center px-12"
          >
            <span className={`w-fit px-3 py-1 rounded text-xs font-bold mb-4 ${ads[current].color}`}>
              {ads[current].tag}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{ads[current].title}</h2>
            <p className="text-gray-400 max-w-xl">{ads[current].desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 transition-all duration-300 rounded-full ${i === current ? 'w-8 bg-ap-gold' : 'w-2 bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdScroller;