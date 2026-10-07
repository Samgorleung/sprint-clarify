import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyPlaceholder } from './components/EmptyPlaceholder';
import { BacklogView } from './components/BacklogView';
import { DependencyMatrix } from './components/DependencyMatrix';
import { ExportBar } from './components/ExportBar';
import { ErrorBanner } from './components/ErrorBanner';
import { ApiKeyModal } from './components/ApiKeyModal';
import { decomposeFeature } from './lib/gemini';
import { DecompositionResult } from './types/agile';

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
        {/* Error Banner with Retry */}
        {error && (
          <ErrorBanner
            error={error}
            onRetry={handleDecompose}
            onDismiss={() => setError(null)}
          />
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
                setError(null);
              }}
            />

            {/* Dual Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="decomposition-results">
              {/* Left Column: Epics & Story Cards (60%) */}
              <div className="lg:col-span-7">
                <BacklogView result={result} />
              </div>

              {/* Right Column: Dependency Matrix & Mermaid Flow (40%) */}
              <div className="lg:col-span-5">
                <DependencyMatrix result={result} />
              </div>
            </div>
          </div>
        ) : (
          <EmptyPlaceholder onSelectStarter={(text) => setPromptText(text)} />
        )}
      </main>

      {/* API Key Modal */}
      {showKeyModal && (
        <ApiKeyModal
          currentKey={apiKey}
          onSave={handleSaveKey}
          onClose={() => setShowKeyModal(false)}
        />
      )}
    </div>
  );
}

export default App;
