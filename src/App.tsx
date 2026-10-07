import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyPlaceholder } from './components/EmptyPlaceholder';
import { decomposeFeature } from './lib/gemini';
import { DecompositionResult } from './types/agile';
import { AlertCircle, RotateCcw, CheckCircle, Code, Layers } from 'lucide-react';

export function App() {
  const [promptText, setPromptText] = useState('');
  const [result, setResult] = useState<DecompositionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('sprint_clarify_gemini_key') || '';
    setApiKey(storedKey);
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('sprint_clarify_gemini_key', key);
    setShowKeyModal(false);
  };

  const handleDecompose = async () => {
    if (!promptText.trim() || promptText.length < 10) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await decomposeFeature(promptText, apiKey);
      setResult(data);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to decompose feature request.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasApiKey = Boolean(apiKey || import.meta.env.VITE_GEMINI_API_KEY);

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col font-sans">
      <Header
        hasApiKey={hasApiKey}
        onOpenKeyModal={() => setShowKeyModal(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 flex items-start justify-between gap-3 text-rose-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Decomposition Failed</h4>
                <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={handleDecompose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Prompt Input Area */}
        <PromptInput
          promptText={promptText}
          setPromptText={setPromptText}
          onSubmit={handleDecompose}
          isLoading={isLoading}
        />

        {/* Content Display */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : result ? (
          <div className="space-y-6">
            {/* Results Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Decomposition Complete</h3>
                  <p className="text-xs text-zinc-400">{result.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                  {result.epics.length} Epics
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-mono">
                  {result.userStories.length} Stories
                </span>
              </div>
            </div>

            {/* Dual Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="decomposition-results">
              {/* Left Column: Epics & Stories */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Backlog Breakdown</span>
                  </h3>
                </div>

                {/* Epics Overview */}
                {result.epics.map((epic) => (
                  <div key={epic.id} className="p-4 rounded-xl bg-surface border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                        {epic.id}
                      </span>
                      <h4 className="text-sm font-semibold text-zinc-100">{epic.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{epic.objective}</p>
                  </div>
                ))}

                {/* User Stories Initial View (Slice 1 baseline) */}
                <div className="space-y-3">
                  {result.userStories.map((story) => (
                    <div key={story.id} className="p-4 rounded-xl bg-surface border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                            {story.id}
                          </span>
                          <span className="text-xs font-semibold text-zinc-200">{story.title}</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {story.complexity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 bg-zinc-950/50 p-2.5 rounded border border-zinc-800/80">
                        <span className="text-indigo-400 font-medium">As a </span>{story.asA}, <br/>
                        <span className="text-indigo-400 font-medium">I want </span>{story.iWant}, <br/>
                        <span className="text-indigo-400 font-medium">So that </span>{story.soThat}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Execution Sequence */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span>Execution Sequence Flow</span>
                </h3>

                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="bg-zinc-950/80 rounded-lg p-3 font-mono text-xs text-zinc-300 overflow-x-auto border border-zinc-800">
                    <pre className="whitespace-pre-wrap">{result.mermaidDiagram}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyPlaceholder onSelectStarter={(text) => setPromptText(text)} />
        )}
      </main>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-zinc-100">Configure Gemini API Key</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter your Google Gemini API key below. It will be stored in your browser's local storage for this session, or provide it via <code className="text-indigo-400 bg-zinc-900 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> in <code className="text-indigo-400 bg-zinc-900 px-1 py-0.5 rounded">.env.local</code>.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              defaultValue={apiKey}
              id="api-key-input"
              className="w-full bg-zinc-950 border border-border rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('api-key-input') as HTMLInputElement;
                  handleSaveKey(input?.value || '');
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
