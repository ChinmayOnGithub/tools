import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DocsPaginationProps {
  prev?: { title: string; slug: string };
  next?: { title: string; slug: string };
}

export default function DocsPagination({ prev, next }: DocsPaginationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 mt-12 border-t-2 border-border"
      aria-label="Documentation Pagination"
    >
      {prev ? (
        <Link
          href={`/guides/${prev.slug}`}
          className="p-4 border-2 border-border bg-card hover:border-primary group transition-all"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
            <span>Previous</span>
          </span>
          <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors block truncate">
            {prev.title}
          </span>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={`/guides/${next.slug}`}
          className="p-4 border-2 border-border bg-card hover:border-primary group transition-all text-right sm:col-start-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1 mb-1">
            <span>Next</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors block truncate">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
