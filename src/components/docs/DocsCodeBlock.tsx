'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface DocsCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export default function DocsCodeBlock({
  code,
  language = 'text',
  title,
  className = '',
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border-2 border-border bg-card overflow-hidden font-mono text-xs my-4 ${className}`}>
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-muted/40 border-b border-border text-[11px]">
        <span className="font-bold text-muted-foreground uppercase tracking-wider">
          {title || language}
        </span>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 px-2 py-1 bg-background border border-border text-foreground hover:border-primary hover:text-primary transition-colors text-[10px] font-bold"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed text-foreground whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
