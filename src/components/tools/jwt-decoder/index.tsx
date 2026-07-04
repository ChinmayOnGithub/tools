'use client';

import { useState, useEffect } from 'react';
import t from './locales/en.json';
import { decodeJWT } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';

export default function JWTDecoder() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  
  const { copied: copiedHeader, copy: copyHeader } = useCopyToClipboard('jwt-decoder');
  const { copied: copiedPayload, copy: copyPayload } = useCopyToClipboard('jwt-decoder');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('jwt-decoder');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce analytics tracking to avoid logging unfinished token string edits
  useEffect(() => {
    if (!input.trim()) return;

    const timer = setTimeout(() => {
      const result = decodeJWT(input);
      if (result.success) {
        trackToolCompletion('jwt-decoder');
      } else {
        trackValidationError('jwt-decoder', 'decode_failed');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [input]);

  const handleClear = () => {
    setInput('');
  };

  const handleLoadSample = () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: 'usr_1234567890',
      name: 'Annette Black',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000) - 60, // 1 minute ago
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };
    
    const encodeStr = (obj: Record<string, unknown>) => {
      const str = JSON.stringify(obj);
      const b64 = btoa(unescape(encodeURIComponent(str)));
      return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };
    
    const token = `${encodeStr(header)}.${encodeStr(payload)}.sflkxwrjsmekkf2qt4fwpmejf36poe6y`;
    setInput(token);
  };

  const result = input.trim() ? decodeJWT(input) : null;
  const decoded = result?.success ? result.data : null;
  const errorMsg = result && !result.success ? result.error : null;

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Trust pledge indicators banner */}
      <div className="bg-muted/30 border-2 border-border p-3 rounded-none text-[10px] sm:text-xs font-bold text-muted-foreground flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Browser-Only Decodes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Tokens Never Leave Your Machine
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-primary text-[9px] select-none">■</span>
          Free & Secure Forever
        </span>
      </div>

      {/* Control panel */}
      <div className="flex justify-between items-center bg-card p-3 rounded-lg border">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            {t.loadSampleButton}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
            {t.clearButton}
          </Button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-3 rounded-lg text-xs font-semibold border bg-destructive/10 text-destructive border-destructive/20">
          {t.validationError.replace('{message}', errorMsg)}
        </div>
      )}

      {/* Layout workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Token Input panel */}
        <Card className="flex flex-col h-fit">
          <CardHeader className="py-3.5 px-4 border-b">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t.inputLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              rows={12}
              className="w-full rounded-md border border-input bg-transparent p-3 font-mono text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 resize-y"
              aria-label="Encoded JWT input string"
            />
          </CardContent>
        </Card>

        {/* Decoded claims panels */}
        <div className="space-y-6">
          {decoded ? (
            <>
              {/* Claims Metadata stats */}
              <Card>
                <CardHeader className="py-3 px-4 border-b bg-muted/10">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t.metadataLabel}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-muted-foreground font-semibold">{t.algorithm}</span>
                    <span className="font-mono font-bold text-foreground">
                      {decoded.header.alg ? String(decoded.header.alg) : 'none'}
                    </span>
                  </div>
                  {decoded.issuedAtDate && (
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground font-semibold">{t.issuedAt}</span>
                      <span className="font-semibold text-foreground text-[11px]">{decoded.issuedAtDate}</span>
                    </div>
                  )}
                  {decoded.expirationDate && (
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground font-semibold">{t.expiration}</span>
                      <span className="font-semibold text-foreground text-[11px]">{decoded.expirationDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">{t.statusLabel}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      decoded.isExpired 
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {decoded.isExpired ? t.statusExpired : t.statusActive}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Header JSON viewer */}
              <Card className="flex flex-col">
                <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center space-y-0 bg-muted/10">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t.headerLabel}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => copyHeader(JSON.stringify(decoded.header, null, 2))}>
                    {copiedHeader ? t.copiedFeedback : t.copyButton}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-4 font-mono text-xs text-foreground bg-muted/20 overflow-x-auto select-all max-h-[180px]">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Payload JSON claims viewer */}
              <Card className="flex flex-col">
                <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center space-y-0 bg-muted/10">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t.payloadLabel}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => copyPayload(JSON.stringify(decoded.payload, null, 2))}>
                    {copiedPayload ? t.copiedFeedback : t.copyButton}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-4 font-mono text-xs text-foreground bg-muted/20 overflow-x-auto select-all max-h-[300px]">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center border border-dashed rounded-xl">
              <p className="text-xs text-muted-foreground italic">
                {input.trim() ? 'Resolve input parsing errors to view JWT claims' : 'Decoded JWT header, payload claims, and claim details will be rendered here'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
