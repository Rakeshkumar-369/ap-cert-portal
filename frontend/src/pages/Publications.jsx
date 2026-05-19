import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { FileBarChart, Download, PieChart, Loader2 } from 'lucide-react';
import { publicationsAPI, publicationDownloadUrl } from '../services/api';

const iconOptions = [<FileBarChart size={32} />, <PieChart size={32} />];

const Reports = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await publicationsAPI.list(50, 0);
        setPublications(res.data || []);
      } catch (err) {
        console.error('Failed to fetch publications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
        <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
          <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">Publications</h1>
          <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Activity Reports & Strategic Threat Intelligence</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#00D4FF]" />
          <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading publications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">Publications</h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Activity Reports & Strategic Threat Intelligence</p>
      </div>

      {publications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">No publications available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publications.map((pub, idx) => (
            <Card key={pub.id || idx} className="bg-white border-none shadow-lg flex gap-6 p-8 border-t-4 border-[#00D4FF] hover:shadow-2xl transition-all">
              <div className="bg-slate-100 p-4 rounded-xl text-[#002B5B] h-fit group-hover:bg-[#00D4FF] group-hover:text-white transition-colors">
                {iconOptions[idx % iconOptions.length]}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#002B5B] mb-2 uppercase tracking-tight">{pub.title}</h2>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{pub.description || pub.desc}</p>
                <a 
                  href={publicationDownloadUrl(pub) || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#00D4FF] font-black uppercase text-xs tracking-widest hover:text-[#002B5B] transition-colors"
                >
                  <Download size={14} /> Download PDF ({pub.size || formatFileSize(pub.file_size)})
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;