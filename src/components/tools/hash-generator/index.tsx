'use client';

import { useState, useEffect, useMemo } from 'react';
import t from './locales/en.json';
import { generateAllHashes, AllHashes } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextInputArea } from '@/components/ui/TextInputArea';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';
import { Shield, Copy, Check, Binary, Settings } from 'lucide-react';

export default function HashGenerator() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('');
  const [saltPosition, setSaltPosition] = useState<'prepend' | 'append'>('append');
  const [uppercase, setUppercase] = useState(false);
  const [hashes, setHashes] = useState<AllHashes | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Track initial tool page view launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('hash-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Recalculate all hashes asynchronously when inputs change
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

    const check = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB limit for text hashing
    });

    if (!check.isValid) {
      setErrorMsg(check.error || 'File validation failed.');
      trackValidationError('hash-generator', 'file_validation_failed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleCopyHash = (text: string, algorithm: string) => {
    const formatted = uppercase ? text.toUpperCase() : text;
    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedItem(algorithm);
      setTimeout(() => setCopiedItem(null), 1000);
    });
  };

  // Convert validator helper to prevent Next compiler check crashes
  const validateFile = (file: File, rules: { maxSize: number }) => {
    if (file.size > rules.maxSize) {
      return { isValid: false, error: 'File size exceeds 2MB limit.' };
    }
    return { isValid: true };
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
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Trust pledge indicators banner */}
      <div className="bg-muted/30 border-2 border-border p-3 rounded-none text-[10px] sm:text-xs font-bold text-muted-foreground flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Web Crypto Browser Compute
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Inputs Never Uploaded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Free &amp; Secure Forever
        </span>
      </div>

      {/* Action configuration panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 border-2 border-border rounded-none">
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="rounded-none border-2">
            {t.loadSampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input} className="rounded-none border-2">
            {t.clearButton}
          </Button>
          
          <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none ml-2 border-l-2 border-border pl-4 h-7">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary checked:bg-primary cursor-pointer"
            />
            {t.uppercaseLabel}
          </label>
        </div>
      </div>

      {/* Premium Salt Cryptography Settings card */}
      <Card className="rounded-none border-2 border-border card-depth-2">
        <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Settings className="h-4 w-4" /> Cryptographic Salt Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="salt-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Salt String</label>
            <Input
              id="salt-input"
              type="text"
              placeholder="e.g. secret_salt_key"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              className="h-9 text-xs font-semibold rounded-none border-2"
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="salt-position" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Salt Position</label>
            <select
              id="salt-position"
              value={saltPosition}
              onChange={(e) => setSaltPosition(e.target.value as 'prepend' | 'append')}
              className="h-9 border-2 border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer w-32"
            >
              <option value="append">Append (End)</option>
              <option value="prepend">Prepend (Start)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Error state box */}
      {errorMsg && (
        <StatusBanner type="error" message={errorMsg} />
      )}

      {/* Workspaces layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Input Panel */}
        <TextInputArea 
          value={input}
          onChange={setInput}
          placeholder={t.placeholder}
          label={t.inputLabel}
          onFileDrop={processUploadedFile}
          rows={12}
          showStats={true}
        />

        {/* Output Panel: Displays all concurrent hashes */}
        <Card className="rounded-none border-2 border-border card-depth-1 h-full min-h-[300px]">
          <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" /> Generated Hashes List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {hashes ? (
              <div className="divide-y divide-border/40 font-mono text-xs select-text">
                {formattedHashesList.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleCopyHash(item.value, item.id)}
                    className="flex justify-between items-stretch hover:bg-muted/15 cursor-pointer transition-colors group"
                  >
                    <div className="flex flex-col gap-1.5 py-3.5 px-4 min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Binary className="h-3.5 w-3.5" /> {item.id}
                      </span>
                      <span className="truncate font-bold text-foreground font-mono tracking-wide text-xs select-all">
                        {uppercase ? item.value.toUpperCase() : item.value}
                      </span>
                    </div>
                    
                    <button
                      className="px-4 border-l border-border/40 hover:bg-muted flex items-center justify-center shrink-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title={`Copy ${item.id} hash`}
                    >
                      {copiedItem === item.id ? (
                        <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
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
  );
}
