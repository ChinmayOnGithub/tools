'use client';

import { ExternalLink, RefreshCw, AlertCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LiveStatusHeaderProps {
  provider: {
    name: string;
    url: string;
    privacyNote?: string;
  };
  lastUpdated?: string;
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function LiveStatusHeader({
  provider,
  lastUpdated,
  loading = false,
  onRefresh,
  className = '',
}: LiveStatusHeaderProps) {
  return (
    <div className={`p-3 bg-muted/20 border-2 border-border flex flex-wrap items-center justify-between gap-3 text-xs ${className}`}>
      {/* Live Badge + Provider */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          Live Data
        </span>
        <span className="text-muted-foreground text-[11px]">
          Source:{' '}
          <a
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground hover:text-primary hover:underline inline-flex items-center gap-0.5"
          >
            {provider.name}
            <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-70" />
          </a>
        </span>
      </div>

      {/* Last updated & refresh action */}
      <div className="flex items-center gap-3">
        {lastUpdated && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Updated: {lastUpdated}</span>
          </div>
        )}
        {onRefresh && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={loading}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Fetching...' : 'Refresh'}
          </Button>
        )}
      </div>

      {/* Privacy disclaimer callout if specified */}
      {provider.privacyNote && (
        <div className="w-full pt-1.5 border-t border-border/30 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Shield className="h-3 w-3 text-primary shrink-0" />
          <span>{provider.privacyNote}</span>
        </div>
      )}
    </div>
  );
}

interface LiveErrorBannerProps {
  error: string;
  onRetry?: () => void;
}

export function LiveErrorBanner({ error, onRetry }: LiveErrorBannerProps) {
  return (
    <div className="p-4 border-2 border-destructive/30 bg-destructive/5 flex items-start justify-between gap-3 text-xs">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-destructive block">Data Fetch Error</span>
          <p className="text-muted-foreground leading-relaxed">{error}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="shrink-0 text-xs font-bold border-destructive/40 hover:bg-destructive/10"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
