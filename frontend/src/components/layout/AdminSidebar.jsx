import React from 'react';
import { Home, FolderOpen, AlertOctagon, LogOut, ShieldCheck, User, ChevronRight, Loader2 } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, loggingOut }) => {

  const menu = [
    { id: 'home', label: 'Home Page CMS', icon: Home, desc: 'Manage home assets & carousel' },
    { id: 'resources', label: 'Resources Management', icon: FolderOpen, desc: 'Downloads & publications' },
    { id: 'incidents', label: 'Reported Incidents', icon: AlertOctagon, desc: 'View & manage reports' },
  ];

  const userStr = localStorage.getItem('user');
  let userInfo = null;
  try {
    userInfo = userStr ? JSON.parse(userStr) : null;
  } catch (e) {}

  const lastLoginDisplay = userInfo?.last_login || null;

  return (
    <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm shrink-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ap-navy rounded-xl flex items-center justify-center shadow-md shadow-ap-navy/20">
            <ShieldCheck className="text-white" size={22} />
          </div>
          <div>
            <span className="font-black text-ap-navy uppercase tracking-tighter text-lg leading-none block">AP-CERT</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Management</p>
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
                isActive
                  ? 'bg-ap-navy text-white shadow-md shadow-ap-navy/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} />
              <div className="text-left flex-1">
                <span className="text-xs font-bold block">{item.label}</span>
                {!isActive && (
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{item.desc}</span>
                )}
              </div>
              {isActive && <ChevronRight size={14} className="text-white/60" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-5 border-t border-slate-100 space-y-3">
        {userInfo?.last_login && (
          <div className="px-4 py-3 bg-gradient-to-r from-ap-navy/5 to-ap-glow/5 rounded-xl border border-slate-100">
            <p className="text-[8px] font-black uppercase text-ap-navy tracking-widest flex items-center gap-1.5">
              <User size={10} /> Last Login
            </p>
            <p className="text-[11px] font-semibold text-slate-700 mt-1 leading-tight">{lastLoginDisplay}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 border border-transparent hover:border-red-100"
        >
          {loggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;