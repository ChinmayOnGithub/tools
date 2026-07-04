'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import t from './locales/en.json';
import { generateHash } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { validateFile } from '@/lib/file-processor';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError, 
  trackDownloadAction 
} from '@/lib/analytics';

const ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

export default function HashGenerator() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [uppercase, setUppercase] = useState(false);
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard('hash-generator');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('hash-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Recalculate hash asynchronously when inputs change
  useEffect(() => {
    if (!input) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOutput('');
      setErrorMsg(null);
      return;
    }

    if (input.length > 2000000) {
      setOutput('');
      setErrorMsg('Input size exceeds maximum limit of 2MB.');
      trackValidationError('hash-generator', 'size_limit_exceeded');
      return;
    }

    let isCurrent = true;
    generateHash(input, algorithm)
      .then((hash) => {
        if (!isCurrent) return;
        setOutput(uppercase ? hash.toUpperCase() : hash);
        setErrorMsg(null);
        trackToolCompletion('hash-generator');
      })
      .catch((err) => {
        if (!isCurrent) return;
        setOutput('');
        setErrorMsg(err.message || 'Hash generation failed.');
        trackValidationError('hash-generator', 'calc_error');
      });

    return () => {
      isCurrent = false;
    };
  }, [input, algorithm, uppercase]);

  const handleClear = () => {
    setInput('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setInput('CoolTools: Fast, secure, and private browser-based utilities.');
  };

  const processUploadedFile = (file: File) => {
    setErrorMsg(null);

    // Standardized file validation
    const check = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB limit for text hashing
    });

    if (!check.isValid) {
      setErrorMsg(check.error || 'File validation failed.');
      trackValidationError('hash-generator', 'file_validation_failed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const handleDownload = () => {
    if (!output) return;
    trackDownloadAction('hash-generator');
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithm.toLowerCase()}_hash.txt`;
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
      <div className="bg-muted/30 border-2 border-border p-3 rounded-none text-[10px] sm:text-xs font-bold text-muted-foreground flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Web Crypto Browser Compute
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Inputs Never Uploaded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Free & Secure Forever
        </span>
      </div>

      {/* Action configuration panel */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-card p-3 rounded-lg border">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.algorithmLabel}
            </span>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="bg-background border border-input rounded-md px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Cryptographic hash algorithm"
            >
              {ALGORITHMS.map((alg) => (
                <option key={alg} value={alg}>
                  {alg}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none border-l pl-3">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            {t.uppercaseLabel}
          </label>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload Text File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.json,.js,.ts"
            className="hidden"
            aria-label="Upload text file for hashing"
          />
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            {t.loadSampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
            {t.clearButton}
          </Button>
        </div>
      </div>

      {/* Error state box */}
      {errorMsg && (
        <div className="p-3 rounded-lg text-xs font-semibold border bg-destructive/10 text-destructive border-destructive/20">
          {errorMsg}
        </div>
      )}

      {/* Workspaces layout grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card 
          className={`flex flex-col h-full relative transition-all duration-200 ${
            isDragging ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardHeader className="py-3.5 px-4 border-b">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t.inputLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative">
            {isDragging && (
              <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center z-10 text-center p-4">
                <p className="text-xs font-bold text-primary">Drop File Here</p>
                <p className="text-[10px] text-muted-foreground mt-1">Accepts text files under 2MB</p>
              </div>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              rows={12}
              className="w-full h-full min-h-[250px] border-none bg-transparent p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="Raw text input for hashing"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col h-full">
          <CardHeader className="py-3.5 px-4 border-b flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t.outputLabel} ({algorithm})
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
              placeholder="Hash output will be rendered here..."
              rows={12}
              className="w-full h-full min-h-[250px] border-none bg-muted/20 p-4 font-mono text-xs outline-none focus:ring-0 resize-y break-all"
              aria-label="Generated cryptographic hash string"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
