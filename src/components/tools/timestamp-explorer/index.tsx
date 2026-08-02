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
import { Copy, Check } from 'lucide-react';

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

  const handleLoadCurrent = useCallback(() => {
    const nowSecStr = Math.floor(Date.now() / 1000).toString();
    setInput(nowSecStr);
    addHistoryEntry('timestamp-explorer', 'Timestamp Explorer', 'Loaded Current Time', nowSecStr);
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  useGlobalShortcuts({
    onRun: handleLoadCurrent,
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
                <label htmlFor="timestamp-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t.epochLabel}
                </label>
                <Input
                  id="timestamp-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 1719600000 or YYYY-MM-DD"
                  className="rounded-none font-mono border border-border bg-card h-9 text-xs"
                />
              </div>
              {!stats.isValid && input && (
                <p className="text-xs font-bold text-destructive">{t.invalidFormat}</p>
              )}

              <ActionBar>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleLoadCurrent}>
                    {t.sampleButton}
                  </Button>
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
            <OutputPanel title="Conversions & Standards">
              <div className="space-y-4 text-xs font-semibold">
                {/* ISO 8601 */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t.iso8601}
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

                {/* UTC Date */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t.utcDate}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/20 border border-border px-3 py-1.5 flex-1 truncate text-foreground">{stats.utcString}</span>
                    <button
                      onClick={() => handleCopyValue('utc', stats.utcString)}
                      className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card rounded-none"
                      type="button"
                    >
                      {copiedField === 'utc' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <PipeButton value={stats.utcString} iconOnly={true} className="h-9 border border-border bg-card rounded-none px-3 text-muted-foreground hover:text-primary hover:bg-muted" />
                  </div>
                </div>

                {/* Local Date */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t.localDate}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/20 border border-border px-3 py-1.5 flex-1 truncate text-foreground">{stats.localString}</span>
                    <button
                      onClick={() => handleCopyValue('local', stats.localString)}
                      className="p-2 border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-card rounded-none"
                      type="button"
                    >
                      {copiedField === 'local' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <PipeButton value={stats.localString} iconOnly={true} className="h-9 border border-border bg-card rounded-none px-3 text-muted-foreground hover:text-primary hover:bg-muted" />
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
              Awaiting valid inputs
            </div>
          )}
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
