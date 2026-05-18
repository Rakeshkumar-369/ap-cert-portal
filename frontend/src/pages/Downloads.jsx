import React from 'react';
import { FileText, Download, Shield, Layout, FileType } from 'lucide-react';
import Card from '../components/ui/Card';

const resources = [
  {
    category: "Guidelines & SOPs",
    items: [
      { name: "Security Monitoring Guidelines", type: "PDF", size: "1.2 MB", date: "May 2026" },
      { name: "Incident Response Plan Template", type: "DOCX", size: "850 KB", date: "April 2026" },
      { name: "Zero Trust Architecture Framework", type: "PDF", size: "2.4 MB", date: "March 2026" }
    ]
  },
  {
    category: "Awareness Posters",
    items: [
      { name: "16-Character Password Policy", type: "JPG", size: "3.5 MB", date: "May 2026" },
      { name: "Phishing Prevention Infographic", type: "PDF", size: "1.8 MB", date: "May 2026" }
    ]
  }
];

const Downloads = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-l-4 border-ap-lavender pl-6">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Resource Center</h1>
        <p className="text-gray-400 max-w-2xl">
          Access official AP-CERT documents, security templates, and awareness materials for your organization.
        </p>
      </div>

      <div className="space-y-12">
        {resources.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-bold text-ap-gold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layout size={20} /> {group.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((file, fIdx) => (
                <Card key={fIdx} className="group border-ap-purple/20 hover:bg-ap-purple/10 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="bg-ap-navy p-3 rounded-lg text-ap-lavender group-hover:text-ap-gold transition-colors">
                      <FileType size={24} />
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                  <h3 className="mt-4 font-bold text-sm leading-tight mb-2">{file.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{file.type} • {file.size}</span>
                    <span className="text-[10px] text-ap-lavender font-bold">{file.date}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Disclaimer as per Source 121 */}
      <div className="mt-16 p-6 rounded-xl bg-ap-navy/50 border border-ap-purple/20 text-center">
        <p className="text-xs text-gray-500 italic">
          Note: These documents are living resources and are updated as new security information becomes available.
        </p>
      </div>
    </div>
  );
};

export default Downloads;