import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { GUIDES_ARTICLES } from '@/config/guides-data';

interface RelatedGuidesListProps {
  toolId: string;
  className?: string;
  maxItems?: number;
}

export default function RelatedGuidesList({
  toolId,
  className = '',
  maxItems = 3,
}: RelatedGuidesListProps) {
  // Find guides where this tool is either the primary tool or related
  const relevantGuides = GUIDES_ARTICLES.filter(
    (g) => g.primaryToolId === toolId || g.relatedToolIds.includes(toolId)
  ).slice(0, maxItems);

  if (relevantGuides.length === 0) return null;

  return (
    <div className={`bg-card border-2 border-border p-5 card-depth-1 space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
            Learn More: Problem Guides &amp; RFC Standards
          </h2>
        </div>
        <Link
          href="/guides"
          className="text-[11px] font-bold text-primary hover:underline"
        >
          View all guides →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {relevantGuides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.slug}`}
            className="group block p-3 bg-muted/20 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5">
                    {guide.clusterName}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{guide.readTime}</span>
                </div>
                <h3 className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {guide.shortDescription}
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
