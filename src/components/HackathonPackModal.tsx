import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, CheckCircle2 } from 'lucide-react';
import { DecompositionResult } from '../types/agile';
import { generateDevpostPlanningPack, downloadTextFile } from '../lib/devpostExporter';
import { copyToClipboard } from '../lib/markdownExporter';

interface HackathonPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DecompositionResult;
  featurePrompt?: string;
}

export const HackathonPackModal: React.FC<HackathonPackModalProps> = ({
  isOpen,
  onClose,
  result,
  featurePrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'scope' | 'prd' | 'spec'>('scope');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadAllDone, setDownloadAllDone] = useState(false);

  if (!isOpen) return null;

  const pack = generateDevpostPlanningPack(result, featurePrompt);

  const fileContents = {
    scope: { filename: 'scope.md', content: pack.scopeMd, title: 'Scope Definition' },
    prd: { filename: 'prd.md', content: pack.prdMd, title: 'Product Requirements' },
    spec: { filename: 'spec.md', content: pack.specMd, title: 'Technical Specification' },
  };

  const current = fileContents[activeTab];

  const handleCopyCurrent = async () => {
    const ok = await copyToClipboard(current.content);
    if (ok) {
      setCopiedFile(current.filename);
      setTimeout(() => setCopiedFile(null), 2000);
    }
  };

  const handleDownloadCurrent = () => {
    downloadTextFile(current.filename, current.content);
  };

  const handleDownloadAll = () => {
    downloadTextFile('scope.md', pack.scopeMd);
    setTimeout(() => downloadTextFile('prd.md', pack.prdMd), 200);
    setTimeout(() => downloadTextFile('spec.md', pack.specMd), 400);
    setDownloadAllDone(true);
    setTimeout(() => setDownloadAllDone(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between bg-zinc-950/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Devpost Submission Kit
              </span>
              <span className="text-xs text-zinc-400 font-mono">Build With AI: Basics</span>
            </div>
            <h3 className="text-lg font-bold text-white">Devpost Planning Artifacts Pack</h3>
            <p className="text-xs text-zinc-400">
              The 3 required planning files (<code className="text-indigo-300 font-mono">scope.md</code>, <code className="text-indigo-300 font-mono">prd.md</code>, <code className="text-indigo-300 font-mono">spec.md</code>) ready to commit to your repository.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection & Actions Bar */}
        <div className="px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            {(['scope', 'prd', 'spec'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{fileContents[tab].filename}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurrent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            >
              {copiedFile === current.filename ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedFile === current.filename ? 'Copied File!' : `Copy ${current.filename}`}</span>
            </button>

            <button
              onClick={handleDownloadCurrent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
              title={`Download ${current.filename}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {current.filename}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              {downloadAllDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{downloadAllDone ? 'Downloaded All 3!' : 'Download All 3 Files'}</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-5 overflow-auto bg-zinc-950 font-mono text-xs leading-relaxed text-zinc-300 select-text">
          <pre className="whitespace-pre-wrap break-words">{current.content}</pre>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-zinc-950/80 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between px-5">
          <span>
            💡 <strong>Hackathon Tip:</strong> Commit these files to your public repo root to satisfy the Devpost Learn Skill Pack criteria.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
