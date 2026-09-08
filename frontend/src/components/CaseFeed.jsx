import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CaseFeed({ cases, activeAnalysisId, onSelectCase }) {
  if (!cases || cases.length === 0) return null;

  // Capped at 10 most recent analyzed emails
  const feedCases = [...cases].slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1 border-b border-[#E0DFDC] dark:border-[#2A2B2E] pb-2">
        <h3 className="text-xs font-bold text-[#191919] dark:text-white uppercase tracking-wider font-mono">
          Analyzed Email Forensics Feed ({feedCases.length})
        </h3>
        <span className="text-xs text-[#666666] dark:text-[#A0A0A0]">Showing 10 most recent cases</span>
      </div>

      <div className="space-y-3">
        {feedCases.map((item, idx) => {
          const score = item.risk_score ?? item.risk?.score ?? 0;
          const isCritical = score >= 80 || item.classification === 'CRITICAL';
          const isHighOrMedium = (score >= 30 && score < 80) || item.classification === 'HIGH' || item.classification === 'MEDIUM';
          const isSelected = activeAnalysisId === item.id || activeAnalysisId === item.record_id;

          let scoreColorClass = 'text-[#0F7B3F] dark:text-[#22C55E]';
          let badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-[#0F7B3F] dark:text-[#22C55E] border border-emerald-200 dark:border-emerald-800';

          if (isCritical) {
            scoreColorClass = 'text-[#B91C1C] dark:text-[#EF4444]';
            badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 text-[#B91C1C] dark:text-[#EF4444] border border-rose-200 dark:border-rose-800';
          } else if (isHighOrMedium) {
            scoreColorClass = 'text-[#B45309] dark:text-[#F59E0B]';
            badgeStyle = 'bg-amber-50 dark:bg-amber-950/40 text-[#B45309] dark:text-[#F59E0B] border border-amber-200 dark:border-amber-800';
          }

          const senderName = item.from_address || item.headers?.from_address || 'Unknown Sender';
          const senderIp = item.sender_ip || item.intel?.ip_address || '127.0.0.1';
          const subject = item.subject || item.headers?.subject || 'Forensic Analysis Record';
          const reasons = item.reasons || item.risk?.reasons || [];

          return (
            <div
              key={idx}
              className={`bg-white dark:bg-[#17181A] border ${
                isSelected 
                  ? 'border-[#0A66C2] dark:border-[#3B82F6] ring-1 ring-[#0A66C2] dark:ring-[#3B82F6]' 
                  : 'border-[#E0DFDC] dark:border-[#2A2B2E] hover:border-[#B0B0B0] dark:hover:border-[#404247]'
              } rounded-xl p-5 shadow-xs transition duration-150`}
            >
              {/* LinkedIn Post Author Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar Initial */}
                  <div className="w-10 h-10 rounded-full bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] flex items-center justify-center font-bold text-[#0A66C2] dark:text-[#3B82F6] text-sm flex-shrink-0">
                    {senderName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#191919] dark:text-white leading-snug">
                      {senderName}
                    </h4>
                    <p className="text-xs text-[#666666] dark:text-[#A0A0A0] font-mono leading-tight">
                      Originating IP: <span className="text-[#191919] dark:text-[#EDEDED] font-medium">{senderIp}</span> • Case #{item.id || idx + 1}
                    </p>
                  </div>
                </div>

                {/* Score Number Color-Coded Pill Badge Top-Right */}
                <div className={`px-3 py-1 text-xs font-bold font-mono rounded-full flex items-center gap-1.5 ${badgeStyle}`}>
                  <span className={`font-black ${scoreColorClass}`}>{score}</span>
                  <span>— {item.classification || item.risk?.classification || 'ANALYZED'}</span>
                </div>
              </div>

              {/* Subject Body Preview */}
              <div className="mb-4 pl-1">
                <h5 className="text-base font-semibold text-[#191919] dark:text-white leading-snug">
                  {subject}
                </h5>

                {reasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {reasons.slice(0, 3).map((r, rIdx) => (
                      <span key={rIdx} className="px-2 py-0.5 bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] text-[#666666] dark:text-[#A0A0A0] text-xs rounded-md">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Footer Action Bar */}
              <div className="flex items-center justify-between border-t border-[#E0DFDC] dark:border-[#2A2B2E] pt-3 text-xs">
                <span className="text-[#666666] dark:text-[#A0A0A0]">
                  {item.created_at ? `Analyzed on ${item.created_at}` : 'Ready for forensic review'}
                </span>

                <button
                  onClick={() => onSelectCase(item)}
                  className="px-4 py-1.5 bg-white dark:bg-[#0B0B0C] border border-[#0A66C2] dark:border-[#3B82F6] text-[#0A66C2] dark:text-[#3B82F6] hover:bg-[#0A66C2]/5 dark:hover:bg-[#3B82F6]/10 font-semibold rounded-full transition flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <span>Inspect Forensics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
