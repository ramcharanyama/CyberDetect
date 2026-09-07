import React, { useState } from 'react';
import { ArrowRight, AlertCircle, Sun, Moon } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess, darkMode, onToggleDarkMode }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('cyberdetect2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.user);
      } else {
        setError(data.detail || 'Authentication failed');
      }
    } catch (err) {
      setError('Unable to connect to CyberDetect backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] dark:bg-[#0B0B0C] flex items-center justify-center p-4 transition-colors relative">
      
      {/* Theme Toggle Top Right */}
      <button
        onClick={onToggleDarkMode}
        className="absolute top-6 right-6 p-2 text-[#666666] dark:text-[#A0A0A0] hover:text-[#191919] dark:hover:text-white bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-full transition flex items-center justify-center cursor-pointer"
        title="Toggle Light/Dark Theme"
      >
        {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
      </button>

      <div className="max-w-md w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#191919] dark:text-white">
            Cyber<span className="text-[#0A66C2] dark:text-[#3B82F6]">Detect</span>
          </h1>
          <p className="text-[#666666] dark:text-[#A0A0A0] text-sm mt-1">Email Phishing & BEC Forensic Analyzer</p>
        </div>

        {/* Login Box */}
        <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#191919] dark:text-white mb-1">Sign in</h2>
          <p className="text-xs text-[#666666] dark:text-[#A0A0A0] mb-6">Stay updated on cybersecurity forensics & threat signals</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#666666] dark:text-[#A0A0A0] mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] focus:border-[#0A66C2] dark:focus:border-[#3B82F6] rounded-md px-3.5 py-2.5 text-sm text-[#191919] dark:text-white placeholder-[#999999] focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#666666] dark:text-[#A0A0A0] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] focus:border-[#0A66C2] dark:focus:border-[#3B82F6] rounded-md px-3.5 py-2.5 text-sm text-[#191919] dark:text-white placeholder-[#999999] focus:outline-none transition"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[#B91C1C] dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3 bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-md text-xs text-[#666666] dark:text-[#A0A0A0]">
              Demo credentials pre-filled:<br />
              <span className="text-[#191919] dark:text-white font-mono font-semibold">admin</span> / <span className="text-[#191919] dark:text-white font-mono font-semibold">cyberdetect2026</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A66C2] hover:bg-[#004182] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold py-3 px-4 rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
