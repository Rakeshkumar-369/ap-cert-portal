import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldCheck, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import { downloadsAPI, downloadFileUrl } from '../services/api';

const Downloads = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await downloadsAPI.list(50, 0);
        setDocs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch downloads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight">Resource Repository</h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Official SOPs, Guidelines, and Annual Reports</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#00D4FF]" />
          <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading documents...</span>
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">No documents available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docs.map((doc, idx) => (
            <Card key={doc.id || idx} className="bg-white border-none shadow-md hover:shadow-xl transition-all group border-t-4 border-t-[#00D4FF]">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#002B5B] rounded-lg text-white group-hover:bg-[#00D4FF] transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002B5B] text-sm uppercase tracking-tight">{doc.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                      {doc.size ? doc.size : formatFileSize(doc.file_size)} • {doc.date ? doc.date : (doc.created_at ? formatDate(doc.created_at) : '')}
                    </p>
                  </div>
                </div>
                <a 
                  href={downloadFileUrl(doc) || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#002B5B] hover:text-[#00D4FF] transition-colors"
                  title="Download"
                >
                  <Download size={20} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

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