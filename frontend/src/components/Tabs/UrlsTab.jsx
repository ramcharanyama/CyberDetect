import React from 'react';
import { Link2, AlertTriangle, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';

export default function UrlsTab({ data }) {
  const urlRes = data?.urls || {};
  const urlsList = urlRes?.urls || [];

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Extracted Links & Brand Impersonation Forensics</h4>
            <p className="text-xs text-slate-400">
              Levenshtein distance algorithm checked against major target brands (PayPal, Microsoft, Google, Amazon, etc.)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-300">
            Total URLs: <span className="font-bold text-white">{urlRes.url_count || 0}</span>
          </span>
          {urlRes.lookalike_detected && (
            <span className="px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-lg font-bold">
              LOOKALIKE DOMAIN DETECTED
            </span>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono flex items-center gap-2">
        <span className="text-cyan-400 font-bold">🔒 SECURITY ISOLATION GUARANTEE:</span>
        <span>CyberDetect static engine extracted links safely without initiating external HTTP requests or visiting URLs.</span>
      </div>

      {/* Table of URLs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        {urlsList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">
            No HTTP/HTTPS hyper-links or embedded domains discovered in email payload.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Extracted URL</th>
                  <th className="py-3 px-4">Target Domain</th>
                  <th className="py-3 px-4">Levenshtein & Brand Match</th>
                  <th className="py-3 px-4">Risk Reasons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {urlsList.map((item, idx) => {
                  const isSuspicious = item.is_suspicious;
                  const lookalike = item.lookalike || {};

                  return (
                    <tr key={idx} className={isSuspicious ? 'bg-rose-950/10 hover:bg-rose-950/20' : 'hover:bg-slate-800/40'}>
                      <td className="py-3 px-4">
                        {isSuspicious ? (
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold rounded flex items-center gap-1 w-max">
                            <ShieldAlert className="w-3 h-3" />
                            THREAT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold rounded flex items-center gap-1 w-max">
                            <CheckCircle className="w-3 h-3" />
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
                        <span className="text-cyan-300 font-bold">{item.domain}</span>
                      </td>

                      <td className="py-3 px-4">
                        {lookalike.is_lookalike ? (
                          <div className="text-rose-300 font-bold">
                            ⚠️ Brand '{lookalike.matched_brand}' (Distance: {lookalike.distance})
                          </div>
                        ) : lookalike.matched_brand ? (
                          <div className="text-emerald-400">
                            ✓ Authentic {lookalike.matched_brand} Domain
                          </div>
                        ) : (
                          <span className="text-slate-500">No major brand match</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {item.reasons.length > 0 ? (
                          <div className="text-rose-300 text-[11px]">
                            {item.reasons.join(', ')}
                          </div>
                        ) : (
                          <span className="text-slate-500">None</span>
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
