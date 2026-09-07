import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RiskOverviewCard({ risk }) {
  if (!risk) return null;

  const score = risk.score ?? 0;
  const classification = risk.classification || 'UNKNOWN';
  const reasons = risk.reasons || [];

  const isCriticalOrHigh = classification === 'CRITICAL' || classification === 'HIGH' || score >= 60;
  const isMedium = classification === 'MEDIUM' || (score >= 30 && score < 60);

  let scoreColorClass = 'text-emerald-500';
  let badgeColorClass = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
  let borderAccentClass = 'border-emerald-900/40';

  if (isCriticalOrHigh) {
    scoreColorClass = 'text-[#E63946]';
    badgeColorClass = 'bg-[#E63946] text-white border-transparent';
    borderAccentClass = 'border-[#E63946]/40';
  } else if (isMedium) {
    scoreColorClass = 'text-amber-500';
    badgeColorClass = 'bg-amber-950/60 text-amber-400 border-amber-800/60';
    borderAccentClass = 'border-amber-900/40';
  }

  return (
    <div className={`bg-[#141414] border ${borderAccentClass} rounded-lg p-8 shadow-xl`}>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        
        {/* Dominant Hero Score Visual (Title Card Style) */}
        <div className="flex items-baseline gap-6 animate-score-resolve">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
              EVIDENCE SCORE
            </span>
            <div className={`text-8xl sm:text-9xl font-black font-mono tracking-tighter leading-none ${scoreColorClass}`}>
              {score}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className={`inline-block px-3 py-1 text-xs font-black font-mono uppercase tracking-wider rounded border ${badgeColorClass}`}>
              {score} — {classification} RISK
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {risk.risk_level || `${classification} Threat Level`}
            </h2>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Weighted rule-based risk evaluation based on header alignment, authentication, brand lookalikes, and threat intelligence.
            </p>
          </div>
        </div>

        {/* AI-assisted Evidence Scoring Reasons List */}
        <div className="flex-1 w-full bg-[#0A0A0A] border border-[#262626] rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {risk.ai_label || "AI-assisted evidence scoring"}
            </span>
            <span className="text-xs font-mono text-neutral-500">
              {reasons.length} Signal{reasons.length !== 1 ? 's' : ''}
            </span>
          </div>

          <ul className="space-y-2.5">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                {isCriticalOrHigh ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] flex-shrink-0 mt-1.5" />
                ) : isMedium ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                )}
                <span className="leading-relaxed font-sans">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
