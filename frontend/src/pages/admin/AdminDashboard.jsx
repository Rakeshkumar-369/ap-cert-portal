import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { authAPI } from '../../services/api';
import HomeManagement from './HomeManagement';
import ResourcesManagement from './ResourcesManagement';
import IncidentViewer from './IncidentViewer';
import { Activity } from 'lucide-react';

const getToken = () => localStorage.getItem('token');

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const TABS = [
  { id: 'home', label: 'Home Page CMS' },
  { id: 'resources', label: 'Resources Management' },
  { id: 'incidents', label: 'Reported Incidents' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    const token = getToken();
    setLoggingOut(true);
    try {
      await authAPI.logout(token);
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
      window.location.reload();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeManagement />;
      case 'resources': return <ResourcesManagement />;
      case 'incidents': return <IncidentViewer />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} loggingOut={loggingOut} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-10 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-ap-navy flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-ap-glow rounded-full inline-block" />
                  {activeTab === 'home' && 'Home Page Assets'}
                  {activeTab === 'resources' && 'Resource Repository'}
                  {activeTab === 'incidents' && 'Incident Command'}
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 ml-[15px]">
                  AP-CERT Administrative Control
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Live Session</span>
              <Activity size={14} className="text-slate-300" />
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-1 mt-5 bg-slate-100 rounded-xl p-1 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-ap-navy shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
