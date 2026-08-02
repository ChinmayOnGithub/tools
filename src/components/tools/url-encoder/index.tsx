'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Upload, Trash, Copy } from 'lucide-react';
import t from './locales/en.json';
import { encodeURLString, decodeURLString } from './utils';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';
import CopyShareToast from '@/components/shared/CopyShareToast';

// Hooks
import { useUrlQueryInput } from '@/hooks/useUrlQueryInput';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';

export default function URLEncoder() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [queryOnly, setQueryOnly] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useCopyToClipboard('url-encoder');

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('url-encoder');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce conversion event tracking
  useEffect(() => {
    if (!input.trim()) return;

    const timer = setTimeout(() => {
      if (mode === 'encode') {
        trackToolCompletion('url-encoder');
      } else {
        const result = decodeURLString(input);
        if (result.success) {
          trackToolCompletion('url-encoder');
        } else {
          trackValidationError('url-encoder', 'decode_failed');
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, mode]);

  // Compute outputs and errors
  const { output, errorMsg } = useMemo(() => {
    let outputVal = '';
    let errorVal: string | null = null;

    if (input.length > 2000000) {
      errorVal = 'Input size exceeds maximum limit of 2MB. Please enter a smaller URL string.';
    } else if (input.trim()) {
      if (mode === 'encode') {
        outputVal = encodeURLString(input, queryOnly);
      } else {
        const result = decodeURLString(input);
        if (result.success) {
          outputVal = result.output;
        } else {
          errorVal = t.validationError.replace('{message}', result.error || 'Invalid string');
        }
      }
    }

    return { output: outputVal, errorMsg: errorVal };
  }, [input, mode, queryOnly]);

  const handleClear = () => {
    setInput('');
  };

  const handleLoadSample = () => {
    if (mode === 'encode') {
      setInput('https://tools.chinmaypatil.com/search?query=json formatter & validator=true');
    } else {
      setInput('https%3A%2F%2Ftools.chinmaypatil.com%2Fsearch%3Fquery%3Djson%20formatter%20%26%20validator%3Dtrue');
    }
  };

  const processUploadedFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string || '');
    };
    reader.readAsText(file);
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
    const textarea = document.querySelector('textarea[aria-label="URL input text"]') as HTMLTextAreaElement;
    if (textarea) textarea.focus();
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
      }
    } catch {
      handleFocusInput();
    }
  };

  const handleCopyOutput = () => {
    if (!output) return;
    copy(output);
    setShowToast(true);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  const modeToggles = (
    <div className="flex border border-border rounded-none overflow-hidden h-7">
      <button
        onClick={() => {
          setMode('encode');
          handleClear();
        }}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-border transition-colors ${
          mode === 'encode'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        Encode
      </button>
      <button
        onClick={() => {
          setMode('decode');
          handleClear();
        }}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          mode === 'decode'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        Decode
      </button>
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      {/* 1. Validation Message Box */}
      {errorMsg && (
        <div className="p-3 text-xs font-semibold border bg-destructive/5 text-destructive border-destructive/20 rounded-none animate-in fade-in duration-200">
          {errorMsg}
        </div>
      )}

      {/* 2. Workspace Layout */}
      <ToolLayout>
        {/* Workspace Inputs/Outputs */}
        <div className="space-y-6">
          <InputPanel 
            title={mode === 'encode' ? 'URL/Text to Encode' : 'URL Encoded Data to Decode'} 
            actions={modeToggles} 
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
                  aria-label="URL input text"
                  className="w-full h-80 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                />
                
                {isDragging && (
                  <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center border-2 border-dashed border-primary pointer-events-none">
                    <Upload className="h-8 w-8 text-primary animate-bounce mb-2" />
                    <span className="text-xs font-bold text-foreground">Drop Text File to Load Content</span>
                  </div>
                )}
              </div>

              {/* Action Operations */}
              <ActionBar>
                <div className="flex flex-wrap gap-3 items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processUploadedFile(file);
                    }}
                    className="hidden"
                    aria-label="Upload text file"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    {t.uploadButton}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLoadSample}>
                    Load Sample
                  </Button>
                  
                  {/* Query params only check option */}
                  {mode === 'encode' && (
                    <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-foreground cursor-pointer select-none border-l border-border pl-4 h-6">
                      <input
                        type="checkbox"
                        checked={queryOnly}
                        onChange={(e) => setQueryOnly(e.target.checked)}
                        className="h-3.5 w-3.5 rounded-none border border-border text-primary focus:ring-primary checked:bg-primary cursor-pointer bg-card"
                      />
                      <span>Encode Queries Only</span>
                    </label>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    {t.clearButton}
                  </Button>
                </div>
              </ActionBar>
            </div>
          </InputPanel>

          {/* Outputs (Only displayed if output text is populated) */}
          {!!output && (
            <OutputPanel title={mode === 'encode' ? 'Encoded URL Output' : 'Decoded Text Output'}>
              <div className="space-y-4">
                <div className="border border-border bg-card p-1">
                  <textarea
                    value={output}
                    readOnly
                    placeholder={t.outputPlaceholder}
                    aria-label="URL output text"
                    className="w-full h-80 bg-transparent text-xs font-mono p-3 border-none outline-none focus:ring-0 text-foreground resize-y"
                  />
                </div>

                <ActionBar>
                  <div className="flex gap-2">
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
            </OutputPanel>
          )}
        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Copied URL data to clipboard." 
      />
    </div>
  );
}
