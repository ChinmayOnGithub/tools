'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Upload, Trash, Copy, Download, Eye, Image as ImageIcon } from 'lucide-react';
import t from './locales/en.json';
import { encodeBase64Text, decodeBase64Text, base64ToBlob } from './utils';

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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError, 
  trackDownloadAction 
} from '@/lib/analytics';

export default function Base64Converter() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [downloadFilename, setDownloadFilename] = useState('download.txt');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useCopyToClipboard('base64-converter');

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('base64-converter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce conversion event tracking
  useEffect(() => {
    if (!input.trim() || fileError) return;

    const timer = setTimeout(() => {
      if (mode === 'encode') {
        trackToolCompletion('base64-converter');
      } else {
        const result = decodeBase64Text(input);
        if (result.success) {
          trackToolCompletion('base64-converter');
        } else {
          trackValidationError('base64-converter', 'decode_failed');
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [input, mode, fileError]);

  // Compute conversion output
  const output = useMemo(() => {
    if (!input.trim() || fileError) return '';
    if (input.length > 5000000) return '';

    if (mode === 'encode') {
      if (input.startsWith('data:')) {
        return input;
      }
      return encodeBase64Text(input);
    } else {
      let rawBase64 = input.trim();
      if (rawBase64.startsWith('data:')) {
        const parts = rawBase64.split(',');
        if (parts.length > 1) {
          rawBase64 = parts[1];
        }
      }
      const result = decodeBase64Text(rawBase64);
      return result.success ? result.output : '';
    }
  }, [input, mode, fileError]);

  const errorMsg = useMemo(() => {
    if (fileError) return fileError;
    if (input.length > 5000000) {
      return 'Input size exceeds maximum limit of 5MB. Please clear or paste a smaller snippet.';
    }
    if (input.trim() && mode === 'decode') {
      let rawBase64 = input.trim();
      if (rawBase64.startsWith('data:')) {
        const parts = rawBase64.split(',');
        if (parts.length > 1) {
          rawBase64 = parts[1];
        }
      }
      const result = decodeBase64Text(rawBase64);
      if (!result.success) {
        return t.validationError.replace('{message}', result.error || 'Invalid Base64 string');
      }
    }
    return null;
  }, [input, mode, fileError]);

  // Detect if the Base64 input/output represents an image data url or image signature
  const imagePreviewUrl = useMemo(() => {
    const target = mode === 'encode' ? output : input.trim();
    if (!target) return null;
    
    if (target.startsWith('data:image/')) {
      return target;
    }
    if (/^(iVBORw0KGgo|R0lGOD|iVBORw0KGgoAAAANSUhEUg|iVBORw0KGgoAAAANSUhEUgAA|\/9j\/)/.test(target)) {
      return `data:image/png;base64,${target}`;
    }
    return null;
  }, [input, output, mode]);

  const handleClear = () => {
    setInput('');
    setFileError(null);
  };

  const processUploadedFile = (file: File) => {
    setFileError(null);
    setDownloadFilename(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string || '';
      if (mode === 'encode') {
        setInput(resultStr);
      } else {
        const base64Str = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
        setInput(base64Str);
      }
    };

    if (mode === 'encode') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
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
    const textarea = document.querySelector('textarea[aria-label="Base64 input text"]') as HTMLTextAreaElement;
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

  const handleCopyOutput = () => {
    if (!output) return;
    copy(output);
    setShowToast(true);
  };

  const handleDownload = () => {
    if (mode === 'encode') {
      if (!output) return;
      trackDownloadAction('base64-converter');
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename.endsWith('.txt') ? downloadFilename : downloadFilename + '.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      if (!input) return;
      let rawBase64 = input.trim();
      if (rawBase64.startsWith('data:')) {
        const parts = rawBase64.split(',');
        if (parts.length > 1) {
          rawBase64 = parts[1];
        }
      }
      const blob = base64ToBlob(rawBase64);
      if (!blob) {
        alert('Invalid Base64 data for binary file conversion.');
        return;
      }
      trackDownloadAction('base64-converter');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
        <div className="p-3 text-xs font-semibold border bg-destructive/5 text-destructive border-destructive/20 rounded-none">
          {errorMsg}
        </div>
      )}

      {/* 2. Workspace Layout */}
      <ToolLayout>
        {/* Workspace Inputs/Outputs */}
        <div className="space-y-6">
          <InputPanel 
            title={mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'} 
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
                  aria-label="Base64 input text"
                  className="w-full h-80 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                />
                
                {isDragging && (
                  <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center border-2 border-dashed border-primary pointer-events-none">
                    <Upload className="h-8 w-8 text-primary animate-bounce mb-2" />
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processUploadedFile(file);
                    }}
                    className="hidden"
                    aria-label="Upload data file"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    {t.uploadButton}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setInput(mode === 'encode' ? 'Hello, World! CoolTools browser-native Base64 conversion.' : 'SGVsbG8sIFdvcmxkISBDb29sVG9vbHMgYnJvd3Nlci1uYXRpdmUgQmFzZTY0IGNvbnZlcnNpb24u');
                    }}
                  >
                    Load Sample
                  </Button>
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
            <OutputPanel title={mode === 'encode' ? 'Encoded Base64 Output' : 'Decoded Text Output'}>
              <div className="space-y-4">
                <div className="border border-border bg-card p-1">
                  <textarea
                    value={output}
                    readOnly
                    placeholder={t.outputPlaceholder}
                    aria-label="Base64 output text"
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
            </OutputPanel>
          )}

          {/* Visual Live Decoded Image Previewer Panel */}
          {imagePreviewUrl && (
            <Card className="rounded-none border border-border card-depth-2 animate-in fade-in duration-200">
              <CardHeader className="py-3 px-4 border-b border-border bg-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Eye className="h-4 w-4 animate-pulse" /> Decoded Image Previewer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px] bg-muted/10">
                <div className="border border-border shadow-md bg-background p-2 max-w-full flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imagePreviewUrl} 
                    alt="Base64 decoded asset preview"
                    className="max-h-[300px] object-contain max-w-full"
                  />
                </div>
                <div className="flex gap-2.5 mt-4 text-[10px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" /> Direct Inline Image Render
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Copied Base64 data to clipboard." 
      />
    </div>
  );
}
