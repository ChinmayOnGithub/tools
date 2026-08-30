'use client';

import { useState } from 'react';
import { X, Check, Copy } from 'lucide-react';

interface DocsComparisonProps {
  invalidTitle?: string;
  invalidCode?: string;
  validTitle?: string;
  validCode: string;
  explanation?: string;
  language?: string;
  className?: string;
}

export default function DocsComparison({
  invalidTitle = 'Invalid',
  invalidCode,
  validTitle = 'Correct',
  validCode,
  explanation,
  className = '',
}: DocsComparisonProps) {
  const [copiedInvalid, setCopiedInvalid] = useState(false);
  const [copiedValid, setCopiedValid] = useState(false);

  const handleCopyInvalid = () => {
    if (!invalidCode) return;
    navigator.clipboard.writeText(invalidCode);
    setCopiedInvalid(true);
    setTimeout(() => setCopiedInvalid(false), 2000);
  };

  const handleCopyValid = () => {
    navigator.clipboard.writeText(validCode);
    setCopiedValid(true);
    setTimeout(() => setCopiedValid(false), 2000);
  };

  return (
    <div className={`space-y-2 my-4 ${className}`}>
      {explanation && (
        <p className="text-xs text-muted-foreground italic mb-2 font-medium">
          {explanation}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Invalid Side */}
        {invalidCode && (
          <div className="border-2 border-destructive/40 bg-destructive/5 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-destructive/10 border-b border-destructive/20 text-[10px] font-black uppercase tracking-wider text-destructive">
              <span className="flex items-center gap-1">
                <X className="h-3.5 w-3.5" />
                <span>{invalidTitle}</span>
              </span>
              <button
                onClick={handleCopyInvalid}
                className="text-muted-foreground hover:text-foreground text-[10px] font-bold inline-flex items-center gap-1"
                aria-label="Copy invalid snippet"
              >
                <Copy className="h-3 w-3" />
                <span>{copiedInvalid ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-foreground whitespace-pre">
              <code>{invalidCode}</code>
            </pre>
          </div>
        )}

        {/* Valid Side */}
        <div className={`border-2 border-emerald-500/40 bg-emerald-500/5 overflow-hidden ${!invalidCode ? 'md:col-span-2' : ''}`}>
          <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              <span>{validTitle}</span>
            </span>
            <button
              onClick={handleCopyValid}
              className="text-muted-foreground hover:text-foreground text-[10px] font-bold inline-flex items-center gap-1"
              aria-label="Copy valid snippet"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedValid ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-foreground whitespace-pre">
            <code>{validCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
