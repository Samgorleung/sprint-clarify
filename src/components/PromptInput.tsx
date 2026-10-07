import React from 'react';
import { Send, Sparkles, Wand2 } from 'lucide-react';
import { STARTER_PROMPTS } from '../lib/starterPrompts';

interface PromptInputProps {
  promptText: string;
  setPromptText: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  promptText,
  setPromptText,
  onSubmit,
  isLoading,
}) => {
  const isSubmitDisabled = promptText.trim().length < 10 || isLoading;

  const handleSelectStarter = (prompt: string) => {
    setPromptText(prompt);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-zinc-200 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-indigo-400" />
          <span>Feature Request or Business Goal</span>
        </label>
        <span className="text-xs text-zinc-500 font-mono">
          {promptText.length} characters {promptText.length < 10 && '(min 10)'}
        </span>
      </div>

      <div className="relative">
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Paste an ambiguous stakeholder request, PRD fragment, or feature idea here... (e.g. 'Add biometric FaceID login to mobile app with keychain fallback and PIN reset')"
          rows={3}
          disabled={isLoading}
          className="w-full bg-zinc-950/70 border border-border rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all disabled:opacity-60"
        />
      </div>

      {/* Starter Prompts */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            Quick Starters:
          </span>
          {STARTER_PROMPTS.map((starter) => (
            <button
              key={starter.id}
              onClick={() => handleSelectStarter(starter.prompt)}
              disabled={isLoading}
              title={starter.description}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 transition-all hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              {starter.title}
            </button>
          ))}
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Decomposing Requirements...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Clarify & Decompose</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
