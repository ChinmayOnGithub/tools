'use client';

import { useState, useEffect } from 'react';
import { Trash, Copy, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import t from './locales/en.json';
import { decodeJWT } from './utils';

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
import { 
  trackToolLaunch, 
  trackToolCompletion, 
  trackValidationError 
} from '@/lib/analytics';

export default function JWTDecoder() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Copied to clipboard.');
  
  const { copy } = useCopyToClipboard('jwt-decoder');

  // URL query parameter piping hook
  useUrlQueryInput(setInput);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('jwt-decoder');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Debounce analytics tracking
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

  const handleFocusInput = () => {
    const textarea = document.querySelector('textarea[aria-label="JWT token input"]') as HTMLTextAreaElement;
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

  const handleCopySection = (text: string, label: string) => {
    if (!text) return;
    copy(text);
    setToastMsg(`Copied ${label} to clipboard.`);
    setShowToast(true);
  };

  const result = input.trim() ? decodeJWT(input) : null;
  const headerText = result?.success && result.data ? JSON.stringify(result.data.header, null, 2) : '';
  const payloadText = result?.success && result.data ? JSON.stringify(result.data.payload, null, 2) : '';
  const signatureText = result?.success && result.data ? result.data.signature : '';
  const errorMsg = result && !result.success ? result.error : null;

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Prominent Technical Callout: Decode != Verify */}
      <div className="p-3.5 border-2 border-primary/30 bg-primary/5 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-muted-foreground leading-relaxed">
          <p className="font-bold text-foreground">
            <span className="uppercase tracking-wider">Decode ≠ Verify</span> — Client-Side Structural Inspection
          </p>
          <p>
            This tool parses and displays the JSON Web Token structure directly in your browser. It reveals the claims and header algorithms, but <strong className="text-foreground">does not verify the cryptographic signature</strong> against your private secret or public key.
          </p>
        </div>
      </div>

      {/* 1. Validation Message Box */}
      {errorMsg && (
        <div className="p-3 text-xs font-semibold border bg-destructive/5 text-destructive border-destructive/20 rounded-none animate-in fade-in duration-200">
          {t.validationError.replace('{message}', errorMsg)}
        </div>
      )}

      {/* 2. Workspace Layout */}
      <ToolLayout>
        {/* Workspace Inputs */}
        <div className="space-y-6">
          <InputPanel 
            title="JWT Token Input (Header.Payload.Signature)" 
            onPasteClick={handlePasteClick}
          >
            <div className="space-y-4">
              <div className="border border-border bg-card p-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  aria-label="JWT token input"
                  className="w-full h-80 bg-transparent text-xs font-mono p-3 focus:outline-none resize-y border-none outline-none focus:ring-0 text-foreground"
                />
              </div>

              <ActionBar>
                <div className="flex gap-2">
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
        </div>

        {/* Outputs Column */}
        <div className="space-y-6">
          {/* Claim Metadata Status Bar */}
          {result?.success && result.data && (
            <div className="p-3 border border-border bg-card grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                {result.data.isExpired ? (
                  <span className="text-destructive flex items-center gap-1 font-bold">
                    <Clock className="h-3.5 w-3.5" /> Token Expired
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Token Not Expired
                  </span>
                )}
              </div>
              {result.data.expirationDate && (
                <div className="text-muted-foreground text-[11px]">
                  Exp: {result.data.expirationDate}
                </div>
              )}
            </div>
          )}

          {/* Decoded Header */}
          {!!headerText && (
            <OutputPanel title="Decoded Header (Algorithm & Key Type)">
              <div className="space-y-4">
                <div className="border border-border bg-card p-1">
                  <textarea
                    value={headerText}
                    readOnly
                    placeholder="Decoded Header JSON"
                    aria-label="Decoded Header JSON text area"
                    className="w-full h-32 bg-transparent text-xs font-mono p-3 border-none outline-none focus:ring-0 text-foreground resize-y"
                  />
                </div>
                <ActionBar>
                  <div className="flex gap-2">
                    <PipeButton value={headerText} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleCopySection(headerText, 'Header')}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      {t.copyButton}
                    </Button>
                  </div>
                </ActionBar>
              </div>
            </OutputPanel>
          )}

          {/* Decoded Payload */}
          {!!payloadText && (
            <OutputPanel title="Decoded Payload (Claims & Tokens Metadata)">
              <div className="space-y-4">
                <div className="border border-border bg-card p-1">
                  <textarea
                    value={payloadText}
                    readOnly
                    placeholder="Decoded Payload JSON"
                    aria-label="Decoded Payload JSON text area"
                    className="w-full h-56 bg-transparent text-xs font-mono p-3 border-none outline-none focus:ring-0 text-foreground resize-y"
                  />
                </div>
                <ActionBar>
                  <div className="flex gap-2">
                    <PipeButton value={payloadText} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleCopySection(payloadText, 'Payload')}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      {t.copyButton}
                    </Button>
                  </div>
                </ActionBar>
              </div>
            </OutputPanel>
          )}

          {/* Raw Signature Output */}
          {!!signatureText && (
            <OutputPanel title="Token Signature Component">
              <div className="space-y-4">
                <div className="border border-border bg-card p-3">
                  <p className="font-mono text-xs text-muted-foreground break-all">{signatureText}</p>
                </div>
              </div>
            </OutputPanel>
          )}
        </div>
      </ToolLayout>

      {/* Copy notification toast */}
      <CopyShareToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMsg} 
      />
    </div>
  );
}
