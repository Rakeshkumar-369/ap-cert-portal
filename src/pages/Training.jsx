import React from 'react';
import Card from '../components/ui/Card';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const events = [
  { title: "Advanced Incident Handling Workshop", date: "June 15-17, 2026", type: "Govt Officials", location: "Vijayawada" },
  { title: "Webinar: Zero Trust Implementation", date: "July 05, 2026", type: "Public / CISOs", location: "Online" }
];

const Training = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black uppercase mb-12">Training & Capacity Building</h1>
    
    <div className="bg-ap-purple/10 border border-ap-purple/20 p-8 rounded-2xl mb-12">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-widest">
        <GraduationCap className="text-ap-gold" /> Nomination Process
      </h2>
      <p className="text-sm text-gray-300 leading-relaxed">
        Government departments can nominate their IT staff for specialized cybersecurity sessions. Creating the next-generation cyber force through real-world practice. 
      </p>
    </div>

    <div className="space-y-4">
      <h3 className="font-black uppercase tracking-widest text-xs text-ap-lavender mb-6">Upcoming Calendar</h3>
      {events.map((ev, idx) => (
        <Card key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-ap-purple">
          <div>
            <span className="text-[10px] font-bold bg-ap-lavender/20 text-ap-lavender px-2 py-0.5 rounded uppercase">{ev.type}</span>
            <h4 className="text-lg font-bold mt-2">{ev.title}</h4>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><Calendar size={16} /> {ev.date}</div>
            <div className="flex items-center gap-2"><MapPin size={16} /> {ev.location}</div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Training;