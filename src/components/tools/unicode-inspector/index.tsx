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
import { Copy, Check } from 'lucide-react';

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
        setInput('Hello 👋\u200b');
      }
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
                  placeholder="Paste or type text to inspect..."
                  aria-label="Input text for Unicode inspection"
                  className="w-full h-40 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                />
              </div>

              <ActionBar>
                <div className="flex gap-2" />
                <div className="flex gap-2">
                  <PipeButton value={input} />
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
          <OutputPanel title="Character Mapping Matrix">
            {chars.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-muted-foreground uppercase border border-dashed border-border">
                {t.emptyState}
              </div>
            ) : (
              <div className="overflow-x-auto border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-border bg-muted/40 font-black uppercase tracking-wider text-[10px] text-muted-foreground">
                      <th className="p-2 border-r border-border w-12">Idx</th>
                      <th className="p-2 border-r border-border w-20 text-center">{t.charHeader}</th>
                      <th className="p-2 border-r border-border w-24">{t.codePointHeader}</th>
                      <th className="p-2 border-r border-border w-36">{t.hexHeader}</th>
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
                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                              Hidden
                            </span>
                          ) : (
                            item.char
                          )}
                        </td>
                        <td className="p-2 border-r border-border font-mono">{item.codePoint}</td>
                        <td className="p-2 border-r border-border font-mono flex items-center justify-between gap-1.5">
                          <span>{item.hex}</span>
                          <div className="flex items-stretch shrink-0 h-6">
                            <button
                              onClick={() => handleCopyValue(`hex-${idx}`, item.hex)}
                              className="px-2 border-l border-border/40 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                              title="Copy code point hex"
                              type="button"
                            >
                              {copiedField === `hex-${idx}` ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <PipeButton value={item.hex} iconOnly={true} className="h-full border-t-0 border-b-0 border-r-0 border-l border-border/40 bg-transparent text-muted-foreground hover:text-primary hover:bg-muted font-bold text-[9px] uppercase tracking-wider rounded-none px-2" />
                          </div>
                        </td>
                        <td className="p-2 font-bold text-foreground truncate max-w-[200px]" title={item.name}>
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
