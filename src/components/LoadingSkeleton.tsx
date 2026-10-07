import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      {/* Left Column Skeleton (60%) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Epic Card Skeleton */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-20 bg-zinc-800 rounded"></div>
            <div className="h-5 w-48 bg-zinc-800 rounded"></div>
          </div>
          <div className="h-4 w-full bg-zinc-800/60 rounded"></div>
        </div>

        {/* Story Card Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-zinc-800 rounded"></div>
                <div className="h-5 w-52 bg-zinc-800 rounded"></div>
              </div>
              <div className="h-5 w-8 bg-zinc-800 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-zinc-800/40 rounded"></div>
              <div className="h-3.5 w-4/5 bg-zinc-800/40 rounded"></div>
            </div>
            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <div className="h-3 w-1/3 bg-zinc-800 rounded"></div>
              <div className="h-3 w-5/6 bg-zinc-800/50 rounded"></div>
              <div className="h-3 w-4/6 bg-zinc-800/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column Skeleton (40%) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Mermaid Diagram Skeleton */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="h-5 w-36 bg-zinc-800 rounded"></div>
          <div className="h-64 bg-zinc-950/60 rounded-lg flex items-center justify-center border border-zinc-800/50">
            <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-indigo-500/40 border-t-indigo-500 rounded-full animate-spin" />
              Synthesizing dependency flow...
            </div>
          </div>
        </div>

        {/* Dependency Cards Skeleton */}
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-zinc-800 rounded"></div>
              <div className="h-4 w-14 bg-zinc-800 rounded"></div>
            </div>
            <div className="h-3 w-full bg-zinc-800/40 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
