import React from 'react';
import { GitCommit, ArrowRight, ShieldAlert } from 'lucide-react';
import { DecompositionResult } from '../types/agile';
import { MermaidVisualizer } from './MermaidVisualizer';

interface DependencyMatrixProps {
  result: DecompositionResult;
}

export const DependencyMatrix: React.FC<DependencyMatrixProps> = ({ result }) => {
  // Extract stories with dependencies or blocking relationships
  const relatedStories = result.userStories.filter(
    (s) => s.dependsOn.length > 0 || s.blocks.length > 0 || s.technicalRisks.length > 0
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-emerald-400" />
          <span>Dependency Matrix & Flow</span>
        </h3>
        <span className="text-xs text-zinc-500 font-mono">
          {relatedStories.length} linked nodes
        </span>
      </div>

      {/* Mermaid Sequence Flowchart */}
      <MermaidVisualizer chart={result.mermaidDiagram} />

      {/* Directional Dependency Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>Directional Story Relationships</span>
        </h4>

        {relatedStories.length === 0 ? (
          <div className="p-4 rounded-xl bg-surface border border-border text-center text-xs text-zinc-500">
            No cross-story dependencies or blocking constraints detected.
          </div>
        ) : (
          relatedStories.map((story) => (
            <div
              key={story.id}
              className="p-3.5 rounded-xl bg-surface border border-border space-y-2.5 shadow-sm hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                    {story.id}
                  </span>
                  <span className="text-xs font-semibold text-zinc-200 truncate max-w-[200px]">
                    {story.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {story.complexity}
                </span>
              </div>

              {/* Badges for requires and blocks */}
              <div className="flex flex-col gap-1.5 pt-1 text-[11px]">
                {story.dependsOn.length > 0 && (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-zinc-500 font-mono text-[10px]">Depends on:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {story.dependsOn.map((dep) => (
                        <span
                          key={dep}
                          className="px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono border border-indigo-900/60"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {story.blocks.length > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-400/90">
                    <span className="text-zinc-500 font-mono text-[10px]">Blocks:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {story.blocks.map((blk) => (
                        <span
                          key={blk}
                          className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20 flex items-center gap-1"
                        >
                          <ArrowRight className="w-2.5 h-2.5" />
                          {blk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {story.technicalRisks.length > 0 && (
                  <div className="flex items-start gap-1 text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/40">
                    <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 text-zinc-400">{story.technicalRisks[0]}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
