import React from 'react';

export default function AuthTab({ data }) {
  const auth = data?.auth || {};
  const { spf, dmarc, dkim, domain } = auth;

  const renderBadge = (status) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-[#0F7B3F] border border-emerald-200 text-xs font-bold font-mono rounded-full">
            PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="px-2.5 py-1 bg-rose-50 text-[#B91C1C] border border-rose-200 text-xs font-bold font-mono rounded-full">
            FAIL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-[#F4F2EE] text-[#666666] border border-[#E0DFDC] text-xs font-bold font-mono rounded-full">
            NONE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E0DFDC] rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#666666] uppercase font-mono">Target Domain:</span>
          <span className="text-xs font-mono text-[#0A66C2] font-bold bg-[#F4F2EE] px-2.5 py-1 rounded border border-[#E0DFDC]">
            {domain || 'N/A'}
          </span>
        </div>
        <span className="text-xs text-[#666666] font-mono hidden sm:block">
          DNS Record Verification via dnspython
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* SPF */}
        <div className="bg-white border border-[#E0DFDC] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E0DFDC] pb-3">
            <h4 className="text-sm font-bold text-[#191919] font-mono">SPF Verification</h4>
            {renderBadge(spf?.status)}
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            Validates if host IP is authorized by domain TXT records.
          </p>
          <div className="pt-2 border-t border-[#E0DFDC] text-xs font-mono">
            <div className="text-[#666666] text-[10px] uppercase mb-1">SPF TXT Record</div>
            <div className="p-2.5 bg-[#F4F2EE] rounded text-[#191919] text-[11px] break-all border border-[#E0DFDC]">
              {spf?.record || spf?.details || 'No SPF record found'}
            </div>
          </div>
        </div>

        {/* DKIM */}
        <div className="bg-white border border-[#E0DFDC] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E0DFDC] pb-3">
            <h4 className="text-sm font-bold text-[#191919] font-mono">DKIM Verification</h4>
            {renderBadge(dkim?.status)}
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            Inspects cryptographic signature headers on incoming payload.
          </p>
          <div className="pt-2 border-t border-[#E0DFDC] text-xs font-mono">
            <div className="text-[#666666] text-[10px] uppercase mb-1">DKIM Header</div>
            <div className="p-2.5 bg-[#F4F2EE] rounded text-[#191919] text-[11px] break-all border border-[#E0DFDC]">
              {dkim?.header || dkim?.details || 'No DKIM header found'}
            </div>
          </div>
        </div>

        {/* DMARC */}
        <div className="bg-white border border-[#E0DFDC] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E0DFDC] pb-3">
            <h4 className="text-sm font-bold text-[#191919] font-mono">DMARC Policy</h4>
            {renderBadge(dmarc?.status)}
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            Enforces policy alignment across SPF and DKIM signatures.
          </p>
          <div className="pt-2 border-t border-[#E0DFDC] text-xs font-mono">
            <div className="text-[#666666] text-[10px] uppercase mb-1">_dmarc Record</div>
            <div className="p-2.5 bg-[#F4F2EE] rounded text-[#191919] text-[11px] break-all border border-[#E0DFDC]">
              {dmarc?.record || dmarc?.details || 'No DMARC record found'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
