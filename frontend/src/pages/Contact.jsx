import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

const Contact = () => {
  return (
    /* Changed background from dark navy to a light, clean slate */
    <div className="min-h-screen bg-[#F8FAFC] py-16 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section: Professional Navy Text on Light Background */}
        <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
          <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">
            Contact <span className="text-[#00D4FF]">AP-CERT</span>
          </h1>
          <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
            24/7 Cybersecurity Support & Incident Coordination
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Cards with Glowing Borders */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-t-4 border-t-[#00D4FF] transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#002B5B] rounded-xl text-white shadow-lg shadow-blue-900/20">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Support</h3>
                  <p className="text-sm font-bold text-[#002B5B]">incident@apcert.gov.in</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-t-4 border-t-[#00D4FF] transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#002B5B] rounded-xl text-white shadow-lg shadow-blue-900/20">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Help Desk</h3>
                  <p className="text-sm font-bold text-[#002B5B]">+91 866 234 XXXX</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#002B5B] text-white shadow-xl relative overflow-hidden group">
              {/* Animated Glow Line */}
              <div className="absolute top-0 right-0 w-1 h-full bg-[#00D4FF] shadow-[0_0_20px_#00D4FF] group-hover:w-2 transition-all" />
              <div className="flex items-center gap-4">
                <Clock size={24} className="text-[#00D4FF]" />
                <div>
                  <h3 className="text-[10px] font-black text-[#00D4FF] uppercase tracking-widest">Availability</h3>
                  <p className="text-sm font-bold uppercase tracking-tight">Active 24/7 Response</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Nodal Office with clean spacing */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white border-none shadow-[0_4px_25px_rgba(0,0,0,0.06)] relative overflow-hidden">
               {/* Decorative subtle blue gradient corner */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00D4FF]/5 rounded-full blur-3xl" />
               
              <h3 className="text-xl font-bold text-[#002B5B] mb-8 flex items-center gap-2">
                <MapPin className="text-[#00D4FF]" size={22} /> Nodal Office
              </h3>
              
              <div className="space-y-6 text-gray-600 leading-relaxed relative z-10">
                <div>
                  <p className="font-black text-[#002B5B] text-lg uppercase tracking-tight">Andhra Pradesh Technology Services (APTS)</p>
                  <p className="text-ap-gold font-bold text-xs uppercase tracking-widest mt-1">ITE&C Department, Govt. of Andhra Pradesh</p>
                </div>
                
                <p className="text-sm font-medium">
                  Vijayawada, Andhra Pradesh, India.
                </p>
                
                <div className="pt-8 mt-10 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    <ShieldCheck size={16} className="text-green-500" /> Authorized Communication Channel
                  </div>
                  <button className="text-[10px] font-black text-[#002B5B] hover:text-[#00D4FF] uppercase tracking-widest transition-colors">
                    View on Map →
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;