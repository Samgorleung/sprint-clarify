import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { UserStory, Epic } from '../types/agile';
import { formatStoryMarkdown, copyToClipboard } from '../lib/markdownExporter';

interface StoryCardProps {
  story: UserStory;
  epic?: Epic;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, epic }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = formatStoryMarkdown(story, epic);
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const complexityColor = {
    S: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    M: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    L: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }[story.complexity] || 'bg-zinc-800 text-zinc-400 border-zinc-700';

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden transition-all hover:border-zinc-700 shadow-sm">
      {/* Header bar / Accordion trigger */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-surface hover:bg-zinc-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-inner">
            {story.id}
          </span>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
            {story.epicId}
          </span>
          <h4 className="text-sm font-semibold text-zinc-100 truncate">{story.title}</h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${complexityColor}`}>
            {story.complexity}
          </span>

          <button
            onClick={handleCopy}
            title="Copy Story Markdown for Jira/Linear"
            className="p-1.5 rounded-md hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-600"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
            aria-label={isExpanded ? 'Collapse story' : 'Expand story'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Story Body */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-border/40 text-xs">
          {/* User Story narrative */}
          <div className="mt-3 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 space-y-1">
            <div className="text-zinc-300">
              <span className="font-semibold text-indigo-400">As a </span>
              <span>{story.asA},</span>
            </div>
            <div className="text-zinc-300">
              <span className="font-semibold text-indigo-400">I want </span>
              <span>{story.iWant},</span>
            </div>
            <div className="text-zinc-300">
              <span className="font-semibold text-indigo-400">So that </span>
              <span>{story.soThat}</span>
            </div>
          </div>

          {/* Gherkin Acceptance Criteria */}
          <div className="space-y-2">
            <div className="font-medium text-zinc-300 flex items-center gap-1.5">
              <span>Acceptance Criteria (Gherkin):</span>
            </div>
            <div className="space-y-1.5 pl-1">
              {story.acceptanceCriteria.map((ac, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-300 leading-relaxed">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[11.5px] font-sans">{ac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies and Blocking Relationships */}
          {(story.dependsOn.length > 0 || story.blocks.length > 0) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/60">
              {story.dependsOn.length > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <span className="text-zinc-500 font-mono">Requires:</span>
                  {story.dependsOn.map((dep) => (
                    <span key={dep} className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 font-mono border border-zinc-700/80">
                      {dep}
                    </span>
                  ))}
                </div>
              )}

              {story.blocks.length > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-amber-400/90 ml-auto">
                  <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="font-mono">Blocks:</span>
                  {story.blocks.map((b) => (
                    <span key={b} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Technical Risks */}
          {story.technicalRisks.length > 0 && (
            <div className="pt-2 border-t border-zinc-800/60 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Technical Considerations & Risks:</span>
              </div>
              <div className="space-y-1">
                {story.technicalRisks.map((risk, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-amber-400/80 shrink-0 mt-0.5" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
