'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent, useCallback } from 'react';
import t from './locales/en.json';
import { beautifyJSON, minifyJSON, parseJSONError } from './utils';
import { TreeView } from './TreeView';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { CheckCircle, AlertTriangle, ListFilter, FileText, Download, Copy, Trash } from 'lucide-react';
import { downloadFile } from '@/lib/download';
import { validateFile } from '@/lib/file-processor';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError, 
  trackDownloadAction 
} from '@/lib/analytics';
import CopyShareToast from '@/components/shared/CopyShareToast';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { useSmartActions } from '@/hooks/useSmartActions';
import { useUrlQueryInput } from '@/hooks/useUrlQueryInput';
import { addHistoryEntry } from '@/lib/history';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';

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

interface JsonWorkspaceProps {
  slug?: string;
}

export default function JsonWorkspace({ slug = 'json-formatter' }: JsonWorkspaceProps) {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [indent, setIndent] = useState<number>(2); // 2 spaces by default, 0 represents Tabs
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text');
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [showToast, setShowToast] = useState(false);
  
  // Tab/Mode state: 'formatter' | 'validator'
  const [activeMode, setActiveMode] = useState<'formatter' | 'validator'>(
    slug === 'json-validator' ? 'validator' : 'formatter'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useCopyToClipboard(slug);
  const { addRecent } = useWorkspace();

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        setErrorMsg(null);
        setIsValid(null);
      }
    } catch {
      handleFocusInput();
    }
  };

  const handleFocusInput = () => {
    const textarea = document.querySelector('textarea[aria-label="JSON input text"]') as HTMLTextAreaElement;
    if (textarea) textarea.focus();
  };

  useGlobalShortcuts({
    onRun: () => {
      if (activeMode === 'formatter') {
        handleBeautify();
      } else {
        handleValidateOnly();
      }
    },
    onCopy: () => handleCopyOutput(),
    onClear: () => handleClear(),
    onFocusInput: handleFocusInput,
  });

  useSmartActions({
    value: input,
    onPasteAction: (text) => setInput(text),
    focusSelector: 'textarea[aria-label="JSON input text"]',
  });

  useUrlQueryInput(setInput);

  // Track initial page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch(slug);
      addRecent(slug);
    }, 0);
    return () => clearTimeout(timer);
  }, [slug, addRecent]);



  const handleCopyOutput = () => {
    const textToCopy = output || input;
    if (!textToCopy) return;
    copy(textToCopy);
    setShowToast(true);
  };

  const handleSortKeys = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const sortObj = (obj: unknown): unknown => {
        if (Array.isArray(obj)) return obj.map(sortObj);
        if (obj !== null && typeof obj === 'object') {
          return Object.keys(obj as Record<string, unknown>)
            .sort()
            .reduce((acc, key) => {
              acc[key] = sortObj((obj as Record<string, unknown>)[key]);
              return acc;
            }, {} as Record<string, unknown>);
        }
        return obj;
      };
      const sorted = sortObj(parsed);
      const formatted = JSON.stringify(sorted, null, indent === 0 ? '\t' : indent);
      setInput(formatted);
      setOutput(formatted);
      setParsedData(sorted);
      setIsValid(true);
      setErrorMsg(null);
      addHistoryEntry(slug, 'JSON Workspace', 'Sorted Object Keys', '');
    } catch {
      setErrorMsg('Invalid JSON string cannot be sorted.');
    }
  };

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
      const parsedErr = parseJSONError(errorObj.message || 'Invalid JSON', input);
      const locStr = parsedErr.line ? ` (Line ${parsedErr.line}, Col ${parsedErr.column})` : '';
      setErrorMsg(`${parsedErr.detailedError}${locStr}`);
    }
  }, [input, indent]);

  // Debounced auto-validator for validator feedback
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
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorMsg(null);
      setParsedData(null);
      return;
    }

    if (input.length > 5000000) {
      setOutput('');
      setIsValid(false);
      setErrorMsg('Input size exceeds maximum limit of 5MB. Please upload a smaller file.');
      trackValidationError(slug, 'size_limit_exceeded');
      return;
    }

    const result = beautifyJSON(input, indent === 0 ? 9 : indent);
    if (result.success) {
      try {
        const parsed = JSON.parse(input);
        setParsedData(parsed);
        setOutput(JSON.stringify(parsed, null, indent === 0 ? '\t' : indent));
        setErrorMsg(null);
        setIsValid(true);
        trackToolCompletion(slug);
        const sizeKb = (new Blob([input]).size / 1024).toFixed(2) + ' KB';
        addHistoryEntry(slug, 'JSON Workspace', 'Beautified JSON', `Size: ${sizeKb}`);
      } catch (err) {
        setOutput('');
        setIsValid(false);
        setParsedData(null);
        const errMsg = err instanceof Error ? err.message : 'Invalid JSON';
        setErrorMsg(`JSON Parse Error: ${errMsg}`);
        trackValidationError(slug, 'syntax_error');
      }
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
      trackValidationError(slug, 'syntax_error');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorMsg(null);
      setParsedData(null);
      return;
    }

    const result = minifyJSON(input);
    if (result.success) {
      setOutput(result.output);
      setErrorMsg(null);
      setIsValid(true);
      trackToolCompletion(slug);
      const sizeKb = (new Blob([input]).size / 1024).toFixed(2) + ' KB';
      addHistoryEntry(slug, 'JSON Workspace', 'Minified JSON', `Size: ${sizeKb}`);
    } else {
      setOutput('');
      setIsValid(false);
      setErrorMsg(
        t.validationError
          .replace('{message}', result.error || 'Invalid JSON')
          .replace('{line}', String(result.line || 1))
          .replace('{column}', String(result.column || 1))
      );
      trackValidationError(slug, 'syntax_error');
    }
  };

  const handleValidateOnly = () => {
    runValidation();
    if (isValid === true) {
      trackToolCompletion(slug);
      addHistoryEntry(slug, 'JSON Workspace', 'Validated JSON (Valid)', '');
    } else if (isValid === false) {
      trackValidationError(slug, 'syntax_error');
    }
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

  const processUploadedFile = (file: File) => {
    setErrorMsg(null);
    setIsValid(null);

    const check = validateFile(file, {
      maxSize: 5 * 1024 * 1024, // 5MB limit
      allowedExtensions: ['.json', '.txt'],
    });

    if (!check.isValid) {
      setErrorMsg(check.error || 'File validation failed.');
      trackValidationError(slug, 'file_validation_failed');
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
    const dataToDownload = output || input;
    if (!dataToDownload) return;
    downloadFile(dataToDownload, 'cooltools_format.json', 'application/json');
    trackDownloadAction(slug);
  };

  const handleLoadSample = () => {
    setErrorMsg(null);
    setIsValid(null);
    setInput(SAMPLE_JSON);
  };

  if (!mounted) {
    return (
      <div className="animate-pulse bg-muted h-96 rounded-none w-full border border-border" />
    );
  }

  // Segmented tab actions for mode
  const modeToggles = (
    <div className="flex border border-border rounded-none overflow-hidden h-7">
      <button
        onClick={() => setActiveMode('formatter')}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-border transition-colors ${
          activeMode === 'formatter'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        Formatter
      </button>
      <button
        onClick={() => setActiveMode('validator')}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          activeMode === 'validator'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        Validator
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 2. Workspace Layout */}
      <ToolLayout>
        {/* Workspace Inputs/Outputs */}
        <div className="space-y-6">
          <InputPanel title={t.inputLabel} actions={modeToggles} onPasteClick={handlePasteClick}>
            <div className="space-y-4">
              {/* Indent options for formatter mode */}
              {activeMode === 'formatter' && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Indent Style:
                  </span>
                  {[
                    { label: '2 Spaces', val: 2 },
                    { label: '4 Spaces', val: 4 },
                    { label: 'Tabs', val: 0 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setIndent(opt.val)}
                      className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider cursor-pointer rounded-none transition-colors ${
                        indent === opt.val
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:border-primary/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

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
                  aria-label="JSON input text"
                  className="w-full h-80 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                />
                
                {isDragging && (
                  <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center border-2 border-dashed border-primary pointer-events-none">
                    <FileText className="h-8 w-8 text-primary animate-bounce mb-2" />
                    <span className="text-xs font-black text-foreground">Drop JSON file here</span>
                  </div>
                )}
              </div>

              {/* Status Diagnostic Banner */}
              {isValid !== null && (
                <div
                  className={`p-3 text-xs font-semibold border border-border flex items-center gap-2 rounded-none ${
                    isValid
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}
                >
                  {isValid ? (
                    <>
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{t.validationValid}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                      <span className="font-mono">{errorMsg}</span>
                    </>
                  )}
                </div>
              )}

              {/* Action operations shelf */}
              <ActionBar>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json,.txt"
                    className="hidden"
                    aria-label="Upload JSON file"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    {t.uploadButton}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLoadSample}>
                    {t.sampleButton}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    {t.clearButton}
                  </Button>
                  {activeMode === 'formatter' ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleSortKeys} disabled={!input} title="Alphabetically sort keys">
                        <ListFilter className="h-3.5 w-3.5 mr-1" />
                        Sort Keys
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleMinify} disabled={!input}>
                        {t.minifyButton}
                      </Button>
                      <Button onClick={handleBeautify} disabled={!input}>
                        {t.beautifyButton}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleValidateOnly} disabled={!input}>
                      Validate Syntax
                    </Button>
                  )}
                </div>
              </ActionBar>
            </div>
          </InputPanel>

          {/* Outputs (Only displayed if formatted output exists or tree view is occupied) */}
          {!!(output || parsedData) && (
            <OutputPanel
              title={t.outputLabel}
              actions={
                <div className="flex items-center border border-border rounded-none overflow-hidden h-7">
                  <button
                    onClick={() => setViewMode('text')}
                    className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-border transition-colors ${
                      viewMode === 'text'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    Raw Text
                  </button>
                  <button
                    onClick={() => setViewMode('tree')}
                    className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      viewMode === 'tree'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                    disabled={!parsedData}
                  >
                    Node Tree
                  </button>
                </div>
              }
            >
              {viewMode === 'tree' && parsedData ? (
                <TreeView data={parsedData} />
              ) : (
                <div className="space-y-4">
                  <div className="border border-border bg-muted/5 p-1">
                    <textarea
                      value={output}
                      readOnly
                      placeholder={t.outputPlaceholder}
                      className="w-full h-80 bg-transparent text-xs font-mono p-3 border-none outline-none focus:ring-0 text-foreground resize-y"
                    />
                  </div>

                  <ActionBar>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-3.5 w-3.5 mr-1" />
                        {t.downloadButton}
                      </Button>
                      <PipeButton value={output} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCopyOutput}>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        {t.copyButton}
                      </Button>
                    </div>
                  </ActionBar>
                </div>
              )}
            </OutputPanel>
          )}
        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Copied JSON data to clipboard." 
      />
    </div>
  );
}
