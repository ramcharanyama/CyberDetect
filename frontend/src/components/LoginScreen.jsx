import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginScreen({ onLoginSuccess }) {
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
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-[#E63946] text-white font-black tracking-tighter text-2xl mb-3">
            CD
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            CYBER<span className="text-[#E63946]">DETECT</span>
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Email Phishing & BEC Forensic Analyzer</p>
        </div>

        {/* Login Panel */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-8">
          <h2 className="text-lg font-bold text-white mb-6">Sign In to SOC Portal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 font-medium mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E63946] rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 font-medium mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E63946] rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded text-xs text-neutral-400">
              Demo credentials pre-filled:<br />
              <span className="text-neutral-200 font-mono">admin</span> / <span className="text-neutral-200 font-mono">cyberdetect2026</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E63946] hover:bg-[#D62839] text-white font-bold py-3 px-4 rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
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
