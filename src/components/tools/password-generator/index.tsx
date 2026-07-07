'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import t from './locales/en.json';
import { generateMultiplePasswords, analyzePassword } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import {
  trackToolLaunch,
  trackToolCompletion,
  trackCopyAction
} from '@/lib/analytics';
import { Shield, Key, Lock, Copy, Check, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';
import { SliderInput } from '@/components/ui/SliderInput';
import { CheckboxField } from '@/components/ui/CheckboxField';

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { copied: copiedAll, copy: copyAll } = useCopyToClipboard('password-generator');

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

  useEffect(() => {
    if (copiedIndex === null) return;
    const timer = setTimeout(() => setCopiedIndex(null), 1500);
    return () => clearTimeout(timer);
  }, [copiedIndex]);

  const handleCopyAll = () => {
    if (passwords.length === 0) return;
    copyAll(passwords.join('\n'));
  };

  const handleCopyPassword = (pw: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(pw);
    trackCopyAction('password-generator');
    setCopiedIndex(index);
  };

  // Analyze the first password in the list for the stats panel
  const currentAnalysis = useMemo(() => {
    const firstPw = passwords[0] || '';
    return analyzePassword(firstPw, mode === 'passphrase');
  }, [passwords, mode]);

  const getStrengthBadgeClass = (level: string) => {
    switch (level) {
      case 'weak':   return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
      case 'medium': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'strong': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/30';
      default:       return 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30';
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-96 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Mode toggle */}
      <div className="flex border-2 border-border rounded-none overflow-hidden h-9">
        <button
          id="mode-password"
          onClick={() => setMode('password')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors border-r border-border ${
            mode === 'password'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <Key className="h-4 w-4" /> Random Password
        </button>
        <button
          id="mode-passphrase"
          onClick={() => setMode('passphrase')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
            mode === 'passphrase'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lock className="h-4 w-4" /> Memorable Passphrase
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left Column: Config Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-none border-2 border-border card-depth-2">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">

              {mode === 'password' ? (
                <>
                  {/* Password Length */}
                  <SliderInput
                    id="length-slider"
                    label="Length"
                    min={8}
                    max={64}
                    value={length}
                    onChange={setLength}
                    unit=" chars"
                  />

                  {/* Character Options */}
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-border/40">
                    <CheckboxField id="opt-uppercase" label="Uppercase letters (A-Z)" checked={uppercase} onChange={setUppercase} />
                    <CheckboxField id="opt-lowercase" label="Lowercase letters (a-z)" checked={lowercase} onChange={setLowercase} />
                    <CheckboxField id="opt-numbers"   label="Numbers (0-9)"           checked={numbers}   onChange={setNumbers} />
                    <CheckboxField id="opt-symbols"   label="Symbols (!@#$%)"         checked={symbols}   onChange={setSymbols} />
                  </div>

                  {/* Exclusions */}
                  <div className="flex flex-col gap-2.5 pt-3 border-t border-border/40 text-xs">
                    <CheckboxField id="opt-similar"   label="Exclude Similar (i, l, 1, L, o, 0)"                   checked={excludeSimilar}   onChange={setExcludeSimilar} />
                    <CheckboxField id="opt-ambiguous" label={"Exclude Ambiguous ({ } [ ] / \\ ' \" ` ; : . < >)"} checked={excludeAmbiguous} onChange={setExcludeAmbiguous} />
                  </div>
                </>
              ) : (
                <>
                  {/* Passphrase Word Count */}
                  <SliderInput
                    id="word-count"
                    label="Word Count"
                    min={3}
                    max={10}
                    value={wordCount}
                    onChange={setWordCount}
                    unit=" words"
                  />

                  {/* Separator */}
                  <div className="space-y-1.5">
                    <label htmlFor="separator-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Separator Character
                    </label>
                    <Input
                      id="separator-input"
                      type="text"
                      maxLength={3}
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="h-9 text-xs font-semibold rounded-none border-2 border-border"
                    />
                  </div>

                  {/* Capitalize */}
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-border/40">
                    <CheckboxField id="opt-capitalize" label="Capitalize words" checked={capitalize} onChange={setCapitalize} />
                  </div>
                </>
              )}

              {/* Quantity */}
              <div className="space-y-1.5 pt-3 border-t border-border/40">
                <label htmlFor="quantity-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Passwords Quantity
                </label>
                <Input
                  id="quantity-input"
                  type="number"
                  min={1}
                  max={15}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(15, parseInt(e.target.value) || 1)))}
                  className="h-9 text-xs font-semibold rounded-none border-2 border-border"
                />
              </div>

              <div className="pt-4 border-t border-border/40">
                <Button id="regenerate-btn" onClick={handleGenerate} className="w-full rounded-none border-2">
                  Regenerate
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generated list + Strength analysis */}
        <div className="lg:col-span-2 space-y-6">

          {/* Output Card */}
          <Card className="rounded-none border-2 border-border card-depth-2">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/10 flex flex-row justify-between items-center space-y-0">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> Generated Passwords
              </CardTitle>
              {passwords.length > 0 && (
                <Button id="copy-all-btn" variant="outline" size="sm" onClick={handleCopyAll} className="rounded-none border-2 h-7 text-[10px] w-24">
                  {copiedAll ? t.copiedFeedback : 'Copy All'}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40 font-mono text-xs select-text">
                {passwords.map((pw, i) => {
                  const pwAnalysis = analyzePassword(pw, mode === 'passphrase');
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2.5 px-3.5 hover:bg-muted/15 transition-colors group"
                    >
                      <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                        <span className="truncate text-foreground font-bold font-mono tracking-wide">{pw}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 border text-[8px] font-black uppercase tracking-wider ${getStrengthBadgeClass(pwAnalysis.strength)}`}>
                            {pwAnalysis.strength}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-sans font-bold">
                            Entropy: {pwAnalysis.entropy} bits
                          </span>
                        </div>
                      </div>

                      <button
                        id={`copy-pw-${i}`}
                        onClick={(e) => handleCopyPassword(pw, i, e)}
                        className="p-1.5 border border-border bg-background hover:text-primary transition-colors cursor-pointer shrink-0 rounded-none"
                        title="Copy Password"
                      >
                        {copiedIndex === i
                          ? <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
                          : <Copy className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Strength analysis */}
          {passwords.length > 0 && currentAnalysis && (
            <Card className="rounded-none border-2 border-border card-depth-2 animate-in fade-in duration-200">
              <CardHeader className="py-3 px-4 border-b border-border bg-primary/5">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Password Health Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Entropy Strength Value:</span>
                  <span className="font-mono text-foreground font-bold">{currentAnalysis.entropy} Bits</span>
                </div>

                {mode === 'password' && (
                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { active: currentAnalysis.hasUpper,  label: 'Uppercase Letters' },
                      { active: currentAnalysis.hasLower,  label: 'Lowercase Letters' },
                      { active: currentAnalysis.hasNumber, label: 'Numbers Included' },
                      { active: currentAnalysis.hasSymbol, label: 'Symbols Included' },
                    ].map(({ active, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        {active
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          : <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        }
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-muted/20 border-2 border-border/40 text-muted-foreground text-[10px] leading-relaxed">
                  <span className="font-black text-primary uppercase block mb-1">Security Standard Guidelines:</span>
                  Passphrases or passwords with above 60 bits of entropy offer solid baseline protection against common offline brute-force attacks. Aim for above 80 bits (teal colored badge) for maximum professional-grade security.
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
