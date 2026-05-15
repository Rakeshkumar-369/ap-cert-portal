import React from 'react';
import { Activity, ShieldAlert, Globe, Radio } from 'lucide-react';
import Card from '../ui/Card';

const stats = [
  { label: "Threats Mitigated", value: "1,284", icon: ShieldAlert, color: "text-ap-gold" },
  { label: "Data Analyzed", value: "14.2 TB", icon: Activity, color: "text-ap-lavender" },
  { label: "State Entities Protected", value: "100+", icon: Globe, color: "text-ap-gold" },
];

const headlines = [
  { id: 1, tag: "CERT-In", title: "New Ransomware variant targeting healthcare sector", date: "Today" },
  { id: 2, tag: "ADVISORY", title: "Critical vulnerability in popular web servers", date: "2h ago" },
  { id: 3, tag: "AP-CERT", title: "Cyber awareness workshop for state officials scheduled", date: "Yesterday" },
];

const StatsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Key Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="flex flex-col items-center text-center justify-center border-ap-purple/10 bg-ap-purple/5">
              <stat.icon className={`${stat.color} mb-3`} size={32} />
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
            </Card>
          ))}
          
          {/* Machine Learning Insight - Ref source 107 */}
          <div className="md:col-span-3 mt-4 p-6 rounded-xl bg-gradient-to-r from-ap-purple/20 to-transparent border border-ap-purple/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-ap-purple flex items-center justify-center animate-pulse">
                <Radio className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-ap-gold uppercase text-xs tracking-tighter">Live SOC Analytics</h4>
                <p className="text-sm text-gray-300 italic">"Blended security analytics platform ingesting massive amounts of data using machine learning." [cite: 107]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Headlines Feed */}
        <div className="bg-[#162a54]/50 border border-ap-purple/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold uppercase tracking-widest text-sm text-ap-lavender">Global Headlines</h3>
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <div className="space-y-6">
            {headlines.map((news) => (
              <div key={news.id} className="group cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black bg-ap-navy border border-ap-purple/50 px-2 py-0.5 rounded text-ap-gold group-hover:bg-ap-gold group-hover:text-ap-navy transition-colors">
                    {news.tag}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">{news.date}</span>
                </div>
                <p className="text-sm font-medium leading-snug group-hover:text-ap-lavender transition-colors">
                  {news.title}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 border border-ap-purple/30 rounded text-xs font-bold uppercase hover:bg-ap-purple/10 transition-all">
            View All Updates
          </button>
        </div>

      </div>
    </section>
  );
};

export default StatsSection;