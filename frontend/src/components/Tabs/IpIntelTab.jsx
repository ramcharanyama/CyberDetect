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
      <div className="bg-white border border-[#E0DFDC] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#191919]">Threat Intelligence Engine</h4>
            <span className="px-2 py-0.5 bg-[#F4F2EE] text-[#666666] border border-[#E0DFDC] text-[10px] font-mono rounded-full">
              {source || 'AbuseIPDB Client'}
            </span>
          </div>
          <p className="text-xs text-[#666666]">
            Threat intel responses cached locally to ensure high availability during live demos.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-[#F4F2EE] border border-[#E0DFDC] text-[#191919] rounded-full font-semibold">
            JSON Cache: /backend/cache/{ip_address || 'ip'}.json
          </span>
        </div>
      </div>

      {/* Main Reputation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Abuse Confidence Score */}
        <div className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center shadow-xs ${
          is_malicious ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-[#E0DFDC]'
        }`}>
          <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-2">Abuse Confidence Score</div>
          <div className={`text-6xl font-bold font-mono tracking-tight my-1 ${is_malicious ? 'text-[#B91C1C]' : 'text-[#0F7B3F]'}`}>
            {abuse_confidence_score ?? 0}%
          </div>
          <div className="mt-2">
            {is_malicious ? (
              <span className="px-3 py-1 bg-rose-50 text-[#B91C1C] border border-rose-200 text-xs font-mono font-bold rounded-full uppercase">
                High Threat IP
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-[#0F7B3F] border border-emerald-200 text-xs font-mono font-bold rounded-full uppercase">
                Clean IP Reputation
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#666666] mt-3 font-mono">
            {total_reports || 0} Abuse Reports Logged
          </p>
        </div>

        {/* Host Network Profile */}
        <div className="md:col-span-2 bg-white border border-[#E0DFDC] rounded-xl p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-mono text-[#666666] uppercase tracking-wider border-b border-[#E0DFDC] pb-2 flex items-center justify-between">
            <span>Sender Network Profile</span>
            <span className="text-[#191919] font-bold">{ip_address}</span>
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#666666] block text-[10px] uppercase">Country Location</span>
              <span className="text-[#191919] font-bold text-sm">
                {country_name} ({country_code})
              </span>
            </div>

            <div>
              <span className="text-[#666666] block text-[10px] uppercase">ISP Provider</span>
              <span className="text-[#191919] font-bold text-sm">
                {isp}
              </span>
            </div>

            <div>
              <span className="text-[#666666] block text-[10px] uppercase">Host Usage Type</span>
              <span className="text-[#191919]">{usage_type || 'Data Center / Web Hosting'}</span>
            </div>

            <div>
              <span className="text-[#666666] block text-[10px] uppercase">Host Domain</span>
              <span className="text-[#191919]">{domain || 'N/A'}</span>
            </div>
          </div>

          {categories && categories.length > 0 && (
            <div className="pt-3 border-t border-[#E0DFDC]">
              <span className="text-[#666666] block text-[10px] uppercase font-mono mb-2">Reported Threat Categories</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-[#B91C1C] text-xs font-mono rounded-full">
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
