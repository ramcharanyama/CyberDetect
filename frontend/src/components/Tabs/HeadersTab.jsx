import React, { useState } from 'react';

export default function HeadersTab({ data }) {
  const [showRaw, setShowRaw] = useState(false);
  const receivedChain = data?.received_chain || [];
  const rawHeaders = data?.raw_headers || {};

  return (
    <div className="space-y-6">
      
      {/* Received Chain Trace */}
      <div className="bg-white border border-[#E0DFDC] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E0DFDC] pb-3 mb-4">
          <h4 className="text-xs font-bold text-[#191919] uppercase font-mono tracking-wider">
            Received Header Chain Trace
          </h4>
          <span className="text-xs font-mono text-[#666666]">
            {receivedChain.length} Hop{receivedChain.length !== 1 ? 's' : ''} Recorded
          </span>
        </div>

        {receivedChain.length === 0 ? (
          <p className="text-xs text-[#666666] font-mono">No Received headers detected.</p>
        ) : (
          <div className="space-y-3">
            {receivedChain.map((hop, idx) => (
              <div key={idx} className="p-3.5 bg-[#F4F2EE] border border-[#E0DFDC] rounded-lg text-xs font-mono">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0A66C2] text-white text-[11px] font-bold flex items-center justify-center">
                      {hop.hop_number}
                    </span>
                    <span className="text-[#191919] font-bold">
                      Source IP: {hop.from_ip || 'No IP Captured'}
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 bg-rose-50 text-[#B91C1C] border border-rose-200 text-[10px] rounded-full uppercase font-bold">
                        Origin Host
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#666666]">
                    Protocol: {hop.protocol}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#666666] text-[11px] mb-2">
                  <div><span className="text-[#191919] font-semibold">From Host:</span> {hop.from_host}</div>
                  <div><span className="text-[#191919] font-semibold">Relayed By:</span> {hop.by_host}</div>
                </div>

                <div className="text-[10px] text-[#666666] truncate pt-2 border-t border-[#E0DFDC]">
                  {hop.raw}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw Headers Explorer */}
      <div className="bg-white border border-[#E0DFDC] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E0DFDC] pb-3 mb-3">
          <h4 className="text-xs font-bold text-[#191919] font-mono uppercase tracking-wider">
            Raw Headers Explorer
          </h4>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1 bg-[#F4F2EE] hover:bg-[#E0DFDC] text-xs font-mono text-[#0A66C2] font-semibold rounded-full border border-[#E0DFDC] transition"
          >
            {showRaw ? 'Collapse Raw Headers' : 'Expand All Raw Headers'}
          </button>
        </div>

        {showRaw && (
          <div className="mt-3 p-4 bg-[#F4F2EE] border border-[#E0DFDC] rounded-lg overflow-x-auto">
            <pre className="text-[11px] font-mono text-[#191919] whitespace-pre-wrap leading-relaxed">
              {Object.entries(rawHeaders).map(([key, val]) => (
                <div key={key} className="mb-1">
                  <span className="text-[#0A66C2] font-bold">{key}:</span>{' '}
                  <span className="text-[#191919]">{Array.isArray(val) ? val.join('\n  ') : val}</span>
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
