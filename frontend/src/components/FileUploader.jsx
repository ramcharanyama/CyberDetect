import React, { useRef, useState } from 'react';
import { Upload, FileText, Clipboard, AlertCircle } from 'lucide-react';

export default function FileUploader({ onAnalyzeFile, onAnalyzePaste, onSelectSample, loading }) {
  const [activeInputMode, setActiveInputMode] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [pasteError, setPasteError] = useState('');
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

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    setPasteError('');
    if (!pastedText.trim()) {
      setPasteError('Pasted content cannot be empty');
      return;
    }
    try {
      await onAnalyzePaste(pastedText);
    } catch (err) {
      setPasteError(err.message || 'Invalid email format');
    }
  };

  return (
    <div className="bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] rounded-xl p-6 shadow-xs transition-colors">
      
      {/* Mode Selector Header: Upload File vs Paste Raw Content */}
      <div className="flex items-center gap-4 border-b border-[#E0DFDC] dark:border-[#2A2B2E] pb-3 mb-5">
        <button
          onClick={() => { setActiveInputMode('upload'); setPasteError(''); }}
          className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider border-b-2 py-1 transition cursor-pointer ${
            activeInputMode === 'upload'
              ? 'border-[#0A66C2] dark:border-[#3B82F6] text-[#0A66C2] dark:text-[#3B82F6]'
              : 'border-transparent text-[#666666] dark:text-[#A0A0A0] hover:text-[#191919] dark:hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload .EML File</span>
        </button>

        <button
          onClick={() => { setActiveInputMode('paste'); setPasteError(''); }}
          className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider border-b-2 py-1 transition cursor-pointer ${
            activeInputMode === 'paste'
              ? 'border-[#0A66C2] dark:border-[#3B82F6] text-[#0A66C2] dark:text-[#3B82F6]'
              : 'border-transparent text-[#666666] dark:text-[#A0A0A0] hover:text-[#191919] dark:hover:text-white'
          }`}
        >
          <Clipboard className="w-3.5 h-3.5" />
          <span>Paste Email Raw Content</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        
        {/* Main Input Container (Dropzone or Textarea) */}
        <div className="flex-1 w-full flex flex-col">
          {activeInputMode === 'upload' ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 w-full border border-dashed border-[#B0B0B0] dark:border-[#404247] hover:border-[#0A66C2] dark:hover:border-[#3B82F6] bg-[#F4F2EE]/50 dark:bg-[#0B0B0C]/50 hover:bg-[#0A66C2]/5 rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center group min-h-[160px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".eml,.txt"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#17181A] border border-[#E0DFDC] dark:border-[#2A2B2E] flex items-center justify-center text-[#0A66C2] dark:text-[#3B82F6] group-hover:scale-105 transition shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#191919] dark:text-white">
                    Upload <span className="font-mono text-[#0A66C2] dark:text-[#3B82F6]">.eml</span> forensic file
                  </p>
                  <p className="text-xs text-[#666666] dark:text-[#A0A0A0] mt-0.5">Drag & drop or click to upload email headers & payload</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasteSubmit} className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <textarea
                  value={pastedText}
                  onChange={(e) => { setPastedText(e.target.value); setPasteError(''); }}
                  placeholder="Paste raw email headers and content here (e.g., From: user@domain.com, Received: from ..., Subject: ...)"
                  rows={5}
                  className="w-full bg-[#F4F2EE]/50 dark:bg-[#0B0B0C]/50 border border-[#E0DFDC] dark:border-[#2A2B2E] focus:border-[#0A66C2] dark:focus:border-[#3B82F6] rounded-xl p-3 text-xs font-mono text-[#191919] dark:text-[#EDEDED] placeholder-[#999999] dark:placeholder-[#666666] focus:outline-none transition resize-none"
                />
                {pasteError && (
                  <div className="mt-2 text-xs text-[#B91C1C] dark:text-[#EF4444] font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{pasteError}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !pastedText.trim()}
                  className="px-5 py-2 bg-[#0A66C2] dark:bg-[#3B82F6] hover:bg-[#004182] text-white font-semibold rounded-full text-xs transition disabled:opacity-50 cursor-pointer"
                >
                  Analyze Pasted Content
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Vertically Centered "OR" Divider */}
        <div className="hidden lg:flex items-center justify-center font-semibold text-xs text-[#666666] dark:text-[#808080] uppercase px-1">
          OR
        </div>

        {/* Quick Test Data Cards - Shared Container Width & Heights */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-72 justify-between">
          
          <button
            onClick={() => onSelectSample('clean_newsletter')}
            disabled={loading}
            className="flex-1 flex items-center gap-3 p-3 bg-white dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] hover:border-[#0F7B3F] dark:hover:border-[#22C55E] rounded-xl text-left transition group disabled:opacity-50 px-4 cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0F7B3F] dark:bg-[#22C55E] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#191919] dark:text-white leading-tight">Clean Newsletter</div>
              <div className="text-[10px] text-[#666666] dark:text-[#A0A0A0]">Authentic • Low Risk</div>
            </div>
          </button>

          <button
            onClick={() => onSelectSample('paypal_phishing')}
            disabled={loading}
            className="flex-1 flex items-center gap-3 p-3 bg-white dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] hover:border-[#B91C1C] dark:hover:border-[#EF4444] rounded-xl text-left transition group disabled:opacity-50 px-4 cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#B91C1C] dark:bg-[#EF4444] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#191919] dark:text-white leading-tight">PayPal Phishing</div>
              <div className="text-[10px] text-[#666666] dark:text-[#A0A0A0]">Credential Scam • Critical Risk</div>
            </div>
          </button>

          <button
            onClick={() => onSelectSample('ceo_bec')}
            disabled={loading}
            className="flex-1 flex items-center gap-3 p-3 bg-white dark:bg-[#0B0B0C] border border-[#E0DFDC] dark:border-[#2A2B2E] hover:border-[#B45309] dark:hover:border-[#F59E0B] rounded-xl text-left transition group disabled:opacity-50 px-4 cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#B45309] dark:bg-[#F59E0B] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#191919] dark:text-white leading-tight">Urgent CEO BEC</div>
              <div className="text-[10px] text-[#666666] dark:text-[#A0A0A0]">BEC Transfer • Shared IP Test</div>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}
