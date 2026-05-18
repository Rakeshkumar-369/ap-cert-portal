import React from 'react';
import Card from '../components/ui/Card';
import { Users, Mail } from 'lucide-react';

const Committee = () => {
  const officers = [
    { name: "Principal Secretary", role: "Chairman, AP-CERT Committee", email: "ps-ite@ap.gov.in" },
    { name: "Managing Director, APTS", role: "Member Secretary", email: "md-apts@ap.gov.in" },
    { name: "State CISO", role: "Operations Lead", email: "ciso@ap.gov.in" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6 text-center md:text-left">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">
          Organizational <span className="text-[#00D4FF]">Structure</span>
        </h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Governance & Leadership of AP-CERT</p>
      </div>
      
      <div className="flex justify-center mb-16">
        <Card className="w-full max-w-md text-center border-none shadow-2xl border-t-4 border-[#00D4FF] bg-white">
          <div className="bg-[#002B5B] text-white font-black py-2 rounded-full mb-4 uppercase text-[10px] tracking-widest inline-block px-6">
            Governing Body
          </div>
          <h2 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight">AP-CERT Committee</h2>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest italic">Strategic Oversight & Policy</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {officers.map((off, idx) => (
          <Card key={idx} className="text-center group bg-white border-none shadow-lg hover:shadow-2xl transition-all">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 group-hover:border-[#00D4FF] transition-colors overflow-hidden">
              <Users className="text-[#002B5B] group-hover:text-[#00D4FF] transition-colors" size={32} />
            </div>
            <h3 className="font-black text-[#002B5B] text-lg uppercase tracking-tight mb-1">{off.name}</h3>
            <p className="text-[10px] text-ap-gold uppercase font-black tracking-widest mb-6 px-4 leading-tight">{off.role}</p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-mono pt-4 border-t border-slate-50">
              <Mail size={14} className="text-[#00D4FF]" /> {off.email}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Committee;