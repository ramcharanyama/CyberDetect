import React from 'react';
import { Shield, User, LogOut, Activity, Database } from 'lucide-react';

export default function HeaderNav({ user, onLogout }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                Cyber<span className="text-cyan-400">Detect</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 border border-cyan-700/50 text-cyan-300 rounded-full font-bold uppercase">
                Hackathon Demo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Email Phishing & BEC Forensics Engine</p>
          </div>
        </div>

        {/* Right: User & Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SOC STATUS: READY</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
            <User className="w-4 h-4 text-cyan-400" />
            <div className="text-xs">
              <div className="text-white font-medium">{user?.name || 'SOC Analyst'}</div>
              <div className="text-[10px] text-slate-400 font-mono">{user?.role || 'Lead Investigator'}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-slate-700"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
