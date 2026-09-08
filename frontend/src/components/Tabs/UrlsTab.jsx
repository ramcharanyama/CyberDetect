import React from 'react';

export default function UrlsTab({ data }) {
  const urlRes = data?.urls || {};
  const urlsList = urlRes?.urls || [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E0DFDC] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-[#191919]">Extracted Links & Levenshtein Metrics</h4>
          <p className="text-xs text-[#666666]">
            Brand impersonation detection evaluated against target brand dictionary (PayPal, Microsoft, Google, Amazon, etc.)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-[#F4F2EE] border border-[#E0DFDC] rounded-full text-[#191919]">
            Total URLs: <span className="font-bold text-[#0A66C2]">{urlRes.url_count || 0}</span>
          </span>
          {urlRes.lookalike_detected && (
            <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-[#B91C1C] rounded-full font-bold">
              LOOKALIKE DETECTED
            </span>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-[#F4F2EE] border border-[#E0DFDC] rounded-lg text-xs text-[#666666] font-mono">
        <span className="text-[#0A66C2] font-bold">SECURITY GUARANTEE:</span> Links extracted statically without external HTTP requests or visiting target URLs.
      </div>

      {/* URLs Table */}
      <div className="bg-white border border-[#E0DFDC] rounded-xl overflow-hidden shadow-xs">
        {urlsList.length === 0 ? (
          <div className="p-8 text-center text-[#666666] text-xs font-mono">
            No HTTP/HTTPS hyper-links or embedded domains discovered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F4F2EE] text-[#666666] border-b border-[#E0DFDC] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Extracted URL</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Levenshtein Brand Analysis</th>
                  <th className="py-3 px-4">Reasons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DFDC]">
                {urlsList.map((item, idx) => {
                  const isSuspicious = item.is_suspicious;
                  const lookalike = item.lookalike || {};

                  return (
                    <tr key={idx} className={isSuspicious ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-[#F4F2EE]/50'}>
                      <td className="py-3 px-4">
                        {isSuspicious ? (
                          <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-[#B91C1C] text-[10px] font-bold rounded-full">
                            FLAGGED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[#0F7B3F] text-[10px] font-bold rounded-full">
                            CLEAN
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-[#191919] font-mono text-[11px] truncate" title={item.url}>
                          {item.url}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[#0A66C2] font-bold">{item.domain}</span>
                      </td>

                      <td className="py-3 px-4">
                        {lookalike.is_lookalike ? (
                          <div className="text-[#B91C1C] font-bold">
                            ✕ Impersonates '{lookalike.matched_brand}' (Distance: {lookalike.distance})
                          </div>
                        ) : lookalike.matched_brand ? (
                          <div className="text-[#0F7B3F]">
                            ✓ Genuine {lookalike.matched_brand}
                          </div>
                        ) : (
                          <span className="text-[#666666]">No brand match</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {item.reasons.length > 0 ? (
                          <div className="text-[#B91C1C] text-[11px]">
                            {item.reasons.join(', ')}
                          </div>
                        ) : (
                          <span className="text-[#666666]">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
