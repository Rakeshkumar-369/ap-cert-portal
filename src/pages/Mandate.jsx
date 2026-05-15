import React from 'react';
import { Gavel, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import Card from '../components/ui/Card';

const Mandate = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4 border-b-2 border-ap-gold inline-block pb-2">
          Functions & Mandate
        </h1>
        <p className="text-gray-400 max-w-3xl mt-4 leading-relaxed">
          The Andhra Pradesh Cyber Security Response Team (AP-CERT) is the nodal agency 
          designated to handle cyber security incidents in the state, operating under the 
          legal framework of the Information Technology Act. [cite: 1, 95]
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Legal Basis Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-ap-lavender uppercase tracking-widest flex items-center gap-2">
            <Gavel size={20} /> Legal Basis
          </h2>
          <Card className="border-ap-purple/20">
            <p className="text-sm text-gray-300 leading-relaxed">
              AP-CERT functions in alignment with **Section 70B of the Information Technology Act, 2000**, 
              mirroring the statutory functions of the National CERT (CERT-In).  
              It serves as the state-level point of contact for incident reporting and coordination. [cite: 1, 99]
            </p>
          </Card>
        </div>

        {/* Objectives Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-ap-gold uppercase tracking-widest flex items-center gap-2">
            <Zap size={20} /> Primary Objective
          </h2>
          <Card className="border-ap-gold/20">
            <p className="text-sm text-gray-300 leading-relaxed">
              To reduce the time from first awareness of a cybersecurity threat to 
              the mitigation of the event, providing coverage to all state departments 
              and government-owned entities. [cite: 104, 105]
            </p>
          </Card>
        </div>
      </div>

      {/* Statutory Functions Grid */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-12 uppercase tracking-widest">
          Statutory Functions 
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l border-ap-lavender bg-ap-navy/40">
            <BarChart3 className="text-ap-gold mb-4" />
            <h3 className="font-bold mb-2">Collection & Analysis</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Gathering and analyzing information on cyber incidents across the state network infrastructure. 
            </p>
          </div>

          <div className="p-6 border-l border-ap-lavender bg-ap-navy/40">
            <ShieldCheck className="text-ap-gold mb-4" />
            <h3 className="font-bold mb-2">Emergency Measures</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Implementing emergency measures for handling cyber security incidents 24/7. [cite: 1, 112]
            </p>
          </div>

          <div className="p-6 border-l border-ap-lavender bg-ap-navy/40">
            <Users className="text-ap-gold mb-4" />
            <h3 className="font-bold mb-2">Coordination</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Acting as the central coordinator for cyber incident response activities among state entities. [cite: 1, 108]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mandate;