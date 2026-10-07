import React from 'react';
import { Layers, Bookmark } from 'lucide-react';
import { DecompositionResult, Epic } from '../types/agile';
import { StoryCard } from './StoryCard';

interface BacklogViewProps {
  result: DecompositionResult;
}

export const BacklogView: React.FC<BacklogViewProps> = ({ result }) => {
  const epicMap = new Map<string, Epic>();
  result.epics.forEach((e) => epicMap.set(e.id, e));

  return (
    <div className="space-y-5">
      {/* Column Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Agile Backlog Breakdown</span>
        </h3>
        <span className="text-xs text-zinc-500 font-mono">
          {result.userStories.length} stories across {result.epics.length} epics
        </span>
      </div>

      {/* Epics Milestone Cards */}
      <div className="space-y-3">
        {result.epics.map((epic) => (
          <div
            key={epic.id}
            className="p-4 rounded-xl bg-gradient-to-br from-surface to-zinc-900 border border-indigo-500/20 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold flex items-center gap-1">
                <Bookmark className="w-3 h-3" />
                {epic.id}
              </span>
              <h4 className="text-sm font-semibold text-zinc-100">{epic.title}</h4>
            </div>
            <p className="text-xs text-zinc-400 pl-1 leading-relaxed">{epic.objective}</p>
          </div>
        ))}
      </div>

      {/* User Stories Accordion List */}
      <div className="space-y-3">
        {result.userStories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            epic={epicMap.get(story.epicId)}
          />
        ))}
      </div>
    </div>
  );
};
