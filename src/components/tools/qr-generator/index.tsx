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
import FaqSection from '@/components/shared/FaqSection';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

export default function QrGeneratorComponent() {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('https://tools.chinmaypatil.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [downloadFormat, setDownloadFormat] = useState('png');
  
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
        if (downloadFormat === 'svg') {
          // Generate vector SVG string client-side using the qrcode library directly
          const svgString = await QRCode.toString(inputText, {
            type: 'svg',
            width: size,
            color: {
              dark: fgColor,
              light: bgColor,
            },
          });
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          
          setDownloadUrl(url);
          setSuccess(true);
          trackToolCompletion('qr-generator');
          trackDownloadAction('qr-generator');

          const link = document.createElement('a');
          link.href = url;
          link.download = 'qrcode.svg';
          link.click();
        } else {
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
            link.download = `qrcode.${downloadFormat}`;
            link.click();
          }, downloadFormat === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
        }
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
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Card className="card-depth-2 rounded-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            {t.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main text input field */}
          <div className="space-y-1.5">
            <label htmlFor="qr-input" className="text-xs font-bold text-muted-foreground">Code Content</label>
            <Input
              id="qr-input"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSuccess(false);
              }}
              placeholder={t.inputPlaceholder}
              className="h-10 text-xs font-semibold rounded-none"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 border-t pt-4">
            {/* Visual preview box */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-border bg-white shrink-0 w-full md:w-64 min-h-[160px] rounded-none">
              <canvas ref={canvasRef} className="max-w-full h-auto" style={{ width: '180px', height: '180px' }} />
            </div>

            {/* Configuration Settings panel */}
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> {t.settingsHeader}
              </span>

              {/* Size selection slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                  <label htmlFor="size-slider">{t.sizeLabel}</label>
                  <span>{size}x{size} px</span>
                </div>
                <input
                  id="size-slider"
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-border rounded-none cursor-pointer accent-primary"
                  aria-label="QR Code size slider"
                />
              </div>

              {/* Download Format selection dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="download-format-select" className="text-xs font-bold text-muted-foreground">Download Format</label>
                <select
                  id="download-format-select"
                  value={downloadFormat}
                  onChange={(e) => {
                    setDownloadFormat(e.target.value);
                    setSuccess(false);
                  }}
                  className="w-full h-10 border-2 border-border rounded-none px-3 bg-background text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="png">PNG (Lossless - Best for Digital)</option>
                  <option value="svg">SVG (Vector - Best for Print)</option>
                  <option value="jpeg">JPEG (Standard Image)</option>
                </select>
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
                      className="h-8 w-8 rounded-none border border-border cursor-pointer shrink-0"
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
                      className="h-8 w-8 rounded-none border border-border cursor-pointer shrink-0"
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
            <div className="bg-destructive/5 border-2 border-destructive/20 text-destructive p-4 flex gap-3 text-xs font-semibold leading-relaxed rounded-none">
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
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer rounded-none"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {loading ? 'Processing...' : t.generateButton}
              </Button>
            </div>
          )}

          {/* Success / Result details */}
          {success && downloadUrl && (
            <div className="bg-emerald-500/5 border-2 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 p-4 rounded-none flex flex-col gap-2 text-xs font-semibold leading-relaxed">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.successMessage}</span>
              </div>
              <a
                href={downloadUrl}
                download={`qrcode.${downloadFormat}`}
                className="text-primary underline font-bold pl-7"
              >
                {t.downloadPrompt}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ accordion */}
      <Card className="p-4 space-y-4 rounded-none">
        <FaqSection faqs={t.faq} />
      </Card>
    </div>
  );
}
