import React from 'react';
import Card from '../components/ui/Card';
import { FileBarChart, Download, PieChart } from 'lucide-react';

const Reports = () => {
  const publicationData = [
    {
      title: "Annual Report 2025",
      desc: "Full overview of cybersecurity initiatives, incident response metrics, and policy impact.",
      size: "4.2 MB",
      icon: <FileBarChart size={32} />
    },
    {
      title: "Cyber Threat Landscape",
      desc: "Bi-annual study on evolving threat vectors and state-wide vulnerability trends.",
      size: "2.8 MB",
      icon: <PieChart size={32} />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">Publications</h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Activity Reports & Strategic Threat Intelligence</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {publicationData.map((pub, idx) => (
          <Card key={idx} className="bg-white border-none shadow-lg flex gap-6 p-8 border-t-4 border-[#00D4FF] hover:shadow-2xl transition-all">
            <div className="bg-slate-100 p-4 rounded-xl text-[#002B5B] h-fit group-hover:bg-[#00D4FF] group-hover:text-white transition-colors">
              {pub.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#002B5B] mb-2 uppercase tracking-tight">{pub.title}</h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{pub.desc}</p>
              <button className="flex items-center gap-2 text-[#00D4FF] font-black uppercase text-xs tracking-widest hover:text-[#002B5B] transition-colors">
                <Download size={14} /> Download PDF ({pub.size})
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;