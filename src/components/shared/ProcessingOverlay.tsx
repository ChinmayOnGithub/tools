'use client';

import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingOverlayProps {
  /** Primary message shown while processing */
  message?: string;
  className?: string;
}

/**
 * Canonical inline processing spinner shown inside an OutputPanel while a
 * file operation is in progress. Replaces the repeated RefreshCw + muted
 * panel block across image/PDF tools.
 */
export default function ProcessingOverlay({
  message = 'Processing…',
  className,
}: ProcessingOverlayProps) {
  return (
    <div
      className={cn(
        'bg-muted/30 border border-border p-5 text-center space-y-3 rounded-none',
        className
      )}
    >
      <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto" />
      <p className="text-xs font-bold text-foreground">{message}</p>
    </div>
  );
}
