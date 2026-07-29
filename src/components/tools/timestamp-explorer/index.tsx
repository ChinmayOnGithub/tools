'use client';

import { useState, useEffect, useCallback } from 'react';
import t from './locales/en.json';
import { parseEpoch } from './utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { addHistoryEntry } from '@/lib/history';
import CopyShareToast from '@/components/shared/CopyShareToast';
import { Calendar, Clock, Copy, Check } from 'lucide-react';

export default function TimestampExplorer() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { addRecent } = useWorkspace();

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
      setInput(Math.floor(Date.now() / 1000).toString());
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
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Action configuration panel */}
      <div className="flex flex-wrap gap-2 items-center bg-card p-3 border-2 border-border rounded-none justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadCurrent} className="rounded-none border-2">
            {t.sampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} className="rounded-none border-2" disabled={!input}>
            Clear
          </Button>
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Card */}
        <Card className="rounded-none border-2 flex flex-col">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-foreground">
              <Calendar className="h-4 w-4 text-primary" /> Input Timestamp / Date
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="timestamp-input" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t.epochLabel}
              </label>
              <Input
                id="timestamp-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. 1719600000 or YYYY-MM-DD"
                className="rounded-none font-mono"
              />
            </div>
            {!stats.isValid && input && (
              <p className="text-xs font-bold text-destructive">{t.invalidFormat}</p>
            )}
          </CardContent>
        </Card>

        {/* Output Values Card */}
        <Card className="rounded-none border-2 flex flex-col">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-foreground">
              <Clock className="h-4 w-4 text-primary" /> Conversions &amp; Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {stats.isValid ? (
              <div className="space-y-3.5 text-xs">
                {/* ISO 8601 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t.iso8601}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/30 border px-2 py-1 flex-1 truncate">{stats.iso8601}</span>
                    <button
                      onClick={() => handleCopyValue('iso', stats.iso8601)}
                      className="p-1.5 border-2 border-border hover:border-primary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {copiedField === 'iso' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* RFC 3339 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t.rfc3339}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/30 border px-2 py-1 flex-1 truncate">{stats.rfc3339}</span>
                    <button
                      onClick={() => handleCopyValue('rfc', stats.rfc3339)}
                      className="p-1.5 border-2 border-border hover:border-primary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {copiedField === 'rfc' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* UTC Date */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t.utcDate}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/30 border px-2 py-1 flex-1 truncate">{stats.utcString}</span>
                    <button
                      onClick={() => handleCopyValue('utc', stats.utcString)}
                      className="p-1.5 border-2 border-border hover:border-primary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {copiedField === 'utc' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Local Date */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t.localDate}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono bg-muted/30 border px-2 py-1 flex-1 truncate">{stats.localString}</span>
                    <button
                      onClick={() => handleCopyValue('local', stats.localString)}
                      className="p-1.5 border-2 border-border hover:border-primary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {copiedField === 'local' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Relative Time */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t.relativeTime}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-primary bg-muted/30 border px-2 py-1 flex-1 truncate">{stats.relative}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-bold text-muted-foreground uppercase">
                Awaiting valid inputs
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
