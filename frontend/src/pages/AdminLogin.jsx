import React from 'react';
import { Lock, User, ShieldCheck, Activity } from 'lucide-react';
import Card from '../components/ui/Card';

const AdminLogin = ({ onLogin }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-ap-navy">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Auth Metrics */}
        <div className="hidden md:block space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-ap-gold flex items-center gap-2">
            <Activity className="animate-pulse" /> Security Portal
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-ap-purple/10 border-ap-purple/20">
              <div className="text-[10px] uppercase font-bold text-ap-lavender mb-1">Last System Sync</div>
              <div className="text-sm font-mono text-white">2026-05-18 11:00 AM</div>
            </Card>
            <Card className="bg-ap-purple/10 border-ap-purple/20">
              <div className="text-[10px] uppercase font-bold text-ap-lavender mb-1">Active Admin Sessions</div>
              <div className="text-sm font-mono text-white">02 Authorized</div>
            </Card>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <Card className="border-ap-lavender/30 p-10 bg-[#112240]">
          <div className="text-center mb-8">
            <ShieldCheck className="mx-auto text-ap-gold mb-2" size={48} />
            <h1 className="text-xl font-bold uppercase tracking-widest">Admin Access</h1>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-ap-lavender tracking-widest flex items-center gap-2">
                <User size={14} /> Admin ID
              </label>
              <input type="text" className="w-full bg-ap-navy border border-ap-purple/30 rounded-xl p-3 focus:border-ap-gold outline-none transition-all" placeholder="Enter ID" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-ap-lavender tracking-widest flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <input type="password" className="w-full bg-ap-navy border border-ap-purple/30 rounded-xl p-3 focus:border-ap-gold outline-none transition-all" placeholder="••••••••" />
            </div>

            <div className="flex justify-between items-center">
              <button type="button" className="text-[10px] text-gray-500 hover:text-ap-gold uppercase font-bold transition-colors">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full bg-ap-gold text-ap-navy font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg shadow-ap-gold/10">
              Authenticate & Enter
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;