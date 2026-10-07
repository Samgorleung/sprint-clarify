import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { GitBranch, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/markdownExporter';

interface MermaidVisualizerProps {
  chart: string;
}

// Initialize mermaid once with dark theme configuration
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#18181b',
    primaryColor: '#6366f1',
    primaryTextColor: '#f4f4f5',
    primaryBorderColor: '#4f46e5',
    lineColor: '#818cf8',
    secondaryColor: '#27272a',
    tertiaryColor: '#09090b',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
  },
});

export const MermaidVisualizer: React.FC<MermaidVisualizerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart || !chart.trim()) {
        setSvgContent(null);
        setError('No diagram syntax provided.');
        return;
      }

      setError(null);
      const uniqueId = `mermaid-svg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      try {
        // Clean chart string if model enclosed it in markdown backticks
        let cleaned = chart.trim();
        if (cleaned.startsWith('```mermaid')) {
          cleaned = cleaned.replace(/^```mermaid\s*/, '').replace(/```$/, '').trim();
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
        }

        const { svg } = await mermaid.render(uniqueId, cleaned);
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: unknown) {
        console.warn('Mermaid rendering failed, using fallback display:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Invalid Mermaid syntax generated.');
          setSvgContent(null);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, renderCount]);

  const handleCopyChart = async () => {
    const success = await copyToClipboard(chart);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-semibold text-zinc-200">Execution Sequence Flow</h4>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRenderCount((c) => c + 1)}
            title="Re-render diagram"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopyChart}
            title="Copy Mermaid syntax"
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Area */}
      {error ? (
        <div className="space-y-3 bg-zinc-950/80 p-4 rounded-lg border border-amber-500/20">
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Mermaid Render Notice (Syntax Fallback)</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            The generated dependency sequence could not be compiled into an SVG layout, but raw flow syntax is preserved below:
          </p>
          <pre className="p-3 bg-zinc-900 rounded text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap">
            {chart}
          </pre>
        </div>
      ) : svgContent ? (
        <div
          ref={containerRef}
          className="overflow-x-auto py-2 flex items-center justify-center min-h-[180px] bg-zinc-950/40 rounded-lg p-2 border border-zinc-800/40"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="flex items-center justify-center h-32 text-xs text-zinc-500 font-mono">
          Compiling execution graph...
        </div>
      )}
    </div>
  );
};
