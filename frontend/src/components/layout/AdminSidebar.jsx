import React from 'react';
import { Home, FolderOpen, AlertOctagon, LogOut, ShieldCheck } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menu = [
    { id: 'home', label: 'Home Page CMS', icon: Home },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
    { id: 'incidents', label: 'Reported Incidents', icon: AlertOctagon },
  ];

  return (
    <div className="w-80 h-full bg-[#112240] border-r border-ap-purple/20 p-6 flex flex-col shadow-2xl">
      <div className="mb-10 flex items-center gap-3 px-2">
        <ShieldCheck className="text-ap-gold" size={28} />
        <span className="font-black text-white uppercase tracking-tighter text-lg">Admin <span className="text-ap-gold">Panel</span></span>
      </div>

      <div className="mb-10">
        <h3 className="text-[10px] font-black text-ap-lavender uppercase tracking-[0.2em] mb-6 px-2">Navigation</h3>
        <nav className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-ap-gold text-ap-navy shadow-lg scale-[1.02]' 
                : 'text-gray-400 hover:bg-ap-purple/20 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-6 border-t border-ap-purple/10">
        <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={20} /> Terminate Session
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;