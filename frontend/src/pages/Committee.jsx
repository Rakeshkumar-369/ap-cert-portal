import React from 'react';
import Card from '../components/ui/Card';
import { Users, Briefcase, Mail } from 'lucide-react';

const officers = [
  { name: "Principal Secretary", role: "Chairman, AP-CERT Committee", email: "ps-ite@ap.gov.in" },
  { name: "Managing Director, APTS", role: "Member Secretary", email: "md-apts@ap.gov.in" },
  { name: "State CISO", role: "Operations Lead", email: "ciso@ap.gov.in" }
];

const Committee = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black uppercase mb-12 border-b-2 border-ap-purple pb-4 text-center">Organizational Structure</h1>
    
    <div className="flex justify-center mb-16">
      <Card className="w-full max-w-md text-center border-ap-gold/50 bg-ap-gold/5">
        <div className="bg-ap-gold text-ap-navy font-black py-2 rounded mb-4 uppercase text-xs">Governing Body</div>
        <h2 className="text-xl font-bold">AP-CERT Steering Committee</h2>
        <p className="text-xs text-gray-400 mt-2 italic">Strategic oversight and policy decision-making. </p>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {officers.map((off, idx) => (
        <Card key={idx} className="text-center group hover:bg-ap-purple/10 transition-colors">
          <div className="w-16 h-16 bg-ap-navy rounded-full flex items-center justify-center mx-auto mb-4 border border-ap-lavender/30">
            <Users className="text-ap-lavender group-hover:text-ap-gold transition-colors" />
          </div>
          <h3 className="font-bold mb-1">{off.name}</h3>
          <p className="text-[10px] text-ap-lavender uppercase font-black tracking-widest mb-4">{off.role}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
            <Mail size={12} /> {off.email}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Committee;