import React from 'react';
import { Check } from 'lucide-react';

interface GherkinCriterionProps {
  criterion: string;
  isVerified: boolean;
  onToggle: () => void;
}

interface ParsedToken {
  keyword: 'Given' | 'When' | 'Then' | 'And' | 'But' | null;
  text: string;
}

export const GherkinCriterion: React.FC<GherkinCriterionProps> = ({
  criterion,
  isVerified,
  onToggle,
}) => {
  // Parse Gherkin keywords
  const parseGherkin = (text: string): ParsedToken[] => {
    const regex = /\b(Given|When|Then|And|But)\b/gi;
    const parts: ParsedToken[] = [];
    let lastIndex = 0;
    let currentKeyword: 'Given' | 'When' | 'Then' | 'And' | 'But' | null = null;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const segment = text.substring(lastIndex, match.index).trim();
        if (segment) {
          parts.push({ keyword: currentKeyword, text: segment });
        }
      }
      const rawKeyword = match[1].toLowerCase();
      currentKeyword = (rawKeyword.charAt(0).toUpperCase() + rawKeyword.slice(1)) as
        | 'Given'
        | 'When'
        | 'Then'
        | 'And'
        | 'But';
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex).trim();
      if (remaining) {
        parts.push({ keyword: currentKeyword, text: remaining });
      }
    }

    // Fallback if no keywords were parsed
    if (parts.length === 0) {
      return [{ keyword: null, text }];
    }

    return parts;
  };

  const tokens = parseGherkin(criterion);

  const getKeywordBadgeStyle = (kw: string) => {
    switch (kw) {
      case 'Given':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'When':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Then':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'And':
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'But':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div
      onClick={onToggle}
      className={`group flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${
        isVerified
          ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-300'
          : 'bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 border-zinc-800/80 text-zinc-300'
      }`}
    >
      {/* Verification checkbox button */}
      <button
        type="button"
        aria-label={isVerified ? 'Mark criterion unverified' : 'Mark criterion verified'}
        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
          isVerified
            ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm shadow-emerald-500/40'
            : 'border-zinc-600 group-hover:border-indigo-400 bg-zinc-950/80 text-transparent'
        }`}
      >
        <Check className="w-3 h-3 stroke-[3]" />
      </button>

      {/* Formatted tokens */}
      <div className={`text-[12px] leading-relaxed flex-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 ${
        isVerified ? 'line-through text-zinc-400 opacity-80' : ''
      }`}>
        {tokens.map((token, idx) => (
          <span key={idx} className="inline-flex items-center gap-1.5">
            {token.keyword && (
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getKeywordBadgeStyle(
                  token.keyword
                )}`}
              >
                {token.keyword}
              </span>
            )}
            <span className="text-zinc-200">{token.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
