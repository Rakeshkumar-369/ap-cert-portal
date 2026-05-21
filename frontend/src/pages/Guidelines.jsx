import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Activity,
  ExternalLink,
  AlertTriangle,
  Loader2,
  ChevronRight,
  ArrowRight,
  FileWarning
} from 'lucide-react';

const Guidelines = () => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cisaData, setCisaData] = useState([]);
  const [cisaLoading, setCisaLoading] = useState(true);
  const [cisaError, setCisaError] = useState(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';

    const fetchVulnerabilities = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vulnerability/list?year=2026&limit=10`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setVulnerabilities(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCisaKev = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cisa/kev?limit=10`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setCisaData(json.data || []);
      } catch (err) {
        setCisaError(err.message);
      } finally {
        setCisaLoading(false);
      }
    };

    fetchVulnerabilities();
    fetchCisaKev();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      {/* Header */}
      <div className="border-l-4 border-[#00D4FF] pl-6">
        <h1 className="text-4xl font-black text-[#002B5B] uppercase tracking-tight flex items-center gap-4">
          <FileWarning size={36} className="text-[#00D4FF]" />
          Security Advisories & Guidelines
        </h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
          Latest security alerts from CERT-In and CISA Known Exploited Vulnerabilities
        </p>
      </div>

      {/* Dual Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* CISA KEV - Known Exploited Vulnerabilities */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
            <div className="p-3 bg-[#002B5B] rounded-2xl text-[#00D4FF] shadow-lg">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight">
              Known Exploited Vulnerabilities
            </h3>
          </div>

          {cisaLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-[#00D4FF] animate-spin" />
              <span className="ml-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Loading CISA KEV data...</span>
            </div>
          ) : cisaError ? (
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={18} className="text-red-500" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Unable to fetch CISA data</span>
              </div>
              <p className="text-xs text-red-500 font-medium">CISA KEV data temporarily unavailable. Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cisaData.map((act, idx) => (
                <div
                  key={act.cve_id}
                  className="relative pl-6 border-l-2 border-slate-200 hover:border-l-[#00D4FF] transition-colors group bg-white rounded-xl p-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-sm font-black text-[#002B5B] uppercase leading-tight group-hover:text-[#00D4FF] transition-colors">
                      {act.title}
                    </h4>
                    {idx < 3 && (
                      <span className="bg-[#00D4FF] text-[#002B5B] text-[8px] font-black px-2 py-0.5 rounded">ACTIVE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wider">
                      {act.cve_id}
                    </span>
                    {act.date && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Added: {act.date}</span>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{act.vendor} / {act.product}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-3">{act.description}</p>
                  <a
                    href={act.reference_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-black text-[#002B5B] uppercase tracking-widest hover:text-[#00D4FF] transition-colors"
                  >
                    View Advisory <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>
          )}

          {!cisaLoading && !cisaError && (
            <a
              href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#002B5B] transition-colors border-t border-slate-100 mt-4"
            >
              View Full Catalog on CISA <ArrowRight size={12} className="inline ml-1" />
            </a>
          )}
        </section>

        {/* CERT-In Vulnerabilities */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
            <div className="p-3 bg-[#002B5B] rounded-2xl text-[#00D4FF] shadow-lg">
              <Activity size={24} />
            </div>
            <h3 className="text-2xl font-black text-[#002B5B] uppercase tracking-tight">
              CERT-In Alerts
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-[#00D4FF] animate-spin" />
              <span className="ml-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Loading alerts...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={18} className="text-red-500" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Unable to fetch alerts</span>
              </div>
              <p className="text-xs text-red-500 font-medium">CERT-In data temporarily unavailable. Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vulnerabilities.map((alert, idx) => (
                <motion.a
                  key={alert.civn_id}
                  href={alert.reference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 p-4 bg-white hover:shadow-xl rounded-2xl transition-all group cursor-pointer border-l-2 border-transparent hover:border-l-[#00D4FF] block"
                >
                  <ChevronRight className="text-slate-300 group-hover:text-[#00D4FF] mt-1 shrink-0" size={18} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-[10px] font-black text-[#002B5B] uppercase tracking-widest">{alert.civn_id}</span>
                      {alert.date && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">({alert.date})</span>
                      )}
                      {idx < 3 && (
                        <span className="bg-[#00D4FF] text-[#002B5B] text-[8px] font-black px-2 py-0.5 rounded">NEW</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-[#002B5B] transition-colors">
                      {alert.title}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold text-[#00D4FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      View on CERT-In <ExternalLink size={10} />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          {!loading && !error && (
            <a
              href="https://www.cert-in.org.in/s2cMainServlet?pageid=VLNLIST"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#002B5B] transition-colors border-t border-slate-100 mt-4"
            >
              View All on CERT-In <ArrowRight size={12} className="inline ml-1" />
            </a>
          )}
        </section>

      </div>
    </div>
  );
};

export default Guidelines;
