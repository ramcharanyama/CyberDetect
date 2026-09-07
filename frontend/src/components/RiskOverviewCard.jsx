import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Cpu, Sparkles, CheckCircle } from 'lucide-react';

export default function RiskOverviewCard({ risk }) {
  if (!risk) return null;

  const score = risk.score ?? 0;
  const classification = risk.classification || 'UNKNOWN';
  const badgeColor = risk.badge_color || 'emerald';
  const reasons = risk.reasons || [];
  const breakdown = risk.score_breakdown || {};

  const getColorClasses = (color) => {
    switch (color) {
      case 'red':
        return {
          cardGlow: 'glow-card-red border-rose-500/50 bg-slate-900/90',
          badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          scoreText: 'text-rose-500',
          ringColor: 'stroke-rose-500',
          icon: <ShieldAlert className="w-8 h-8 text-rose-400" />
        };
      case 'orange':
        return {
          cardGlow: 'glow-card-orange border-orange-500/50 bg-slate-900/90',
          badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          scoreText: 'text-orange-500',
          ringColor: 'stroke-orange-500',
          icon: <ShieldAlert className="w-8 h-8 text-orange-400" />
        };
      case 'amber':
        return {
          cardGlow: 'glow-card border-amber-500/50 bg-slate-900/90',
          badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          scoreText: 'text-amber-500',
          ringColor: 'stroke-amber-500',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />
        };
      default:
        return {
          cardGlow: 'glow-card-emerald border-emerald-500/50 bg-slate-900/90',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          scoreText: 'text-emerald-400',
          ringColor: 'stroke-emerald-400',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />
        };
    }
  };

  const style = getColorClasses(badgeColor);

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${style.cardGlow}`}>
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
        
        {/* Score Ring Gauge & Badge */}
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="stroke-slate-800"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ease-out ${style.ringColor}`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-black tracking-tight ${style.scoreText}`}>{score}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">/ 100 SCORE</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-3 py-1 rounded-lg text-xs font-black font-mono tracking-wide border uppercase ${style.badgeBg}`}>
                {score} — {classification} RISK
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              {risk.risk_level || `${classification} Risk Level`}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Engineered Forensic Evidence Score derived from rule-based weighted heuristics.
            </p>
          </div>
        </div>

        {/* AI-assisted Evidence Scoring Banner & Bulleted Reasons */}
        <div className="flex-1 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                {risk.ai_label || "AI-assisted evidence scoring"}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {reasons.length} Anomaly Signal{reasons.length !== 1 ? 's' : ''}
            </span>
          </div>

          <ul className="space-y-2">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                {badgeColor === 'emerald' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
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
