'use client';

import { useState, useEffect } from 'react';
import t from './locales/en.json';
import { encodeURLString, decodeURLString } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';

export default function URLEncoder() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  const { copied, copy } = useCopyToClipboard('url-encoder');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('url-encoder');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce conversion event tracking to prevent flooding GA4 logs during keystrokes
  useEffect(() => {
    if (!input.trim()) return;

    const timer = setTimeout(() => {
      if (mode === 'encode') {
        trackToolCompletion('url-encoder');
      } else {
        const result = decodeURLString(input);
        if (result.success) {
          trackToolCompletion('url-encoder');
        } else {
          trackValidationError('url-encoder', 'decode_failed');
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, mode]);

  let output = '';
  let errorMsg: string | null = null;

  // Input boundary limit checking
  const isInputTooLarge = input.length > 2000000;

  if (isInputTooLarge) {
    errorMsg = 'Input size exceeds maximum limit of 2MB. Please enter a smaller URL string.';
  } else if (input.trim()) {
    if (mode === 'encode') {
      output = encodeURLString(input);
    } else {
      const result = decodeURLString(input);
      if (result.success) {
        output = result.output;
      } else {
        errorMsg = t.validationError.replace('{message}', result.error || 'Invalid string');
      }
    }
  }

  const handleClear = () => {
    setInput('');
  };

  const handleLoadSample = () => {
    if (mode === 'encode') {
      setInput('https://tools.chinmaypatil.com/search?query=json formatter & validator=true');
    } else {
      setInput('https%3A%2F%2Ftools.chinmaypatil.com%2Fsearch%3Fquery%3Djson%20formatter%20%26%20validator%3Dtrue');
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Controls panel */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-card p-3 border-2 border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mode === 'encode' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('encode');
              handleClear();
            }}
          >
            {t.encodeButton}
          </Button>
          <Button
            variant={mode === 'decode' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('decode');
              handleClear();
            }}
          >
            {t.decodeButton}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load Sample
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
            {t.clearButton}
          </Button>
        </div>
      </div>

      {/* Validation Message Box */}
      {errorMsg && (
        <div className="p-3 text-xs font-semibold border-2 bg-destructive/10 text-destructive border-destructive/20">
          {errorMsg}
        </div>
      )}

      {/* Inputs grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="py-3.5 px-4 border-b">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t.inputLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              rows={12}
              className="w-full h-full min-h-[250px] border-none bg-transparent p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="URL raw inputs text"
            />
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="py-3.5 px-4 border-b flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t.outputLabel}
            </CardTitle>
            {output && (
              <Button variant="outline" size="sm" onClick={() => copy(output)}>
                {copied ? t.copiedFeedback : t.copyButton}
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <textarea
              readOnly
              value={output}
              placeholder={t.outputPlaceholder}
              rows={12}
              className="w-full h-full min-h-[250px] border-none bg-muted/20 p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="URL converted output text"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
