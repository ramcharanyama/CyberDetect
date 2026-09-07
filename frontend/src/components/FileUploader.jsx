import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function FileUploader({ onAnalyzeFile, onSelectSample, loading }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyzeFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onAnalyzeFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        
        {/* Dropzone Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 w-full border border-dashed border-[#333333] hover:border-[#E63946] bg-[#0A0A0A] rounded-lg p-6 text-center cursor-pointer transition group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".eml,.txt"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-[#141414] rounded-full border border-[#262626] group-hover:border-[#E63946] transition">
              <Upload className="w-5 h-5 text-neutral-300 group-hover:text-[#E63946]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Upload <span className="font-mono text-[#E63946]">.eml</span> email forensic file
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Drag & drop or click to analyze headers & payload</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="text-xs font-mono text-neutral-600 uppercase px-2">
          OR PRESET TEST DATA
        </div>

        {/* Quick Sample Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-72">
          <button
            onClick={() => onSelectSample('clean_newsletter')}
            disabled={loading}
            className="flex items-center gap-3 p-2.5 bg-[#0A0A0A] border border-[#262626] hover:border-emerald-700/60 rounded text-left transition group disabled:opacity-50"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-neutral-200 group-hover:text-white">Clean Newsletter</div>
              <div className="text-[10px] text-neutral-500 font-mono">Authentic • Low Risk</div>
            </div>
          </button>

          <button
            onClick={() => onSelectSample('paypal_phishing')}
            disabled={loading}
            className="flex items-center gap-3 p-2.5 bg-[#0A0A0A] border border-[#262626] hover:border-[#E63946] rounded text-left transition group disabled:opacity-50"
          >
            <div className="w-2 h-2 rounded-full bg-[#E63946] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-neutral-200 group-hover:text-white">PayPal Phishing</div>
              <div className="text-[10px] text-neutral-500 font-mono">Credential Scam • Critical Risk</div>
            </div>
          </button>

          <button
            onClick={() => onSelectSample('ceo_bec')}
            disabled={loading}
            className="flex items-center gap-3 p-2.5 bg-[#0A0A0A] border border-[#262626] hover:border-amber-700/60 rounded text-left transition group disabled:opacity-50"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-neutral-200 group-hover:text-white">Urgent CEO BEC</div>
              <div className="text-[10px] text-neutral-500 font-mono">BEC Transfer • Shared IP Test</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
