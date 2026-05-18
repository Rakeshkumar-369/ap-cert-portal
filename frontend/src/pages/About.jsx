import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black uppercase mb-8 border-b-2 border-ap-purple pb-4">About AP-CERT</h1>
      
      <section className="space-y-8 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-bold text-ap-gold mb-3 uppercase tracking-wider">Mandate & Role</h2>
          <p>
            The Andhra Pradesh Cyber Security Response Team (AP-CERT) manages the Andhra Pradesh Cyber Security Operations Centre (APCSOC) 
            and provides cybersecurity coverage to all state departments and government-owned entities[cite: 104, 126]. 
            Our primary objective is to reduce the time from first awareness of a threat to its mitigation[cite: 105].
          </p>
        </div>

        <div className="bg-ap-purple/10 p-8 rounded-2xl border border-ap-purple/20">
          <h2 className="text-xl font-bold text-white mb-4">Core Services</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <li className="flex items-center gap-2"><span className="text-ap-gold">✔</span> Threat Monitoring</li>
            <li className="flex items-center gap-2"><span className="text-ap-gold">✔</span> Vulnerability Identification</li>
            <li className="flex items-center gap-2"><span className="text-ap-gold">✔</span> Threat Hunting</li>
            <li className="flex items-center gap-2"><span className="text-ap-gold">✔</span> Brand Monitoring & Protection</li>
          </ul>
        </div>

        <p>
          Operated by Andhra Pradesh Technology Services (APTS), we serve as the nodal agency for implementing the 
          state's Cyber Security Policy, ensuring the security of government infrastructure and assets[cite: 94, 95, 97].
        </p>
      </section>
    </div>
  );
};

export default About;