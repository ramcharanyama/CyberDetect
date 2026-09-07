import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import HeaderNav from './components/HeaderNav';
import FileUploader from './components/FileUploader';
import CaseRows from './components/CaseRows';
import RelatedInfraBanner from './components/RelatedInfraBanner';
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

  // Restore session token & load history on start
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
      // Auto-load default sample analysis on start
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

  const handleSelectCaseFromRow = (caseItem) => {
    if (caseItem.sample_key) {
      handleSelectSample(caseItem.sample_key);
    } else if (caseItem.id || caseItem.record_id) {
      // If we clicked a row card, load its data directly or re-run
      if (caseItem.risk) {
        setAnalysis(caseItem);
      } else {
        // Find in history or re-trigger sample if mapped
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
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'headers', label: 'Headers & Hops' },
    { id: 'auth', label: 'Authentication' },
    { id: 'urls', label: 'URLs & Domains' },
    { id: 'ip', label: 'IP Intelligence' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col font-sans selection:bg-[#E63946] selection:text-white">
      <HeaderNav user={user} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Upload & Sample Selector */}
        <FileUploader
          onAnalyzeFile={handleAnalyzeFile}
          onSelectSample={handleSelectSample}
          loading={loading}
        />

        {/* Netflix-Style Horizontal Browse Rows (Cases / Uploads / High Risk) */}
        {historyList.length > 0 && (
          <CaseRows
            cases={historyList}
            activeAnalysisId={analysis?.record_id}
            onSelectCase={handleSelectCaseFromRow}
          />
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-sm rounded flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-[#141414] border border-[#262626] rounded-lg p-12 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white">Running CyberDetect Forensics Engine...</h3>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Parsing Headers • Verifying SPF/DKIM/DMARC • Calculating Levenshtein Metrics • Querying Threat Intel
              </p>
            </div>
          </div>
        )}

        {/* Full Analysis View */}
        {!loading && analysis && (
          <div className="space-y-8">
            
            {/* Related Infrastructure Banner */}
            <RelatedInfraBanner
              relatedEmails={analysis.related_emails}
              senderIp={analysis.sender_ip}
            />

            {/* Hero Risk Section */}
            <RiskOverviewCard risk={analysis.risk} />

            {/* Horizontal Underline Tabs */}
            <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
              
              {/* Horizontal Underline Tab Bar */}
              <div className="border-b border-[#262626] bg-[#0A0A0A] px-6 flex items-center gap-8 overflow-x-auto no-scrollbar">
                {tabs.map((t) => {
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`py-4 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition ${
                        isActive
                          ? 'border-[#E63946] text-white'
                          : 'border-transparent text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Panel Content */}
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
      <footer className="border-t border-[#1C1C1C] bg-[#0A0A0A] py-6 text-center text-xs text-neutral-600 font-mono">
        CyberDetect Forensic Engine • Hackathon Demo Architecture
      </footer>
    </div>
  );
}
