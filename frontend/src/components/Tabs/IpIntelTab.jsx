import React from 'react';

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
      
      {/* Cache Status Banner */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">Threat Intelligence Engine</h4>
            <span className="px-2 py-0.5 bg-[#0A0A0A] text-neutral-400 border border-[#262626] text-[10px] font-mono rounded">
              {source || 'AbuseIPDB Client'}
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Threat intel responses cached locally to ensure high availability during live demos.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-[#0A0A0A] border border-[#262626] text-neutral-300 rounded font-semibold">
            JSON Cache: /backend/cache/{ip_address || 'ip'}.json
          </span>
        </div>
      </div>

      {/* Main Reputation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Abuse Confidence Score */}
        <div className={`p-6 rounded-lg border flex flex-col items-center justify-center text-center ${
          is_malicious ? 'bg-rose-950/20 border-[#E63946]' : 'bg-[#141414] border-[#262626]'
        }`}>
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">Abuse Confidence Score</div>
          <div className={`text-6xl font-black font-mono tracking-tighter my-1 ${is_malicious ? 'text-[#E63946]' : 'text-emerald-400'}`}>
            {abuse_confidence_score ?? 0}%
          </div>
          <div className="mt-2">
            {is_malicious ? (
              <span className="px-3 py-1 bg-[#E63946] text-white text-xs font-mono font-bold rounded uppercase">
                High Threat IP
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold rounded uppercase">
                Clean IP Reputation
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mt-3 font-mono">
            {total_reports || 0} Abuse Reports Logged
          </p>
        </div>

        {/* Host Network Profile */}
        <div className="md:col-span-2 bg-[#141414] border border-[#262626] rounded-lg p-5 space-y-4">
          <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider border-b border-[#262626] pb-2 flex items-center justify-between">
            <span>Sender Network Profile</span>
            <span className="text-white font-bold">{ip_address}</span>
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase">Country Location</span>
              <span className="text-white font-bold text-sm">
                {country_name} ({country_code})
              </span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[10px] uppercase">ISP Provider</span>
              <span className="text-white font-bold text-sm">
                {isp}
              </span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[10px] uppercase">Host Usage Type</span>
              <span className="text-neutral-300">{usage_type || 'Data Center / Web Hosting'}</span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[10px] uppercase">Host Domain</span>
              <span className="text-neutral-300">{domain || 'N/A'}</span>
            </div>
          </div>

          {categories && categories.length > 0 && (
            <div className="pt-3 border-t border-[#262626]">
              <span className="text-neutral-500 block text-[10px] uppercase font-mono mb-2">Reported Threat Categories</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono rounded">
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
