import React from 'react';
import { GraduationCap, Calendar, MapPin, Users, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';

const Training = () => {
  const programs = [
    {
      id: 1,
      title: "Advanced Incident Handling Workshop",
      date: "June 15-17, 2026",
      location: "Vijayawada (In-Person)",
      audience: "Govt IT Officials",
      description: "Hands-on simulation of major cyber attack vectors and containment strategies using APCSOC infrastructure.",
      status: "Open for Nomination"
    },
    {
      id: 2,
      title: "Webinar: Implementing Zero Trust Architecture",
      date: "July 05, 2026",
      location: "Online (Virtual)",
      audience: "CISOs & IT Managers",
      description: "Deep dive into the 8 pillars of Zero Trust and how to implement them within state-owned entities.",
      status: "Registration Opening Soon"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Page Heading */}
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">
          Training & <span className="text-[#00D4FF]">Capacity Building</span>
        </h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
          Empowering Andhra Pradesh's Workforce Against Cyber Threats
        </p>
      </div>

      {/* Main Feature / Process Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <Card className="bg-white border-none shadow-xl border-t-4 border-t-[#00D4FF] h-full p-10">
            <GraduationCap className="text-[#00D4FF] mb-6" size={48} />
            <h2 className="text-2xl font-black text-[#002B5B] uppercase mb-4 tracking-tight">The Nomination Process</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Government departments are invited to nominate their key IT personnel for specialized technical sessions. Our training is designed to build a resilient frontline defense against modern adversarial tactics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase">
                <CheckCircle size={16} className="text-green-500" /> Dept. Nomination
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase">
                <CheckCircle size={16} className="text-green-500" /> Skill Assessment
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase">
                <CheckCircle size={16} className="text-green-500" /> Hands-on Labs
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase">
                <CheckCircle size={16} className="text-green-500" /> Certification
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="bg-[#002B5B] text-white p-8 flex flex-col justify-center text-center border-none shadow-xl">
          <Users className="text-[#00D4FF] mx-auto mb-4" size={40} />
          <h3 className="text-3xl font-black mb-1">1,240+</h3>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Personnel Trained Since 2024</p>
          <div className="h-1 w-16 bg-[#00D4FF] mx-auto my-4" />
          <button className="text-xs font-black uppercase text-[#00D4FF] hover:text-white transition-colors">
            View Training Impact →
          </button>
        </Card>
      </div>

      {/* Program List with Original Full-length logic */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Upcoming Programs</h3>
        {programs.map((prog) => (
          <Card key={prog.id} className="bg-white border-none shadow-md hover:shadow-lg transition-all group p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black bg-slate-100 text-[#002B5B] px-3 py-1 rounded uppercase tracking-tighter">
                    {prog.audience}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${prog.status.includes('Open') ? 'text-green-600' : 'text-amber-600'}`}>
                    • {prog.status}
                  </span>
                </div>
                <h4 className="text-xl font-black text-[#002B5B] uppercase tracking-tight group-hover:text-[#00D4FF] transition-colors">
                  {prog.title}
                </h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-2xl">
                  {prog.description}
                </p>
              </div>
              
              <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 border-l border-slate-100 md:pl-10 min-w-[200px]">
                <div className="flex items-center gap-3"><Calendar size={16} className="text-[#00D4FF]" /> {prog.date}</div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-[#00D4FF]" /> {prog.location}</div>
                <button className="mt-2 w-full bg-[#002B5B] text-white py-3 rounded-lg font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#00D4FF] hover:text-[#002B5B] transition-all">
                  Apply Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Training;