import React from 'react';
import { Layers, ArrowDownCircle, CheckCircle2, GitBranch, Terminal } from 'lucide-react';
import { STARTER_PROMPTS } from '../lib/starterPrompts';

interface EmptyPlaceholderProps {
  onSelectStarter: (prompt: string) => void;
}

export const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({ onSelectStarter }) => {
  return (
    <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-8 sm:p-12 text-center bg-zinc-950/40">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-semibold text-zinc-100">Ready to Clarify Sprint Requirements</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Paste an ambiguous business feature or select a starter prompt above. SprintClarify enforces strict Gemini <code className="text-indigo-400 bg-zinc-900 px-1 py-0.5 rounded font-mono text-xs">responseSchema</code> to decompose requests into Jira-ready epics, Gherkin user stories, and execution dependencies.
        </p>

        {/* Feature pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
          <div className="p-3 rounded-lg bg-surface/60 border border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gherkin Acceptance</span>
            </div>
            <p className="text-[11px] text-zinc-400">Strict Given/When/Then scenarios generated for every story.</p>
          </div>

          <div className="p-3 rounded-lg bg-surface/60 border border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 mb-1">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dependency Matrix</span>
            </div>
            <p className="text-[11px] text-zinc-400">Identifies prerequisites and renders dynamic Mermaid sequence flows.</p>
          </div>

          <div className="p-3 rounded-lg bg-surface/60 border border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 mb-1">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Zero-Fluff Export</span>
            </div>
            <p className="text-[11px] text-zinc-400">1-click Markdown export optimized for Jira and Linear tickets.</p>
          </div>
        </div>

        {/* Quick starter cards */}
        <div className="pt-6">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>Or try one of these real-world examples</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {STARTER_PROMPTS.map((starter) => (
              <button
                key={starter.id}
                onClick={() => onSelectStarter(starter.prompt)}
                className="p-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 hover:border-indigo-500/40 text-left transition-all group"
              >
                <div className="text-xs font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
                  {starter.title}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                  {starter.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
