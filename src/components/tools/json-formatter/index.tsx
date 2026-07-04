'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import t from './locales/en.json';
import { beautifyJSON, minifyJSON } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { downloadFile } from '@/lib/download';
import { validateFile } from '@/lib/file-processor';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError, 
  trackDownloadAction 
} from '@/lib/analytics';

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
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard('json-formatter');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('json-formatter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleBeautify = () => {
    if (input.length > 5000000) {
      setOutput('');
      setIsValid(false);
      setErrorMsg('Input size exceeds maximum limit of 5MB. Please upload a smaller file.');
      trackValidationError('json-formatter', 'size_limit_exceeded');
      return;
    }

    const result = beautifyJSON(input);
    if (result.success) {
      setOutput(result.output);
      setErrorMsg(null);
      setIsValid(true);
      trackToolCompletion('json-formatter');
    } else {
      setOutput('');
      setIsValid(false);
      setErrorMsg(
        t.validationError
          .replace('{message}', result.error || 'Invalid JSON')
          .replace('{line}', String(result.line || 1))
          .replace('{column}', String(result.column || 1))
      );
      trackValidationError('json-formatter', 'syntax_error');
    }
  };

  const handleMinify = () => {
    if (input.length > 5000000) {
      setOutput('');
      setIsValid(false);
      setErrorMsg('Input size exceeds maximum limit of 5MB. Please upload a smaller file.');
      trackValidationError('json-formatter', 'size_limit_exceeded');
      return;
    }

    const result = minifyJSON(input);
    if (result.success) {
      setOutput(result.output);
      setErrorMsg(null);
      setIsValid(true);
      trackToolCompletion('json-formatter');
    } else {
      setOutput('');
      setIsValid(false);
      setErrorMsg(
        t.validationError
          .replace('{message}', result.error || 'Invalid JSON')
          .replace('{line}', String(result.line || 1))
          .replace('{column}', String(result.column || 1))
      );
      trackValidationError('json-formatter', 'syntax_error');
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
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    const check = validateFile(file, {
      maxSize: 5 * 1024 * 1024,
      allowedMimeTypes: ['application/json', 'text/plain'],
    });

    if (!check.isValid) {
      setErrorMsg(check.error || 'Invalid file type.');
      setIsValid(false);
      trackValidationError('json-formatter', 'file_validation_failed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string || '');
      setOutput('');
      setErrorMsg(null);
      setIsValid(null);
    };
    reader.readAsText(file);
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
    trackDownloadAction('json-formatter');
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
        <div className={`p-4 rounded-none text-xs font-bold border-2 leading-relaxed flex items-start gap-2.5 ${
          isValid 
            ? 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-600/30' 
            : 'bg-destructive/5 text-destructive border-destructive/30'
        }`}>
          {isValid ? (
            <>
              <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{t.validationValid}</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-destructive" />
              <span>{errorMsg}</span>
            </>
          )}
        </div>
      )}

      {/* Workspaces Panels Grid */}
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
                <p className="text-xs font-bold text-primary">Drop JSON File Here</p>
                <p className="text-[10px] text-muted-foreground mt-1">Accepts .json text files under 5MB</p>
              </div>
            )}
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
