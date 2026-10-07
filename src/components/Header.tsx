import React from 'react';
import { Layers, Key, Sparkles } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  onOpenKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasApiKey, onOpenKeyModal }) => {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">SprintClarify</span>
              <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                PoC v0.1
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Decompose ambiguous requests into verified Agile backlogs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors ${
              hasApiKey
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasApiKey ? 'Gemini API: Ready' : 'Configure API Key'}</span>
          </button>

          <div className="flex items-center gap-1 text-xs text-zinc-400 border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 rounded-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>
    </header>
  );
};
