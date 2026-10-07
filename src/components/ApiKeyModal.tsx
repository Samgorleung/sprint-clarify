import React, { useState } from 'react';
import { Key, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';

interface ApiKeyModalProps {
  currentKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ currentKey, onSave, onClose }) => {
  const [key, setKey] = useState(currentKey);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Configure Google Gemini API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          SprintClarify directly uses the Google Gen AI SDK in your browser. You can store your API key in browser storage here, or set <code className="text-indigo-400 bg-zinc-900 px-1 py-0.5 rounded font-mono">VITE_GEMINI_API_KEY</code> in <code className="text-indigo-400 bg-zinc-900 px-1 py-0.5 rounded font-mono">.env.local</code>.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Gemini API Key</label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-zinc-950 border border-border rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 flex items-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Keys are stored solely in your local browser and never sent to a third-party server.
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={() => {
              setKey('');
              onSave('');
            }}
            className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
          >
            Clear Stored Key
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(key)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
