import React from 'react';

export default function RiskOverviewCard({ risk }) {
  if (!risk) return null;

  const score = risk.score ?? 0;
  const classification = risk.classification || 'UNKNOWN';
  const reasons = risk.reasons || [];

  const isCriticalOrHigh = classification === 'CRITICAL' || classification === 'HIGH' || score >= 60;
  const isMedium = classification === 'MEDIUM' || (score >= 30 && score < 60);

  let scoreColorClass = 'text-[#0F7B3F] dark:text-[#22C55E]';
  let badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-[#0F7B3F] dark:text-[#22C55E] border border-emerald-200 dark:border-emerald-800';
  let dotColor = 'bg-[#0F7B3F] dark:bg-[#22C55E]';

  if (isCriticalOrHigh) {
    scoreColorClass = 'text-[#B91C1C] dark:text-[#EF4444]';
    badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 text-[#B91C1C] dark:text-[#EF4444] border border-rose-200 dark:border-rose-800';
    dotColor = 'bg-[#B91C1C] dark:bg-[#EF4444]';
  } else if (isMedium) {
    scoreColorClass = 'text-[#B45309] dark:text-[#F59E0B]';
    badgeStyle = 'bg-amber-50 dark:bg-amber-950/40 text-[#B45309] dark:text-[#F59E0B] border border-amber-200 dark:border-amber-800';
    dotColor = 'bg-[#B45309] dark:bg-[#F59E0B]';
  }

  return (
    <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
        
        {/* Prominent Color-Coded Score Hero (Primary Color Signal) */}
        <div className="flex items-baseline gap-5 lg:w-5/12 p-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-1">
              Forensic Evidence Score
            </span>
            {/* Score Number itself is color-coded */}
            <div className={`text-7xl sm:text-8xl font-black font-mono tracking-tighter leading-none ${scoreColorClass}`}>
              {score}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <span className={`inline-block px-3 py-1 text-xs font-bold font-mono rounded-full ${badgeStyle}`}>
              {score} — {classification} RISK
            </span>
            <h2 className="text-xl font-bold text-[#191919] dark:text-white tracking-tight">
              {risk.risk_level || `${classification} Risk Level`}
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#A0A0A0] leading-relaxed">
              Weighted rule-based risk evaluation from header parsing, DNS verification, and threat intelligence.
            </p>
          </div>
        </div>

        {/* Divider with Even Padding on Both Sides */}
        <div className="hidden lg:block w-px bg-[#E0DFDC] dark:bg-[#2A2B2E] my-1" />

        {/* AI-assisted Evidence Scoring Reasons List */}
        <div className="flex-1 lg:w-7/12 bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E0DFDC] dark:border-[#2A2B2E] pb-2.5 mb-3">
              <span className="text-xs font-bold text-[#191919] dark:text-white uppercase tracking-wider font-mono">
                {risk.ai_label || "AI-assisted evidence scoring"}
              </span>
              <span className="text-xs font-mono text-[#666666] dark:text-[#A0A0A0]">
                {reasons.length} Signal{reasons.length !== 1 ? 's' : ''}
              </span>
            </div>

            <ul className="space-y-2">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#191919] dark:text-[#EDEDED]">
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0 mt-1.5`} />
                  <span className="leading-relaxed font-sans">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
