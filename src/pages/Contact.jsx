import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-l-4 border-ap-gold pl-6">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Contact AP-CERT</h1>
        <p className="text-gray-400 max-w-2xl">
          Get in touch for incident reporting, security advisories, or general inquiries. 
          Our team operates 24/7 to ensure state-wide digital safety.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-ap-purple/20">
            <div className="flex items-center gap-4 text-ap-gold mb-4">
              <Clock size={24} />
              <h2 className="font-bold uppercase tracking-widest text-sm">Availability</h2>
            </div>
            <p className="text-sm text-gray-300">24x7 Incident Monitoring & Response</p>
            <p className="text-xs text-gray-500 mt-2">Non-emergency hours: Mon-Fri, 9AM - 6PM</p>
          </Card>

          <Card className="border-ap-purple/20">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Mail className="text-ap-lavender shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase text-gray-500">Emergency Email</div>
                  <div className="text-sm font-mono text-white">incident@apcert.gov.in</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-ap-lavender shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase text-gray-500">Toll-Free Helpline</div>
                  <div className="text-sm font-mono text-white">1800-XX-XXXX</div>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="text-ap-lavender shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase text-gray-500">Headquarters</div>
                  <div className="text-sm text-white">APTS Office, Vijayawada, Andhra Pradesh</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Secure Communication & PGP */}
        <div className="lg:col-span-2">
          <Card className="h-full border-ap-gold/20 bg-gradient-to-br from-[#162a54] to-ap-navy">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-ap-gold" size={32} />
              <h2 className="text-2xl font-bold">Secure Incident Reporting</h2>
            </div>
            
            <p className="text-sm text-gray-300 mb-8 leading-relaxed">
              For reporting sensitive vulnerabilities or incidents, we recommend using 
              encrypted communication. Use our public PGP key to secure your emails.
            </p>

            <div className="bg-black/40 rounded-lg p-6 border border-ap-purple/30">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-ap-lavender">Public PGP Key Details</span>
                <button className="text-[10px] bg-ap-purple/30 px-2 py-1 rounded text-white hover:bg-ap-purple transition-colors">Copy Key</button>
              </div>
              <pre className="text-[10px] md:text-xs text-ap-gold/80 font-mono leading-tight overflow-x-auto">
                {`-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v2

mQENBGE2...[truncated for display]...
... Key Fingerprint: 4E23 1F9A 88B2 10C4 ...
-----END PGP PUBLIC KEY BLOCK-----`}
              </pre>
            </div>

            <div className="mt-8 p-4 bg-ap-gold/10 rounded-lg border border-ap-gold/20">
              <p className="text-xs text-ap-gold leading-relaxed">
                <strong>Note:</strong> Reports sent via PGP are handled with the highest priority and 
                confidentiality by the AP-CERT operations team.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Contact;