import React from 'react';
import RelatedInfraPanel from '../RelatedInfraPanel';

export default function OverviewTab({ data }) {
  if (!data) return null;

  const { headers, sender_ip, related_emails } = data;
  const replyToMismatch = headers?.reply_to_mismatch;
  const returnPathMismatch = headers?.return_path_mismatch;

  return (
    <div className="space-y-6">
      {/* Header Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Sender Card */}
        <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-3 border-b border-[#E0DFDC] dark:border-[#2A2B2E] pb-2 font-mono">
            Sender Identity
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">Display Name</span>
              <span className="text-[#191919] dark:text-white font-semibold text-sm">{headers?.from_name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">From Address</span>
              <span className="text-[#0A66C2] dark:text-[#3B82F6] font-mono font-bold">{headers?.from_address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">From Domain</span>
              <span className="text-[#191919] dark:text-white font-mono">{headers?.from_domain || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">Originating Sender IP</span>
              <span className="text-[#B45309] dark:text-[#F59E0B] font-mono font-bold">{sender_ip || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Envelope Metadata */}
        <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-3 border-b border-[#E0DFDC] dark:border-[#2A2B2E] pb-2 font-mono">
            Envelope Details
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">To Address</span>
              <span className="text-[#191919] dark:text-white font-mono">{headers?.to_address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">Subject</span>
              <span className="text-[#191919] dark:text-white font-semibold">{headers?.subject || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">Date</span>
              <span className="text-[#666666] dark:text-[#A0A0A0] font-mono">{headers?.date || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#666666] dark:text-[#A0A0A0] block">Message-ID</span>
              <span className="text-[#666666] dark:text-[#A0A0A0] font-mono text-[11px] truncate block">{headers?.message_id || 'N/A'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Alignment Verification Card */}
      <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-5 shadow-xs">
        <div className="text-xs font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-3 flex items-center justify-between border-b border-[#E0DFDC] dark:border-[#2A2B2E] pb-2 font-mono">
          <span>Header Address Alignment</span>
          {(replyToMismatch || returnPathMismatch) ? (
            <span className="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-[#B91C1C] dark:text-[#EF4444] border border-rose-200 dark:border-rose-800 text-xs font-bold rounded-full">
              MISMATCH DETECTED
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-[#0F7B3F] dark:text-[#22C55E] border border-emerald-200 dark:border-emerald-800 text-xs font-bold rounded-full">
              PERFECT ALIGNMENT
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className={`p-3.5 rounded-lg border ${replyToMismatch ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-[#B91C1C] dark:text-[#EF4444]' : 'bg-[#F4F2EE] dark:bg-[#0B0B0C] border-[#E0DFDC] dark:border-[#2A2B2E] text-[#191919] dark:text-[#EDEDED]'}`}>
            <div className="text-[#666666] dark:text-[#A0A0A0] text-[10px] uppercase mb-1">Reply-To Address</div>
            <div className="text-[#191919] dark:text-white text-xs font-bold">{headers?.reply_to_address || '(Matches From Address)'}</div>
            <div className="text-[11px] mt-1.5 font-sans">
              {replyToMismatch 
                ? `✕ Mismatch: Reply domain (${headers?.reply_to_domain}) differs from From domain (${headers?.from_domain})`
                : '✓ Matches From domain'}
            </div>
          </div>

          <div className={`p-3.5 rounded-lg border ${returnPathMismatch ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-[#B91C1C] dark:text-[#EF4444]' : 'bg-[#F4F2EE] dark:bg-[#0B0B0C] border-[#E0DFDC] dark:border-[#2A2B2E] text-[#191919] dark:text-[#EDEDED]'}`}>
            <div className="text-[#666666] dark:text-[#A0A0A0] text-[10px] uppercase mb-1">Return-Path Address</div>
            <div className="text-[#191919] dark:text-white text-xs font-bold">{headers?.return_path_address || '(Matches From Address)'}</div>
            <div className="text-[11px] mt-1.5 font-sans">
              {returnPathMismatch 
                ? `✕ Mismatch: Return-Path domain (${headers?.return_path_domain}) differs from From domain (${headers?.from_domain})`
                : '✓ Matches From domain'}
            </div>
          </div>
        </div>
      </div>

      {/* Parsed Body Preview Block */}
      {data.body_preview && (
        <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-bold text-[#666666] dark:text-[#A0A0A0] uppercase tracking-wider mb-2 font-mono">
            Parsed Body Preview
          </div>
          <pre className="p-3.5 bg-[#F4F2EE] dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-lg text-xs font-mono text-[#191919] dark:text-[#EDEDED] overflow-x-auto whitespace-pre-wrap max-h-48">
            {data.body_preview.text || '(HTML Only Body Content)'}
          </pre>
        </div>
      )}

      {/* RELOCATED CORRELATION PANEL */}
      <RelatedInfraPanel
        relatedEmails={related_emails}
        senderIp={sender_ip}
        senderDomain={headers?.from_domain}
      />
    </div>
  );
}
