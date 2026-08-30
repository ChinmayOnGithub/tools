'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Globe2, Users, Compass, Languages, Coins, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LiveStatusHeader, LiveErrorBanner } from '@/components/shared/LiveToolComponents';
import { fetchLiveCountry, COUNTRIES_PROVIDER, CountryProfile } from './utils';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';
import t from './locales/en.json';

const POPULAR_COUNTRIES = ['Canada', 'Japan', 'Germany', 'Australia', 'Brazil', 'India'];

export default function CountryInfo() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('Japan');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CountryProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const executeSearch = useCallback(async (targetCountry: string) => {
    if (!targetCountry.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetchLiveCountry(targetCountry);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      setData(null);
    } else {
      setData(res.data);
      if (res.lastUpdated) setLastUpdated(res.lastUpdated);
      trackToolCompletion('country-info');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('country-info');
      executeSearch('Japan');
    }, 0);
    return () => clearTimeout(timer);
  }, [executeSearch]);

  if (!mounted) return <div className="animate-pulse bg-muted h-64 border border-border" />;

  return (
    <div className="space-y-6 w-full">
      {/* Live Status & Provider Bar */}
      <LiveStatusHeader
        provider={COUNTRIES_PROVIDER}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={() => executeSearch(query)}
      />

      {/* Search Bar Input */}
      <div className="bg-card border-2 border-border p-4 card-depth-1 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Country search input"
              className="pl-10 h-10 text-xs"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-10 px-6 font-bold text-xs shrink-0">
            {loading ? 'Searching...' : t.searchButton}
          </Button>
        </form>

        {/* Popular Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
          <span className="font-bold text-muted-foreground uppercase">Popular Countries:</span>
          {POPULAR_COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setQuery(c);
                executeSearch(c);
              }}
              className="border border-border bg-muted/40 px-2 py-0.5 hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && <LiveErrorBanner error={error} onRetry={() => executeSearch(query)} />}

      {/* Country Profile Results */}
      {data && (
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-4">
              {data.flagSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.flagSvg}
                  alt={`${data.name} Flag`}
                  className="h-12 w-16 object-cover border border-border shadow-sm shrink-0"
                />
              ) : (
                <span className="text-4xl">{data.flagEmoji}</span>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-foreground">{data.name}</h2>
                  <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 border border-border">
                    {data.cca2} / {data.cca3}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic">{data.officialName}</p>
              </div>
            </div>

            <div className="p-3 bg-muted/20 border border-border text-right text-xs">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Capital City</span>
              <span className="font-black text-foreground">{data.capital}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-muted/20 border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Users className="h-3.5 w-3.5 text-blue-500" />
                <span>Population</span>
              </div>
              <p className="text-lg font-black text-foreground">{data.population.toLocaleString()}</p>
            </div>

            <div className="p-3 bg-muted/20 border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Compass className="h-3.5 w-3.5 text-emerald-500" />
                <span>Total Area</span>
              </div>
              <p className="text-lg font-black text-foreground">{data.area.toLocaleString()} km²</p>
            </div>

            <div className="p-3 bg-muted/20 border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Globe2 className="h-3.5 w-3.5 text-violet-500" />
                <span>Region</span>
              </div>
              <p className="text-sm font-bold text-foreground truncate">{data.region} ({data.subregion})</p>
            </div>

            <div className="p-3 bg-muted/20 border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Timezone(s)</span>
              </div>
              <p className="text-xs font-mono font-bold text-foreground truncate">{data.timezones.slice(0, 2).join(', ')}</p>
            </div>
          </div>

          {/* Languages & Currencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-muted/10 border border-border space-y-2">
              <div className="flex items-center gap-1.5 text-foreground font-bold">
                <Languages className="h-4 w-4 text-primary" />
                <span>Official Languages</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.languages.map((lang, idx) => (
                  <span key={idx} className="bg-background border border-border px-2 py-0.5 text-[11px] font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted/10 border border-border space-y-2">
              <div className="flex items-center gap-1.5 text-foreground font-bold">
                <Coins className="h-4 w-4 text-primary" />
                <span>Currencies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.currencies.map((curr, idx) => (
                  <span key={idx} className="bg-background border border-border px-2 py-0.5 text-[11px] font-bold text-foreground">
                    {curr.code} ({curr.symbol}) — {curr.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
