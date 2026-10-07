import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyPlaceholder } from './components/EmptyPlaceholder';
import { BacklogView } from './components/BacklogView';
import { ExportBar } from './components/ExportBar';
import { decomposeFeature } from './lib/gemini';
import { DecompositionResult } from './types/agile';
import { AlertCircle, RotateCcw, Code } from 'lucide-react';

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
            {/* Results Export Toolbar */}
            <ExportBar
              result={result}
              onReset={() => {
                setResult(null);
                setPromptText('');
              }}
            />

            {/* Dual Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="decomposition-results">
              {/* Left Column: Epics & Story Cards (60%) */}
              <div className="lg:col-span-7">
                <BacklogView result={result} />
              </div>

              {/* Right Column: Execution Sequence (40%) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>Execution Sequence Flow</span>
                  </h3>
                  <span className="text-[11px] text-zinc-500 font-mono">Mermaid.js</span>
                </div>

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
