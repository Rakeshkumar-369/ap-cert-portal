import React from 'react';
import Card from '../components/ui/Card';
import { Shield, Target, Eye } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">About <span className="text-[#00D4FF]">AP-CERT</span></h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Nodal Agency for Cyber Security in Andhra Pradesh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg font-medium text-[#002B5B]">
            AP-CERT operates as the primary authority for cyber incident response, operating under the administrative control of APTS and the ITE&C Department.
          </p>
          <p>
            Our mandate is to secure the state's digital infrastructure through continuous monitoring, 
            vulnerability assessment, and rapid incident mitigation.
          </p>
        </div>
        <Card className="bg-white border-none shadow-xl border-r-4 border-r-[#00D4FF] p-10">
          <Shield size={48} className="text-[#00D4FF] mb-6" />
          <h3 className="text-xl font-bold text-[#002B5B] mb-2 uppercase">Statutory Nodal Agency</h3>
          <p className="text-sm text-gray-500">Designated under Section 70B of the IT Act, 2000 to handle cybersecurity incidents state-wide.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#002B5B] text-white p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#00D4FF] shadow-[0_0_15px_#00D4FF]" />
          <Target className="text-[#00D4FF] mb-4" />
          <h4 className="text-lg font-bold uppercase mb-2">Our Mission</h4>
          <p className="text-sm text-gray-300 leading-relaxed">To enhance the security of Andhra Pradesh's communications and information infrastructure through proactive collaboration.</p>
        </Card>

        <Card className="bg-white border-none shadow-lg p-8 border-b-4 border-b-[#00D4FF]">
          <Eye className="text-[#002B5B] mb-4" />
          <h4 className="text-lg font-bold text-[#002B5B] uppercase mb-2">Our Vision</h4>
          <p className="text-sm text-gray-600 leading-relaxed">Building a resilient cyber ecosystem for government departments, critical sectors, and the citizens of the state.</p>
        </Card>
      </div>
    </div>
  );
};

export default About;