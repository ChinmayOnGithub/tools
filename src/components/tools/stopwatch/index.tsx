'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import t from './locales/en.json';
import { formatElapsedDuration } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';
import FaqSection from '@/components/shared/FaqSection';

interface LapRecord {
  lapNum: number;
  lapTime: number;
  overallTime: number;
}

export default function StopwatchComponent() {
  const [mounted, setMounted] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const elapsedTimeRef = useRef(elapsedTime);
  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('stopwatch');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Handle precision time updates reactively
  useEffect(() => {
    if (!running) return;

    const localStartTime = performance.now() - elapsedTimeRef.current;
    const intervalId = setInterval(() => {
      setElapsedTime(performance.now() - localStartTime);
    }, 10);

    return () => clearInterval(intervalId);
  }, [running]);

  const handleStart = () => {
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!running) return;
    const currentOverall = elapsedTime;
    const lastOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const currentLap = currentOverall - lastOverall;

    const newLap: LapRecord = {
      lapNum: laps.length + 1,
      lapTime: currentLap,
      overallTime: currentOverall,
    };

    setLaps((prev) => [newLap, ...prev]);
    trackToolCompletion('stopwatch');
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Card className="card-depth-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            {t.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Large timer display */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-border bg-muted/10">
            <span 
              className="font-mono text-4xl sm:text-5xl font-extrabold tracking-widest text-primary"
              aria-live="polite"
            >
              {formatElapsedDuration(elapsedTime)}
            </span>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex justify-center gap-4">
            {!running ? (
              <Button
                onClick={handleStart}
                className="font-bold gap-2 w-28 h-10 text-xs cursor-pointer"
              >
                <Play className="h-4 w-4" />
                {t.startButton}
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="outline"
                className="font-bold gap-2 w-28 h-10 text-xs cursor-pointer"
              >
                <Pause className="h-4 w-4" />
                {t.pauseButton}
              </Button>
            )}

            <Button
              onClick={handleLap}
              disabled={!running}
              variant="outline"
              className="font-bold gap-2 w-28 h-10 text-xs cursor-pointer"
            >
              <Flag className="h-4 w-4" />
              {t.lapButton}
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              className="font-bold gap-2 w-28 h-10 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              {t.resetButton}
            </Button>
          </div>

          {/* Laps List table */}
          {laps.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                {t.lapListHeader} ({laps.length})
              </span>

              <div className="border-2 border-border overflow-hidden max-h-[220px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b font-bold text-muted-foreground">
                      <th className="p-2">{t.lapNumber}</th>
                      <th className="p-2">{t.lapTime}</th>
                      <th className="p-2">{t.overallTime}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laps.map((lap) => (
                      <tr key={lap.lapNum} className="border-b hover:bg-muted/10 font-semibold text-foreground">
                        <td className="p-2">#{lap.lapNum}</td>
                        <td className="p-2 text-primary font-mono">{formatElapsedDuration(lap.lapTime)}</td>
                        <td className="p-2 font-mono">{formatElapsedDuration(lap.overallTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ accordion */}
      
      <Card className="p-4 space-y-4 rounded-none">
        <FaqSection faqs={t.faq} />
      </Card>
    </div>
  );
}
