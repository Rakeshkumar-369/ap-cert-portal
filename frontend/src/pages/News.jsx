import React from 'react';
import Card from '../components/ui/Card';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';

const newsItems = [
  {
    title: "AP-CERT expands 24/7 Monitoring for State Infrastructure",
    date: "May 10, 2026",
    summary: "Expansion of the APCSOC to include additional government-owned entities for proactive defense[cite: 104, 111].",
    category: "Initiative"
  },
  {
    title: "New Cyber Awareness Campaign Launched for Citizens",
    date: "April 28, 2026",
    summary: "A state-wide program focused on phishing prevention and safe banking practices[cite: 102, 137].",
    category: "Public Outreach"
  }
];

const News = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black uppercase mb-12 border-b-2 border-ap-purple pb-4">News & Updates</h1>
    <div className="grid gap-6">
      {newsItems.map((item, idx) => (
        <Card key={idx} className="hover:border-ap-gold/50">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold bg-ap-purple/20 text-ap-lavender px-2 py-1 rounded uppercase tracking-widest">
              {item.category}
            </span>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Calendar size={14} /> {item.date}
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2 group-hover:text-ap-gold transition-colors">{item.title}</h2>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.summary}</p>
          <button className="flex items-center gap-2 text-ap-gold text-xs font-bold uppercase tracking-widest hover:underline">
            Read Full Article <ExternalLink size={12} />
          </button>
        </Card>
      ))}
    </div>
  </div>
);

export default News;