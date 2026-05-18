import React from 'react';
import AdScroller from '../components/layout/AdScroller';
import StatsSection from '../components/layout/StatsSection';
import IncidentTable from '../components/layout/IncidentTable';
import { Shield, Zap, Bell } from 'lucide-react';

const Home = () => {
  return (
    <>
      {/* Information Carousel - High priority as per mandate [cite: 1] */}
      <AdScroller />

      {/* Quick Action & Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-ap-purple/10 border border-ap-purple/20 p-6 rounded-xl flex items-center gap-4">
            <Bell className="text-ap-gold animate-bounce" />
            <span className="text-sm font-bold uppercase">System Status: Operational</span>
          </div>
        </div>
        
        {/* Real-time Metrics [cite: 1, 107] */}
        <StatsSection />
      </section>

      {/* Incident Headlines/Table Section [cite: 1] */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest">Active Incident Logs</h2>
        <IncidentTable />
      </section>
    </>
  );
};

export default Home;