'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Settings, 
  Download, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import t from './locales/en.json';
import { getQrOptions } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

export default function QrGeneratorComponent() {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('https://tools.chinmaypatil.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('qr-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const generateQrCode = async (triggerDownload = false) => {
    if (!inputText.trim()) {
      setError(t.emptyInputError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      const opts = getQrOptions(size, fgColor, bgColor);
      await QRCode.toCanvas(canvas, inputText, opts);

      if (triggerDownload) {
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('QR serialization failed');
          }
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setSuccess(true);
          trackToolCompletion('qr-generator');
          trackDownloadAction('qr-generator');

          const link = document.createElement('a');
          link.href = url;
          link.download = 'qrcode.png';
          link.click();
        });
      }
    } catch (err: unknown) {
      setError(t.generationFailedError);
      trackValidationError('qr-generator', 'generation_failed');
      logger.error('Failed to generate QR:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate preview when configuration changes
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      generateQrCode(false);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, inputText, size, fgColor, bgColor]);

  const handleDownload = () => {
    generateQrCode(true);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Card className="card-depth-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            {t.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main text input field */}
          <div className="space-y-1.5">
            <label htmlFor="qr-input" className="text-xs font-bold text-muted-foreground">URL or Text Content</label>
            <Input
              id="qr-input"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSuccess(false);
              }}
              placeholder={t.inputPlaceholder}
              className="h-10 text-xs font-semibold"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 border-t-2 border-border pt-4">
            {/* Visual Canvas box */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-border bg-muted/5 shrink-0 w-full md:w-auto">
              <div className="border-2 border-border bg-white p-2 overflow-hidden flex items-center justify-center min-h-[160px] min-w-[160px]">
                <canvas ref={canvasRef} style={{ width: '150px', height: '150px' }} />
              </div>
            </div>

            {/* Custom parameters configuration panel */}
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> {t.settingsHeader}
              </span>

              {/* Size slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                  <label htmlFor="size-slider">{t.sizeLabel}</label>
                  <span>{size}px</span>
                </div>
                <input
                  id="size-slider"
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-border rounded cursor-pointer accent-primary"
                  aria-label="QR code size slider"
                />
              </div>

              {/* Color pickers */}
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-muted-foreground">
                <div className="space-y-1.5">
                  <label htmlFor="fg-color" className="block">{t.fgColorLabel}</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-8 w-8 rounded border cursor-pointer shrink-0"
                      aria-label="Foreground color picker"
                    />
                    <span className="font-mono text-[10px]">{fgColor}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bg-color" className="block">{t.bgColorLabel}</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 w-8 rounded border cursor-pointer shrink-0"
                      aria-label="Background color picker"
                    />
                    <span className="font-mono text-[10px]">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message Card */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 flex gap-3 text-xs font-semibold leading-relaxed">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          {inputText && (
            <div className="pt-2">
              <Button
                onClick={handleDownload}
                disabled={loading}
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {loading ? 'Processing...' : t.generateButton}
              </Button>
            </div>
          )}

          {/* Success / Result details */}
          {success && downloadUrl && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 flex flex-col gap-2 text-xs font-semibold leading-relaxed">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>{t.successMessage}</span>
              </div>
              <a
                href={downloadUrl}
                download="qrcode.png"
                className="text-primary underline font-bold pl-7"
              >
                {t.downloadPrompt}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ accordion */}
      <Card className="p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3.5 text-xs">
          {t.faq.map((item, i) => (
            <div key={i} className={i > 0 ? 'border-t pt-3' : ''}>
              <h4 className="font-bold text-foreground mb-1">{item.q}</h4>
              <p className="text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
