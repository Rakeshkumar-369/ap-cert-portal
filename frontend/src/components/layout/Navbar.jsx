import { useState, useEffect } from 'react';
import { 
  
  Menu, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  Home,
  ArrowUp,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../../data/navLinks';

const Navbar = ({ setPage, onReportClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (name) => {
    const route = name.toLowerCase().trim();
    if (route === 'report an incident' || route === 'report incident') {
      onReportClick();
    } else if (route === 'training') {
      setPage('training');
    } else if (route === 'contact' || route === 'contact us') {
      setPage('contact');
    } else if (route === 'about apcert' || route === 'who we are') {
      setPage('about');
    } else if (route.includes('mandate')) {
      setPage('mandate');
    } else if (route.includes('tips') || route === 'security tips') {
      setPage('tips');
    } else if (route === 'downloads') {
      setPage('downloads');
    } else if (route === 'publications' || route === 'reports') {
      setPage('reports');
    } else if (route === 'home') {
      setPage('home');
    } else if (route === 'vulnerability disclosure') {
      setPage('vulnerability');
    } else if (route === "who's who" || route === 'committee') {
      setPage('committee');
    } else if (route === 'news & updates' || route === 'news') {
      setPage('news');
    }
    else if (route === 'admin') {
      setPage('admin');
    } else {
      setPage(route.replace(/\s+/g, ''));
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 200, damping: 20 } 
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  return (
    <>
      <header className="w-full z-[100] font-sans">
        
        {/* TOP BRANDING AREA */}
        <div className="w-full bg-white border-b border-slate-100 relative">

          <button
            onClick={() => handleNavigation('admin')}
            className="absolute top-2 left-2 w-10 h-10 opacity-0 z-[200] cursor-pointer"
            aria-label="Admin Login"
          ></button>
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 cursor-pointer group" 
              onClick={() => handleNavigation('home')}
            >
            <div className="relative w-10 h-10 md:w-12 md:h-12 group-hover:scale-105 transition-transform">
  <svg
    viewBox="0 0 24 24"
    className="absolute inset-0 w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="shield-clip">
        <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" />
      </clipPath>
    </defs>
    <image
      href={`${import.meta.env.BASE_URL}APCSOC.png`}
      x="0"
      y="0"
      width="24"
      height="24"
      clipPath="url(#shield-clip)"
      preserveAspectRatio="xMidYMid slice"
    />
  </svg>
</div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black text-[#003366] leading-none tracking-tight">
                  AP-CERT
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  Andhra Pradesh Computer Emergency Response Team
                </p>
              </div>
            </motion.div>
            
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex flex-col items-end border-r border-slate-200 pr-6 text-right">
                <span className="text-[10px] font-black uppercase text-[#003366]">24/7 Support</span>
                <span className="text-[9px] font-bold text-green-600 uppercase flex items-center gap-1">
                  <Globe size={10} /> State Infrastructure Active
                </span>
              </div>
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="AP Logo"
                className="h-14 object-contain"
              />
            </div>

            <button 
              className="lg:hidden p-2 text-[#003366]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* PRIMARY STICKY NAV */}
        <nav className="w-full bg-[#003366] sticky top-0 shadow-xl hidden lg:block z-[110]">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
            
            <div className="flex h-full items-center gap-2">
              <button 
                onClick={() => handleNavigation('home')}
                className="w-12 h-12 flex items-center justify-center bg-[#FFCC00] text-[#003366] rounded-xl hover:bg-white transition-all duration-300 shadow-md group mr-4"
              >
                <Home size={22} className="group-hover:scale-110 transition-transform" />
              </button>

              {navLinks.map((item) => {
                if (item.name === 'Home') return null;
                return (
                  <div 
                    key={item.name} 
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button 
                      onClick={() => !item.links && handleNavigation(item.name)}
                      className="px-5 h-full text-[14px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 hover:text-[#FFCC00] transition-colors relative group"
                    >
                      {item.name}
                      {item.links && (
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform duration-300 ${activeDropdown === item.name ? 'rotate-180 text-[#FFCC00]' : 'opacity-50'}`} 
                        />
                      )}
                      <span className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#FFCC00] transition-all duration-300 group-hover:w-3/4" />
                    </button>

                    <AnimatePresence>
                      {item.links && activeDropdown === item.name && (
                        <motion.div 
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-[90%] left-0 w-64 pt-2 z-[150]"
                        >
                          <div className="bg-white rounded-2xl shadow-2xl border-t-4 border-[#FFCC00] overflow-hidden p-2">
                            {item.links.map((sub) => (
                              <button
                                key={sub.name}
                                onClick={() => handleNavigation(sub.name)}
                                className="w-full text-left px-4 py-3 text-[12px] font-bold uppercase text-slate-700 hover:bg-slate-50 hover:text-[#003366] rounded-lg transition-all"
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onReportClick}
              className="h-12 bg-[#FFCC00] text-[#003366] px-8 rounded-xl text-[12px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:shadow-xl transition-all active:scale-95 border-2 border-transparent hover:border-[#FFCC00]"
            >
              <ShieldAlert size={18} />
              Report Incident
            </button>
          </div>
        </nav>
      </header>

      {/* SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[200] bg-[#003366] text-white p-4 rounded-xl shadow-2xl border-b-4 border-[#FFCC00] hover:bg-[#FFCC00] hover:text-[#003366] transition-all group"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-[#003366] z-[300] lg:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-10">
              {/* Replaced Shield icon with logo image - same dimensions */}
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto">
              {navLinks.map((item) => (
                <div key={item.name} className="flex flex-col gap-3">
                  <div className="text-[#FFCC00] text-[10px] font-black uppercase tracking-widest opacity-70">
                    {item.name}
                  </div>
                  {item.links ? (
                    item.links.map((sub) => (
                      <button key={sub.name} onClick={() => handleNavigation(sub.name)} className="text-left text-lg font-bold text-white">
                        {sub.name}
                      </button>
                    ))
                  ) : (
                    <button onClick={() => handleNavigation(item.name)} className="text-left text-lg font-bold text-white">
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={() => { onReportClick(); setIsMobileMenuOpen(false); }}
              className="mt-auto bg-[#FFCC00] text-[#003366] py-5 rounded-xl font-bold uppercase text-sm tracking-widest shadow-xl flex items-center justify-center gap-2"
            >
              <ShieldAlert size={20} /> Report Incident
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;