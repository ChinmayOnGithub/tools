'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import t from './locales/en.json';
import { calculateTextStats } from './utils';
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

const SAMPLE_TEXT = `JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

CoolTools operates 100% locally in your web browser tab. Security and confidentiality are preserved.`;

export default function WordCounter() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard('word-counter');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('word-counter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce analytics completion logs
  useEffect(() => {
    if (!input.trim() || fileError) return;

    const timer = setTimeout(() => {
      trackToolCompletion('word-counter');
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, fileError]);

  const handleClear = () => {
    setInput('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setFileError(null);
    setInput(SAMPLE_TEXT);
  };

  const processUploadedFile = (file: File) => {
    setFileError(null);

    // Standardized file validation
    const check = validateFile(file, {
      maxSize: 5 * 1024 * 1024, // 5MB limit
    });

    if (!check.isValid) {
      setFileError(check.error || 'File validation failed.');
      trackValidationError('word-counter', 'file_validation_failed');
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
    if (!input) return;
    trackDownloadAction('word-counter');
    const blob = new Blob([input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word_counter_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  const stats = calculateTextStats(input);

  return (
    <div className="space-y-6 w-full">
      {/* Privacy pledge indicators banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-[10px] sm:text-xs font-bold flex flex-wrap gap-x-4 gap-y-1">
        <span>✓ 100% In-Browser Analysis</span>
        <span>✓ Text Never Leaves Your Device</span>
        <span>✓ Free & Secure Forever</span>
      </div>

      {/* Action controls */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-card p-3 rounded-lg border">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload Text File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.json,.md,.js,.ts"
            className="hidden"
            aria-label="Upload text file for analysis"
          />
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            {t.loadSampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
            {t.clearButton}
          </Button>
        </div>

        {input && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              {t.downloadButton}
            </Button>
            <Button variant="outline" size="sm" onClick={() => copy(input)}>
              {copied ? t.copiedFeedback : t.copyButton}
            </Button>
          </div>
        )}
      </div>

      {/* File error notification */}
      {fileError && (
        <div className="p-3 rounded-lg text-xs font-semibold border bg-destructive/10 text-destructive border-destructive/20">
          {fileError}
        </div>
      )}

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Text Input area (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <Card 
            className={`flex flex-col h-full min-h-[350px] relative transition-all duration-200 ${
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
                  <p className="text-[10px] text-muted-foreground mt-1">Accepts text files under 5MB</p>
                </div>
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full h-full min-h-[300px] border-none bg-transparent p-4 text-sm outline-none focus:ring-0 resize-y"
                aria-label="Input text for counting analysis"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Statistics panel (1/3 width on desktop) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="py-3 px-4 border-b bg-muted/10">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.statsLabel}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Primary metrics boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-primary font-mono">{stats.words}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                    {t.words}
                  </span>
                </div>
                
                <div className="bg-secondary/40 p-3 rounded-lg border flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-foreground font-mono">{stats.characters}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                    {t.characters}
                  </span>
                </div>

                <div className="bg-secondary/40 p-3 rounded-lg border flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-foreground font-mono">{stats.sentences}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                    {t.sentences}
                  </span>
                </div>

                <div className="bg-secondary/40 p-3 rounded-lg border flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-foreground font-mono">{stats.paragraphs}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                    {t.paragraphs}
                  </span>
                </div>
              </div>

              {/* Secondary details */}
              <div className="border-t pt-3 space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground font-semibold">{t.charactersNoSpaces}</span>
                  <span className="font-mono font-bold text-foreground">{stats.charactersNoSpaces}</span>
                </div>
                
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground font-semibold">{t.readingTime}</span>
                  <span className="font-semibold text-foreground">{stats.readingTime}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">{t.speakingTime}</span>
                  <span className="font-semibold text-foreground">{stats.speakingTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
