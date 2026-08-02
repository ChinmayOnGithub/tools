'use client';

import { useState, useEffect } from 'react';
import { Download, Trash, RefreshCw, Copy } from 'lucide-react';
import t from './locales/en.json';
import { generateLorem } from './utils';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';
import CopyShareToast from '@/components/shared/CopyShareToast';

// Hooks
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackDownloadAction 
} from '@/lib/analytics';

export default function LoremIpsumGenerator() {
  const [mounted, setMounted] = useState(false);
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [amount, setAmount] = useState<number>(5);
  const [format, setFormat] = useState<'text' | 'html'>('text');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { copy } = useCopyToClipboard('lorem-ipsum-generator');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('lorem-ipsum-generator');
      setOutput(generateLorem({ type: 'paragraphs', amount: 5, format: 'text', startWithLorem: true }));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = () => {
    const result = generateLorem({ type, amount: Math.max(1, Math.min(100, amount)), format, startWithLorem });
    setOutput(result);
    trackToolCompletion('lorem-ipsum-generator');
  };

  const handleClear = () => {
    setOutput('');
  };

  const handleCopyOutput = () => {
    if (!output) return;
    copy(output);
    setShowToast(true);
  };

  const handleDownload = () => {
    if (!output) return;
    trackDownloadAction('lorem-ipsum-generator');
    const blob = new Blob([output], { type: format === 'html' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = format === 'html' ? 'placeholder.html' : 'placeholder.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  const formatToggles = (
    <div className="flex border border-border rounded-none overflow-hidden h-7">
      <button
        onClick={() => setFormat('text')}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-border transition-colors ${
          format === 'text'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        Plain Text
      </button>
      <button
        onClick={() => setFormat('html')}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          format === 'html'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        HTML Markup
      </button>
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* 1. Settings Panel */}
        <div className="space-y-6">
          <InputPanel title="Generator Configurations" actions={formatToggles}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Generation Mode Select */}
                <div className="space-y-1.5">
                  <label htmlFor="gen-type" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Generation Unit
                  </label>
                  <select
                    id="gen-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'words' | 'sentences' | 'paragraphs')}
                    className="w-full h-9 border border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
                  >
                    <option value="words">Words</option>
                    <option value="sentences">Sentences</option>
                    <option value="paragraphs">Paragraphs</option>
                  </select>
                </div>

                {/* Amount input */}
                <div className="space-y-1.5">
                  <label htmlFor="gen-amount" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Amount to Generate
                  </label>
                  <Input
                    id="gen-amount"
                    type="number"
                    min={1}
                    max={100}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="h-9 text-xs font-semibold rounded-none border border-border bg-card"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-border/40">
                <CheckboxField
                  id="opt-start-lorem"
                  label="Start with 'Lorem ipsum dolor sit amet'"
                  checked={startWithLorem}
                  onChange={setStartWithLorem}
                />
              </div>

              {/* Actions */}
              <ActionBar>
                <div className="flex gap-2">
                  <Button onClick={handleGenerate}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Generate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear} disabled={!output}>
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    {t.clearButton}
                  </Button>
                </div>
              </ActionBar>
            </div>
          </InputPanel>
        </div>

        {/* 2. Output Panel */}
        <div className="space-y-6">
          {!!output && (
            <OutputPanel title={t.outputLabel}>
              <div className="space-y-4">
                <div className="border border-border bg-card p-1">
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Generated placeholder text will appear here..."
                    aria-label="Lorem output text"
                    className="w-full h-80 bg-transparent text-xs font-mono p-3 border-none outline-none focus:ring-0 text-foreground resize-y"
                  />
                </div>

                <ActionBar>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      {t.downloadButton}
                    </Button>
                    <PipeButton value={output} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCopyOutput}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Text
                    </Button>
                  </div>
                </ActionBar>
              </div>
            </OutputPanel>
          )}
        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Copied placeholder text to clipboard." 
      />
    </div>
  );
}
