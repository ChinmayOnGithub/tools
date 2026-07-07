'use client';

import { useState, useEffect, useMemo } from 'react';
import t from './locales/en.json';
import { encodeBase64Text, decodeBase64Text, base64ToBlob } from './utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TextInputArea } from '@/components/ui/TextInputArea';
import { DownloadActions } from '@/components/ui/DownloadActions';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError, 
  trackDownloadAction 
} from '@/lib/analytics';
import { Eye, Image as ImageIcon, Binary, ArrowRight } from 'lucide-react';

export default function Base64Converter() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [downloadFilename, setDownloadFilename] = useState('download.txt');
  const [fileError, setFileError] = useState<string | null>(null);

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
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Reusable segment mode controls */}
      <div className="flex border-2 border-border rounded-none overflow-hidden h-9">
        <button
          onClick={() => {
            setMode('encode');
            handleClear();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors border-r border-border ${
            mode === 'encode' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <Binary className="h-4 w-4" /> Encode Text/Files
        </button>
        <button
          onClick={() => {
            setMode('decode');
            handleClear();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
            mode === 'decode' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowRight className="h-4 w-4" /> Decode Base64 Output
        </button>
      </div>

      {/* Validation Message Box */}
      {errorMsg && (
        <div className="p-3 text-xs font-semibold border-2 bg-destructive/5 text-destructive border-destructive/20 rounded-none">
          {errorMsg}
        </div>
      )}

      {/* Binary file download panel */}
      {((mode === 'decode' && input) || (mode === 'encode' && output)) && !fileError && !errorMsg && (
        <DownloadActions
          filename={downloadFilename}
          onFilenameChange={setDownloadFilename}
          placeholder={t.fileNamePlaceholder}
          onDownload={handleDownload}
          downloadLabel={t.downloadButton}
        />
      )}

      {/* Inputs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <TextInputArea 
          value={input}
          onChange={setInput}
          placeholder={t.placeholder}
          label={t.inputLabel}
          onFileDrop={processUploadedFile}
          showStats={true}
        />

        {/* Output Card */}
        <TextInputArea 
          value={output}
          readOnly={true}
          placeholder={t.outputPlaceholder}
          label={t.outputLabel}
          showStats={true}
        />
      </div>

      {/* Visual Live Decoded Image Previewer Panel */}
      {imagePreviewUrl && (
        <Card className="rounded-none border-2 border-border card-depth-2 animate-in fade-in duration-200">
          <CardHeader className="py-3 px-4 border-b border-border bg-primary/5">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Eye className="h-4 w-4 animate-pulse" /> Decoded Image Previewer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px] bg-muted/10">
            <div className="border-4 border-border shadow-md bg-background p-2 max-w-full flex items-center justify-center">
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
  );
}
