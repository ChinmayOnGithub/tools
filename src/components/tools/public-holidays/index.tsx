'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarDays } from 'lucide-react';
import { LiveStatusHeader, LiveErrorBanner } from '@/components/shared/LiveToolComponents';
import { fetchLiveHolidays, NAGER_DATE_PROVIDER, COMMON_HOLIDAY_COUNTRIES, PublicHoliday } from './utils';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';

export default function PublicHolidays() {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const executeSearch = useCallback(async (targetYear: number, targetCountry: string) => {
    setLoading(true);
    setError(null);
    const res = await fetchLiveHolidays(targetYear, targetCountry);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      setHolidays([]);
    } else {
      setHolidays(res.data || []);
      if (res.lastUpdated) setLastUpdated(res.lastUpdated);
      trackToolCompletion('public-holidays');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('public-holidays');
      executeSearch(currentYear, 'US');
    }, 0);
    return () => clearTimeout(timer);
  }, [currentYear, executeSearch]);

  if (!mounted) return <div className="animate-pulse bg-muted h-64 border border-border" />;

  const selectedCountryName = COMMON_HOLIDAY_COUNTRIES.find((c) => c.code === country)?.name || country;

  return (
    <div className="space-y-6 w-full">
      {/* Live Status & Provider Bar */}
      <LiveStatusHeader
        provider={NAGER_DATE_PROVIDER}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={() => executeSearch(year, country)}
      />

      {/* Control Selectors */}
      <div className="bg-card border-2 border-border p-4 card-depth-1 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                executeSearch(year, e.target.value);
              }}
              aria-label="Select country for holidays"
              className="w-full h-11 border-2 border-border bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {COMMON_HOLIDAY_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Calendar Year
            </label>
            <select
              value={year}
              onChange={(e) => {
                const y = parseInt(e.target.value, 10);
                setYear(y);
                executeSearch(y, country);
              }}
              aria-label="Select year for holidays"
              className="w-full h-11 border-2 border-border bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((y) => (
                <option key={y} value={y}>
                  {y} {y === currentYear ? '(Current Year)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && <LiveErrorBanner error={error} onRetry={() => executeSearch(year, country)} />}

      {/* Holiday Table List */}
      {holidays.length > 0 && (
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2 className="text-base font-black text-foreground">
                {selectedCountryName} — {year} Public Holidays
              </h2>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-0.5 border border-border">
              {holidays.length} Observances
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {holidays.map((h, idx) => {
              const holidayDate = new Date(h.date);
              const dayName = holidayDate.toLocaleDateString(undefined, { weekday: 'short' });
              return (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-muted/20 px-2 transition-colors">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block">{h.name}</span>
                    {h.localName && h.localName !== h.name && (
                      <span className="text-[11px] text-muted-foreground italic block">{h.localName}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono bg-muted px-2 py-0.5 border border-border text-foreground font-bold">
                      {h.date} ({dayName})
                    </span>
                    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 border ${h.global ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                      {h.global ? 'Nationwide' : 'Regional'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
