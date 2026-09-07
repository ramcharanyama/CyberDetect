import React from 'react';
import { User, LogOut, Sun, Moon } from 'lucide-react';

export default function HeaderNav({ user, onLogout, darkMode, onToggleDarkMode }) {
  return (
    <header className="border-b border-[#E0DFDC] dark:border-[#2A2B2E] bg-white dark:bg-[#17181A] sticky top-0 z-50 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* Left: CyberDetect Wordmark (LinkedIn icon removed) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#191919] dark:text-white">
              Cyber<span className="text-[#0A66C2] dark:text-[#3B82F6]">Detect</span>
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-mono bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] text-[#666666] dark:text-[#999999] rounded-full font-medium">
              SOC Forensics Feed
            </span>
          </div>
        </div>

        {/* Right: User Status, Theme Toggle & Logout */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 text-[#666666] dark:text-[#A0A0A0] hover:text-[#191919] dark:hover:text-white bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-full transition flex items-center justify-center cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1 bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] text-[#666666] dark:text-[#A0A0A0] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#0F7B3F] dark:bg-[#22C55E]"></span>
            <span>SYSTEM ACTIVE</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-full">
            <User className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#3B82F6]" />
            <span className="text-xs font-semibold text-[#191919] dark:text-[#EDEDED]">{user?.name || 'SOC Analyst'}</span>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 text-[#666666] dark:text-[#A0A0A0] hover:text-[#191919] dark:hover:text-white hover:bg-[#F4F2EE] dark:hover:bg-[#0B0B0C] rounded-full transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
