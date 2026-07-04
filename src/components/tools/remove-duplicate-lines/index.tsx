'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import t from './locales/en.json';
import { removeDuplicateLines } from './utils';
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

const SAMPLE_LIST = `apple
banana
apple
Orange
banana
  apple  
cherry
Orange`;

export default function RemoveDuplicateLines() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard('remove-duplicate-lines');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('remove-duplicate-lines');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce analytics completion logs
  useEffect(() => {
    if (!input.trim() || fileError) return;

    const timer = setTimeout(() => {
      trackToolCompletion('remove-duplicate-lines');
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, caseSensitive, trimWhitespace, sort, fileError]);

  const handleClear = () => {
    setInput('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setFileError(null);
    setInput(SAMPLE_LIST);
  };

  const processUploadedFile = (file: File) => {
    setFileError(null);

    // Standardized file validation
    const check = validateFile(file, {
      maxSize: 5 * 1024 * 1024, // 5MB limit
    });

    if (!check.isValid) {
      setFileError(check.error || 'File validation failed.');
      trackValidationError('remove-duplicate-lines', 'file_validation_failed');
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

  const output = removeDuplicateLines(input, { caseSensitive, trimWhitespace, sort });

  const handleDownload = () => {
    if (!output) return;
    trackDownloadAction('remove-duplicate-lines');
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full" />;
  }

  // Count lines removed
  const inputLines = input ? input.split(/\r?\n/).length : 0;
  const outputLines = output ? output.split(/\r?\n/).length : 0;
  const removedCount = inputLines - outputLines;

  return (
    <div className="space-y-6 w-full">
      {/* Trust pledge indicators banner */}
      <div className="bg-muted/30 border-2 border-border p-3 rounded-none text-[10px] sm:text-xs font-bold text-muted-foreground flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Browser-Only Cleanups
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Lists Never Uploaded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Free & Secure Forever
        </span>
      </div>

      {/* Action controls panel */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-card p-3 border-2 border-border">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload List File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.csv,.json,.md"
            className="hidden"
            aria-label="Upload list text file"
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
        <div className="p-3 text-xs font-semibold border-2 bg-destructive/10 text-destructive border-destructive/20">
          {fileError}
        </div>
      )}

      {/* Option settings card */}
      <Card>
        <CardHeader className="py-3 px-4 border-b bg-muted/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Options
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col md:flex-row gap-6 md:items-center">
          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            {t.caseSensitiveLabel}
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-muted text-primary focus:ring-primary accent-primary"
            />
            {t.trimWhitespaceLabel}
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.sortLabel}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'none' | 'asc' | 'desc')}
              className="bg-background border-2 border-input px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Output sorting options"
            >
              <option value="none">{t.sortNone}</option>
              <option value="asc">{t.sortAsc}</option>
              <option value="desc">{t.sortDesc}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cleaned counts summary box */}
      {input && removedCount > 0 && (
        <div className="p-3 text-xs font-bold border-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          {t.summaryText.replace('{count}', String(removedCount))}
        </div>
      )}

      {/* Dual textareas grid workspace */}
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
                <p className="text-[10px] text-muted-foreground mt-1">Accepts text files under 5MB</p>
              </div>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              rows={14}
              className="w-full h-full min-h-[250px] border-none bg-transparent p-4 text-sm outline-none focus:ring-0 resize-y"
              aria-label="Input raw list text area"
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
              placeholder="Deduplicated and sorted list output will be rendered here..."
              rows={14}
              className="w-full h-full min-h-[250px] border-none bg-muted/20 p-4 text-sm outline-none focus:ring-0 resize-y"
              aria-label="Deduplicated list output area"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
