'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import t from './locales/en.json';
import { formatTime, playAlarmSound } from './utils';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Maximize2, 
  Minimize2,
  X
} from 'lucide-react';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';

export default function PomodoroTimer() {
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  
  // Loaded from localStorage in useEffect
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings editing states
  const [editFocus, setEditFocus] = useState(25);
  const [editShort, setEditShort] = useState(5);
  const [editLong, setEditLong] = useState(15);
  const [editInterval, setEditInterval] = useState(4);
  const [editAutoStart, setEditAutoStart] = useState(true);
  const [editSound, setEditSound] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load localStorage configurations safely after mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('pomodoro-timer');

      try {
        const savedFocus = localStorage.getItem('pomodoro_focusDuration');
        const savedShort = localStorage.getItem('pomodoro_shortBreakDuration');
        const savedLong = localStorage.getItem('pomodoro_longBreakDuration');
        const savedInterval = localStorage.getItem('pomodoro_longBreakInterval');
        const savedAutoStart = localStorage.getItem('pomodoro_autoStartBreaks');
        const savedSound = localStorage.getItem('pomodoro_soundEnabled');
        const savedNotifications = localStorage.getItem('pomodoro_notificationsEnabled');

        if (savedFocus) {
          const val = parseInt(savedFocus, 10);
          setFocusDuration(val);
          setEditFocus(val);
          setTimeLeft(val * 60);
        }
        if (savedShort) {
          const val = parseInt(savedShort, 10);
          setShortBreakDuration(val);
          setEditShort(val);
        }
        if (savedLong) {
          const val = parseInt(savedLong, 10);
          setLongBreakDuration(val);
          setEditLong(val);
        }
        if (savedInterval) {
          const val = parseInt(savedInterval, 10);
          setLongBreakInterval(val);
          setEditInterval(val);
        }
        if (savedAutoStart) {
          const val = savedAutoStart === 'true';
          setAutoStartBreaks(val);
          setEditAutoStart(val);
        }
        if (savedSound) {
          const val = savedSound === 'true';
          setSoundEnabled(val);
          setEditSound(val);
        }
        if (savedNotifications === 'true' && typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            setNotificationsEnabled(true);
          }
        }
      } catch (error) {
        logger.error('Failed to load Pomodoro configuration from localStorage:', error);
      }

    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update timer whenever mode or configurations change
  useEffect(() => {
    if (!isActive) {
      const mins = mode === 'focus' 
        ? focusDuration 
        : mode === 'short' 
          ? shortBreakDuration 
          : longBreakDuration;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(mins * 60);
    }
  }, [focusDuration, shortBreakDuration, longBreakDuration, mode, isActive]);

  // Update Document title tab countdown
  useEffect(() => {
    if (!mounted) return;
    const modeLabel = mode === 'focus' ? t.focus : mode === 'short' ? t.shortBreak : t.longBreak;
    document.title = isActive 
      ? `[${formatTime(timeLeft)}] ${modeLabel} | ${t.title}`
      : `${t.title} | CoolTools`;

    return () => {
      document.title = 'CoolTools';
    };
  }, [timeLeft, isActive, mode, mounted]);

  // Notification and bell trigger handler
  const handleSessionCompletion = useCallback(() => {
    setIsActive(false);

    if (soundEnabled) {
      playAlarmSound();
    }

    const nextMode = mode === 'focus'
      ? ((completedSessions + 1) % longBreakInterval === 0 ? 'long' : 'short')
      : 'focus';

    const notificationMessage = nextMode === 'focus' 
      ? t.notificationTimerFinished.replace('{type}', mode === 'short' ? t.shortBreak : t.longBreak)
      : t.notificationTimerFinished.replace('{type}', t.focus);

    if (notificationsEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(t.title, {
          body: notificationMessage,
          icon: '/favicon.ico',
        });
      }
    }

    if (mode === 'focus') {
      setCompletedSessions((prev) => prev + 1);
    }

    setMode(nextMode);
    
    // Auto start next session trigger if preferences are checked
    if (autoStartBreaks) {
      setIsActive(true);
    }

    trackToolCompletion('pomodoro-timer');
  }, [mode, completedSessions, longBreakInterval, soundEnabled, notificationsEnabled, autoStartBreaks]);

  // Timer interval loops
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSessionCompletion();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSessionCompletion]);

  const handleReset = useCallback(() => {
    setIsActive(false);
    const mins = mode === 'focus' 
      ? focusDuration 
      : mode === 'short' 
        ? shortBreakDuration 
        : longBreakDuration;
    setTimeLeft(mins * 60);
  }, [mode, focusDuration, shortBreakDuration, longBreakDuration]);

  const handleSkip = useCallback(() => {
    setIsActive(false);
    const nextMode = mode === 'focus'
      ? ((completedSessions + 1) % longBreakInterval === 0 ? 'long' : 'short')
      : 'focus';
    
    if (mode === 'focus') {
      setCompletedSessions((prev) => prev + 1);
    }
    
    setMode(nextMode);
  }, [mode, completedSessions, longBreakInterval]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        logger.error('Error attempting to enable fullscreen:', err);
        trackValidationError('pomodoro-timer', 'fullscreen_failed');
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Keyboard shortcut keys listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsActive((prev) => !prev);
          break;
        case 'r':
          e.preventDefault();
          handleReset();
          break;
        case 's':
          e.preventDefault();
          handleSkip();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReset, handleSkip, toggleFullscreen]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      try {
        localStorage.setItem('pomodoro_notificationsEnabled', 'false');
      } catch (e) {
        logger.error('Failed to save notifications configuration:', e);
      }
    } else {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          try {
            localStorage.setItem('pomodoro_notificationsEnabled', 'true');
          } catch (e) {
            logger.error('Failed to save notifications configuration:', e);
          }
        } else {
          alert(t.notificationPermissionDenied);
        }
      }
    }
  };

  const handleSaveSettings = () => {
    // Basic bounds checking
    const boundFocus = Math.max(1, Math.min(180, editFocus));
    const boundShort = Math.max(1, Math.min(60, editShort));
    const boundLong = Math.max(1, Math.min(120, editLong));
    const boundInterval = Math.max(1, Math.min(12, editInterval));

    setFocusDuration(boundFocus);
    setShortBreakDuration(boundShort);
    setLongBreakDuration(boundLong);
    setLongBreakInterval(boundInterval);
    setAutoStartBreaks(editAutoStart);
    setSoundEnabled(editSound);

    try {
      localStorage.setItem('pomodoro_focusDuration', String(boundFocus));
      localStorage.setItem('pomodoro_shortBreakDuration', String(boundShort));
      localStorage.setItem('pomodoro_longBreakDuration', String(boundLong));
      localStorage.setItem('pomodoro_longBreakInterval', String(boundInterval));
      localStorage.setItem('pomodoro_autoStartBreaks', String(editAutoStart));
      localStorage.setItem('pomodoro_soundEnabled', String(editSound));
    } catch (e) {
      logger.error('Failed to save settings configurations:', e);
    }

    const currentMins = mode === 'focus' ? boundFocus : mode === 'short' ? boundShort : boundLong;
    setTimeLeft(currentMins * 60);
    setIsActive(false);
    setShowSettings(false);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-96 rounded-lg w-full" />;
  }

  // Calculate SVG progress ring coordinates
  const currentTotalSeconds = (mode === 'focus' 
    ? focusDuration 
    : mode === 'short' 
      ? shortBreakDuration 
      : longBreakDuration) * 60;
  
  const percentage = currentTotalSeconds > 0 ? (timeLeft / currentTotalSeconds) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius; // 753.98
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine themes colors based on active modes
  const modeColors = {
    focus: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-500',
      stroke: 'stroke-rose-500',
      label: t.focus
    },
    short: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      stroke: 'stroke-emerald-500',
      label: t.shortBreak
    },
    long: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      text: 'text-sky-500',
      stroke: 'stroke-sky-500',
      label: t.longBreak
    }
  };

  const theme = modeColors[mode];

  return (
    <div className="space-y-6 w-full">
      {/* Trust Pledge Indicators Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-[10px] sm:text-xs font-bold flex flex-wrap gap-x-4 gap-y-1">
        <span>✓ 100% Offline Capable</span>
        <span>✓ Local Audio Synthesis</span>
        <span>✓ Zero Focus Logs Saved</span>
      </div>

      {/* Main interactive timer workspace */}
      <div 
        ref={containerRef}
        className={`flex flex-col items-center justify-center border transition-all duration-300 rounded-lg p-6 ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-background w-screen h-screen rounded-none border-none' 
            : 'bg-card'
        }`}
      >
        {/* Fullscreen header mode exit buttons */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-50">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label="Exit Fullscreen">
              <Minimize2 className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="flex flex-col items-center justify-center max-w-md w-full space-y-6">
          
          {/* Active Mode Indicator Badge */}
          <div className={`px-4 py-1.5 rounded-full border text-xs font-extrabold uppercase tracking-widest ${theme.bg} ${theme.border} ${theme.text}`}>
            {theme.label}
          </div>

          {/* SVG Circular Progress Ring */}
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 280 280">
              {/* Background Track Circle */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-muted fill-transparent"
                strokeWidth="10"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className={`fill-transparent transition-all duration-300 ${theme.stroke}`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center digital clock countdown display */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-foreground select-none" aria-label={t.timerLabel}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">
                {t.sessionCount.replace('{count}', String((completedSessions % longBreakInterval) + 1)).replace('{total}', String(longBreakInterval))}
              </span>
            </div>
          </div>

          {/* Core Interactive buttons toolbar */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              aria-label={t.resetButton}
              className="h-10 w-10 rounded-full"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              onClick={() => setIsActive((prev) => !prev)}
              aria-label={isActive ? t.pauseButton : t.startButton}
              className="h-12 px-6 rounded-full font-bold flex items-center gap-2"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 fill-current" />
                  {t.pauseButton}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  {t.startButton}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleSkip}
              aria-label={t.skipButton}
              className="h-10 w-10 rounded-full"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings and System Preference Toggles */}
          <div className="flex items-center gap-4 pt-4 border-t w-full justify-center text-muted-foreground">
            {/* Audio Alert switch toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => {
                localStorage.setItem('pomodoro_soundEnabled', String(!prev));
                return !prev;
              })}
              aria-label={soundEnabled ? 'Mute Alarm sound' : 'Unmute Alarm sound'}
              className="hover:text-foreground transition-colors"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            {/* Desktop browser banners switch toggle */}
            <button
              onClick={handleToggleNotifications}
              aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
              className="hover:text-foreground transition-colors"
            >
              {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </button>

            {/* Fullscreen request toggle */}
            <button
              onClick={toggleFullscreen}
              aria-label={t.fullscreenButton}
              className="hover:text-foreground transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>

            {/* Settings toggler */}
            <button
              onClick={() => {
                setEditFocus(focusDuration);
                setEditShort(shortBreakDuration);
                setEditLong(longBreakDuration);
                setEditInterval(longBreakInterval);
                setEditAutoStart(autoStartBreaks);
                setEditSound(soundEnabled);
                setShowSettings(true);
              }}
              aria-label={t.settingsButton}
              className="hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Settings Modal dialog overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              aria-label={t.closeButton}
            >
              <X className="h-5 w-5" />
            </button>
            
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Pomodoro Settings
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-focus">{t.focusDurationLabel}</label>
                  <Input
                    id="edit-focus"
                    type="number"
                    value={editFocus}
                    onChange={(e) => setEditFocus(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={180}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-short">{t.shortBreakDurationLabel}</label>
                  <Input
                    id="edit-short"
                    type="number"
                    value={editShort}
                    onChange={(e) => setEditShort(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={60}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-long">{t.longBreakDurationLabel}</label>
                  <Input
                    id="edit-long"
                    type="number"
                    value={editLong}
                    onChange={(e) => setEditLong(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={120}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-interval">{t.longBreakIntervalLabel}</label>
                  <Input
                    id="edit-interval"
                    type="number"
                    value={editInterval}
                    onChange={(e) => setEditInterval(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={12}
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2.5 border-t">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editAutoStart}
                    onChange={(e) => setEditAutoStart(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <span>Auto-start breaks & focus sessions</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editSound}
                    onChange={(e) => setEditSound(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-muted text-primary focus:ring-primary accent-primary"
                  />
                  <span>{t.alarmSoundLabel}</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveSettings}>
                  {t.saveButton}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

      {/* Keyboard Shortcuts Quick Reference Banner */}
      <Card className="p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Keyboard Shortcuts Quick Reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Space</span>
            <span>Play / Pause Timer</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">R</span>
            <span>Reset Active Timer</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">S</span>
            <span>Skip Current Session</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">F</span>
            <span>Toggle Fullscreen Mode</span>
          </div>
        </div>
      </Card>

      {/* Accordion FAQ Area */}
      <Card className="p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3.5 text-xs">
          <div>
            <h4 className="font-bold text-foreground mb-1">
              What is the Pomodoro Technique?
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It breaks your work down into intervals (typically 25 minutes long), separated by short breaks (usually 5 minutes). These intervals are named &quot;pomodoros&quot;, the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo originally used.
            </p>
          </div>

          <div className="border-t pt-3">
            <h4 className="font-bold text-foreground mb-1">
              Does my timer state sync or save to the cloud?
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              No. Privacy is our product philosophy. Your session count, timer controls, focus durations, and preference choices are processed entirely within your local browser sandbox and persisted locally using HTML5 localStorage.
            </p>
          </div>

          <div className="border-t pt-3">
            <h4 className="font-bold text-foreground mb-1">
              Do audio bells chime when my browser tab is inactive?
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Yes. The double-chime D5-A5 alert is synthesized dynamically using Web Audio API oscillators, which operate in the background even if you switch browser tabs. Note that some browsers restrict sound auto-play until you interact with the page first.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
