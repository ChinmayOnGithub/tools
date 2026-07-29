'use client';

import { useState, useEffect, useCallback } from 'react';
import t from './locales/en.json';
import { inspectText } from './utils';
import { Button } from '@/components/ui/Button';
import { TextInputArea } from '@/components/ui/TextInputArea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { addHistoryEntry } from '@/lib/history';
import CopyShareToast from '@/components/shared/CopyShareToast';
import { Eye, Copy, Check } from 'lucide-react';

export default function UnicodeInspector() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { addRecent } = useWorkspace();

  const handleFocusInput = () => {
    const el = document.querySelector('textarea') as HTMLTextAreaElement;
    if (el) el.focus();
  };

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!input.trim()) return;
    addHistoryEntry(
      'unicode-inspector',
      'Unicode Inspector',
      'Inspected String',
      `${input.length} characters`
    );
  }, [input]);

  useGlobalShortcuts({
    onRun: handleAnalyze,
    onClear: handleClear,
    onFocusInput: handleFocusInput,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      addRecent('unicode-inspector');
      setInput('Hello 👋\u200b');
    }, 0);
    return () => clearTimeout(timer);
  }, [addRecent]);

  const chars = inspectText(input);

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
      {/* Action Configuration Panel */}
      <div className="flex flex-wrap gap-2 items-center bg-card p-3 border-2 border-border rounded-none justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleClear} className="rounded-none border-2" disabled={!input}>
            Clear Input
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Input Card */}
        <TextInputArea
          label={t.inputLabel}
          value={input}
          onChange={setInput}
          placeholder="Paste or type text to inspect..."
          rows={4}
          showStats={false}
        />

        {/* Results Card */}
        <Card className="rounded-none border-2">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-foreground">
              <Eye className="h-4 w-4 text-primary" /> Character Mapping Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {chars.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-muted-foreground uppercase">
                {t.emptyState}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-border bg-muted/40 font-black uppercase tracking-wider text-[10px] text-muted-foreground">
                      <th className="p-2 border-r border-border">Idx</th>
                      <th className="p-2 border-r border-border">{t.charHeader}</th>
                      <th className="p-2 border-r border-border">{t.codePointHeader}</th>
                      <th className="p-2 border-r border-border">{t.hexHeader}</th>
                      <th className="p-2">{t.nameHeader}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chars.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-border/60 hover:bg-muted/10 ${
                          item.isHidden ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <td className="p-2 border-r border-border font-mono text-[10px] text-muted-foreground">
                          {item.index}
                        </td>
                        <td className="p-2 border-r border-border font-bold text-center text-sm">
                          {item.isHidden ? (
                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                              Hidden
                            </span>
                          ) : (
                            item.char
                          )}
                        </td>
                        <td className="p-2 border-r border-border font-mono">{item.codePoint}</td>
                        <td className="p-2 border-r border-border font-mono flex items-center justify-between gap-2">
                          <span>{item.hex}</span>
                          <button
                            onClick={() => handleCopyValue(`hex-${idx}`, item.hex)}
                            className="p-1 hover:border-primary text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-transparent"
                            title="Copy code point hex"
                          >
                            {copiedField === `hex-${idx}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="p-2 font-bold text-foreground">
                          {item.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
