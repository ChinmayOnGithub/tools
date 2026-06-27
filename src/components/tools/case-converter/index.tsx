'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import t from './locales/en.json';
import { convertCase } from './utils';
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

const STYLES = [
  { id: 'upper', label: t.upper },
  { id: 'lower', label: t.lower },
  { id: 'title', label: t.titleCase },
  { id: 'sentence', label: t.sentence },
  { id: 'camel', label: t.camel },
  { id: 'pascal', label: t.pascal },
  { id: 'snake', label: t.snake },
  { id: 'kebab', label: t.kebab },
  { id: 'train', label: t.train },
  { id: 'dot', label: t.dot },
];

export default function CaseConverter() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('upper');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard('case-converter');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('case-converter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce analytics completion logs
  useEffect(() => {
    if (!input.trim() || fileError) return;

    const timer = setTimeout(() => {
      trackToolCompletion('case-converter');
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, style, fileError]);

  const handleClear = () => {
    setInput('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setFileError(null);
    setInput('CoolTools is a PRIVATE browser-side tools platform. All files remain on your DEVICE.');
  };

  const processUploadedFile = (file: File) => {
    setFileError(null);

    // Standardized file validation
    const check = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB limit
    });

    if (!check.isValid) {
      setFileError(check.error || 'File validation failed.');
      trackValidationError('case-converter', 'file_validation_failed');
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

  const output = convertCase(input, style);

  const handleDownload = () => {
    if (!output) return;
    trackDownloadAction('case-converter');
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cased_${style}_text.txt`;
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
        <span>✓ 100% Client-Side Casing</span>
        <span>✓ Text Never Sent to Servers</span>
        <span>✓ Free & Secure Forever</span>
      </div>

      {/* Action controls panel */}
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
            aria-label="Upload text file for casing conversion"
          />
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            {t.loadSampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
            {t.clearButton}
          </Button>
        </div>
      </div>

      {/* File error notification */}
      {fileError && (
        <div className="p-3 rounded-lg text-xs font-semibold border bg-destructive/10 text-destructive border-destructive/20">
          {fileError}
        </div>
      )}

      {/* Casing styles grid selector card */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Casing Style
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STYLES.map((st) => (
              <Button
                key={st.id}
                variant={style === st.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStyle(st.id)}
                className="w-full text-[11px] h-8 font-semibold"
              >
                {st.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dual workspaces textareas grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
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
              className="w-full h-full min-h-[250px] border-none bg-transparent p-4 text-sm outline-none focus:ring-0 resize-y"
              aria-label="Input raw text for case conversions"
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
              placeholder="Converted casing text output will be rendered here..."
              rows={12}
              className="w-full h-full min-h-[250px] border-none bg-muted/20 p-4 text-sm outline-none focus:ring-0 resize-y"
              aria-label="Converted text output area"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
