'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { trackRelatedToolClick } from '@/lib/analytics';

interface TryToolProps {
  toolId: string;
  actionText?: string;
  explanation?: string;
  sampleInput?: string;
  className?: string;
}

export default function TryTool({
  toolId,
  actionText = 'Open in Tool',
  explanation,
  sampleInput,
  className = '',
}: TryToolProps) {
  const tool = TOOLS_REGISTRY.find((t) => t.id === toolId);

  if (!tool) return null;

  const handleLaunch = () => {
    trackRelatedToolClick('guide', toolId);
  };

  const toolUrl = sampleInput 
    ? `/tools/${tool.id}?input=${encodeURIComponent(sampleInput)}`
    : `/tools/${tool.id}`;

  return (
    <div className={`border-2 border-primary/40 bg-primary/5 p-5 card-depth-1 space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-primary/20">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Browser Tool</span>
          </div>
          <h3 className="text-base font-extrabold text-foreground">{tool.name}</h3>
        </div>

        <Link
          href={toolUrl}
          onClick={handleLaunch}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shrink-0 shadow-sm"
        >
          <span>{actionText}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {explanation || tool.description}
      </p>

      {sampleInput && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Terminal className="h-3 w-3 text-primary" />
            <span>Preloaded Example Payload</span>
          </div>
          <pre className="p-2.5 bg-background border border-border font-mono text-[11px] overflow-auto max-h-28 whitespace-pre-wrap text-foreground">
            {sampleInput}
          </pre>
        </div>
      )}
    </div>
  );
}
