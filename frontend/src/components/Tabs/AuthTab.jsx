import React from 'react';

export default function AuthTab({ data }) {
  const auth = data?.auth || {};
  const { spf, dmarc, dkim, domain } = auth;

  const renderBadge = (status) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-bold font-mono rounded">
            PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="px-2.5 py-1 bg-[#E63946] text-white text-xs font-bold font-mono rounded">
            FAIL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-[#0A0A0A] text-neutral-400 border border-[#262626] text-xs font-bold font-mono rounded">
            NONE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-400 uppercase font-mono">Target Domain:</span>
          <span className="text-xs font-mono text-white font-bold bg-[#0A0A0A] px-2.5 py-1 rounded border border-[#262626]">
            {domain || 'N/A'}
          </span>
        </div>
        <span className="text-xs text-neutral-500 font-mono hidden sm:block">
          DNS TXT Verification via dnspython
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* SPF */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h4 className="text-sm font-bold text-white font-mono">SPF Verification</h4>
            {renderBadge(spf?.status)}
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Validates if host IP is authorized by domain TXT records.
          </p>
          <div className="pt-2 border-t border-[#262626] text-xs font-mono">
            <div className="text-neutral-500 text-[10px] uppercase mb-1">SPF TXT Record</div>
            <div className="p-2.5 bg-[#0A0A0A] rounded text-neutral-300 text-[11px] break-all border border-[#262626]">
              {spf?.record || spf?.details || 'No SPF record found'}
            </div>
          </div>
        </div>

        {/* DKIM */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h4 className="text-sm font-bold text-white font-mono">DKIM Verification</h4>
            {renderBadge(dkim?.status)}
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Inspects cryptographic signature headers on incoming payload.
          </p>
          <div className="pt-2 border-t border-[#262626] text-xs font-mono">
            <div className="text-neutral-500 text-[10px] uppercase mb-1">DKIM Header</div>
            <div className="p-2.5 bg-[#0A0A0A] rounded text-neutral-300 text-[11px] break-all border border-[#262626]">
              {dkim?.header || dkim?.details || 'No DKIM header found'}
            </div>
          </div>
        </div>

        {/* DMARC */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h4 className="text-sm font-bold text-white font-mono">DMARC Policy</h4>
            {renderBadge(dmarc?.status)}
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Enforces policy alignment across SPF and DKIM signatures.
          </p>
          <div className="pt-2 border-t border-[#262626] text-xs font-mono">
            <div className="text-neutral-500 text-[10px] uppercase mb-1">_dmarc Record</div>
            <div className="p-2.5 bg-[#0A0A0A] rounded text-neutral-300 text-[11px] break-all border border-[#262626]">
              {dmarc?.record || dmarc?.details || 'No DMARC record found'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
