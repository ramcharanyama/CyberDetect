import React, { useState } from 'react';

export default function HeadersTab({ data }) {
  const [showRaw, setShowRaw] = useState(false);
  const receivedChain = data?.received_chain || [];
  const rawHeaders = data?.raw_headers || {};

  return (
    <div className="space-y-6">
      
      {/* Received Chain Trace */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Received Header Chain Trace
          </h4>
          <span className="text-xs font-mono text-neutral-400">
            {receivedChain.length} Hop{receivedChain.length !== 1 ? 's' : ''} Recorded
          </span>
        </div>

        {receivedChain.length === 0 ? (
          <p className="text-xs text-neutral-500 font-mono">No Received headers detected.</p>
        ) : (
          <div className="space-y-3">
            {receivedChain.map((hop, idx) => (
              <div key={idx} className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded text-xs font-mono">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#262626] text-white text-[11px] font-bold flex items-center justify-center">
                      {hop.hop_number}
                    </span>
                    <span className="text-white font-bold">
                      Source IP: {hop.from_ip || 'No IP Captured'}
                    </span>
                    {idx === 0 && (
                      <span className="px-1.5 py-0.5 bg-[#E63946] text-white text-[10px] rounded uppercase font-bold">
                        Origin Host
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Protocol: {hop.protocol}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-400 text-[11px] mb-2">
                  <div><span className="text-neutral-500">From Host:</span> {hop.from_host}</div>
                  <div><span className="text-neutral-500">Relayed By:</span> {hop.by_host}</div>
                </div>

                <div className="text-[10px] text-neutral-500 truncate pt-2 border-t border-[#1C1C1C]">
                  {hop.raw}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw Headers Explorer */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-3">
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Raw Headers Explorer
          </h4>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1 bg-[#0A0A0A] hover:bg-[#262626] text-xs font-mono text-neutral-300 rounded border border-[#262626] transition"
          >
            {showRaw ? 'Collapse Raw Headers' : 'Expand All Raw Headers'}
          </button>
        </div>

        {showRaw && (
          <div className="mt-3 p-4 bg-[#0A0A0A] border border-[#262626] rounded overflow-x-auto">
            <pre className="text-[11px] font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed">
              {Object.entries(rawHeaders).map(([key, val]) => (
                <div key={key} className="mb-1">
                  <span className="text-white font-bold">{key}:</span>{' '}
                  <span className="text-neutral-400">{Array.isArray(val) ? val.join('\n  ') : val}</span>
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
