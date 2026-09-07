import React, { useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 glow-card">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        
        {/* Dropzone Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 w-full border-2 border-dashed border-slate-700 hover:border-cyan-500/80 bg-slate-950/60 hover:bg-cyan-950/20 rounded-xl p-6 text-center cursor-pointer transition group relative overflow-hidden"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".eml,.txt"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-slate-900 rounded-full border border-slate-700 group-hover:border-cyan-500/50 group-hover:scale-110 transition">
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Drop your <span className="text-cyan-400 font-mono">.eml</span> email file here
              </p>
              <p className="text-xs text-slate-400 mt-1">or click to browse local files for forensic analysis</p>
            </div>
          </div>
        </div>

        {/* OR Divider */}
        <div className="flex items-center lg:flex-col justify-center text-xs font-mono text-slate-500 uppercase px-2">
          <span>OR QUICK TEST SAMPLES</span>
        </div>

        {/* Preset Sample Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-72">
          <button
            onClick={() => onSelectSample('clean_newsletter')}
            disabled={loading}
            className="flex items-center gap-3 p-3 bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/20 rounded-xl text-left transition group disabled:opacity-50"
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white group-hover:text-emerald-300">Clean Newsletter</div>
              <div className="text-[10px] text-slate-400 truncate">Authentic • Expected: LOW Risk</div>
            </div>
          </button>

          <button
            onClick={() => onSelectSample('paypal_phishing')}
            disabled={loading}
            className="flex items-center gap-3 p-3 bg-slate-950/80 border border-rose-500/30 hover:border-rose-500 hover:bg-rose-950/20 rounded-xl text-left transition group disabled:opacity-50"
          >
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 group-hover:scale-105 transition">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white group-hover:text-rose-300">PayPal Phishing</div>
              <div className="text-[10px] text-slate-400 truncate">Credential Phish • Expected: CRITICAL</div>
            </div>
          </button>

          <button
            onClick={() => onSelectSample('ceo_bec')}
            disabled={loading}
            className="flex items-center gap-3 p-3 bg-slate-950/80 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-950/20 rounded-xl text-left transition group disabled:opacity-50"
          >
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 group-hover:scale-105 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white group-hover:text-amber-300">Urgent CEO BEC</div>
              <div className="text-[10px] text-slate-400 truncate">BEC Transfer • Shared IP Test</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
