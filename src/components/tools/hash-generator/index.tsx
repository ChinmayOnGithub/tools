'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Upload, Trash, Copy, Check, Binary, Settings, Shield } from 'lucide-react';
import t from './locales/en.json';
import { generateAllHashes, AllHashes } from './utils';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';
import CopyShareToast from '@/components/shared/CopyShareToast';

// Hooks
import { useUrlQueryInput } from '@/hooks/useUrlQueryInput';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';

export default function HashGenerator() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('');
  const [saltPosition, setSaltPosition] = useState<'prepend' | 'append'>('append');
  const [uppercase, setUppercase] = useState(false);
  const [hashes, setHashes] = useState<AllHashes | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useCopyToClipboard('hash-generator');

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('hash-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Recalculate all hashes when inputs change
  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      if (!input) {
        setHashes(null);
        setErrorMsg(null);
        return;
      }

      if (input.length > 2000000) {
        setHashes(null);
        setErrorMsg('Input size exceeds maximum limit of 2MB.');
        trackValidationError('hash-generator', 'size_limit_exceeded');
        return;
      }

      let isCurrent = true;
      generateAllHashes(input, salt, saltPosition)
        .then((res) => {
          if (!isCurrent) return;
          setHashes(res);
          setErrorMsg(null);
          trackToolCompletion('hash-generator');
        })
        .catch((err) => {
          if (!isCurrent) return;
          setHashes(null);
          setErrorMsg(err.message || 'Hash generation failed.');
          trackValidationError('hash-generator', 'calc_error');
        });

      return () => {
        isCurrent = false;
      };
    }, 50);

    return () => clearTimeout(timer);
  }, [input, salt, saltPosition, mounted]);

  const handleClear = () => {
    setInput('');
    setSalt('');
    setErrorMsg(null);
    setHashes(null);
  };

  const handleLoadSample = () => {
    setInput('CoolTools: Fast, secure, and private browser-based utilities.');
  };

  const processUploadedFile = (file: File) => {
    setErrorMsg(null);
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('File size exceeds 2MB limit.');
      trackValidationError('hash-generator', 'file_validation_failed');
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
    const textarea = document.querySelector('textarea[aria-label="Hash input text"]') as HTMLTextAreaElement;
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

  const handleCopyHash = (text: string, algorithm: string) => {
    const formatted = uppercase ? text.toUpperCase() : text;
    copy(formatted);
    setCopiedItem(algorithm);
    setTimeout(() => setCopiedItem(null), 1000);
  };

  const formattedHashesList = useMemo(() => {
    if (!hashes) return [];
    return [
      { id: 'MD5', value: hashes.md5 },
      { id: 'SHA-1', value: hashes.sha1 },
      { id: 'SHA-256', value: hashes.sha256 },
      { id: 'SHA-512', value: hashes.sha512 },
    ];
  }, [hashes]);

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* 1. Validation Error Message */}
      {errorMsg && (
        <div className="p-3 text-xs font-semibold border bg-destructive/5 text-destructive border-destructive/20 rounded-none animate-in fade-in duration-200">
          {errorMsg}
        </div>
      )}

      {/* 2. Workspace Layout */}
      <ToolLayout>
        {/* Input/Output Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Input Panel & Salt Params */}
          <div className="space-y-6">
            <InputPanel 
              title={t.inputLabel} 
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
                    aria-label="Hash input text"
                    className="w-full h-80 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                  />
                  
                  {isDragging && (
                    <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center border-2 border-dashed border-primary pointer-events-none">
                      <Upload className="h-8 w-8 text-primary animate-bounce mb-2" />
                      <span className="text-xs font-bold text-foreground">Drop File to Load Content</span>
                    </div>
                  )}
                </div>

                {/* Operations Bar */}
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
                      aria-label="Upload text file"
                    />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      {t.uploadButton}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLoadSample}>
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

            {/* Salt cryptography configuration panel */}
            <Card className="rounded-none border border-border card-depth-2">
              <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Settings className="h-4 w-4 text-primary" /> Cryptographic Salt Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-1.5 w-full">
                  <label htmlFor="salt-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Salt String</label>
                  <Input
                    id="salt-input"
                    type="text"
                    placeholder="e.g. secret_salt_key"
                    value={salt}
                    onChange={(e) => setSalt(e.target.value)}
                    className="h-9 text-xs font-semibold rounded-none border border-border bg-card"
                  />
                </div>
                
                <div className="space-y-1.5 w-full md:w-32">
                  <label htmlFor="salt-position" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Salt Position</label>
                  <select
                    id="salt-position"
                    value={saltPosition}
                    onChange={(e) => setSaltPosition(e.target.value as 'prepend' | 'append')}
                    className="h-9 border border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer w-full"
                  >
                    <option value="append">Append (End)</option>
                    <option value="prepend">Prepend (Start)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Output Panel Table */}
          <div className="space-y-6 h-full">
            <Card className="rounded-none border border-border card-depth-1 h-full min-h-[300px]">
              <CardHeader className="py-3 px-4 border-b border-border bg-muted/10 flex flex-row justify-between items-center">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary animate-pulse" /> Generated Hashes List
                </CardTitle>

                {/* Uppercase toggle */}
                <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                    className="h-3.5 w-3.5 rounded-none border border-border text-primary focus:ring-primary checked:bg-primary cursor-pointer bg-card"
                  />
                  <span>Uppercase</span>
                </label>
              </CardHeader>
              <CardContent className="p-0">
                {hashes ? (
                  <div className="divide-y divide-border/40 font-mono text-xs select-text">
                    {formattedHashesList.map((item) => (
                      <div 
                        key={item.id}
                        className="flex justify-between items-stretch hover:bg-muted/15 transition-colors group"
                      >
                        <div className="flex flex-col gap-1.5 py-3.5 px-4 min-w-0 flex-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <Binary className="h-3.5 w-3.5" /> {item.id}
                          </span>
                          <span className="truncate font-bold text-foreground font-mono tracking-wide text-xs select-all">
                            {uppercase ? item.value.toUpperCase() : item.value}
                          </span>
                        </div>
                        
                        <div className="flex items-stretch shrink-0">
                          <button
                            onClick={() => handleCopyHash(item.value, item.id)}
                            className="px-4 border-l border-border/40 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title={`Copy ${item.id} hash`}
                            type="button"
                          >
                            {copiedItem === item.id ? (
                              <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          
                          <PipeButton 
                            value={uppercase ? item.value.toUpperCase() : item.value} 
                            iconOnly={true}
                            className="h-full border-t-0 border-b-0 border-r-0 border-l border-border/40 bg-transparent text-muted-foreground hover:text-primary hover:bg-muted font-bold text-[10px] uppercase tracking-wider rounded-none px-3"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs font-bold text-muted-foreground leading-relaxed">
                    Enter or paste input text on the left workspace panel to generate all cryptographic hashes.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Copied hash value to clipboard." 
      />
    </div>
  );
}
