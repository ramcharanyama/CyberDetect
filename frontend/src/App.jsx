import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import HeaderNav from './components/HeaderNav';
import FileUploader from './components/FileUploader';
import RelatedInfraBanner from './components/RelatedInfraBanner';
import RiskOverviewCard from './components/RiskOverviewCard';
import OverviewTab from './components/Tabs/OverviewTab';
import HeadersTab from './components/Tabs/HeadersTab';
import AuthTab from './components/Tabs/AuthTab';
import UrlsTab from './components/Tabs/UrlsTab';
import IpIntelTab from './components/Tabs/IpIntelTab';

import { Shield, LayoutDashboard, FileText, Key, Link2, Database, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if session token exists in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('cyberdetect_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cyberdetect_user', JSON.stringify(userData));
    // Automatically load default sample analysis on login
    handleSelectSample('paypal_phishing');
  };

  const handleLogout = () => {
    setUser(null);
    setAnalysis(null);
    localStorage.removeItem('cyberdetect_user');
  };

  const handleAnalyzeFile = async (file) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to analyze uploaded EML file');
      }

      const data = await res.json();
      setAnalysis(data);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message || 'Error communicating with forensic backend');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = async (sampleId) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/analyze/sample/${sampleId}`, {
        method: 'POST'
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to run sample analysis');
      }

      const data = await res.json();
      setAnalysis(data);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message || 'Error running sample analysis');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'headers', label: 'Headers & Hops', icon: FileText },
    { id: 'auth', label: 'Authentication', icon: Key },
    { id: 'urls', label: 'URLs & Domains', icon: Link2 },
    { id: 'ip', label: 'IP Intelligence', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HeaderNav user={user} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Upload & Sample Selection Section */}
        <FileUploader
          onAnalyzeFile={handleAnalyzeFile}
          onSelectSample={handleSelectSample}
          loading={loading}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Overlay Spinner */}
        {loading && (
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-12 text-center space-y-4 glow-card">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">Running CyberDetect Forensics Engine...</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Parsing Headers • Verifying SPF/DKIM/DMARC • Calculating Levenshtein Metrics • Querying AbuseIPDB
              </p>
            </div>
          </div>
        )}

        {/* Analysis Dashboard Output */}
        {!loading && analysis && (
          <div className="space-y-8">
            
            {/* Optional Step 9: Related Infrastructure IP Correlation Alert Banner */}
            <RelatedInfraBanner
              relatedEmails={analysis.related_emails}
              senderIp={analysis.sender_ip}
            />

            {/* Risk Overview Card with Big Score Badge & Reasons List */}
            <RiskOverviewCard risk={analysis.risk} />

            {/* Forensic Inspection Tab Navigation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden glow-card">
              
              {/* Tab Header Bar */}
              <div className="border-b border-slate-800 bg-slate-950/60 p-2 flex flex-wrap gap-2">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Panel */}
              <div className="p-6">
                {activeTab === 'overview' && <OverviewTab data={analysis} />}
                {activeTab === 'headers' && <HeadersTab data={analysis} />}
                {activeTab === 'auth' && <AuthTab data={analysis} />}
                {activeTab === 'urls' && <UrlsTab data={analysis} />}
                {activeTab === 'ip' && <IpIntelTab data={analysis} />}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        CyberDetect Forensic Engine • Built for Cybersecurity Hackathon Demo • FastAPI & React
      </footer>
    </div>
  );
}
