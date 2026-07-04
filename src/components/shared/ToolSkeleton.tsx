/**
 * ToolSkeleton
 * Structured shimmer skeleton that approximates the real tool card layout.
 * Used as the loading placeholder for all dynamically imported tool components.
 */
export function ToolSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full animate-pulse" aria-hidden="true">
      {/* Main card skeleton */}
      <div className="border-2 border-border bg-card p-6 space-y-5">
        {/* Card header */}
        <div className="space-y-2 pb-4 border-b border-border">
          <div className="h-5 w-48 bg-muted rounded-none" />
          <div className="h-3 w-72 bg-muted/60 rounded-none" />
        </div>

        {/* Input field skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-24 bg-muted/60 rounded-none" />
          <div className="h-10 w-full bg-muted rounded-none" />
        </div>

        {/* Secondary controls row */}
        <div className="flex gap-3">
          <div className="h-9 flex-1 bg-muted/50 rounded-none" />
          <div className="h-9 flex-1 bg-muted/50 rounded-none" />
        </div>

        {/* Content block */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="h-3 w-full bg-muted/40 rounded-none" />
          <div className="h-3 w-5/6 bg-muted/40 rounded-none" />
          <div className="h-3 w-4/6 bg-muted/40 rounded-none" />
        </div>

        {/* Action button skeleton */}
        <div className="h-11 w-full bg-primary/20 rounded-none" />
      </div>

      {/* FAQ card skeleton */}
      <div className="border-2 border-border bg-card p-4 space-y-3">
        <div className="h-3 w-40 bg-muted/60 rounded-none" />
        <div className="border-t border-border pt-3 space-y-2">
          <div className="h-3 w-56 bg-muted/50 rounded-none" />
          <div className="h-3 w-full bg-muted/30 rounded-none" />
        </div>
        <div className="border-t border-border pt-3 space-y-2">
          <div className="h-3 w-48 bg-muted/50 rounded-none" />
          <div className="h-3 w-5/6 bg-muted/30 rounded-none" />
        </div>
      </div>
    </div>
  );
}

export default ToolSkeleton;
