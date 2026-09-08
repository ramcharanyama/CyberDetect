import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import HeaderNav from './components/HeaderNav';
import FileUploader from './components/FileUploader';
import CaseFeed from './components/CaseFeed';
import RiskOverviewCard from './components/RiskOverviewCard';
import OverviewTab from './components/Tabs/OverviewTab';
import HeadersTab from './components/Tabs/HeadersTab';
import AuthTab from './components/Tabs/AuthTab';
import UrlsTab from './components/Tabs/UrlsTab';
import IpIntelTab from './components/Tabs/IpIntelTab';

import { AlertCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dark Mode state: Persisted in localStorage, default to OS preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('cyberdetect_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to documentElement AND body on state change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('cyberdetect_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('cyberdetect_theme', 'light');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('cyberdetect_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchHistory();
      handleSelectSample('paypal_phishing');
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (e) {}
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cyberdetect_user', JSON.stringify(userData));
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
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Error communicating with forensic backend');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePaste = async (content) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/analyze/paste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to analyze pasted email content');
      }

      const data = await res.json();
      setAnalysis(data);
      setActiveTab('overview');
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Error parsing pasted email content');
      throw err;
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
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Error running sample analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCaseFromFeed = (caseItem) => {
    if (caseItem.sample_key) {
      handleSelectSample(caseItem.sample_key);
    } else if (caseItem.id || caseItem.record_id) {
      if (caseItem.risk) {
        setAnalysis(caseItem);
      } else {
        if (caseItem.subject?.includes("PayPal")) {
          handleSelectSample("paypal_phishing");
        } else if (caseItem.subject?.includes("Wire")) {
          handleSelectSample("ceo_bec");
        } else {
          handleSelectSample("clean_newsletter");
        }
      }
    }
  };

  if (!user) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'headers', label: 'Headers & Hops' },
    { id: 'auth', label: 'Authentication' },
    { id: 'urls', label: 'URLs & Domains' },
    { id: 'ip', label: 'IP Intelligence' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EE] dark:bg-[#0B0B0C] text-[#191919] dark:text-[#EDEDED] flex flex-col font-sans selection:bg-[#0A66C2] selection:text-white transition-colors">
      <HeaderNav
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Upload / Paste & Sample Selector Panel */}
        <FileUploader
          onAnalyzeFile={handleAnalyzeFile}
          onAnalyzePaste={handleAnalyzePaste}
          onSelectSample={handleSelectSample}
          loading={loading}
        />

        {/* Global Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[#B91C1C] dark:text-rose-400 text-sm rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-12 text-center space-y-3 shadow-xs">
            <div className="w-8 h-8 border-2 border-[#0A66C2] dark:border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-[#191919] dark:text-white">Running CyberDetect Forensics Engine...</h3>
              <p className="text-xs text-[#666666] dark:text-[#A0A0A0] font-mono mt-0.5">
                Parsing Headers • Verifying SPF/DKIM/DMARC • Calculating Levenshtein Metrics • Querying Threat Intel
              </p>
            </div>
          </div>
        )}

        {/* Full Single-Email Forensic Detail View */}
        {!loading && analysis && (
          <div className="space-y-6">
            
            {/* Hero Score Section */}
            <RiskOverviewCard risk={analysis.risk} />

            {/* Underlined Tabs Detail Panel */}
            <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl overflow-hidden shadow-xs">
              
              {/* Blue Underline Tab Bar with Left Padding Matching Panels Above */}
              <div className="border-b border-[#E0DFDC] dark:border-[#2A2B2E] bg-white dark:bg-[#17181A] px-6 flex items-center gap-6 overflow-x-auto">
                {tabs.map((t) => {
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`py-3.5 text-xs font-semibold tracking-wide uppercase border-b-2 transition cursor-pointer ${
                        isActive
                          ? 'border-[#0A66C2] dark:border-[#3B82F6] text-[#0A66C2] dark:text-[#3B82F6]'
                          : 'border-transparent text-[#666666] dark:text-[#A0A0A0] hover:text-[#191919] dark:hover:text-white'
                      }`}
                    >
                      {t.label}
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

        {/* Vertical Feed of 10 Most Recent Analyzed Cases */}
        {historyList.length > 0 && (
          <CaseFeed
            cases={historyList}
            activeAnalysisId={analysis?.record_id}
            onSelectCase={handleSelectCaseFromFeed}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E0DFDC] dark:border-[#2A2B2E] bg-white dark:bg-[#17181A] py-6 text-center text-xs text-[#666666] dark:text-[#A0A0A0] font-mono transition-colors">
        CyberDetect Forensic Engine • Professional SOC Investigation Feed
      </footer>
    </div>
  );
}
