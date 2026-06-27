'use client';

import { useState, useEffect } from 'react';
import t from './locales/en.json';
import { generateLorem } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
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

  const { copied, copy } = useCopyToClipboard('lorem-ipsum-generator');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('lorem-ipsum-generator');
      // Auto-generate initial placeholder on mount
      setOutput(generateLorem({ type: 'paragraphs', amount: 5, format: 'text', startWithLorem: true }));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = () => {
    const result = generateLorem({ type, amount, format, startWithLorem });
    setOutput(result);
    trackToolCompletion('lorem-ipsum-generator');
  };

  const handleClear = () => {
    setOutput('');
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
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Privacy pledge indicators banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-[10px] sm:text-xs font-bold flex flex-wrap gap-x-4 gap-y-1">
        <span>✓ 100% Client-Side Generator</span>
        <span>✓ Local Browser Execution</span>
        <span>✓ Free & Secure Forever</span>
      </div>

      {/* Configuration Option Controls Card */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Generator Configuration Options
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Generate Type Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t.typeLabel}
              </label>
              <div className="flex gap-1 bg-muted p-0.5 rounded-md">
                {(['words', 'sentences', 'paragraphs'] as const).map((tType) => (
                  <button
                    key={tType}
                    onClick={() => setType(tType)}
                    className={`flex-1 text-[11px] font-bold py-1 px-2.5 rounded-md transition-all duration-200 ${
                      type === tType 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tType === 'words' ? t.words : tType === 'sentences' ? t.sentences : t.paragraphs}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Count Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="amount-input" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t.amountLabel}
              </label>
              <Input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                min={1}
                max={500}
                className="h-8 text-xs font-semibold"
              />
            </div>

            {/* Format Selection dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="format-select" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t.formatLabel}
              </label>
              <select
                id="format-select"
                value={format}
                onChange={(e) => setFormat(e.target.value as 'text' | 'html')}
                className="bg-background border border-input rounded-md px-2.5 py-1 text-xs font-semibold h-8 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="text">{t.plainText}</option>
                <option value="html">{t.html}</option>
              </select>
            </div>

          </div>

          <div className="flex flex-wrap gap-4 items-center pt-2 border-t justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-muted text-primary focus:ring-primary accent-primary"
              />
              {t.startWithLoremLabel}
            </label>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} disabled={!output}>
                {t.clearButton}
              </Button>
              <Button size="sm" onClick={handleGenerate}>
                {t.generateButton}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Panel display */}
      <Card className="flex flex-col h-full">
        <CardHeader className="py-3.5 px-4 border-b flex flex-row justify-between items-center space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.outputLabel}
          </CardTitle>
          {output && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                {t.downloadButton}
              </Button>
              <Button variant="outline" size="sm" onClick={() => copy(output)}>
                {copied ? t.copiedFeedback : t.copyButton}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <textarea
            readOnly
            value={output}
            placeholder="Placeholder text will be rendered here..."
            rows={14}
            className="w-full h-full min-h-[300px] border-none bg-muted/20 p-4 text-sm outline-none focus:ring-0 resize-y"
            aria-label="Generated Lorem Ipsum placeholder output text area"
          />
        </CardContent>
      </Card>
    </div>
  );
}
