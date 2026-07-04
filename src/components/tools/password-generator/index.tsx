'use client';

import { useState, useEffect, useCallback } from 'react';
import t from './locales/en.json';
import { generateMultiplePasswords, getPasswordStrength } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackCopyAction 
} from '@/lib/analytics';

export default function PasswordGenerator() {
  const [mounted, setMounted] = useState(false);
  
  // Options states
  const [length, setLength] = useState(16);
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const { copied: copiedAll, copy: copyAll } = useCopyToClipboard('password-generator');

  const handleGenerate = useCallback(() => {
    const opts = {
      length: Math.max(8, Math.min(64, length)),
      uppercase,
      lowercase,
      numbers,
      symbols,
      excludeSimilar,
      excludeAmbiguous,
    };
    const list = generateMultiplePasswords(opts, Math.max(1, Math.min(15, quantity)));
    setPasswords(list);
    
    if (mounted) {
      trackToolCompletion('password-generator');
    }
  }, [length, uppercase, lowercase, numbers, symbols, excludeSimilar, excludeAmbiguous, quantity, mounted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('password-generator');
      handleGenerate();
    }, 0);
    return () => clearTimeout(timer);
  }, [handleGenerate]);

  useEffect(() => {
    if (copiedIndex === null) return;
    const timer = setTimeout(() => setCopiedIndex(null), 1500);
    return () => clearTimeout(timer);
  }, [copiedIndex]);

  const handleCopyAll = () => {
    if (passwords.length === 0) return;
    copyAll(passwords.join('\n'));
  };

  const handleCopyPassword = (pw: string, index: number) => {
    navigator.clipboard.writeText(pw);
    trackCopyAction('password-generator');
    setCopiedIndex(index);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  const samplePassword = passwords[0] || '';
  const strength = getPasswordStrength(samplePassword);

  const getStrengthColor = (level: typeof strength) => {
    switch (level) {
      case 'weak': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30';
      case 'strong': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'very-strong': return 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30';
    }
  };

  const getStrengthLabel = (level: typeof strength) => {
    switch (level) {
      case 'weak': return t.strengthWeak;
      case 'medium': return t.strengthMedium;
      case 'strong': return t.strengthStrong;
      case 'very-strong': return t.strengthVeryStrong;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Left panel: Configs */}
      <Card className="md:col-span-1 h-fit rounded-none border-2 border-border">
        <CardHeader className="py-3.5 px-4 border-b-2 border-border">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          {/* Sliders */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-muted-foreground">{t.lengthLabel}</span>
              <span className="text-primary font-mono">{length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-none appearance-none cursor-pointer accent-primary"
              aria-label="Password length slider"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-muted-foreground">{t.quantityLabel}</span>
              <span className="text-primary font-mono">{quantity}</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-none appearance-none cursor-pointer accent-primary"
              aria-label="Number of passwords slider"
            />
          </div>

          {/* Rules */}
          <div className="border-t-2 border-border pt-4 space-y-3">
            <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary accent-primary"
              />
              {t.uppercaseLabel}
            </label>

            <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary accent-primary"
              />
              {t.lowercaseLabel}
            </label>

            <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary accent-primary"
              />
              {t.numbersLabel}
            </label>

            <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary accent-primary"
              />
              {t.symbolsLabel}
            </label>

            <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer select-none border-t-2 border-border pt-3">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary accent-primary"
              />
              {t.similarLabel}
            </label>

            <label className="flex items-center gap-2.5 text-xs font-bold text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="h-4 w-4 rounded-none border-2 border-border text-primary focus:ring-primary accent-primary"
              />
              {t.ambiguousLabel}
            </label>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!uppercase && !lowercase && !numbers && !symbols}
            className="w-full h-10 text-xs font-bold rounded-none border-2 border-primary"
          >
            {t.generateButton}
          </Button>
        </CardContent>
      </Card>

      {/* Right panel: Results */}
      <Card className="md:col-span-2 flex flex-col h-full rounded-none border-2 border-border">
        <CardHeader className="py-3.5 px-4 border-b-2 border-border flex flex-row justify-between items-center space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.outputLabel}
          </CardTitle>
          {passwords.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleCopyAll} className="rounded-none border-2 border-border font-bold">
              {copiedAll ? t.copiedFeedback : 'Copy All'}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col gap-4">
          {/* Strength Bar */}
          {passwords.length > 0 && (
            <div className="flex items-center gap-3 bg-muted/10 p-3 rounded-none border-2 border-border">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t.strengthLabel}:
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-none border-2 font-extrabold uppercase tracking-wider ${getStrengthColor(strength)}`}>
                {getStrengthLabel(strength)}
              </span>
            </div>
          )}

          {/* List items */}
          <div className="flex-1 space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {passwords.length > 0 ? (
              passwords.map((pw, index) => {
                return (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted/10 hover:bg-muted/20 border-2 border-border rounded-none group transition-colors"
                  >
                    <span className="font-mono text-xs text-foreground tracking-wide select-all break-all pr-4">
                      {pw}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyPassword(pw, index)}
                      className="h-8 px-3 text-xs font-bold border-2 border-border group-hover:border-primary transition-colors cursor-pointer rounded-none shrink-0"
                    >
                      {copiedIndex === index ? t.copiedFeedback : t.copyButton}
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-muted-foreground italic font-semibold">
                {t.placeholder}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
