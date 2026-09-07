import React from 'react';
import { ShieldCheck, ShieldAlert, Key, Globe, FileCheck } from 'lucide-react';

export default function AuthTab({ data }) {
  const auth = data?.auth || {};
  const { spf, dmarc, dkim, domain } = auth;

  const renderBadge = (status) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold font-mono rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold font-mono rounded-lg flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            FAIL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold font-mono rounded-lg">
            NONE / UNVERIFIED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-bold text-white">Target Sender Auth Domain:</span>
          <span className="text-sm font-mono text-cyan-300 font-bold bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
            {domain || 'N/A'}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:block">
          DNS Record Protocol Verification via dnspython
        </span>
      </div>

      {/* 3 Columns for SPF, DKIM, DMARC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* SPF Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white font-mono uppercase">SPF</h4>
            </div>
            {renderBadge(spf?.status)}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sender Policy Framework verifies if host IP is authorized to transmit mail for domain.
          </p>
          <div className="pt-2 border-t border-slate-800 text-xs font-mono">
            <div className="text-slate-500 text-[10px] uppercase mb-1">DNS TXT Record</div>
            <div className="p-2.5 bg-slate-950 rounded-lg text-cyan-300 text-[11px] break-all border border-slate-800">
              {spf?.record || spf?.details || 'No SPF record string found'}
            </div>
          </div>
        </div>

        {/* DKIM Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white font-mono uppercase">DKIM</h4>
            </div>
            {renderBadge(dkim?.status)}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            DomainKeys Identified Mail inspects cryptographic signature headers attached to message.
          </p>
          <div className="pt-2 border-t border-slate-800 text-xs font-mono">
            <div className="text-slate-500 text-[10px] uppercase mb-1">DKIM Signature Header</div>
            <div className="p-2.5 bg-slate-950 rounded-lg text-cyan-300 text-[11px] break-all border border-slate-800">
              {dkim?.header || dkim?.details || 'No DKIM header found'}
            </div>
          </div>
        </div>

        {/* DMARC Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white font-mono uppercase">DMARC</h4>
            </div>
            {renderBadge(dmarc?.status)}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Domain-based Message Authentication Reporting & Conformance enforces policy alignment.
          </p>
          <div className="pt-2 border-t border-slate-800 text-xs font-mono">
            <div className="text-slate-500 text-[10px] uppercase mb-1">_dmarc.{domain} TXT Record</div>
            <div className="p-2.5 bg-slate-950 rounded-lg text-cyan-300 text-[11px] break-all border border-slate-800">
              {dmarc?.record || dmarc?.details || 'No DMARC record found'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
