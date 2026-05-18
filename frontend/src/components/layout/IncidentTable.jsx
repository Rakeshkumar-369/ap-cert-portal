import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ShieldAlert, 
  ChevronRight, 
  Clock, 
  Globe, 
  Server, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Card from '../ui/Card';

const IncidentTable = () => {
  // Maintaining the full data structure with specific metadata
  const [incidents, setIncidents] = useState([
    { 
      id: "INC-2026-9902", 
      type: "Phishing Attempt", 
      target: "Dept. of Revenue", 
      status: "Mitigated", 
      severity: "High", 
      timestamp: "14:20 IST",
      icon: <Globe size={16} />
    },
    { 
      id: "INC-2026-9901", 
      type: "DDoS Mitigation", 
      target: "State Gateway", 
      status: "Active", 
      severity: "Critical", 
      timestamp: "13:45 IST",
      icon: <Server size={16} />
    },
    { 
      id: "INC-2026-9899", 
      type: "Malware Detection", 
      target: "Municipal Corp", 
      status: "Resolved", 
      severity: "Medium", 
      timestamp: "11:30 IST",
      icon: <ShieldAlert size={16} />
    },
    { 
      id: "INC-2026-9895", 
      type: "Unauthorized Access", 
      target: "Secretariat IT", 
      status: "Investigating", 
      severity: "High", 
      timestamp: "09:15 IST",
      icon: <AlertCircle size={16} />
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Mitigated': return 'bg-green-100 text-green-700 border-green-200';
      case 'Active': return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
      case 'Resolved': return 'bg-blue-100 text-[#002B5B] border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getSeverityGlow = (severity) => {
    if (severity === 'Critical') return 'shadow-[0_0_10px_rgba(239,68,68,0.3)] border-l-red-500';
    if (severity === 'High') return 'border-l-amber-500';
    return 'border-l-blue-400';
  };

  return (
    <Card className="p-0 overflow-hidden bg-white border-none shadow-2xl relative">
      {/* Table Header with Gradient and Glow */}
      <div className="p-5 bg-[#002B5B] flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#00D4FF]/20 to-transparent" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-[#00D4FF]/10 rounded-lg">
            <Activity size={20} className="text-[#00D4FF] animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Real-time Security Feeds
            </h3>
            <p className="text-[9px] text-[#00D4FF] font-bold uppercase tracking-tighter">
              APCSOC Live Telemetry Monitoring
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#00D4FF] animate-ping" />
          <span className="text-[10px] font-black uppercase text-white tracking-widest">
            Sync: 100%
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Incident Details</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Entity & Asset</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Log Timestamp</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence>
              {incidents.map((row, idx) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group hover:bg-slate-50/80 transition-all border-l-4 ${getSeverityGlow(row.severity)}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-300 group-hover:text-[#00D4FF] transition-colors">
                        {row.icon}
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#002B5B] uppercase tracking-tight">{row.id}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{row.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-700">{row.target}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-tighter">Internal Network</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <Clock size={12} className="text-slate-300" /> {row.timestamp}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                      <button className="text-slate-300 hover:text-[#00D4FF] transition-colors">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer / CTA */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
        <button className="text-[10px] font-black uppercase tracking-widest text-[#002B5B] hover:text-[#00D4FF] flex items-center gap-2 transition-all group">
          View Complete Incident Archives
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
};

export default IncidentTable;