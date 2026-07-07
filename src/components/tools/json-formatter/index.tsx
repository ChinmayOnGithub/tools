'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent, useCallback } from 'react';
import t from './locales/en.json';
import { beautifyJSON, minifyJSON } from './utils';
import { TreeView } from './TreeView';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { CheckCircle, AlertTriangle, ListFilter, FileText } from 'lucide-react';
import { downloadFile } from '@/lib/download';
import { validateFile } from '@/lib/file-processor';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError, 
  trackDownloadAction 
} from '@/lib/analytics';
import { logger } from '@/lib/logger';

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
  const [indent, setIndent] = useState<number>(2); // 2 spaces by default, 0 represents Tabs
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text');
  const [parsedData, setParsedData] = useState<unknown>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard('json-formatter');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('json-formatter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const runValidation = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setIsValid(true);
      setErrorMsg(null);
      // Format text output immediately based on selected indent
      const formatted = JSON.stringify(parsed, null, indent === 0 ? '\t' : indent);
      setOutput(formatted);
    } catch (err) {
      setIsValid(false);
      setParsedData(null);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      // Simple error parsing
      setErrorMsg(errorObj.message || 'Invalid JSON syntax');
    }
  }, [input, indent]);

  // Debounced auto-validator
  useEffect(() => {
    if (!mounted) return;

    const validator = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setIsValid(null);
        setErrorMsg(null);
        setParsedData(null);
        return;
      }
      if (input.length > 2000000) {
        // Large input guard: don't auto-validate above 2MB for performance
        return;
      }
      runValidation();
    }, 350);

    return () => clearTimeout(validator);
  }, [input, mounted, runValidation]);

  const handleBeautify = () => {
    if (input.length > 5000000) {
      setOutput('');
      setIsValid(false);
      setErrorMsg('Input size exceeds maximum limit of 5MB. Please upload a smaller file.');
      trackValidationError('json-formatter', 'size_limit_exceeded');
      return;
    }

    const result = beautifyJSON(input, indent === 0 ? 9 : indent); // 9 represents tab spacing inside beautifyJSON mock or custom formatting
    if (result.success) {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(JSON.stringify(parsed, null, indent === 0 ? '\t' : indent));
      setErrorMsg(null);
      setIsValid(true);
      trackToolCompletion('json-formatter');
    } else {
      setOutput('');
      setIsValid(false);
      setParsedData(null);
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
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(result.output);
      setErrorMsg(null);
      setIsValid(true);
      trackToolCompletion('json-formatter');
    } else {
      setOutput('');
      setIsValid(false);
      setParsedData(null);
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
    setParsedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setIsValid(null);
      setErrorMsg(null);
      setParsedData(null);
    } catch (err) {
      logger.error('Failed to read clipboard text', err);
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
      setParsedData(null);
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
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Configuration Action Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 rounded-none border-2 border-border">
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="rounded-none border-2">
            {t.sampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-none border-2">
            {t.uploadButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePaste} className="rounded-none border-2">
            Paste Clipboard
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
            aria-label="Upload JSON file"
          />
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input} className="rounded-none border-2">
            {t.clearButton}
          </Button>

          {/* Indent configuration select box */}
          <div className="flex items-center gap-1.5 ml-2 border-l-2 border-border pl-4">
            <label htmlFor="indent-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Spacing:</label>
            <select
              id="indent-select"
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="h-8 border-2 border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={0}>Tabs</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button onClick={handleBeautify} disabled={!input.trim()} className="rounded-none border-2">
            {t.beautifyButton}
          </Button>
          <Button onClick={handleMinify} disabled={!input.trim()} className="rounded-none border-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card 
          className={`flex flex-col h-full min-h-[350px] relative transition-all duration-200 rounded-none border-2 border-border card-depth-1 ${
            isDragging ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
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
              className="w-full h-full min-h-[350px] border-none bg-transparent p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="JSON raw inputs text"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col h-full min-h-[350px] rounded-none border-2 border-border card-depth-1">
          <CardHeader className="py-3 px-4 border-b border-border bg-muted/10 flex flex-row justify-between items-center space-y-0">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                {t.outputLabel}
              </CardTitle>
              
              {/* Output format display toggle buttons */}
              {isValid && !!parsedData && (
                <div className="flex border-2 border-border rounded-none overflow-hidden h-7">
                  <button
                    onClick={() => setViewMode('text')}
                    className={`px-2 flex items-center gap-1.5 text-[10px] font-bold cursor-pointer transition-colors border-r border-border ${
                      viewMode === 'text' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileText className="h-3 w-3" /> Raw Text
                  </button>
                  <button
                    onClick={() => setViewMode('tree')}
                    className={`px-2 flex items-center gap-1.5 text-[10px] font-bold cursor-pointer transition-colors ${
                      viewMode === 'tree' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ListFilter className="h-3 w-3" /> Tree View
                  </button>
                </div>
              )}
            </div>

            {output && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-none border-2 h-7 text-[10px]">
                  {t.downloadButton}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copy(output)} className="rounded-none border-2 h-7 text-[10px] w-20">
                  {copied ? t.copiedFeedback : t.copyButton}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0 flex-1 relative bg-muted/5">
            {viewMode === 'tree' && isValid && parsedData ? (
              <TreeView data={parsedData} />
            ) : (
              <textarea
                readOnly
                value={output}
                placeholder={t.outputPlaceholder}
                className="w-full h-full min-h-[350px] border-none bg-transparent p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
                aria-label="JSON formatted output text"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
