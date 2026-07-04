'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import t from './locales/en.json';
import { timeFieldsToSeconds, secondsToTimeFields } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';
import FaqSection from '@/components/shared/FaqSection';

export default function CountdownTimerComponent() {
  const [mounted, setMounted] = useState(false);
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('5');
  const [seconds, setSeconds] = useState('0');

  const [totalSeconds, setTotalSeconds] = useState(300);
  const [running, setRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('countdown-timer');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Clean timer loops on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const playSyntheticAlarm = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      
      // Make a double bell chime sound using Web Audio Sine Oscillators
      const playBeep = (timeOffset: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime + timeOffset); // A5 note

        gain.gain.setValueAtTime(0.5, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.3);
      };

      playBeep(0);
      playBeep(0.4);
    } catch {
      // Safe fallback if block policies prevent Web Audio API execution
    }
  };

  const handleStart = () => {
    if (running) return;

    // If not already in countdown state, load values from the inputs
    if (totalSeconds === 0 || (!running && totalSeconds === timeFieldsToSeconds({
      hours: parseInt(hours, 10) || 0,
      minutes: parseInt(minutes, 10) || 0,
      seconds: parseInt(seconds, 10) || 0,
    }))) {
      const secs = timeFieldsToSeconds({
        hours: parseInt(hours, 10) || 0,
        minutes: parseInt(minutes, 10) || 0,
        seconds: parseInt(seconds, 10) || 0,
      });

      if (secs <= 0) return;
      setTotalSeconds(secs);
    }

    setRunning(true);

    timerRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
          playSyntheticAlarm();
          trackToolCompletion('countdown-timer');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePause = () => {
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleReset = () => {
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const originalSecs = timeFieldsToSeconds({
      hours: parseInt(hours, 10) || 0,
      minutes: parseInt(minutes, 10) || 0,
      seconds: parseInt(seconds, 10) || 0,
    });
    setTotalSeconds(originalSecs);
  };

  const formatTimerDigits = (val: number): string => {
    return String(val).padStart(2, '0');
  };

  const timeFields = secondsToTimeFields(totalSeconds);

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Card className="card-depth-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            {t.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Inputs configuration panel */}
          {!running && totalSeconds === timeFieldsToSeconds({
            hours: parseInt(hours, 10) || 0,
            minutes: parseInt(minutes, 10) || 0,
            seconds: parseInt(seconds, 10) || 0,
          }) ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="h-input" className="text-xs font-bold text-muted-foreground">{t.hourLabel}</label>
                <Input
                  id="h-input"
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => {
                    setHours(e.target.value);
                    const calculated = timeFieldsToSeconds({
                      hours: parseInt(e.target.value, 10) || 0,
                      minutes: parseInt(minutes, 10) || 0,
                      seconds: parseInt(seconds, 10) || 0,
                    });
                    setTotalSeconds(calculated);
                  }}
                  className="h-10 text-xs font-bold"
                  aria-label="Hours input"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="m-input" className="text-xs font-bold text-muted-foreground">{t.minuteLabel}</label>
                <Input
                  id="m-input"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => {
                    setMinutes(e.target.value);
                    const calculated = timeFieldsToSeconds({
                      hours: parseInt(hours, 10) || 0,
                      minutes: parseInt(e.target.value, 10) || 0,
                      seconds: parseInt(seconds, 10) || 0,
                    });
                    setTotalSeconds(calculated);
                  }}
                  className="h-10 text-xs font-bold"
                  aria-label="Minutes input"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="s-input" className="text-xs font-bold text-muted-foreground">{t.secondLabel}</label>
                <Input
                  id="s-input"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => {
                    setSeconds(e.target.value);
                    const calculated = timeFieldsToSeconds({
                      hours: parseInt(hours, 10) || 0,
                      minutes: parseInt(minutes, 10) || 0,
                      seconds: parseInt(e.target.value, 10) || 0,
                    });
                    setTotalSeconds(calculated);
                  }}
                  className="h-10 text-xs font-bold"
                  aria-label="Seconds input"
                />
              </div>
            </div>
          ) : (
            /* Active countdown state values */
            <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-muted/10">
              <span 
                className="font-mono text-4xl sm:text-5xl font-extrabold tracking-widest text-primary"
                aria-live="polite"
              >
                {formatTimerDigits(timeFields.hours)}:
                {formatTimerDigits(timeFields.minutes)}:
                {formatTimerDigits(timeFields.seconds)}
              </span>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="flex justify-center gap-4">
            {!running ? (
              <Button
                onClick={handleStart}
                className="font-bold gap-2 w-32 h-10 text-xs cursor-pointer"
              >
                <Play className="h-4 w-4" />
                {t.startButton}
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="outline"
                className="font-bold gap-2 w-32 h-10 text-xs cursor-pointer"
              >
                <Pause className="h-4 w-4" />
                {t.pauseButton}
              </Button>
            )}

            <Button
              onClick={handleReset}
              variant="outline"
              className="font-bold gap-2 w-32 h-10 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              {t.resetButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ accordion */}
      
      <Card className="p-4 space-y-4 rounded-none">
        <FaqSection faqs={t.faq} />
      </Card>
    </div>
  );
}
