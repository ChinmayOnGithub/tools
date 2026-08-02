'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Upload, Trash, Copy, Download } from 'lucide-react';
import t from './locales/en.json';
import { convertCase } from './utils';

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
import { validateFile } from '@/lib/file-processor';
import { 
  trackToolLaunch, 
  trackToolCompletion
} from '@/lib/analytics';

const STYLES = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence Case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'pascal', label: 'PascalCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'alternate', label: 'aLtErNaTiNg CaSe' },
  { id: 'train', label: 'Train-Case' },
  { id: 'dot', label: 'dot.case' }
];

export default function CaseConverter() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState('upper');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useCopyToClipboard('case-converter');

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

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

    const check = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB limit
    });

    if (!check.isValid) {
      setFileError(check.error || 'File validation failed.');
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
    const textarea = document.querySelector('textarea[aria-label="Casing input text"]') as HTMLTextAreaElement;
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

  const output = convertCase(input, style);

  const handleCopyOutput = () => {
    if (!output) return;
    copy(output);
    setShowToast(true);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  const caseToggles = (
    <div className="flex flex-wrap gap-1.5 max-w-lg justify-end">
      {STYLES.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setStyle(opt.id)}
          className={`px-2 py-0.5 border text-[9px] font-extrabold uppercase tracking-wider cursor-pointer rounded-none transition-colors ${
            style === opt.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background hover:border-primary/50 text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      {/* 1. File Error Message */}
      {fileError && (
        <div className="p-3 text-xs font-semibold border bg-destructive/5 text-destructive border-destructive/20 rounded-none animate-in fade-in duration-200">
          {fileError}
        </div>
      )}

      {/* 2. Workspace Layout */}
      <ToolLayout>
        {/* Workspace Inputs/Outputs */}
        <div className="space-y-6">
          <InputPanel 
            title={t.inputLabel} 
            actions={caseToggles} 
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
                  aria-label="Casing input text"
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
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload text file"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Upload File
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLoadSample}>
                    {t.loadSampleButton}
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

          {/* Outputs (Only displayed if output text exists) */}
          {!!output && (
            <OutputPanel title={t.outputLabel}>
              <div className="space-y-4">
                <div className="border border-border bg-card p-1">
                  <textarea
                    value={output}
                    readOnly
                    placeholder={t.placeholder}
                    aria-label="Casing output text"
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
        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Copied converted text casing output to clipboard." 
      />
    </div>
  );
}
