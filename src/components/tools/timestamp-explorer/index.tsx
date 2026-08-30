'use client';

import { useState, useEffect, useCallback } from 'react';
import t from './locales/en.json';
import { parseEpoch } from './utils';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';
import CopyShareToast from '@/components/shared/CopyShareToast';

// Hooks
import { useUrlQueryInput } from '@/hooks/useUrlQueryInput';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addHistoryEntry } from '@/lib/history';
import { Copy, Check, Clock, Calendar, Globe } from 'lucide-react';

export default function TimestampExplorer() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { addRecent } = useWorkspace();

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

  const handleFocusInput = () => {
    const el = document.getElementById('timestamp-input');
    if (el) el.focus();
  };

  const handleLoadCurrentSeconds = useCallback(() => {
    const nowSecStr = Math.floor(Date.now() / 1000).toString();
    setInput(nowSecStr);
    addHistoryEntry('timestamp-explorer', 'Timestamp Explorer', 'Loaded Current Seconds', nowSecStr);
  }, []);

  const handleLoadCurrentMilliseconds = useCallback(() => {
    const nowMsStr = Date.now().toString();
    setInput(nowMsStr);
    addHistoryEntry('timestamp-explorer', 'Timestamp Explorer', 'Loaded Current Milliseconds', nowMsStr);
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  useGlobalShortcuts({
    onRun: handleLoadCurrentSeconds,
    onClear: handleClear,
    onFocusInput: handleFocusInput,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      addRecent('timestamp-explorer');
      if (!window.location.search.includes('input=') && !window.location.search.includes('data=')) {
        setInput(Math.floor(Date.now() / 1000).toString());
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [addRecent]);

  const stats = parseEpoch(input);

  const handleCopyValue = (fieldId: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(fieldId);
      setShowToast(true);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Workspace Layout */}
      <ToolLayout>
        {/* Input Panel */}
        <div className="space-y-6">
          <InputPanel 
            title="Input Timestamp / Date"
            onPasteClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (text) setInput(text.trim());
              } catch {
                handleFocusInput();
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="timestamp-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.epochLabel}
                  </label>
                  {stats.isValid && stats.detectedUnit !== 'none' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                      Detected: {stats.detectedUnit}
                    </span>
                  )}
                </div>
                <Input
                  id="timestamp-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 1719600000 (seconds), 1719600000000 (ms), or 2026-06-28T12:00:00Z"
                  className="rounded-none font-mono border border-border bg-card h-9 text-xs"
                />
              </div>

              {!stats.isValid && input && (
                <p className="text-xs font-bold text-destructive">{t.invalidFormat}</p>
              )}

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick Presets:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Button variant="outline" size="sm" onClick={handleLoadCurrentSeconds}>
                    <Clock className="h-3 w-3 mr-1" />
                    Now (Seconds)
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLoadCurrentMilliseconds}>
                    <Clock className="h-3 w-3 mr-1" />
                    Now (Milliseconds)
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setInput(new Date().toISOString())}>
                    <Calendar className="h-3 w-3 mr-1" />
                    Now (ISO 8601)
                  </Button>
                </div>
              </div>

              <ActionBar>
                <div className="flex gap-2">
                  <PipeButton value={input} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
                    Clear
                  </Button>
                </div>
              </ActionBar>
            </div>
          </InputPanel>
        </div>

        {/* Output Conversions Panel */}
        <div className="space-y-6">
          {stats.isValid ? (
            <OutputPanel title="Timestamp Conversions & Standards">
              <div className="space-y-4 text-xs font-semibold">
                
                {/* Epoch Seconds vs Milliseconds */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Unix Seconds (10 Digits)
                    </span>
                    <div className="flex gap-1.5 items-center">
                      <span className="font-mono bg-muted/20 border border-border px-2.5 py-1.5 flex-1 truncate text-foreground text-xs">{stats.epochSeconds}</span>
                      <button
                        onClick={() => handleCopyValue('sec', String(stats.epochSeconds))}
                        className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card"
                        type="button"
                        title="Copy Unix seconds"
                      >
                        {copiedField === 'sec' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Unix Milliseconds (13 Digits)
                    </span>
                    <div className="flex gap-1.5 items-center">
                      <span className="font-mono bg-muted/20 border border-border px-2.5 py-1.5 flex-1 truncate text-foreground text-xs">{stats.epochMilliseconds}</span>
                      <button
                        onClick={() => handleCopyValue('ms', String(stats.epochMilliseconds))}
                        className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card"
                        type="button"
                        title="Copy Unix milliseconds"
                      >
                        {copiedField === 'ms' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ISO 8601 */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t.iso8601} (Standard Exchange)
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/20 border border-border px-3 py-1.5 flex-1 truncate text-foreground">{stats.iso8601}</span>
                    <button
                      onClick={() => handleCopyValue('iso', stats.iso8601)}
                      className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card rounded-none"
                      type="button"
                    >
                      {copiedField === 'iso' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <PipeButton value={stats.iso8601} iconOnly={true} className="h-9 border border-border bg-card rounded-none px-3 text-muted-foreground hover:text-primary hover:bg-muted" />
                  </div>
                </div>

                {/* RFC 3339 */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t.rfc3339}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/20 border border-border px-3 py-1.5 flex-1 truncate text-foreground">{stats.rfc3339}</span>
                    <button
                      onClick={() => handleCopyValue('rfc', stats.rfc3339)}
                      className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card rounded-none"
                      type="button"
                    >
                      {copiedField === 'rfc' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <PipeButton value={stats.rfc3339} iconOnly={true} className="h-9 border border-border bg-card rounded-none px-3 text-muted-foreground hover:text-primary hover:bg-muted" />
                  </div>
                </div>

                {/* UTC Date vs Local Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {t.utcDate}
                    </span>
                    <div className="flex gap-1.5 items-center">
                      <span className="font-mono bg-muted/20 border border-border px-2.5 py-1.5 flex-1 truncate text-foreground text-xs">{stats.utcString}</span>
                      <button
                        onClick={() => handleCopyValue('utc', stats.utcString)}
                        className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card"
                        type="button"
                      >
                        {copiedField === 'utc' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t.localDate} ({stats.timezoneOffset})
                    </span>
                    <div className="flex gap-1.5 items-center">
                      <span className="font-mono bg-muted/20 border border-border px-2.5 py-1.5 flex-1 truncate text-foreground text-xs">{stats.localString}</span>
                      <button
                        onClick={() => handleCopyValue('local', stats.localString)}
                        className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card"
                        type="button"
                      >
                        {copiedField === 'local' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Relative Time */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t.relativeTime}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-primary bg-muted/20 border border-border px-3 py-1.5 flex-1 truncate">{stats.relative}</span>
                  </div>
                </div>
              </div>
            </OutputPanel>
          ) : (
            <div className="py-12 text-center text-xs font-bold text-muted-foreground uppercase border border-dashed border-border">
              Awaiting valid timestamp or date input
            </div>
          )}
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
