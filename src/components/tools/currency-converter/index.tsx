'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRightLeft, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LiveStatusHeader, LiveErrorBanner } from '@/components/shared/LiveToolComponents';
import { fetchLiveExchangeRate, FRANKFURTER_PROVIDER, COMMON_CURRENCIES, CurrencyConversion } from './utils';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';

export default function CurrencyConverter() {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CurrencyConversion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const executeConversion = useCallback(async (amt: number, from: string, to: string) => {
    if (isNaN(amt) || amt <= 0) return;
    setLoading(true);
    setError(null);
    const res = await fetchLiveExchangeRate(amt, from, to);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      setData(null);
    } else {
      setData(res.data);
      if (res.lastUpdated) setLastUpdated(res.lastUpdated);
      trackToolCompletion('currency-converter');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('currency-converter');
      executeConversion(100, 'USD', 'EUR');
    }, 0);
    return () => clearTimeout(timer);
  }, [executeConversion]);

  const handleSwap = () => {
    const nextFrom = toCurrency;
    const nextTo = fromCurrency;
    setFromCurrency(nextFrom);
    setToCurrency(nextTo);
    executeConversion(amount, nextFrom, nextTo);
  };

  if (!mounted) return <div className="animate-pulse bg-muted h-64 border border-border" />;

  return (
    <div className="space-y-6 w-full">
      {/* Live Status & Provider Bar */}
      <LiveStatusHeader
        provider={FRANKFURTER_PROVIDER}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={() => executeConversion(amount, fromCurrency, toCurrency)}
      />

      {/* Main Converter Card */}
      <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeConversion(amount, fromCurrency, toCurrency);
          }}
          className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end"
        >
          {/* Amount input */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Amount
            </label>
            <Input
              type="number"
              min="0.01"
              step="any"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              aria-label="Currency amount"
              className="h-11 font-mono font-bold text-sm"
            />
          </div>

          {/* From Currency */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              From Currency
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => {
                setFromCurrency(e.target.value);
                executeConversion(amount, e.target.value, toCurrency);
              }}
              aria-label="Source currency"
              className="w-full h-11 border-2 border-border bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {COMMON_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pb-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleSwap}
              aria-label="Swap currencies"
              className="h-10 w-10 p-0 rounded-none border-2 border-border hover:border-primary shrink-0"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              To Currency
            </label>
            <select
              value={toCurrency}
              onChange={(e) => {
                setToCurrency(e.target.value);
                executeConversion(amount, fromCurrency, e.target.value);
              }}
              aria-label="Target currency"
              className="w-full h-11 border-2 border-border bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {COMMON_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Error state */}
        {error && <LiveErrorBanner error={error} onRetry={() => executeConversion(amount, fromCurrency, toCurrency)} />}

        {/* Results Banner */}
        {data && (
          <div className="p-6 bg-muted/20 border-2 border-border space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold block">
                {data.amount.toLocaleString()} {data.base} =
              </span>
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                {data.result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {data.target}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/40 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span>
                  1 {data.base} = <strong className="text-foreground">{data.rate.toFixed(6)} {data.target}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <Calendar className="h-3 w-3" />
                <span>ECB Official Rate Date: {data.date}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
