'use client';

import { useState, useEffect } from 'react';
import t from './locales/en.json';
import { generateLorem } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { TextInputArea } from '@/components/ui/TextInputArea';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackDownloadAction 
} from '@/lib/analytics';
import TrustBanner from '@/components/shared/TrustBanner';

export default function LoremIpsumGenerator() {
  const [mounted, setMounted] = useState(false);
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [amount, setAmount] = useState<number>(5);
  const [format, setFormat] = useState<'text' | 'html'>('text');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

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
      {/* Trust pledge indicators banner */}
      <TrustBanner items={['100% Client-Side Generator', 'Local Browser Execution', 'Free & Secure Forever']} className="animate-fade-in" />

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
              <SegmentedControl
                options={[
                  { value: 'words', label: t.words },
                  { value: 'sentences', label: t.sentences },
                  { value: 'paragraphs', label: t.paragraphs },
                ]}
                value={type}
                onChange={(val) => setType(val as 'words' | 'sentences' | 'paragraphs')}
                className="h-8"
              />
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
                className="bg-background border-2 border-input px-2.5 py-1 text-xs font-semibold h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                <option value="text">{t.plainText}</option>
                <option value="html">{t.html}</option>
              </select>
            </div>

          </div>

          <div className="flex flex-wrap gap-4 items-center pt-2 border-t justify-between">
            <CheckboxField
              id="lorem-start"
              label={t.startWithLoremLabel}
              checked={startWithLorem}
              onChange={setStartWithLorem}
            />

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} disabled={!output} className="h-8 text-xs">
                {t.clearButton}
              </Button>
              <Button size="sm" onClick={handleGenerate} className="h-8 text-xs">
                {t.generateButton}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Panel display */}
      <div className="relative">
        {output && (
          <div className="absolute right-4 top-3 z-10 flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 text-xs">
              {t.downloadButton}
            </Button>
          </div>
        )}
        <TextInputArea
          value={output}
          label={t.outputLabel}
          readOnly={true}
          showStats={true}
          placeholder="Placeholder text will be rendered here..."
          rows={14}
        />
      </div>
    </div>
  );
}
