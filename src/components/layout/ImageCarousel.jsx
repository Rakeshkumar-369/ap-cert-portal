import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselData = [
  {
    id: 1,
    src: `${import.meta.env.BASE_URL}images/cyber-1.png`,
    title: "APCSOC OPERATIONS",
    desc: "24/7 MONITORING OF STATE INFRASTRUCTURE"
  },
  {
    id: 2,
    src: `${import.meta.env.BASE_URL}images/cyber-2.png`,
    title: "CYBER FORENSICS",
    desc: "BUILDING EXPERT DIGITAL INVESTIGATION CAPABILITY"
  },
  {
    id: 3,
    src: `${import.meta.env.BASE_URL}images/cyber-3.jpg`,
    title: "CAPACITY BUILDING",
    desc: "TRAINING THE NEXT GENERATION OF CYBER FORCES"
  },
  {
    id: 4,
    src: `${import.meta.env.BASE_URL}images/cyber-4.jpg`,
    title: "INCIDENT RESPONSE",
    desc: "RAPID MITIGATION OF CYBERSECURITY THREATS"
  },
  {
    id: 5,
    src: `${import.meta.env.BASE_URL}images/cyber-5.jpg`,
    title: "THREAT INTELLIGENCE",
    desc: "ADVANCED MACHINE LEARNING FOR THREAT DETECTION"
  },
  {
    id: 6,
    src: `${import.meta.env.BASE_URL}images/cyber-6.jpg`,
    title: "CITIZEN SAFETY",
    desc: "PROACTIVE ADVISORIES FOR ANDHRA PRADESH"
  }
];

const ImageCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextStep, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 })
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-3xl border border-ap-purple/20 shadow-2xl shadow-black/50 bg-ap-navy">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 200, damping: 25 }, opacity: { duration: 0.3 } }}
            className="absolute inset-0"
          >
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-ap-navy/90 via-ap-navy/20 to-transparent z-10" />
            <img 
              src={carouselData[index].src} 
              alt={carouselData[index].title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-12 left-10 z-20 max-w-2xl">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2"
              >
                {carouselData[index].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-ap-gold font-bold uppercase tracking-[0.2em] text-xs md:text-sm"
              >
                {carouselData[index].desc}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Floating Navigation Controls */}
        <div className="absolute inset-y-0 left-4 z-30 flex items-center">
            <button onClick={prevStep} className="p-2 rounded-full bg-white/10 hover:bg-ap-gold hover:text-ap-navy backdrop-blur-md transition-all text-white border border-white/20">
                <ChevronLeft size={24} />
            </button>
        </div>
        <div className="absolute inset-y-0 right-4 z-30 flex items-center">
            <button onClick={nextStep} className="p-2 rounded-full bg-white/10 hover:bg-ap-gold hover:text-ap-navy backdrop-blur-md transition-all text-white border border-white/20">
                <ChevronRight size={24} />
            </button>
        </div>

        {/* Pill Indicators */}
        <div className="absolute bottom-6 right-10 z-30 flex gap-2">
          {carouselData.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === index ? 'w-10 bg-ap-gold' : 'w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;