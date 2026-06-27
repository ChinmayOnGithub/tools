'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import t from './locales/en.json';
import { beautifyJSON, minifyJSON } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { downloadFile } from '@/lib/download';

const SAMPLE_JSON = `{
  "name": "CoolTools Platform",
  "version": 1.0,
  "private": true,
  "features": [
    "100% local computing",
    "zero server logging",
    "instant output speed"
  ],
  "requirements": {
    "browser": "modern",
    "cookies": false
  }
}`;

export default function JSONFormatter() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleBeautify = () => {
    const result = beautifyJSON(input);
    if (result.success) {
      setOutput(result.output);
      setErrorMsg(null);
      setIsValid(true);
    } else {
      setOutput('');
      setIsValid(false);
      setErrorMsg(
        t.validationError
          .replace('{message}', result.error || 'Invalid JSON')
          .replace('{line}', String(result.line || 1))
          .replace('{column}', String(result.column || 1))
      );
    }
  };

  const handleMinify = () => {
    const result = minifyJSON(input);
    if (result.success) {
      setOutput(result.output);
      setErrorMsg(null);
      setIsValid(true);
    } else {
      setOutput('');
      setIsValid(false);
      setErrorMsg(
        t.validationError
          .replace('{message}', result.error || 'Invalid JSON')
          .replace('{line}', String(result.line || 1))
          .replace('{column}', String(result.column || 1))
      );
    }
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    setOutput('');
    setErrorMsg(null);
    setIsValid(null);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setErrorMsg(null);
    setIsValid(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string || '');
      setOutput('');
      setErrorMsg(null);
      setIsValid(null);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!output) return;
    downloadFile(output, 'formatted.json', 'application/json');
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Configuration Action Controls */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-card p-3 rounded-lg border">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            {t.sampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            {t.uploadButton}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
            aria-label="Upload JSON file"
          />
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
            {t.clearButton}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleBeautify} disabled={!input.trim()}>
            {t.beautifyButton}
          </Button>
          <Button onClick={handleMinify} disabled={!input.trim()}>
            {t.minifyButton}
          </Button>
        </div>
      </div>

      {/* Validation Message Box */}
      {isValid !== null && (
        <div className={`p-3 rounded-lg text-xs font-semibold border ${
          isValid 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
            : 'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {isValid ? t.validationValid : errorMsg}
        </div>
      )}

      {/* Workspaces Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
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
              rows={16}
              className="w-full h-full min-h-[300px] border-none bg-transparent p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="JSON raw inputs text"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
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
              placeholder={t.outputPlaceholder}
              rows={16}
              className="w-full h-full min-h-[300px] border-none bg-muted/20 p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="JSON formatted output text"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
