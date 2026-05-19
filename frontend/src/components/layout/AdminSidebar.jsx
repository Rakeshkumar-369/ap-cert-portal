import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FolderOpen, AlertOctagon, LogOut, ShieldCheck } from 'lucide-react';
import { authAPI } from '../../services/api'; // adjust path as needed

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      navigate('/');
      window.location.reload();
    }
  };
// Change this reload - this is temporary fix. :)
  const menu = [
    { id: 'home', label: 'Home Page CMS', icon: Home },
    { id: 'resources', label: 'Resources Management', icon: FolderOpen },
    { id: 'incidents', label: 'Reported Incidents', icon: AlertOctagon },
  ];

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 p-6 flex flex-col shadow-gov">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="bg-ap-navy p-2 rounded-lg">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-ap-navy uppercase tracking-tighter text-lg leading-none">
            AP-CERT
          </span>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Admin Portal
          </span>
        </div>
      </div>

      <nav className="space-y-1">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === item.id
                ? 'bg-ap-navy text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;