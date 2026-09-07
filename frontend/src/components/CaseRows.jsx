import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function CaseRows({ cases, activeAnalysisId, onSelectCase }) {
  if (!cases || cases.length === 0) return null;

  // Group cases into category rows
  const highRiskCases = cases.filter(c => c.risk_score >= 60 || c.classification === 'HIGH' || c.classification === 'CRITICAL');
  const lowRiskCases = cases.filter(c => c.risk_score < 30 || c.classification === 'LOW');
  const recentCases = cases;

  const renderRow = (title, items) => {
    if (!items || items.length === 0) return null;

    const rowRef = useRef(null);

    const scroll = (direction) => {
      if (rowRef.current) {
        const { scrollLeft, clientWidth } = rowRef.current;
        const scrollAmount = clientWidth * 0.75;
        rowRef.current.scrollTo({
          left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 bg-[#141414] hover:bg-[#262626] border border-[#262626] rounded text-neutral-400 hover:text-white transition"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 bg-[#141414] hover:bg-[#262626] border border-[#262626] rounded text-neutral-400 hover:text-white transition"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Row */}
        <div
          ref={rowRef}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {items.map((item, idx) => {
            const isCritical = item.risk_score >= 80 || item.classification === 'CRITICAL';
            const isHigh = item.risk_score >= 60 || item.classification === 'HIGH';
            const isMedium = item.risk_score >= 30 || item.classification === 'MEDIUM';
            const isSelected = activeAnalysisId === item.id || activeAnalysisId === item.record_id;

            let badgeColorClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
            if (isCritical || isHigh) {
              badgeColorClass = 'bg-[#E63946] text-white border-transparent';
            } else if (isMedium) {
              badgeColorClass = 'bg-amber-950/80 text-amber-400 border-amber-800/60';
            }

            // Top 2 reasons preview
            const reasons = item.reasons || item.risk?.reasons || [];
            const topReasons = reasons.slice(0, 2);

            return (
              <div
                key={idx}
                onClick={() => onSelectCase(item)}
                className={`group relative flex-shrink-0 w-64 h-36 bg-[#141414] border ${
                  isSelected ? 'border-[#E63946] ring-1 ring-[#E63946]' : 'border-[#262626] hover:border-neutral-500'
                } rounded-md p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-20 shadow-lg flex flex-col justify-between overflow-hidden`}
              >
                {/* Card Top Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs text-neutral-400 font-medium truncate max-w-[150px]" title={item.from_address || item.headers?.from_address}>
                    {item.from_address || item.headers?.from_address || 'Unknown Sender'}
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-black font-mono tracking-tighter rounded border ${badgeColorClass}`}>
                    {item.risk_score ?? item.risk?.score ?? 0}
                  </span>
                </div>

                {/* Card Subject Line */}
                <div className="my-1">
                  <div className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {item.subject || item.headers?.subject || 'Forensic Analysis Case'}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-1">
                    IP: {item.sender_ip || item.intel?.ip_address || '127.0.0.1'}
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-2 border-t border-[#262626]">
                  <span>{item.classification || item.risk?.classification || 'ANALYZED'}</span>
                  <span>Click to Inspect →</span>
                </div>

                {/* Netflix Hover Overlay Preview (Quick Triage) */}
                <div className="absolute inset-0 bg-[#141414]/95 border border-[#E63946] rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between pointer-events-none">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#262626] pb-1.5 mb-1.5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Quick Triage Preview</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold font-mono rounded ${badgeColorClass}`}>
                        {item.risk_score ?? item.risk?.score ?? 0} — {item.classification || item.risk?.classification}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {topReasons.length > 0 ? (
                        topReasons.map((r, rIdx) => (
                          <div key={rIdx} className="text-[10px] text-neutral-300 leading-tight flex items-start gap-1">
                            <span className="text-[#E63946]">•</span>
                            <span className="line-clamp-2">{r}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-emerald-400">✓ No critical anomalies detected</div>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-[#E63946] text-right font-mono uppercase tracking-wider">
                    Open Forensic Breakdown
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {highRiskCases.length > 0 && renderRow("High & Critical Risk Signals", highRiskCases)}
      {renderRow("Recent Analyzed Emails", recentCases)}
      {lowRiskCases.length > 0 && renderRow("Clean & Verified Emails", lowRiskCases)}
    </div>
  );
}
