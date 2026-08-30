'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Check, X, ArrowRight, Copy } from 'lucide-react';
import { GuideExample } from '@/config/guides-data';
import { trackCopyAction, trackRelatedToolClick } from '@/lib/analytics';

interface InteractiveExampleRunnerProps {
  examples: GuideExample[];
  toolId: string;
  toolName?: string;
}

export default function InteractiveExampleRunner({
  examples,
  toolId,
  toolName = 'Interactive Tool',
}: InteractiveExampleRunnerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!examples || examples.length === 0) return null;

  const current = examples[activeIdx];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    trackCopyAction(toolId);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    trackRelatedToolClick('guide_example', toolId);
  };

  const targetInput = current.invalid || current.validFix;
  const toolUrl = `/tools/${toolId}?input=${encodeURIComponent(targetInput)}`;

  return (
    <div className="bg-card border-2 border-border p-5 sm:p-6 card-depth-1 space-y-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {examples.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`px-3 py-1.5 text-xs font-bold transition-all border ${
              activeIdx === idx
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-foreground">{current.title}</h3>

        {current.reason && (
          <div className="p-3 bg-muted/20 border border-border text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground block mb-0.5">Why this matters:</strong>
            {current.reason}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Invalid (if present) */}
          {current.invalid && (
            <div className="space-y-2 border-2 border-destructive/30 bg-destructive/5 p-3.5">
              <div className="flex items-center justify-between text-destructive font-black text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <X className="h-3.5 w-3.5" />
                  <span>Invalid / Broken Example</span>
                </span>
                <button
                  onClick={() => handleCopy(current.invalid!)}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[10px]"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-2.5 bg-background border border-destructive/20 font-mono text-[11px] overflow-auto max-h-48 whitespace-pre-wrap text-foreground">
                {current.invalid}
              </pre>
            </div>
          )}

          {/* Valid Fix */}
          <div className={`space-y-2 border-2 border-emerald-500/30 bg-emerald-500/5 p-3.5 ${!current.invalid ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-black text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                <span>Valid / Correct Fix</span>
              </span>
              <button
                onClick={() => handleCopy(current.validFix)}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[10px]"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-background border border-emerald-500/20 font-mono text-[11px] overflow-auto max-h-48 whitespace-pre-wrap text-foreground">
              {current.validFix}
            </pre>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
        <span className="text-[11px] text-muted-foreground">
          Test this specific snippet live in browser memory:
        </span>
        <Link
          href={toolUrl}
          onClick={handleLaunch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-sm shrink-0"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Load Example in {toolName}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
