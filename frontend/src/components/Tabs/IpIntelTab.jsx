import React from 'react';
import { Database, ShieldAlert, Globe, Server, CheckCircle2, FileJson } from 'lucide-react';

export default function IpIntelTab({ data }) {
  const intel = data?.intel || {};
  const {
    ip_address,
    is_malicious,
    abuse_confidence_score,
    total_reports,
    country_name,
    country_code,
    isp,
    domain,
    usage_type,
    categories,
    source,
    is_cached
  } = intel;

  return (
    <div className="space-y-6">
      
      {/* Local JSON Caching Status Pill */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Threat Intelligence Engine</h4>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono rounded">
                {source || 'AbuseIPDB Client'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              API lookup results are stored locally per IP to prevent rate limit failures during live hackathon demos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-lg flex items-center gap-1.5 font-semibold">
            <FileJson className="w-4 h-4 text-cyan-400" />
            Cache File: <span className="text-white">/backend/cache/{ip_address || 'ip'}.json</span>
          </span>
        </div>
      </div>

      {/* Main Reputation Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Abuse Confidence Score Gauge */}
        <div className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center ${
          is_malicious ? 'bg-rose-950/20 border-rose-500/50 text-rose-300' : 'bg-slate-900/80 border-slate-800 text-slate-200'
        }`}>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Abuse Confidence Score</div>
          <div className={`text-5xl font-black font-mono my-1 ${is_malicious ? 'text-rose-500' : 'text-emerald-400'}`}>
            {abuse_confidence_score ?? 0}%
          </div>
          <div className="mt-2">
            {is_malicious ? (
              <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold rounded-full uppercase">
                🚨 High Abuse Threat IP
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold rounded-full uppercase">
                ✓ Low Risk IP Reputation
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            {total_reports || 0} Abuse Reports logged across global security sensors.
          </p>
        </div>

        {/* IP Infrastructure Details */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Sender Host Network Profile</span>
            <span className="text-cyan-400 font-bold">{ip_address}</span>
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Country Location</span>
              <span className="text-white font-bold text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                {country_name} ({country_code})
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase">ISP Provider</span>
              <span className="text-white font-bold text-sm flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                {isp}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Host Usage Type</span>
              <span className="text-slate-300">{usage_type || 'Data Center / Web Hosting'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Associated Host Domain</span>
              <span className="text-slate-300">{domain || 'N/A'}</span>
            </div>
          </div>

          {categories && categories.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono mb-2">Reported Threat Categories</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono rounded-lg">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
