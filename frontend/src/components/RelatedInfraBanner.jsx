import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function RelatedInfraBanner({ relatedEmails, senderIp }) {
  if (!relatedEmails || !relatedEmails.has_shared_infra || relatedEmails.count === 0) {
    return null;
  }

  return (
    <div className="bg-[#141414] border-l-4 border-l-[#E63946] border border-[#262626] rounded p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#E63946] flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Related emails found: {relatedEmails.count} — possible shared infrastructure
              </span>
              <span className="px-2 py-0.5 bg-[#0A0A0A] border border-[#262626] text-neutral-300 text-xs font-mono rounded">
                IP: {senderIp}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Sender IP <span className="font-mono text-white">{senderIp}</span> has been observed across multiple analyzed emails in the database.
            </p>
          </div>
        </div>

        {/* List of related email chips */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {relatedEmails.items.map((item, idx) => (
            <div key={idx} className="px-2.5 py-1 bg-[#0A0A0A] border border-[#262626] rounded text-neutral-300 flex items-center gap-2">
              <span className={item.risk_score >= 60 ? 'text-[#E63946] font-bold' : 'text-amber-500 font-bold'}>
                {item.classification} ({item.risk_score})
              </span>
              <span className="text-neutral-400 truncate max-w-[150px]">{item.subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
