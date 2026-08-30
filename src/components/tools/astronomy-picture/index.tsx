'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, ExternalLink, Calendar } from 'lucide-react';
import { LiveStatusHeader, LiveErrorBanner } from '@/components/shared/LiveToolComponents';
import { fetchLiveApod, NASA_APOD_PROVIDER, ApodData } from './utils';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';

export default function AstronomyPicture() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApodData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const executeFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchLiveApod();
    setLoading(false);
    if (res.error) {
      setError(res.error);
      setData(null);
    } else {
      setData(res.data);
      if (res.lastUpdated) setLastUpdated(res.lastUpdated);
      trackToolCompletion('astronomy-picture');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('astronomy-picture');
      executeFetch();
    }, 0);
    return () => clearTimeout(timer);
  }, [executeFetch]);

  if (!mounted) return <div className="animate-pulse bg-muted h-64 border border-border" />;

  return (
    <div className="space-y-6 w-full">
      {/* Live Status & Provider Bar */}
      <LiveStatusHeader
        provider={NASA_APOD_PROVIDER}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={executeFetch}
      />

      {/* Error state */}
      {error && <LiveErrorBanner error={error} onRetry={executeFetch} />}

      {/* APOD Main Showcase Card */}
      {data && (
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                <h2 className="text-xl font-black text-foreground">{data.title}</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Date: {data.date}</span>
                {data.copyright && <span>· Copyright: {data.copyright}</span>}
              </div>
            </div>

            {data.hdurl && (
              <a
                href={data.hdurl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-border bg-muted/40 text-xs font-bold hover:border-primary hover:text-primary transition-colors shrink-0"
              >
                <span>View Full HD (NASA)</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Media View (Image or Video) */}
          <div className="relative border-2 border-border bg-black overflow-hidden flex items-center justify-center min-h-[320px]">
            {data.media_type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.url}
                alt={data.title}
                className="max-h-[600px] w-full object-contain"
              />
            ) : (
              <iframe
                src={data.url}
                title={data.title}
                className="w-full h-96 border-none"
                allowFullScreen
              />
            )}
          </div>

          {/* Astrophysical Explanation */}
          <div className="p-5 bg-muted/20 border border-border space-y-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-bold text-foreground block text-sm">Astrophysical Context &amp; Explanation</span>
            <p>{data.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
