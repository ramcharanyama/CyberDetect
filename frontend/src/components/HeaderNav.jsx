import React from 'react';
import { Shield, User, LogOut, Activity } from 'lucide-react';

export default function HeaderNav({ user, onLogout }) {
  return (
    <header className="border-b border-[#262626] bg-[#0A0A0A]/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#E63946] flex items-center justify-center text-white font-black tracking-tighter text-lg shadow-sm">
            CD
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">
              CYBER<span className="text-[#E63946]">DETECT</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-[#141414] border border-[#262626] text-neutral-400 rounded">
              SOC FORENSICS
            </span>
          </div>
        </div>

        {/* Right: User Status & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 bg-[#141414] border border-[#262626] text-neutral-400 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM ACTIVE</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#262626] rounded">
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-200">{user?.name || 'SOC Analyst'}</span>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-neutral-400 hover:text-white hover:bg-[#141414] rounded transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
