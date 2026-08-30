import Link from 'next/link';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { TOOLS_REGISTRY } from '@/config/tools-registry';

interface TryToolProps {
  toolId: string;
  actionText?: string;
  explanation?: string;
  sampleInput?: string;
  className?: string;
}

export default function TryTool({
  toolId,
  actionText,
  explanation,
  sampleInput,
  className = '',
}: TryToolProps) {
  const tool = TOOLS_REGISTRY.find((t) => t.id === toolId);

  if (!tool) return null;

  const buttonLabel = actionText || `Open in ${tool.name}`;

  const toolUrl = sampleInput 
    ? `/tools/${tool.id}?input=${encodeURIComponent(sampleInput)}`
    : `/tools/${tool.id}`;

  return (
    <div className={`border-2 border-primary/40 bg-primary/5 p-4 space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Tool</span>
          </div>
          <h3 className="text-sm font-extrabold text-foreground">{tool.name}</h3>
        </div>

        <Link
          href={toolUrl}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shrink-0"
        >
          <span>{buttonLabel}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {explanation || tool.description}
      </p>

      {sampleInput && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Terminal className="h-3 w-3 text-primary" />
            <span>Preset Payload</span>
          </div>
          <pre className="p-2 bg-background border border-border font-mono text-[11px] overflow-auto max-h-24 whitespace-pre-wrap text-foreground">
            {sampleInput}
          </pre>
        </div>
      )}
    </div>
  );
}
