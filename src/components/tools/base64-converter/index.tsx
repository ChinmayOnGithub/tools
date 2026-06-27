'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import t from './locales/en.json';
import { encodeBase64Text, decodeBase64Text, base64ToBlob } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { validateFile } from '@/lib/file-processor';
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard('base64-converter');

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('base64-converter');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce conversion event tracking to prevent flooding GA4 logs during keystrokes
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

  let output = '';
  let errorMsg: string | null = fileError;

  // Input boundary checking
  const isInputTooLarge = input.length > 5000000;

  if (isInputTooLarge) {
    errorMsg = 'Input size exceeds maximum limit of 5MB. Please clear or paste a smaller snippet.';
  } else if (input.trim() && !fileError) {
    if (mode === 'encode') {
      output = encodeBase64Text(input);
    } else {
      const result = decodeBase64Text(input);
      if (result.success) {
        output = result.output;
      } else {
        errorMsg = t.validationError.replace('{message}', result.error || 'Invalid Base64 string');
      }
    }
  }

  const handleClear = () => {
    setInput('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processUploadedFile = (file: File) => {
    setFileError(null);

    // Standardized file validation
    const check = validateFile(file, {
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    if (!check.isValid) {
      setFileError(check.error || 'File validation failed.');
      trackValidationError('base64-converter', 'file_validation_failed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string || '';
      const base64Str = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      
      if (mode === 'encode') {
        if (file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.txt')) {
          const textReader = new FileReader();
          textReader.onload = (txtEvent) => {
            setInput(txtEvent.target?.result as string || '');
          };
          textReader.readAsText(file);
        } else {
          setInput(base64Str);
        }
      } else {
        setInput(base64Str);
      }
    };
    reader.readAsDataURL(file);
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
      const blob = base64ToBlob(input);
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

  const handleLoadSample = () => {
    setFileError(null);
    if (mode === 'encode') {
      setInput('CoolTools: Secure client-side browser utilities.');
    } else {
      setInput('Q29vbFRvb2xzOiBTZWN1cmUgY2xpZW50LXNpZGUgYnJvd3NlciB1dGlsaXRpZXMu');
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Action controls */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-card p-3 rounded-lg border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mode === 'encode' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('encode');
              handleClear();
            }}
          >
            {t.encodeButton}
          </Button>
          <Button
            variant={mode === 'decode' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('decode');
              handleClear();
            }}
          >
            {t.decodeButton}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            {t.uploadButton}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload file for base64"
          />
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Load Sample
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
            {t.clearButton}
          </Button>
        </div>
      </div>

      {/* Validation Message Box */}
      {errorMsg && (
        <div className="p-3 rounded-lg text-xs font-semibold border bg-destructive/10 text-destructive border-destructive/20">
          {errorMsg}
        </div>
      )}

      {/* Binary file download panel */}
      {((mode === 'decode' && input) || (mode === 'encode' && output)) && !fileError && (
        <Card className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label htmlFor="filename" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.fileNameLabel}
            </label>
            <Input
              id="filename"
              value={downloadFilename}
              onChange={(e) => setDownloadFilename(e.target.value)}
              placeholder={t.fileNamePlaceholder}
              className="h-8 max-w-xs text-xs font-semibold"
            />
          </div>
          <Button size="sm" onClick={handleDownload} className="w-full sm:w-auto shrink-0" disabled={!!errorMsg}>
            {t.downloadButton}
          </Button>
        </Card>
      )}

      {/* Inputs grid */}
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
                <p className="text-[10px] text-muted-foreground mt-1">Accepts any file under 5MB</p>
              </div>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              rows={12}
              className="w-full h-full min-h-[250px] border-none bg-transparent p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="Base64 input textarea"
            />
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="py-3.5 px-4 border-b flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t.outputLabel}
            </CardTitle>
            {output && !fileError && (
              <Button variant="outline" size="sm" onClick={() => copy(output)}>
                {copied ? t.copiedFeedback : t.copyButton}
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <textarea
              readOnly
              value={output}
              placeholder={t.outputPlaceholder}
              rows={12}
              className="w-full h-full min-h-[250px] border-none bg-muted/20 p-4 font-mono text-xs outline-none focus:ring-0 resize-y"
              aria-label="Base64 output textarea"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
