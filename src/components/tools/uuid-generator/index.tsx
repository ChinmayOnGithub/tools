'use client';

import { useState, useEffect, useCallback } from 'react';
import t from './locales/en.json';
import { generateUUIDs } from './utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';

export default function UUIDGenerator() {
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [output, setOutput] = useState<string[]>([]);

  const { copied, copy } = useCopyToClipboard('uuid-generator');

  const handleGenerate = useCallback(() => {
    // Input validation & limits check
    const boundedQuantity = Math.max(1, Math.min(500, quantity));
    const list = generateUUIDs(boundedQuantity, { uppercase, hyphens });
    setOutput(list);
    trackToolCompletion('uuid-generator');
  }, [quantity, uppercase, hyphens]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('uuid-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleGenerate();
    }
  }, [mounted, handleGenerate]);

  const handleCopy = () => {
    if (output.length === 0) return;
    copy(output.join('\n'));
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configurations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label htmlFor="quantity" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.quantityLabel}
            </label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
              aria-label="Quantity of UUIDs to generate"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 py-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-2 cursor-pointer"
              />
              {t.uppercaseLabel}
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-2 cursor-pointer"
              />
              {t.hyphensLabel}
            </label>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleGenerate} className="w-full md:w-auto">
              {t.generateButton}
            </Button>
          </div>
        </div>

        {/* Output Box */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Output
            </span>
            {output.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? t.copiedFeedback : t.copyButton}
              </Button>
            )}
          </div>
          <textarea
            readOnly
            value={output.join('\n')}
            placeholder={t.placeholder}
            rows={10}
            className="w-full rounded-md border border-input bg-muted/40 p-3 font-mono text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 resize-y"
            aria-label="Generated UUID outputs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
