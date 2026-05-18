import React from 'react';
import Card from '../components/ui/Card';
import { FileBarChart, Download, PieChart } from 'lucide-react';

const Reports = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black uppercase mb-4">Publications</h1>
    <p className="text-gray-400 mb-12">Detailed activity reports, incident statistics, and training coverage overviews. </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-ap-gold/20 flex gap-6 p-8">
        <div className="bg-ap-gold/10 p-4 rounded-xl text-ap-gold h-fit"><FileBarChart size={32} /></div>
        <div>
          <h2 className="text-xl font-bold mb-2">Annual Report 2025</h2>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">Full overview of cybersecurity initiatives, incident response metrics, and policy impact. </p>
          <button className="flex items-center gap-2 text-ap-gold font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
            <Download size={14} /> Download PDF (4.2 MB)
          </button>
        </div>
      </Card>

      <Card className="border-ap-lavender/20 flex gap-6 p-8">
        <div className="bg-ap-lavender/10 p-4 rounded-xl text-ap-lavender h-fit"><PieChart size={32} /></div>
        <div>
          <h2 className="text-xl font-bold mb-2">Cyber Threat Landscape</h2>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">Bi-annual study on evolving threat vectors and state-wide vulnerability trends. </p>
          <button className="flex items-center gap-2 text-ap-lavender font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
            <Download size={14} /> Download PDF (2.8 MB)
          </button>
        </div>
      </Card>
    </div>
  </div>
);

export default Reports;