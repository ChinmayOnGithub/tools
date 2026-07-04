import { ToolSkeleton } from '@/components/shared/ToolSkeleton';

/**
 * Next.js route-level loading UI.
 * Displayed during RSC streaming / page transitions.
 */
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6" aria-live="polite">
      {/* Page heading skeleton */}
      <div className="animate-pulse space-y-3 pb-6 border-b-2 border-border">
        <div className="h-4 w-32 bg-muted/60 rounded-none" />
        <div className="h-8 w-64 bg-muted rounded-none" />
        <div className="h-3 w-96 bg-muted/40 rounded-none" />
      </div>

      {/* Tool workspace skeleton */}
      <ToolSkeleton />

      <span className="sr-only">Loading tool, please wait…</span>
    </div>
  );
}
