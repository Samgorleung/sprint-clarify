import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Bot,
  CheckCircle2,
} from 'lucide-react';
import { UserStory, Epic } from '../types/agile';
import { formatStoryMarkdown, copyToClipboard } from '../lib/markdownExporter';
import { generateAgentSlicePrompt } from '../lib/agentPromptGenerator';
import { GherkinCriterion } from './GherkinCriterion';

interface StoryCardProps {
  story: UserStory;
  epic?: Epic;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, epic }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedAgent, setCopiedAgent] = useState(false);
  const [showAgentPreview, setShowAgentPreview] = useState(false);
  const [verifiedIndices, setVerifiedIndices] = useState<Set<number>>(new Set());

  const handleCopyMarkdown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = formatStoryMarkdown(story, epic);
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  const handleCopyAgentPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = generateAgentSlicePrompt(story, epic);
    const success = await copyToClipboard(prompt);
    if (success) {
      setCopiedAgent(true);
      setTimeout(() => setCopiedAgent(false), 2000);
    }
  };

  const toggleCriterion = (index: number) => {
    setVerifiedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const complexityColor = {
    S: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    M: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    L: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }[story.complexity] || 'bg-zinc-800 text-zinc-400 border-zinc-700';

  const verifiedCount = verifiedIndices.size;
  const totalCriteria = story.acceptanceCriteria.length;
  const isFullyVerified = totalCriteria > 0 && verifiedCount === totalCriteria;

  const agentPrompt = generateAgentSlicePrompt(story, epic);

  return (
    <div className={`bg-surface border rounded-xl overflow-hidden transition-all shadow-sm ${
      isFullyVerified ? 'border-emerald-500/40' : 'border-border hover:border-zinc-700'
    }`}>
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

          {/* Verification badge */}
          {verifiedCount > 0 && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold border ${
              isFullyVerified
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>{isFullyVerified ? 'All Criteria Verified' : `${verifiedCount}/${totalCriteria} Verified`}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${complexityColor}`}>
            {story.complexity}
          </span>

          {/* Copy Prompt for Coding Agent */}
          <button
            onClick={handleCopyAgentPrompt}
            title="Copy Context-Locked Prompt for Claude Code, Cursor, or Codex (with negative constraints)"
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors border ${
              copiedAgent
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 hover:text-white border-indigo-500/30'
            }`}
          >
            {copiedAgent ? <Check className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedAgent ? 'Agent Prompt Copied!' : 'Agent Prompt'}</span>
          </button>

          {/* Copy Jira/Linear Markdown */}
          <button
            onClick={handleCopyMarkdown}
            title="Copy Story Markdown for Jira/Linear"
            className="p-1.5 rounded-md hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-600"
          >
            {copiedMd ? (
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

          {/* Gherkin Acceptance Criteria with Syntax Highlighting and Interactive Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="font-medium flex items-center gap-1.5">
                <span>Acceptance Criteria (Gherkin):</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                Click criterion to mark verified ({verifiedCount}/{totalCriteria})
              </span>
            </div>

            <div className="space-y-2">
              {story.acceptanceCriteria.map((ac, idx) => (
                <GherkinCriterion
                  key={idx}
                  criterion={ac}
                  isVerified={verifiedIndices.has(idx)}
                  onToggle={() => toggleCriterion(idx)}
                />
              ))}
            </div>
          </div>

          {/* Agent Prompt Drawer Toggle */}
          <div className="pt-2 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAgentPreview(!showAgentPreview);
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{showAgentPreview ? 'Hide AI Agent Prompt' : 'View AI Agent Prompt with Negative Constraints'}</span>
            </button>

            {showAgentPreview && (
              <div className="mt-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono leading-relaxed text-zinc-300 space-y-2">
                <div className="flex items-center justify-between text-zinc-400 pb-1.5 border-b border-zinc-800">
                  <span className="font-semibold text-indigo-300">Prompt for Claude Code / Cursor / Codex</span>
                  <button
                    onClick={handleCopyAgentPrompt}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1"
                  >
                    {copiedAgent ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAgent ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap select-text text-zinc-300 max-h-48 overflow-y-auto">
                  {agentPrompt}
                </pre>
              </div>
            )}
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
