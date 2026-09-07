import React from 'react';

export default function UrlsTab({ data }) {
  const urlRes = data?.urls || {};
  const urlsList = urlRes?.urls || [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Extracted Links & Levenshtein Metrics</h4>
          <p className="text-xs text-neutral-400">
            Brand impersonation detection evaluated against target list (PayPal, Microsoft, Google, Amazon, etc.)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-[#0A0A0A] border border-[#262626] rounded text-neutral-300">
            Total URLs: <span className="font-bold text-white">{urlRes.url_count || 0}</span>
          </span>
          {urlRes.lookalike_detected && (
            <span className="px-3 py-1 bg-[#E63946] text-white rounded font-bold">
              LOOKALIKE FLAG
            </span>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded text-xs text-neutral-400 font-mono">
        <span className="text-[#E63946] font-bold">SECURITY NOTICE:</span> Links extracted statically without network calls or visiting targets.
      </div>

      {/* URLs Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden">
        {urlsList.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 text-xs font-mono">
            No HTTP/HTTPS hyper-links or embedded domains discovered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0A0A0A] text-neutral-400 border-b border-[#262626] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Extracted URL</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Levenshtein Brand Analysis</th>
                  <th className="py-3 px-4">Reasons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {urlsList.map((item, idx) => {
                  const isSuspicious = item.is_suspicious;
                  const lookalike = item.lookalike || {};

                  return (
                    <tr key={idx} className={isSuspicious ? 'bg-rose-950/20' : 'hover:bg-[#1A1A1A]'}>
                      <td className="py-3 px-4">
                        {isSuspicious ? (
                          <span className="px-2 py-0.5 bg-[#E63946] text-white text-[10px] font-bold rounded">
                            FLAGGED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
                            CLEAN
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-white font-mono text-[11px] truncate" title={item.url}>
                          {item.url}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-neutral-200 font-bold">{item.domain}</span>
                      </td>

                      <td className="py-3 px-4">
                        {lookalike.is_lookalike ? (
                          <div className="text-[#E63946] font-bold">
                            ✕ Impersonates '{lookalike.matched_brand}' (Distance: {lookalike.distance})
                          </div>
                        ) : lookalike.matched_brand ? (
                          <div className="text-emerald-400">
                            ✓ Genuine {lookalike.matched_brand}
                          </div>
                        ) : (
                          <span className="text-neutral-500">No brand match</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {item.reasons.length > 0 ? (
                          <div className="text-rose-300 text-[11px]">
                            {item.reasons.join(', ')}
                          </div>
                        ) : (
                          <span className="text-neutral-500">None</span>
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
