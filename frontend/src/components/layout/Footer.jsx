import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Accent horizontal line with the requested color (0 212 255) */}
      <div className="h-1 w-full" style={{ backgroundColor: 'rgb(0, 212, 255)' }}></div>

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="font-bold text-xl tracking-tight">AP-CERT</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Andhra Pradesh Computer Emergency Response Team is the nodal agency for 
              responding to computer security incidents as and when they occur in the state.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About AP-CERT</Link></li>
              <li><Link to="/mandate" className="hover:text-blue-400 transition-colors">Our Mandate</Link></li>
              <li><Link to="/vulnerability-disclosure" className="hover:text-blue-400 transition-colors">Vulnerability Disclosure</Link></li>
              <li><Link to="/publications" className="hover:text-blue-400 transition-colors">Reports & Publications</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/security-tips" className="hover:text-blue-400 transition-colors">Security Tips</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors">
                <a href="https://cert-in.org.in" target="_blank" rel="noreferrer">CERT-In</a>
                <ExternalLink className="w-3 h-3" />
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Support</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Vijayawada, Andhra Pradesh, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+91 (866) 2468-123</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>incident@apcert.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} AP-CERT. All rights reserved. Government of Andhra Pradesh.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/hyperlink-policy" className="hover:text-slate-300">Hyperlink Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;