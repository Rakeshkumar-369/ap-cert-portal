import React from 'react';
import Card from '../components/ui/Card';
import { Key, MousePointer2, Smartphone, ShieldCheck, AlertCircle } from 'lucide-react';

const SecurityTips = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section: Professional Navy Text with Blue Glow Accent */}
        <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
          <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight mb-4">
            Security Tips for Citizens
          </h1>
          <p className="text-gray-500 max-w-2xl font-medium leading-relaxed">
            Official guidelines provided by AP-CERT to help you protect your digital assets and personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Password Policy Section */}
          <Card className="bg-white border-none shadow-lg border-t-4 border-t-[#00D4FF] hover:shadow-xl transition-all p-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#F1F5F9] p-4 rounded-2xl text-[#002B5B] shadow-sm">
                <Key size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#002B5B] uppercase tracking-tight mb-4">Stronger & Secure Passwords</h2>
                <ul className="space-y-4 text-sm text-gray-600 font-medium">
                  <li className="flex gap-3">
                    <span className="text-[#00D4FF] font-black">•</span> 
                    <span>Minimum length of 16 characters.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00D4FF] font-black">•</span> 
                    <span>Combine numbers, symbols, uppercase, and lowercase letters.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00D4FF] font-black">•</span> 
                    <span>Avoid personal info like names, DOB, or pet names.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 2FA Section */}
          <Card className="bg-white border-none shadow-lg border-t-4 border-t-[#00D4FF] hover:shadow-xl transition-all p-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#F1F5F9] p-4 rounded-2xl text-[#002B5B] shadow-sm">
                <Smartphone size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#002B5B] uppercase tracking-tight mb-4">Two-Factor Authentication (2FA)</h2>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed font-medium">
                  2FA adds another layer of security to your password by requiring a second piece of information to be validated.
                </p>
                <div className="bg-[#002B5B] p-4 rounded-xl border border-blue-900 text-[11px] text-[#00D4FF] font-black uppercase tracking-widest flex items-center gap-3">
                  <ShieldCheck size={16} /> Recommendation: Use Authenticator Apps over SMS codes.
                </div>
              </div>
            </div>
          </Card>

          {/* Phishing Awareness */}
          <Card className="bg-white border-none shadow-lg border-t-4 border-t-[#00D4FF] hover:shadow-xl transition-all p-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#F1F5F9] p-4 rounded-2xl text-[#002B5B] shadow-sm">
                <MousePointer2 size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#002B5B] uppercase tracking-tight mb-4">Beware of Phishing</h2>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Be cautious of unsolicited emails or messages asking for sensitive information. 
                  Hackers often use social engineering to mimic legitimate entities.
                </p>
              </div>
            </div>
          </Card>

          {/* Incident Reporting CTA: High-Impact Navy Card with Glow Line */}
          <Card className="bg-[#002B5B] border-none shadow-2xl relative overflow-hidden flex flex-col justify-center p-10 group">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#00D4FF] shadow-[0_0_20px_#00D4FF] group-hover:w-3 transition-all" />
            
            <div className="flex items-center gap-3 mb-4 text-[#00D4FF]">
               <AlertCircle size={24} />
               <h2 className="text-xl font-black uppercase tracking-tight text-white">Notice anything suspicious?</h2>
            </div>
            
            <p className="text-sm text-slate-300 mb-8 font-medium leading-relaxed uppercase tracking-tighter">
              Any citizen or government official in Andhra Pradesh can report a cybersecurity incident via our official channels.
            </p>
            
            <button className="w-fit bg-[#00D4FF] text-[#002B5B] font-black px-8 py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-white hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
              Report Now
            </button>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default SecurityTips;