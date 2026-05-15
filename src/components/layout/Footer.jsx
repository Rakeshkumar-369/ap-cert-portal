import React from 'react';
import { Shield,   Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ap-navy border-t border-ap-purple/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-ap-gold w-8 h-8" />
            <span className="text-xl font-bold tracking-tight uppercase">Ap <span className="text-ap-gold">Cert</span></span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Protecting Andhra Pradesh's critical information infrastructure through proactive defense and rapid response.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-ap-lavender uppercase tracking-widest text-xs">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li><a href="#" className="hover:text-ap-gold transition-colors">Incident Reporting</a></li>
            <li><a href="#" className="hover:text-ap-gold transition-colors">Security Advisories</a></li>
            <li><a href="#" className="hover:text-ap-gold transition-colors">Vulnerability Disclosure</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-ap-lavender uppercase tracking-widest text-xs">Resources</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li><a href="#" className="hover:text-ap-gold transition-colors">Cyber Awareness</a></li>
            <li><a href="#" className="hover:text-ap-gold transition-colors">Whitepapers</a></li>
            <li><a href="#" className="hover:text-ap-gold transition-colors">Laws & Policies</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-ap-lavender uppercase tracking-widest text-xs">Contact Emergency</h4>
          <div className="flex items-center gap-3 text-ap-gold mb-2 font-mono">
            <Mail size={16} /> helpdesk@apcert.gov.in
          </div>
          <p className="text-xs text-gray-500">Toll Free: 1800-XX-XXXX</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-ap-purple/10 text-center text-xs text-gray-500">
        © 2026 AP-CERT. All rights reserved. Managed by ITE&C Department, Govt of Andhra Pradesh.
      </div>
    </footer>
  );
};

export default Footer;