import React, { useState } from 'react';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';
import { navLinks } from '../../data/navLinks';

const Navbar = ({ onReportClick, setPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <nav className="border-b border-ap-purple/30 bg-ap-navy/80 backdrop-blur-md sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setPage('home')}
          >
            <Shield className="text-ap-gold w-9 h-9" />

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none uppercase">
                Ap <span className="text-ap-gold">Cert</span>
              </span>

              <span className="text-[10px] text-ap-lavender font-bold tracking-[0.2em] uppercase">
                Cyber Security Team
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">

            {navLinks.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >

                {/* Main Menu Button */}
                {!item.links ? (
                  <button
                    onClick={() => {
                      setPage(item.name.toLowerCase());
                    }}
                    className="text-sm font-bold uppercase tracking-wider hover:text-ap-gold transition-colors py-8"
                  >
                    {item.name}
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider hover:text-ap-gold transition-colors py-8">
                    {item.name}

                    <ChevronDown
                      size={14}
                      className="group-hover:rotate-180 transition-transform"
                    />
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.links && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 w-64 bg-[#162a54] border border-ap-purple/30 rounded-b-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">

                    {item.links.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => {

                          // Report Incident Modal
                          if (sub.name === "Report an Incident") {
                            onReportClick();
                          }

                          // Existing Mappings
                          else if (sub.name === "About APCERT") {
                            setPage('about');
                          }

                          else if (sub.name === "Functions & Mandate") {
                            setPage('mandate');
                          }

                          else if (sub.name === "Security Tips") {
                            setPage('tips');
                          }

                          else if (sub.name === "Downloads") {
                            setPage('downloads');
                          }

                          else if (sub.name === "News & Updates") {
                            setPage('news');
                          }

                          // Additional Mappings
                          else if (sub.name === "Vulnerability Disclosure") {
                            setPage('vulnerability');
                          }

                          else if (sub.name === "Who's Who") {
                            setPage('committee');
                          }

                          else if (sub.name === "Training") {
                            setPage('training');
                          }

                          else if (sub.name === "Publications") {
                            setPage('reports');
                          }

                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-ap-purple/20 hover:text-ap-gold rounded-lg transition-all"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Report Button */}
            <button
              onClick={onReportClick}
              className="bg-ap-gold text-ap-navy px-6 py-2.5 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-white hover:scale-105 transition-all shadow-lg"
            >
              Report Incident
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ap-navy border-b border-ap-purple/30 px-4 py-6 space-y-4">

          {navLinks.map((item) => (
            <div key={item.name}>

              <div className="text-ap-lavender text-xs font-black uppercase mb-2">
                {item.name}
              </div>

              {item.links ? (
                <div className="grid grid-cols-1 gap-2 pl-4 border-l border-ap-purple/20">

                  {item.links.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => {

                        // Report Incident Modal
                        if (sub.name === "Report an Incident") {
                          onReportClick();
                        }

                        // Existing Mappings
                        else if (sub.name === "About APCERT") {
                          setPage('about');
                        }

                        else if (sub.name === "Functions & Mandate") {
                          setPage('mandate');
                        }

                        else if (sub.name === "Security Tips") {
                          setPage('tips');
                        }

                        else if (sub.name === "Downloads") {
                          setPage('downloads');
                        }

                        else if (sub.name === "News & Updates") {
                          setPage('news');
                        }

                        // Additional Mappings
                        else if (sub.name === "Vulnerability Disclosure") {
                          setPage('vulnerability');
                        }

                        else if (sub.name === "Who's Who") {
                          setPage('committee');
                        }

                        else if (sub.name === "Training") {
                          setPage('training');
                        }

                        else if (sub.name === "Publications") {
                          setPage('reports');
                        }

                        setIsMobileMenuOpen(false);
                      }}
                      className="text-sm py-1 text-left hover:text-ap-gold"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPage(item.name.toLowerCase());
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm hover:text-ap-gold"
                >
                  {item.name}
                </button>
              )}
            </div>
          ))}

          {/* Mobile Report Button */}
          <button
            onClick={() => {
              onReportClick();
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-ap-gold text-ap-navy py-3 rounded-lg font-black uppercase text-xs tracking-widest mt-4"
          >
            Report Incident
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;