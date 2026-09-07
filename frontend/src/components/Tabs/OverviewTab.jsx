import React from 'react';
import { Mail, User, Clock, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function OverviewTab({ data }) {
  if (!data) return null;

  const { headers, sender_ip } = data;
  const replyToMismatch = headers?.reply_to_mismatch;
  const returnPathMismatch = headers?.return_path_mismatch;

  return (
    <div className="space-y-6">
      {/* Header Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* From / Sender Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Sender Identity</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400">Display Name:</span>{' '}
              <span className="text-white font-medium">{headers?.from_name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400">From Address:</span>{' '}
              <span className="text-cyan-300 font-mono font-bold">{headers?.from_address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400">From Domain:</span>{' '}
              <span className="text-slate-200 font-mono">{headers?.from_domain || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400">Originating Sender IP:</span>{' '}
              <span className="text-amber-400 font-mono font-bold">{sender_ip || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Recipient & Metadata Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Recipient & Email Envelope</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400">To Address:</span>{' '}
              <span className="text-white font-mono">{headers?.to_address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400">Subject:</span>{' '}
              <span className="text-white font-semibold">{headers?.subject || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400">Date:</span>{' '}
              <span className="text-slate-300 font-mono">{headers?.date || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400">Message-ID:</span>{' '}
              <span className="text-slate-400 font-mono text-[11px] truncate block max-w-full">{headers?.message_id || 'N/A'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mismatch Warning Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>Header Address Alignment Check</span>
          </span>
          {(replyToMismatch || returnPathMismatch) ? (
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded">
              MISMATCH DETECTED
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
              PERFECT ALIGNMENT
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Reply-To Alignment */}
          <div className={`p-3 rounded-lg border ${replyToMismatch ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
            <div className="flex items-center justify-between font-mono mb-1">
              <span>Reply-To Domain</span>
              {replyToMismatch ? (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="font-mono text-white text-xs">{headers?.reply_to_address || '(Same as From)'}</div>
            <div className="text-[11px] mt-1 opacity-80">
              {replyToMismatch 
                ? `❌ Mismatch! Reply domain (${headers?.reply_to_domain}) differs from From domain (${headers?.from_domain})`
                : '✓ Matches From header domain'}
            </div>
          </div>

          {/* Return-Path Alignment */}
          <div className={`p-3 rounded-lg border ${returnPathMismatch ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
            <div className="flex items-center justify-between font-mono mb-1">
              <span>Return-Path Domain</span>
              {returnPathMismatch ? (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="font-mono text-white text-xs">{headers?.return_path_address || '(Same as From)'}</div>
            <div className="text-[11px] mt-1 opacity-80">
              {returnPathMismatch 
                ? `❌ Mismatch! Return-Path domain (${headers?.return_path_domain}) differs from From domain (${headers?.from_domain})`
                : '✓ Matches From header domain'}
            </div>
          </div>
        </div>
      </div>

      {/* Body Content Preview */}
      {data.body_preview && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Parsed Email Body Snippet
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-48">
            {data.body_preview.text || '(HTML Only Body Content)'}
          </pre>
        </div>
      )}
    </div>
  );
}
