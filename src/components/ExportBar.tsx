import React, { useState } from 'react';
import { Copy, Download, Check, RotateCcw, FileText, Code2, AlertTriangle } from 'lucide-react';
import { DecompositionResult } from '../types/agile';
import { formatSprintBacklogMarkdown, copyToClipboard } from '../lib/markdownExporter';

interface ExportBarProps {
  result: DecompositionResult;
  onReset: () => void;
}

export const ExportBar: React.FC<ExportBarProps> = ({ result, onReset }) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const totalRisks = result.userStories.reduce((acc, s) => acc + s.technicalRisks.length, 0);

  const handleCopyMarkdown = async () => {
    const md = formatSprintBacklogMarkdown(result);
    const success = await copyToClipboard(md);
    if (success) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2500);
    }
  };

  const handleCopyJson = async () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const success = await copyToClipboard(jsonStr);
    if (success) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprintclarify-backlog-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 rounded-xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
      {/* Metrics / Badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>{result.epics.length} Epics</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700">
          <span>{result.userStories.length} User Stories</span>
        </div>

        {totalRisks > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{totalRisks} Technical Risks</span>
          </div>
        )}
      </div>

      {/* Global Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
        <button
          onClick={handleCopyMarkdown}
          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-sm"
        >
          {copiedMd ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedMd ? 'Copied Backlog Markdown!' : 'Export All Markdown'}</span>
        </button>

        <button
          onClick={handleCopyJson}
          className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium border border-zinc-700 transition-colors"
          title="Copy raw JSON payload to clipboard"
        >
          {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copiedJson ? 'JSON Copied!' : 'Copy JSON'}</span>
        </button>

        <button
          onClick={handleDownloadJson}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
          title="Download JSON file"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onReset}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700 transition-colors ml-auto md:ml-0"
          title="Start fresh with a new requirement"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
