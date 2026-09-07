import React, { useState } from 'react';
import { GitCommit, Server, ShieldAlert, ArrowRight, Code } from 'lucide-react';

export default function HeadersTab({ data }) {
  const [showRaw, setShowRaw] = useState(false);
  const receivedChain = data?.received_chain || [];
  const rawHeaders = data?.raw_headers || {};

  return (
    <div className="space-y-6">
      
      {/* Received Chain Hop-by-Hop Visualizer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Received Header Chain (Hop-by-Hop Trace)
            </h4>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
            {receivedChain.length} Hop{receivedChain.length !== 1 ? 's' : ''} Detected
          </span>
        </div>

        {receivedChain.length === 0 ? (
          <p className="text-xs text-slate-400 font-mono">No Received headers found in email.</p>
        ) : (
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800 before:z-0">
            {receivedChain.map((hop, idx) => (
              <div key={idx} className="relative z-10 flex items-start gap-4 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-cyan-500/50 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                  {hop.hop_number}
                </div>
                
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-mono text-cyan-300 font-bold flex items-center gap-2">
                      <span>Source IP: {hop.from_ip || 'No IP Captured'}</span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] rounded uppercase">
                          Origin Host
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Protocol: {hop.protocol}
                    </span>
                  </div>

                  <div className="text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    <div><span className="text-slate-500">From Host:</span> {hop.from_host}</div>
                    <div><span className="text-slate-500">Relayed By:</span> {hop.by_host}</div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono truncate pt-1 border-t border-slate-900 mt-1">
                    {hop.raw}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw Headers Toggle & Inspector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Full Raw Header Explorer
            </h4>
          </div>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg border border-slate-700 transition"
          >
            {showRaw ? 'Collapse Raw Headers' : 'Expand All Raw Headers'}
          </button>
        </div>

        {showRaw && (
          <div className="mt-3 p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {Object.entries(rawHeaders).map(([key, val]) => (
                <div key={key} className="mb-1">
                  <span className="text-cyan-400 font-bold">{key}:</span>{' '}
                  <span className="text-slate-300">{Array.isArray(val) ? val.join('\n  ') : val}</span>
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
