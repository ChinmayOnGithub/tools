'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import t from './locales/en.json';
import { generateMultiplePasswords, analyzePassword } from './utils';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import ActionBar from '@/components/shared/ActionBar';
import PipeButton from '@/components/shared/PipeButton';
import CopyShareToast from '@/components/shared/CopyShareToast';

// Hooks
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import {
  trackToolLaunch,
  trackToolCompletion,
  trackDownloadAction
} from '@/lib/analytics';
import { Settings, RefreshCw, FileDown, Copy, Check, Info, LayoutGrid, Terminal } from 'lucide-react';
import { SliderInput } from '@/components/ui/SliderInput';
import { CheckboxField } from '@/components/ui/CheckboxField';
import { downloadFile } from '@/lib/download';

export default function PasswordGenerator() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');

  // Options states for Random Password
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  // Options states for Passphrase
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);

  // Quantities & output
  const [quantity, setQuantity] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [selectedPassword, setSelectedPassword] = useState<string | null>(null);
  const [viewFormat, setViewFormat] = useState<'list' | 'raw'>('list');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { copied, copy } = useCopyToClipboard('password-generator');

  const handleGenerate = useCallback(() => {
    const opts = {
      mode,
      length: Math.max(8, Math.min(64, length)),
      uppercase,
      lowercase,
      numbers,
      symbols,
      excludeSimilar,
      excludeAmbiguous,
      wordCount: Math.max(3, Math.min(10, wordCount)),
      separator,
      capitalize
    };
    const list = generateMultiplePasswords(opts, Math.max(1, Math.min(15, quantity)));
    setPasswords(list);
    if (list.length > 0) {
      setSelectedPassword(list[0]);
    } else {
      setSelectedPassword(null);
    }

    if (mounted) {
      trackToolCompletion('password-generator');
    }
  }, [
    mode, length, uppercase, lowercase, numbers, symbols,
    excludeSimilar, excludeAmbiguous, wordCount, separator,
    capitalize, quantity, mounted
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('password-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        handleGenerate();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [mounted, handleGenerate]);

  const handleCopyAll = () => {
    if (passwords.length === 0) return;
    copy(passwords.join('\n'));
    setShowToast(true);
  };

  const handleCopyPassword = (pw: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(pw).then(() => {
      setCopiedItem(pw);
      setTimeout(() => setCopiedItem(null), 1000);
    });
  };

  const handleDownload = () => {
    if (passwords.length === 0) return;
    trackDownloadAction('password-generator');
    downloadFile(passwords.join('\n'), 'passwords.txt', 'text/plain');
  };

  const strengthAnalysis = useMemo(() => {
    if (!selectedPassword) return null;
    return analyzePassword(selectedPassword);
  }, [selectedPassword]);

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  const modeToggles = (
    <div className="flex border border-border rounded-none overflow-hidden h-7">
      <button
        onClick={() => setMode('password')}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-border transition-colors ${
          mode === 'password'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        Random Password
      </button>
      <button
        onClick={() => setMode('passphrase')}
        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          mode === 'passphrase'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        Memorable Passphrase
      </button>
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: Settings Panel */}
        <div className="space-y-6">
          <Card className="rounded-none border border-border card-depth-2">
            <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-primary" /> Options Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Mode switch */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Generator Mode</label>
                {modeToggles}
              </div>

              {/* Mode Options */}
              {mode === 'password' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password Length ({length})</label>
                    <SliderInput
                      id="password-length"
                      label="Password Length"
                      min={8}
                      max={64}
                      value={length}
                      onChange={setLength}
                    />
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2 border-t border-border/40">
                    <CheckboxField id="chk-upper" label="Uppercase Letters (A-Z)" checked={uppercase} onChange={setUppercase} />
                    <CheckboxField id="chk-lower" label="Lowercase Letters (a-z)" checked={lowercase} onChange={setLowercase} />
                    <CheckboxField id="chk-nums" label="Numbers (0-9)" checked={numbers} onChange={setNumbers} />
                    <CheckboxField id="chk-syms" label="Symbols (!@#$%^&*)" checked={symbols} onChange={setSymbols} />
                    <CheckboxField id="chk-sim" label="Exclude Similar Characters (e.g. i, l, 1, o, 0)" checked={excludeSimilar} onChange={setExcludeSimilar} />
                    <CheckboxField id="chk-amb" label="Exclude Ambiguous Characters (e.g. {, }, [, ])" checked={excludeAmbiguous} onChange={setExcludeAmbiguous} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Word Count ({wordCount})</label>
                    <SliderInput
                      id="passphrase-words"
                      label="Word Count"
                      min={3}
                      max={10}
                      value={wordCount}
                      onChange={setWordCount}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="passphrase-separator" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Separator Character</label>
                    <Input
                      id="passphrase-separator"
                      type="text"
                      maxLength={1}
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-9 text-xs font-semibold rounded-none border border-border bg-card"
                    />
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2 border-t border-border/40">
                    <CheckboxField id="chk-cap" label="Capitalize Words" checked={capitalize} onChange={setCapitalize} />
                  </div>
                </>
              )}

              {/* Quantity select */}
              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <label htmlFor="pass-quantity" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quantity to Generate</label>
                <Input
                  id="pass-quantity"
                  type="number"
                  min={1}
                  max={15}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(15, parseInt(e.target.value) || 1)))}
                  className="h-9 text-xs font-semibold rounded-none border border-border bg-card"
                />
              </div>

              <div className="pt-2">
                <Button onClick={handleGenerate} className="w-full rounded-none">
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generated lists and Strength Inspector */}
        <div className="space-y-6">
          <Card className="rounded-none border border-border card-depth-2">
            <CardHeader className="py-2.5 px-4 border-b border-border bg-muted/10 flex flex-row justify-between items-center space-y-0">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4 text-primary animate-spin-slow" /> Generated Output
              </CardTitle>

              {/* Format switcher tabs */}
              <div className="flex border border-border rounded-none overflow-hidden h-7">
                <button
                  onClick={() => setViewFormat('list')}
                  className={`px-2.5 flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors border-r border-border ${
                    viewFormat === 'list' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="h-3 w-3" /> List View
                </button>
                <button
                  onClick={() => setViewFormat('raw')}
                  className={`px-2.5 flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors ${
                    viewFormat === 'raw' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Terminal className="h-3 w-3" /> Raw Text
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {viewFormat === 'raw' ? (
                <div className="space-y-0">
                  <textarea
                    readOnly
                    value={passwords.join('\n')}
                    placeholder={t.placeholder}
                    className="w-full h-[320px] border-none bg-muted/5 p-4 font-mono text-xs outline-none focus:ring-0 resize-y text-foreground"
                    aria-label="Generated passwords text area"
                  />
                  <ActionBar className="border-t border-border">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <FileDown className="h-3.5 w-3.5 mr-1" />
                        Export List
                      </Button>
                      <PipeButton value={passwords.join('\n')} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCopyAll}>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        {copied ? 'Copied' : 'Copy All'}
                      </Button>
                    </div>
                  </ActionBar>
                </div>
              ) : (
                <div className="h-[320px] overflow-y-auto p-3 bg-muted/5 divide-y divide-border/40 font-mono text-xs select-text">
                  {passwords.map((pw, i) => (
                    <div 
                      key={i}
                      onClick={() => setSelectedPassword(pw)}
                      className={`flex justify-between items-center py-2 px-2.5 cursor-pointer transition-colors ${
                        selectedPassword === pw 
                          ? 'bg-primary/10 border-l-4 border-primary font-bold' 
                          : 'hover:bg-muted/40 border-l-4 border-transparent'
                      }`}
                    >
                      <span className="truncate">{pw}</span>
                      <div className="flex items-stretch shrink-0">
                        <button
                          onClick={(e) => handleCopyPassword(pw, e)}
                          className="px-2 hover:text-primary transition-colors cursor-pointer"
                          title="Copy Password"
                        >
                          {copiedItem === pw ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-in zoom-in-50 duration-200" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <PipeButton value={pw} iconOnly={true} className="h-full border-t-0 border-b-0 border-r-0 border-l border-border/40 bg-transparent text-muted-foreground hover:text-primary hover:bg-muted font-bold text-[9px] uppercase tracking-wider rounded-none px-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password strength details */}
          {selectedPassword && strengthAnalysis && (
            <Card className="rounded-none border border-border card-depth-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <CardHeader className="py-2.5 px-4 border-b border-border bg-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Info className="h-4 w-4" /> Password Strength Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs font-semibold">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Entropy:</span>
                  <span className="font-mono text-foreground font-bold">{strengthAnalysis.entropy} bits</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Strength Assessment:</span>
                  <span className={`font-bold uppercase tracking-wider ${
                    strengthAnalysis.strength === 'very-strong' ? 'text-emerald-500' : strengthAnalysis.strength === 'strong' ? 'text-emerald-400' : strengthAnalysis.strength === 'medium' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {strengthAnalysis.strength === 'very-strong' ? 'Very Strong' : strengthAnalysis.strength === 'strong' ? 'Strong' : strengthAnalysis.strength === 'medium' ? 'Medium' : 'Weak'}
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
        message="Copied passwords list to clipboard." 
      />
    </div>
  );
}
