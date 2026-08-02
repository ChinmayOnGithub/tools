'use client';

import { PrivacyBadge } from './PrivacyBadge';

interface ToolHeaderProps {
  title: string;
  description: string;
  categoryColorBar?: string;
  categoryBadgeClass?: string;
  githubUrl?: string;
}

export function ToolHeader({ 
  title, 
  description, 
  categoryColorBar = 'bg-primary', 
  categoryBadgeClass,
  githubUrl 
}: ToolHeaderProps) {
  return (
    <section className="relative bg-card border border-border p-6 card-depth-1 overflow-hidden space-y-3">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${categoryColorBar}`} />
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
        
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-muted-foreground hover:text-primary border border-border bg-muted/20 px-3 py-1.5 transition-all rounded-none self-start shrink-0"
          >
            [View Source on GitHub]
          </a>
        )}
      </div>

      <PrivacyBadge className="pt-1" badgeClassName={categoryBadgeClass} />
    </section>
  );
}

export default ToolHeader;
