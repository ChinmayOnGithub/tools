'use client';

import { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize, Settings } from 'lucide-react';
import t from './locales/en.json';
import { formatTime, formatDateString } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { trackToolLaunch } from '@/lib/analytics';

export default function FullscreenClockComponent() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  
  // Customization states
  const [use24Hour, setUse24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const clockContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setTime(new Date());
      trackToolLaunch('fullscreen-clock');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update clock every animation frame
  useEffect(() => {
    if (!mounted) return;
    let animFrameId: number;

    const tick = () => {
      setTime(new Date());
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [mounted]);

  // Fullscreen toggle event handlers
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!clockContainerRef.current) return;

    if (!document.fullscreenElement) {
      clockContainerRef.current.requestFullscreen().catch(() => {
        // Safe fallback if blocked
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!mounted || !time) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Card className="card-depth-2 overflow-hidden">
        {/* Fullscreen Workspace Container */}
        <div
          ref={clockContainerRef}
          className={`flex flex-col items-center justify-center p-8 transition-colors select-none ${
            isFullscreen 
              ? 'bg-black text-white fixed inset-0 z-50 w-screen h-screen' 
              : 'bg-card text-foreground min-h-[260px]'
          }`}
        >
          {/* Time text */}
          <span 
            className={`font-mono font-extrabold tracking-widest ${
              isFullscreen 
                ? 'text-7xl sm:text-8xl md:text-9xl text-primary' 
                : 'text-5xl sm:text-6xl text-primary'
            }`}
            aria-live="polite"
          >
            {formatTime(time, showSeconds, use24Hour)}
          </span>

          {/* Date text */}
          {showDate && (
            <span 
              className={`mt-4 font-semibold text-muted-foreground ${
                isFullscreen ? 'text-lg sm:text-xl' : 'text-xs sm:text-sm'
              }`}
            >
              {formatDateString(time)}
            </span>
          )}

          {/* Floating toggle button inside Fullscreen view */}
          {isFullscreen && (
            <div className="absolute bottom-8 right-8 flex gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="h-10 w-10 border-white/20 text-white hover:bg-white/10"
                aria-label="Exit Fullscreen"
              >
                <Minimize className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Configurations Dashboard */}
        <CardContent className="border-t p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Settings className="h-4 w-4" /> Clock Settings
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="text-xs font-bold gap-2 cursor-pointer"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              {t.fullscreenButton}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs font-bold text-muted-foreground">
            {/* 24-hour setting */}
            <div className="flex items-center gap-2">
              <input
                id="toggle-24h"
                type="checkbox"
                checked={use24Hour}
                onChange={() => setUse24Hour(!use24Hour)}
                className="h-4 w-4 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="toggle-24h" className="cursor-pointer select-none">
                {t.timeFormatLabel}
              </label>
            </div>

            {/* seconds setting */}
            <div className="flex items-center gap-2">
              <input
                id="toggle-seconds"
                type="checkbox"
                checked={showSeconds}
                onChange={() => setShowSeconds(!showSeconds)}
                className="h-4 w-4 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="toggle-seconds" className="cursor-pointer select-none">
                {t.showSecondsLabel}
              </label>
            </div>

            {/* date setting */}
            <div className="flex items-center gap-2">
              <input
                id="toggle-date"
                type="checkbox"
                checked={showDate}
                onChange={() => setShowDate(!showDate)}
                className="h-4 w-4 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="toggle-date" className="cursor-pointer select-none">
                {t.showDateLabel}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ accordion */}
      <Card className="p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3.5 text-xs">
          {t.faq.map((item, i) => (
            <div key={i} className={i > 0 ? 'border-t pt-3' : ''}>
              <h4 className="font-bold text-foreground mb-1">{item.q}</h4>
              <p className="text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
