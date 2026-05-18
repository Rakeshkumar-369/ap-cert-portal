import React from 'react';
import { FileText, Download, ShieldCheck } from 'lucide-react';
import Card from '../components/ui/Card';

const Downloads = () => {
  const docs = [
    { name: "Security Monitoring Guidelines", size: "1.2 MB", date: "May 2026" },
    { name: "Incident Response SOP", size: "850 KB", date: "April 2026" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">Resource Repository</h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Official SOPs, Guidelines, and Annual Reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map((doc, idx) => (
          <Card key={idx} className="bg-white border-none shadow-md hover:shadow-xl transition-all group border-t-4 border-t-[#00D4FF]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#002B5B] rounded-lg text-white group-hover:bg-[#00D4FF] transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#002B5B] text-sm uppercase tracking-tight">{doc.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{doc.size} • {doc.date}</p>
                </div>
              </div>
              <button className="text-[#002B5B] hover:text-[#00D4FF] transition-colors">
                <Download size={20} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-[#002B5B] rounded-2xl flex items-center justify-between text-white shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 w-2 h-full bg-[#00D4FF] shadow-[0_0_20px_#00D4FF]" />
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-[#00D4FF]" />
          <span className="text-xs font-bold uppercase tracking-widest">All documents are verified by the State CISO</span>
        </div>
      </div>
    </div>
  );
};

export default Downloads;