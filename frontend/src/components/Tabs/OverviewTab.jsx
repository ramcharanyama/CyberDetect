import React from 'react';

export default function OverviewTab({ data }) {
  if (!data) return null;

  const { headers, sender_ip } = data;
  const replyToMismatch = headers?.reply_to_mismatch;
  const returnPathMismatch = headers?.return_path_mismatch;

  return (
    <div className="space-y-6">
      {/* Header Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Sender Card */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4 border-b border-[#262626] pb-2">
            Sender Identity
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-neutral-500 block">Display Name</span>
              <span className="text-white font-medium">{headers?.from_name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">From Address</span>
              <span className="text-white font-mono font-bold">{headers?.from_address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">From Domain</span>
              <span className="text-neutral-300 font-mono">{headers?.from_domain || 'N/A'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Originating Sender IP</span>
              <span className="text-amber-400 font-mono font-bold">{sender_ip || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Envelope Metadata */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4 border-b border-[#262626] pb-2">
            Envelope Details
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-neutral-500 block">To Address</span>
              <span className="text-white font-mono">{headers?.to_address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Subject</span>
              <span className="text-white font-semibold">{headers?.subject || 'N/A'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Date</span>
              <span className="text-neutral-300 font-mono">{headers?.date || 'N/A'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Message-ID</span>
              <span className="text-neutral-400 font-mono text-[11px] truncate block">{headers?.message_id || 'N/A'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Alignment Verification Card */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
        <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-4 flex items-center justify-between border-b border-[#262626] pb-2">
          <span>Header Address Alignment</span>
          {(replyToMismatch || returnPathMismatch) ? (
            <span className="px-2 py-0.5 bg-[#E63946] text-white text-[10px] font-bold rounded">
              MISMATCH DETECTED
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
              ALIGNED
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className={`p-4 rounded border ${replyToMismatch ? 'bg-rose-950/20 border-rose-800/60 text-rose-300' : 'bg-[#0A0A0A] border-[#262626] text-neutral-300'}`}>
            <div className="text-neutral-400 text-[10px] uppercase mb-1">Reply-To Address</div>
            <div className="text-white text-xs font-bold">{headers?.reply_to_address || '(Matches From Address)'}</div>
            <div className="text-[11px] mt-2 opacity-80">
              {replyToMismatch 
                ? `✕ Mismatch: Reply domain (${headers?.reply_to_domain}) differs from From domain (${headers?.from_domain})`
                : '✓ Matches From domain'}
            </div>
          </div>

          <div className={`p-4 rounded border ${returnPathMismatch ? 'bg-rose-950/20 border-rose-800/60 text-rose-300' : 'bg-[#0A0A0A] border-[#262626] text-neutral-300'}`}>
            <div className="text-neutral-400 text-[10px] uppercase mb-1">Return-Path Address</div>
            <div className="text-white text-xs font-bold">{headers?.return_path_address || '(Matches From Address)'}</div>
            <div className="text-[11px] mt-2 opacity-80">
              {returnPathMismatch 
                ? `✕ Mismatch: Return-Path domain (${headers?.return_path_domain}) differs from From domain (${headers?.from_domain})`
                : '✓ Matches From domain'}
            </div>
          </div>
        </div>
      </div>

      {/* Payload Preview */}
      {data.body_preview && (
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3">
            Parsed Body Preview
          </div>
          <pre className="p-4 bg-[#0A0A0A] border border-[#262626] rounded text-xs font-mono text-neutral-300 overflow-x-auto whitespace-pre-wrap max-h-48">
            {data.body_preview.text || '(HTML Only Body)'}
          </pre>
        </div>
      )}
    </div>
  );
}
