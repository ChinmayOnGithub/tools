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
import { BarChart3, HelpCircle, FileText, Download, Copy, Trash, Sparkles, AlignLeft } from 'lucide-react';
import TrustBanner from '@/components/shared/TrustBanner';

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

  // Quick case transformation functions
  const transformToUppercase = () => {
    setInput(input.toUpperCase());
  };

  const transformToLowercase = () => {
    setInput(input.toLowerCase());
  };

  const transformToTitleCase = () => {
    const transformed = input.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    setInput(transformed);
  };

  const transformToSentenceCase = () => {
    const transformed = input.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (_m, separator, char) => {
      return separator + char.toUpperCase();
    });
    setInput(transformed);
  };

  // Text Clean-Up Panel operations
  const cleanupExtraSpaces = () => {
    const cleaned = input.replace(/\s+/g, ' ').trim();
    setInput(cleaned);
  };

  const cleanupStripHTML = () => {
    const cleaned = input.replace(/<[^>]*>/g, '');
    setInput(cleaned);
  };

  const cleanupAlphanumericOnly = () => {
    const cleaned = input.replace(/[^a-zA-Z0-9\s]/g, '');
    setInput(cleaned);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  const stats = calculateTextStats(input);

  return (
    <div className="space-y-6 w-full">
      {/* Trust pledge indicators banner */}
      <TrustBanner />

      {/* Action controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 border-2 border-border rounded-none">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-none border-2">
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
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="rounded-none border-2">
            {t.loadSampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input} className="rounded-none border-2 text-destructive hover:bg-destructive/5 flex items-center gap-1.5">
            <Trash className="h-3.5 w-3.5" /> {t.clearButton}
          </Button>
        </div>

        {input && (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-none border-2 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> {t.downloadButton}
            </Button>
            <Button variant="outline" size="sm" onClick={() => copy(input)} className="rounded-none border-2 w-24 flex items-center justify-center gap-1.5">
              <Copy className="h-3.5 w-3.5" /> {copied ? t.copiedFeedback : t.copyButton}
            </Button>
          </div>
        )}
      </div>

      {/* File error notification */}
      {fileError && (
        <div className="p-3 text-xs font-semibold border-2 bg-destructive/5 text-destructive border-destructive/20 rounded-none">
          {fileError}
        </div>
      )}

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Text Input area (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            className={`flex flex-col h-full min-h-[380px] relative transition-all duration-200 rounded-none border-2 border-border card-depth-1 ${
              isDragging ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/10 flex flex-row justify-between items-center space-y-0">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> {t.inputLabel}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative flex flex-col">
              {isDragging && (
                <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center z-10 text-center p-4">
                  <p className="text-xs font-bold text-primary">Drop File Here</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Accepts text files under 5MB</p>
                </div>
              )}
              
              {/* Quick Case Transformation bar */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-muted/10 border-b border-border">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground self-center mr-1">Case Modifiers:</span>
                <button
                  onClick={transformToUppercase}
                  disabled={!input.trim()}
                  className="px-2 py-0.5 text-[9px] font-bold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer"
                >
                  UPPERCASE
                </button>
                <button
                  onClick={transformToLowercase}
                  disabled={!input.trim()}
                  className="px-2 py-0.5 text-[9px] font-bold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer"
                >
                  lowercase
                </button>
                <button
                  onClick={transformToTitleCase}
                  disabled={!input.trim()}
                  className="px-2 py-0.5 text-[9px] font-bold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer"
                >
                  Title Case
                </button>
                <button
                  onClick={transformToSentenceCase}
                  disabled={!input.trim()}
                  className="px-2 py-0.5 text-[9px] font-bold border border-border hover:border-primary hover:text-primary bg-background disabled:opacity-40 disabled:pointer-events-none rounded-none cursor-pointer"
                >
                  Sentence Case
                </button>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full flex-1 min-h-[300px] border-none bg-transparent p-4 text-sm outline-none focus:ring-0 resize-y"
                aria-label="Input text for counting analysis"
              />
            </CardContent>
          </Card>

          {/* Premium Text Clean-Up Panel */}
          <Card className="rounded-none border-2 border-border card-depth-1">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Text Clean-Up Toolbar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex flex-wrap gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={cleanupExtraSpaces}
                disabled={!input.trim()}
                className="rounded-none border-2 text-[10px] h-8 font-bold flex items-center gap-1"
              >
                Collapse Whitespace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cleanupStripHTML}
                disabled={!input.trim()}
                className="rounded-none border-2 text-[10px] h-8 font-bold flex items-center gap-1"
              >
                Strip HTML Tags
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cleanupAlphanumericOnly}
                disabled={!input.trim()}
                className="rounded-none border-2 text-[10px] h-8 font-bold flex items-center gap-1"
              >
                Remove Special Chars
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Statistics panels (1/3 width on desktop) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Counters Panel */}
          <Card className="rounded-none border-2 border-border card-depth-1">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" /> {t.statsLabel}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Primary metrics boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 p-3 border-2 border-primary/20 flex flex-col items-center justify-center text-center rounded-none">
                  <span className="text-2xl font-extrabold text-primary font-mono leading-none">{stats.words}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2">
                    {t.words}
                  </span>
                </div>
                
                <div className="bg-muted/10 p-3 border-2 border-border flex flex-col items-center justify-center text-center rounded-none">
                  <span className="text-2xl font-extrabold text-foreground font-mono leading-none">{stats.characters}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2">
                    {t.characters}
                  </span>
                </div>

                <div className="bg-muted/10 p-3 border-2 border-border flex flex-col items-center justify-center text-center rounded-none">
                  <span className="text-xl font-extrabold text-foreground font-mono leading-none">{stats.sentences}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2">
                    {t.sentences}
                  </span>
                </div>

                <div className="bg-muted/10 p-3 border-2 border-border flex flex-col items-center justify-center text-center rounded-none">
                  <span className="text-xl font-extrabold text-foreground font-mono leading-none">{stats.paragraphs}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2">
                    {t.paragraphs}
                  </span>
                </div>
              </div>

              {/* Secondary details */}
              <div className="border-t-2 border-border/40 pt-3 space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">{t.charactersNoSpaces}</span>
                  <span className="font-mono font-bold text-foreground">{stats.charactersNoSpaces}</span>
                </div>
                
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">{t.readingTime}</span>
                  <span className="text-foreground">{stats.readingTime}</span>
                </div>

                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">{t.speakingTime}</span>
                  <span className="text-foreground">{stats.speakingTime}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Readability Grade <span title="Calculated using the Automated Readability Index (ARI)" className="cursor-help"><HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" /></span>
                  </span>
                  <span className="text-primary font-bold">{stats.readabilityGrade}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Detailed Character Breakdown */}
          <Card className="rounded-none border-2 border-border card-depth-1">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <AlignLeft className="h-4 w-4" /> Character Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs font-bold font-mono">
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted-foreground font-semibold">Total Letters:</span>
                <span className="text-foreground">{stats.charBreakdown.letters} <span className="text-[10px] font-normal text-muted-foreground/60">({stats.charBreakdown.vowels}v / {stats.charBreakdown.consonants}c)</span></span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted-foreground font-semibold">Numbers:</span>
                <span className="text-foreground">{stats.charBreakdown.numbers}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted-foreground font-semibold">Whitespaces:</span>
                <span className="text-foreground">{stats.charBreakdown.whitespaces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Symbols/Other:</span>
                <span className="text-foreground">{stats.charBreakdown.symbols}</span>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Density Panel */}
          {stats.keywords.length > 0 && (
            <Card className="rounded-none border-2 border-border card-depth-1 animate-in fade-in duration-200">
              <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Keyword Density (Top 5)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5">
                {stats.keywords.map((kw, i) => (
                  <div key={i} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-foreground">{kw.word}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {kw.count}x ({kw.percentage}%)
                      </span>
                    </div>
                    {/* Brutalist progress bar track */}
                    <div className="h-2 w-full border-2 border-border bg-muted/10 rounded-none overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(100, kw.percentage * 2.5)}%` }} // Scaled relative size for short densities
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
