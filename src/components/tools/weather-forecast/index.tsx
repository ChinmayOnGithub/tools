'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Wind, Droplets, Gauge, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LiveStatusHeader, LiveErrorBanner } from '@/components/shared/LiveToolComponents';
import { fetchLiveWeather, OPEN_METEO_PROVIDER, getWeatherDescription, WeatherData } from './utils';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';
import t from './locales/en.json';

const POPULAR_CITIES = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Mumbai'];

export default function WeatherForecast() {
  const [mounted, setMounted] = useState(false);
  const [cityInput, setCityInput] = useState('London');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const executeSearch = useCallback(async (targetCity: string) => {
    if (!targetCity.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetchLiveWeather(targetCity);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      setData(null);
    } else {
      setData(res.data);
      if (res.lastUpdated) setLastUpdated(res.lastUpdated);
      trackToolCompletion('weather-forecast');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('weather-forecast');
      executeSearch('London');
    }, 0);
    return () => clearTimeout(timer);
  }, [executeSearch]);

  if (!mounted) return <div className="animate-pulse bg-muted h-64 border border-border" />;

  const weatherMeta = data ? getWeatherDescription(data.weatherCode) : null;

  return (
    <div className="space-y-6 w-full">
      {/* Live Status & Provider Bar */}
      <LiveStatusHeader
        provider={OPEN_METEO_PROVIDER}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={() => executeSearch(cityInput)}
      />

      {/* Search Input Bar */}
      <div className="bg-card border-2 border-border p-4 card-depth-1 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(cityInput);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="City search input"
              className="pl-10 h-10 text-xs"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-10 px-6 font-bold text-xs shrink-0">
            {loading ? 'Searching...' : t.searchButton}
          </Button>
        </form>

        {/* Popular Cities Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
          <span className="font-bold text-muted-foreground uppercase">{t.recentLocations}:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCityInput(c);
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
      {error && <LiveErrorBanner error={error} onRetry={() => executeSearch(cityInput)} />}

      {/* Weather Metrics Card */}
      {data && (
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-6">
          {/* Main Temp Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
                <MapPin className="h-4 w-4" />
                <span>{data.city}{data.country ? `, ${data.country}` : ''}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-foreground">{Math.round(data.temperature)}°C</span>
                <span className="text-sm font-bold text-muted-foreground">({Math.round((data.temperature * 9/5) + 32)}°F)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Feels like {Math.round(data.apparentTemperature)}°C · {data.isDay ? 'Daytime' : 'Nighttime'}
              </p>
            </div>

            <div className="p-4 bg-muted/30 border border-border flex items-center gap-3">
              <span className="text-3xl select-none">{weatherMeta?.iconEmoji}</span>
              <div>
                <span className="text-xs font-bold text-foreground block">{weatherMeta?.label}</span>
                <span className="text-[10px] text-muted-foreground">WMO Code {data.weatherCode}</span>
              </div>
            </div>
          </div>

          {/* Secondary Atmospheric Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-muted/20 border border-border space-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Wind className="h-4 w-4 text-blue-500" />
                <span>Wind Speed</span>
              </div>
              <p className="text-xl font-black text-foreground">{data.windSpeed} km/h</p>
              <span className="text-[10px] text-muted-foreground block">Direction: {data.windDirection}°</span>
            </div>

            <div className="p-4 bg-muted/20 border border-border space-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Droplets className="h-4 w-4 text-emerald-500" />
                <span>Relative Humidity</span>
              </div>
              <p className="text-xl font-black text-foreground">{data.relativeHumidity}%</p>
              <span className="text-[10px] text-muted-foreground block">Air Moisture Saturation</span>
            </div>

            <div className="p-4 bg-muted/20 border border-border space-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                <Gauge className="h-4 w-4 text-violet-500" />
                <span>Surface Pressure</span>
              </div>
              <p className="text-xl font-black text-foreground">{data.surfacePressure} hPa</p>
              <span className="text-[10px] text-muted-foreground block">Barometric Level</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
