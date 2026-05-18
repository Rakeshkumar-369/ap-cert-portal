import React from 'react';
import Card from '../components/ui/Card';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';

const News = () => {
  const newsItems = [
    {
      title: "AP-CERT expands 24/7 Monitoring for State Infrastructure",
      date: "May 10, 2026",
      summary: "Expansion of the APCSOC to include additional government-owned entities for proactive defense.",
      category: "Initiative"
    },
    {
      title: "New Cyber Awareness Campaign Launched for Citizens",
      date: "April 28, 2026",
      summary: "A state-wide program focused on phishing prevention and safe banking practices.",
      category: "Public Outreach"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">
          News & <span className="text-[#00D4FF]">Updates</span>
        </h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Official Announcements and Advisory Feeds</p>
      </div>

      <div className="grid gap-8">
        {newsItems.map((item, idx) => (
          <Card key={idx} className="bg-white border-none shadow-md hover:shadow-xl transition-all group border-l-4 border-l-[#002B5B]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <span className="text-[10px] font-black bg-slate-100 text-[#002B5B] px-3 py-1 rounded uppercase tracking-tighter">
                {item.category}
              </span>
              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase mt-2 md:mt-0">
                <Calendar size={14} className="text-[#00D4FF]" /> {item.date}
              </div>
            </div>
            <h2 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight group-hover:text-[#00D4FF] transition-colors mb-4">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed font-medium">
              {item.summary}
            </p>
            <button className="flex items-center gap-2 text-[#002B5B] text-[10px] font-black uppercase tracking-widest group-hover:text-[#00D4FF] transition-colors">
              Read Full Article <ExternalLink size={14} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default News;