'use client';

import { useState, useEffect, useRef, ChangeEvent, useMemo } from 'react';
import { FileText, Download, Copy, Trash, Sparkles, Upload } from 'lucide-react';
import t from './locales/en.json';
import { calculateTextStats } from './utils';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';
import CopyShareToast from '@/components/shared/CopyShareToast';

// Hooks
import { useUrlQueryInput } from '@/hooks/useUrlQueryInput';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
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
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useCopyToClipboard('word-counter');

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

  // Track initial page load view launch
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleFocusInput = () => {
    const textarea = document.querySelector('textarea[aria-label="Input text for counting analysis"]') as HTMLTextAreaElement;
    if (textarea) textarea.focus();
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        setFileError(null);
      }
    } catch {
      handleFocusInput();
    }
  };

  const handleCopyInput = () => {
    if (!input) return;
    copy(input);
    setShowToast(true);
  };

  const handleDownload = () => {
    if (!input) return;
    trackDownloadAction('word-counter');
    const blob = new Blob([input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-counter-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Casing transformations
  const transformToUppercase = () => setInput(input.toUpperCase());
  const transformToLowercase = () => setInput(input.toLowerCase());
  const transformToTitleCase = () => {
    const str = input.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setInput(str);
  };
  const transformToSentenceCase = () => {
    const str = input.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase());
    setInput(str);
  };

  // Text clean-ups
  const cleanupExtraSpaces = () => {
    const cleaned = input.replace(/\s+/g, ' ').trim();
    setInput(cleaned);
  };

  const cleanupStripHTML = () => {
    const cleaned = input.replace(/<\/?[^>]+(>|$)/g, "");
    setInput(cleaned);
  };

  const cleanupAlphanumericOnly = () => {
    const cleaned = input.replace(/[^a-zA-Z0-9\s]/g, "");
    setInput(cleaned);
  };

  // Statistics memoization
  const stats = useMemo(() => {
    return calculateTextStats(input);
  }, [input]);

  const linesCount = input ? input.split('\n').length : 0;

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  const caseModifiers = (
    <div className="flex flex-wrap gap-1.5 justify-end">
      <button
        onClick={transformToUppercase}
        disabled={!input.trim()}
        className="px-2 py-0.5 text-[9px] font-extrabold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer uppercase tracking-wider"
      >
        UPPERCASE
      </button>
      <button
        onClick={transformToLowercase}
        disabled={!input.trim()}
        className="px-2 py-0.5 text-[9px] font-extrabold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer uppercase tracking-wider"
      >
        lowercase
      </button>
      <button
        onClick={transformToTitleCase}
        disabled={!input.trim()}
        className="px-2 py-0.5 text-[9px] font-extrabold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer uppercase tracking-wider"
      >
        Title Case
      </button>
      <button
        onClick={transformToSentenceCase}
        disabled={!input.trim()}
        className="px-2 py-0.5 text-[9px] font-extrabold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer uppercase tracking-wider"
      >
        Sentence Case
      </button>
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      {/* 1. File validation error states */}
      {fileError && (
        <div className="p-3 text-xs font-semibold border bg-destructive/5 text-destructive border-destructive/20 rounded-none animate-in fade-in duration-200">
          {fileError}
        </div>
      )}

      {/* 2. Workspace Layout */}
      <ToolLayout>
        {/* Workspace Inputs/Cleanups */}
        <div className="space-y-6">
          <InputPanel 
            title={t.inputLabel} 
            actions={caseModifiers} 
            onPasteClick={handlePasteClick}
          >
            <div className="space-y-4">
              {/* Text Area Input */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border border-border bg-card p-1 transition-all duration-200 ${
                  isDragging ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  aria-label="Input text for counting analysis"
                  className="w-full h-96 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                />
                
                {isDragging && (
                  <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center border-2 border-dashed border-primary pointer-events-none">
                    <FileText className="h-8 w-8 text-primary animate-bounce mb-2" />
                    <span className="text-xs font-bold text-foreground">Drop File to Load Content</span>
                  </div>
                )}
              </div>

              {/* Action Operations */}
              <ActionBar>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload text file"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Upload File
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLoadSample}>
                    {t.loadSampleButton}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!input}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    {t.downloadButton}
                  </Button>
                  <PipeButton value={input} />
                  <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    {t.clearButton}
                  </Button>
                  <Button onClick={handleCopyInput} disabled={!input}>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    {t.copyButton}
                  </Button>
                </div>
              </ActionBar>
            </div>
          </InputPanel>

          {/* Premium Text Clean-Up Panel */}
          <Card className="rounded-none border border-border card-depth-1">
            <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" /> Text Clean-Up Toolbar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex flex-wrap gap-2.5 bg-card">
              <Button
                variant="outline"
                size="sm"
                onClick={cleanupExtraSpaces}
                disabled={!input.trim()}
                className="rounded-none text-[9px] font-extrabold uppercase tracking-wider"
              >
                Collapse Whitespace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cleanupStripHTML}
                disabled={!input.trim()}
                className="rounded-none text-[9px] font-extrabold uppercase tracking-wider"
              >
                Strip HTML Tags
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cleanupAlphanumericOnly}
                disabled={!input.trim()}
                className="rounded-none text-[9px] font-extrabold uppercase tracking-wider"
              >
                Remove Special Chars
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Statistics panels */}
        <div className="space-y-6">
          <Card className="rounded-none border border-border card-depth-2">
            <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Text Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-card divide-y divide-border/40 font-mono text-xs select-text">
              <div className="flex justify-between items-center py-2.5 px-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Characters</span>
                <span className="font-bold text-foreground">{stats.characters}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Words</span>
                <span className="font-bold text-foreground">{stats.words}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Lines</span>
                <span className="font-bold text-foreground">{linesCount}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Paragraphs</span>
                <span className="font-bold text-foreground">{stats.paragraphs}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reading Time</span>
                <span className="font-bold text-primary">{stats.readingTime}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Speaking Time</span>
                <span className="font-bold text-primary">{stats.speakingTime}</span>
              </div>
            </CardContent>
          </Card>

          {/* Density analysis card */}
          {stats.keywords && stats.keywords.length > 0 && (
            <Card className="rounded-none border border-border card-depth-2">
              <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Keyword Density
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 bg-card divide-y divide-border/40 font-mono text-xs select-text">
                {stats.keywords.slice(0, 8).map((item: { word: string; count: number; percentage: number }, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-2 px-4">
                    <span className="font-bold text-foreground truncate max-w-[120px]">{item.word}</span>
                    <span className="text-muted-foreground font-semibold">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Copied analyzed text to clipboard." 
      />
    </div>
  );
}
