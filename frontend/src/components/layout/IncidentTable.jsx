import React from 'react';
import { mockIncidents } from '../../data/mockIncidents';

const IncidentTable = () => {
  // Helper for severity colors
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-ap-gold bg-ap-gold/10 border-ap-gold/20';
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-ap-purple/20 bg-ap-navy/40 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-ap-purple/20 bg-ap-purple/10">
            <th className="p-4 text-xs font-bold uppercase tracking-widest text-ap-lavender">Incident ID</th>
            <th className="p-4 text-xs font-bold uppercase tracking-widest text-ap-lavender">Type</th>
            <th className="p-4 text-xs font-bold uppercase tracking-widest text-ap-lavender">Severity</th>
            <th className="p-4 text-xs font-bold uppercase tracking-widest text-ap-lavender">Target</th>
            <th className="p-4 text-xs font-bold uppercase tracking-widest text-ap-lavender">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ap-purple/10">
          {mockIncidents.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
              <td className="p-4 font-mono text-sm text-ap-gold">{item.id}</td>
              <td className="p-4 font-semibold">{item.type}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getSeverityStyle(item.severity)}`}>
                  {item.severity}
                </span>
              </td>
              <td className="p-4 text-gray-400 text-sm">{item.target}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${item.status === 'Active' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-sm">{item.status}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;