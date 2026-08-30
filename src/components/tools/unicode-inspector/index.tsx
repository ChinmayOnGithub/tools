'use client';

import { useState, useEffect, useCallback } from 'react';
import t from './locales/en.json';
import { inspectText } from './utils';

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
import { addHistoryEntry } from '@/lib/history';
import { Copy, Check, AlertTriangle } from 'lucide-react';

export default function UnicodeInspector() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { addRecent } = useWorkspace();

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

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
      if (!window.location.search.includes('input=') && !window.location.search.includes('data=')) {
        setInput('Hello 👋\u200b\u202Etest');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [addRecent]);

  const chars = inspectText(input);
  const hiddenCount = chars.filter((c) => c.isHidden).length;
  const zeroWidthCount = chars.filter((c) => c.isZeroWidth).length;
  const bidiCount = chars.filter((c) => c.isBidiControl).length;

  const handleCopyValue = (fieldId: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(fieldId);
      setShowToast(true);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  const loadPreset = (presetText: string) => {
    setInput(presetText);
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
            title={t.inputLabel}
            onPasteClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (text) setInput(text);
              } catch {
                handleFocusInput();
              }
            }}
          >
            <div className="space-y-4">
              <div className="border border-border bg-card p-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste or type text to inspect code points, hidden characters, UTF-8 bytes..."
                  aria-label="Input text for Unicode inspection"
                  className="w-full h-36 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                />
              </div>

              {/* Inspector Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Test Examples:</span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => loadPreset('API_KEY_\u200Bsecret')}
                    className="px-2 py-1 bg-muted/60 hover:bg-muted text-[11px] font-medium border border-border cursor-pointer transition-colors"
                  >
                    Zero-Width Space Injection
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset('user\u202Efdp.exe')}
                    className="px-2 py-1 bg-muted/60 hover:bg-muted text-[11px] font-medium border border-border cursor-pointer transition-colors"
                  >
                    Right-to-Left Override (Spoof)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset('👨‍👩‍👧‍👦 Family Emoji')}
                    className="px-2 py-1 bg-muted/60 hover:bg-muted text-[11px] font-medium border border-border cursor-pointer transition-colors"
                  >
                    Multi-Codepoint Emoji (ZWJ)
                  </button>
                </div>
              </div>

              <ActionBar>
                <div className="flex gap-2">
                  <PipeButton value={input} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
                    Clear Input
                  </Button>
                </div>
              </ActionBar>
            </div>
          </InputPanel>
        </div>

        {/* Character Mapping Matrix Panel */}
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-card border border-border">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Characters</div>
              <div className="text-lg font-black text-foreground">{chars.length}</div>
            </div>
            <div className={`p-3 bg-card border ${hiddenCount > 0 ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                {hiddenCount > 0 && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                <span>Hidden / Controls</span>
              </div>
              <div className={`text-lg font-black ${hiddenCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>{hiddenCount}</div>
            </div>
            <div className="p-3 bg-card border border-border">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Zero-Width Items</div>
              <div className="text-lg font-black text-foreground">{zeroWidthCount}</div>
            </div>
            <div className="p-3 bg-card border border-border">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">BiDi Controls</div>
              <div className="text-lg font-black text-foreground">{bidiCount}</div>
            </div>
          </div>

          <OutputPanel title="Character Mapping Matrix (UTF-8, UTF-16, Categories)">
            {chars.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-muted-foreground uppercase border border-dashed border-border">
                {t.emptyState}
              </div>
            ) : (
              <div className="overflow-x-auto border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-border bg-muted/40 font-black uppercase tracking-wider text-[10px] text-muted-foreground">
                      <th className="p-2 border-r border-border w-10">Idx</th>
                      <th className="p-2 border-r border-border w-16 text-center">{t.charHeader}</th>
                      <th className="p-2 border-r border-border w-24">Code Point</th>
                      <th className="p-2 border-r border-border w-24">UTF-8 Hex</th>
                      <th className="p-2 border-r border-border w-24">UTF-16 Units</th>
                      <th className="p-2 border-r border-border w-32">Category</th>
                      <th className="p-2">{t.nameHeader}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {chars.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-muted/10 transition-colors ${
                          item.isHidden ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <td className="p-2 border-r border-border font-mono text-[10px] text-muted-foreground">
                          {item.index}
                        </td>
                        <td className="p-2 border-r border-border font-bold text-center text-sm">
                          {item.isHidden ? (
                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                              Hidden
                            </span>
                          ) : (
                            item.char
                          )}
                        </td>
                        <td className="p-2 border-r border-border font-mono flex items-center justify-between gap-1">
                          <span>{item.hex}</span>
                          <button
                            onClick={() => handleCopyValue(`hex-${idx}`, item.hex)}
                            className="p-1 hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title="Copy code point"
                            type="button"
                          >
                            {copiedField === `hex-${idx}` ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </td>
                        <td className="p-2 border-r border-border font-mono text-[11px] text-muted-foreground">
                          {item.utf8Hex}
                        </td>
                        <td className="p-2 border-r border-border font-mono text-[11px] text-muted-foreground">
                          {item.utf16Hex}
                        </td>
                        <td className="p-2 border-r border-border text-[11px] text-muted-foreground font-medium">
                          {item.category}
                        </td>
                        <td className="p-2 font-bold text-foreground text-xs" title={item.name}>
                          {item.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
