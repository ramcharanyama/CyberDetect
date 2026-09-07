import React from 'react';

export default function RelatedInfraPanel({ relatedEmails, senderIp, senderDomain }) {
  const count = relatedEmails?.count || 0;
  const rawItems = relatedEmails?.items || [];
  const hasRelated = relatedEmails?.has_shared_infra && count > 0;

  // Sort matched emails by risk score descending
  const sortedItems = [...rawItems].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));
  
  // Cap at maximum 5 matches
  const displayItems = sortedItems.slice(0, 5);
  const remainingCount = count > 5 ? count - 5 : 0;

  return (
    <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between border-b border-[#E0DFDC] dark:border-[#2A2B2E] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#191919] dark:text-white">Related Infrastructure</h4>
            {hasRelated ? (
              <span className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[#B45309] dark:text-[#F59E0B] text-xs font-mono font-bold rounded-full">
                {count} Match{count !== 1 ? 'es' : ''} Found
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[#0F7B3F] dark:text-[#22C55E] text-xs font-mono font-bold rounded-full">
                No Shared IP
              </span>
            )}
          </div>
          <p className="text-xs text-[#666666] dark:text-[#A0A0A0] mt-0.5">
            Correlated emails sharing sender IP <span className="font-mono text-[#191919] dark:text-white font-medium">{senderIp || 'N/A'}</span> or domain <span className="font-mono text-[#191919] dark:text-white font-medium">{senderDomain || 'N/A'}</span>.
          </p>
        </div>
      </div>

      {!hasRelated ? (
        <p className="text-xs text-[#666666] dark:text-[#A0A0A0] font-mono py-2">
          No other analyzed emails in the database share IP address {senderIp}.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F4F2EE] dark:bg-[#0B0B0C] text-[#666666] dark:text-[#A0A0A0] border-b border-[#E0DFDC] dark:border-[#2A2B2E] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Subject Line</th>
                  <th className="py-2.5 px-3">From Address</th>
                  <th className="py-2.5 px-3">Analyzed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DFDC] dark:divide-[#2A2B2E]">
                {displayItems.map((item, idx) => {
                  const score = item.risk_score || 0;
                  const isCritical = score >= 80 || item.classification === 'CRITICAL';
                  const isMedium = score >= 30 && score < 80;

                  let scoreBadge = 'text-[#0F7B3F] dark:text-[#22C55E] bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
                  if (isCritical) {
                    scoreBadge = 'text-[#B91C1C] dark:text-[#EF4444] bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
                  } else if (isMedium) {
                    scoreBadge = 'text-[#B45309] dark:text-[#F59E0B] bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
                  }

                  return (
                    <tr key={idx} className="hover:bg-[#F4F2EE]/50 dark:hover:bg-[#0B0B0C]/50">
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${scoreBadge}`}>
                          {item.risk_score} — {item.classification}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-[#191919] dark:text-white">
                        {item.subject}
                      </td>
                      <td className="py-2.5 px-3 text-[#666666] dark:text-[#A0A0A0]">
                        {item.from_address}
                      </td>
                      <td className="py-2.5 px-3 text-[#666666] dark:text-[#A0A0A0]">
                        {item.created_at || 'Previous Run'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {remainingCount > 0 && (
            <div className="text-right text-xs font-mono text-[#0A66C2] dark:text-[#3B82F6] font-semibold pt-1">
              + {remainingCount} more matched email{remainingCount !== 1 ? 's' : ''} in database
            </div>
          )}
        </div>
      )}
    </div>
  );
}
