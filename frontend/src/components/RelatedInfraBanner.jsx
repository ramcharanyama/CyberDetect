import React from 'react';
import { Network, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function RelatedInfraBanner({ relatedEmails, senderIp }) {
  if (!relatedEmails || !relatedEmails.has_shared_infra || relatedEmails.count === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-slate-900 border border-amber-500/50 rounded-2xl p-4 shadow-lg shadow-amber-950/30 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400 flex-shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-200">
                Related emails found: {relatedEmails.count} — possible shared infrastructure
              </span>
              <span className="px-2 py-0.5 bg-amber-900/80 border border-amber-600 text-amber-300 text-[10px] font-mono rounded-md font-semibold">
                IP: {senderIp}
              </span>
            </div>
            <p className="text-xs text-amber-300/80 mt-0.5">
              Sender IP <span className="font-mono text-white">{senderIp}</span> has been observed in previous forensic analysis runs across different subjects.
            </p>
          </div>
        </div>

        {/* List of related emails preview */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {relatedEmails.items.map((item, idx) => (
            <div key={idx} className="px-3 py-1.5 bg-slate-900/80 border border-amber-500/30 rounded-lg text-slate-200 flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">{item.classification} ({item.risk_score})</span>
              <span className="text-slate-400 truncate max-w-[160px]">{item.subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
