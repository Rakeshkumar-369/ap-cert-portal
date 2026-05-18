import React from 'react';
import { Gavel, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import Card from '../components/ui/Card';

const Mandate = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">
          Functions & <span className="text-[#00D4FF]">Mandate</span>
        </h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-3xl">
          Nodal agency designated to handle cyber security incidents in the state, operating under the statutory framework of the IT Act 2000.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-sm font-black text-[#002B5B] uppercase tracking-[0.2em] flex items-center gap-2">
            <Gavel size={18} className="text-[#00D4FF]" /> Legal Basis
          </h2>
          <Card className="bg-white border-none shadow-lg border-t-4 border-[#00D4FF]">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              AP-CERT functions in alignment with **Section 70B of the Information Technology Act, 2000**, 
              serving as the state-level point of contact for incident reporting and coordination.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-sm font-black text-[#002B5B] uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap size={18} className="text-[#00D4FF]" /> Primary Objective
          </h2>
          <Card className="bg-white border-none shadow-lg border-t-4 border-[#00D4FF]">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              To reduce the time from first awareness of a cybersecurity threat to 
              the mitigation of the event, providing coverage to all state departments.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-black text-[#002B5B] text-center mb-12 uppercase tracking-tight">
          Statutory Functions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 bg-white border-l-4 border-[#002B5B] shadow-md hover:shadow-xl transition-all group">
            <BarChart3 className="text-[#00D4FF] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-[#002B5B] mb-2 uppercase text-sm">Collection & Analysis</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Gathering and analyzing information on cyber incidents across the state network infrastructure.
            </p>
          </div>

          <div className="p-8 bg-white border-l-4 border-[#002B5B] shadow-md hover:shadow-xl transition-all group">
            <ShieldCheck className="text-[#00D4FF] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-[#002B5B] mb-2 uppercase text-sm">Emergency Measures</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Implementing emergency measures for handling cyber security incidents 24/7.
            </p>
          </div>

          <div className="p-8 bg-white border-l-4 border-[#002B5B] shadow-md hover:shadow-xl transition-all group">
            <Users className="text-[#00D4FF] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-[#002B5B] mb-2 uppercase text-sm">Coordination</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Acting as the central coordinator for cyber incident response activities among state entities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mandate;