'use client';

import { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import QRCode from 'qrcode';
import { 
  Settings, 
  Download, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Image as ImageIcon,
  Wifi,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';
import t from './locales/en.json';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import FaqSection from '@/components/shared/FaqSection';
import { SliderInput } from '@/components/ui/SliderInput';
import { ColorPickerField } from '@/components/ui/ColorPickerField';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

export default function QrGeneratorComponent() {
  const [mounted, setMounted] = useState(false);
  const [presetMode, setPresetMode] = useState<'text' | 'wifi'>('text');
  
  // Text Mode inputs
  const [inputText, setInputText] = useState('https://tools.chinmaypatil.com');

  // WiFi Mode inputs
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('secret123');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Config parameters
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [downloadFormat, setDownloadFormat] = useState('png');
  
  // Center logo parameters
  const [logoImageSrc, setLogoImageSrc] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Compute final content string for the QR Code
  const qrContent = useCallback(() => {
    if (presetMode === 'wifi') {
      return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`;
    }
    return inputText;
  }, [presetMode, wifiSsid, wifiPassword, wifiSecurity, inputText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('qr-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const generateQrCode = useCallback(async (triggerDownload = false) => {
    const content = qrContent();
    if (!content.trim()) {
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

      // Automatically override error level to 'H' when a custom logo is loaded
      const activeErrorLevel = logoImageSrc ? 'H' : errorLevel;

      const opts = {
        width: size,
        margin: 2,
        errorCorrectionLevel: activeErrorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      };

      // Helper function to draw logo on context
      const drawLogoOnCanvas = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
        const logoSize = canvas.width * 0.22; // 22% size
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(x - 3, y - 3, logoSize + 6, logoSize + 6);
        ctx.drawImage(img, x, y, logoSize, logoSize);
      };

      // Wrap QRCode generation inside a promise so we can wait for image loading
      await new Promise<void>((resolve, reject) => {
        QRCode.toCanvas(canvas, content, opts, (err) => {
          if (err) return reject(err);

          if (logoImageSrc) {
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve();

            const img = new Image();
            img.onload = () => {
              drawLogoOnCanvas(ctx, img);
              resolve();
            };
            img.onerror = () => {
              reject(new Error('Failed to load logo image'));
            };
            img.src = logoImageSrc;
          } else {
            resolve();
          }
        });
      });

      setSuccess(true);

      if (triggerDownload) {
        if (downloadFormat === 'svg') {
          // Generate vector SVG string client-side
          const svgString = await QRCode.toString(content, {
            type: 'svg',
            width: size,
            errorCorrectionLevel: activeErrorLevel,
            color: {
              dark: fgColor,
              light: bgColor,
            },
          });
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          setDownloadUrl(url);
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
  }, [qrContent, size, fgColor, bgColor, errorLevel, logoImageSrc, downloadFormat]);

  // Auto-generate preview when configuration changes
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      generateQrCode(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [mounted, generateQrCode]);

  const handleDownload = () => {
    generateQrCode(true);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert("Logo image size should be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoImageSrc(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border-2 border-border" />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      {/* Fluent preset mode selectors */}
      <div className="flex border-2 border-border rounded-none overflow-hidden h-9">
        <button
          onClick={() => setPresetMode('text')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors border-r border-border ${
            presetMode === 'text' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <LinkIcon className="h-4 w-4" /> URL / Plain Text
        </button>
        <button
          onClick={() => setPresetMode('wifi')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
            presetMode === 'wifi' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <Wifi className="h-4 w-4" /> WiFi Connection Code
        </button>
      </div>

      <Card className="card-depth-2 rounded-none border-2 border-border">
        <CardHeader className="py-3 px-4 border-b border-border bg-muted/10">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            {t.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 space-y-6">
          
          {presetMode === 'text' ? (
            /* Text Mode Input */
            <div className="space-y-1.5">
              <label htmlFor="qr-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Code Content (URL / Text)</label>
              <Input
                id="qr-input"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setSuccess(false);
                }}
                placeholder={t.inputPlaceholder}
                className="h-10 text-xs font-semibold rounded-none border-2 border-border"
              />
            </div>
          ) : (
            /* WiFi Mode Inputs Form */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border-2 border-border bg-muted/15">
              <div className="space-y-1">
                <label htmlFor="wifi-ssid" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Network SSID</label>
                <Input
                  id="wifi-ssid"
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="h-9 text-xs font-semibold rounded-none border-2"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="wifi-pass" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <Input
                  id="wifi-pass"
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="h-9 text-xs font-semibold rounded-none border-2"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="wifi-sec" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Security Type</label>
                <select
                  id="wifi-sec"
                  value={wifiSecurity}
                  onChange={(e) => setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                  className="w-full h-9 border-2 border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
                >
                  <option value="WPA">WPA / WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open (No Password)</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 border-t border-border/40 pt-4">
            {/* Visual preview box */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-border bg-white shrink-0 w-full md:w-64 min-h-[220px] rounded-none">
              <canvas ref={canvasRef} className="max-w-full h-auto shadow-sm" style={{ width: '180px', height: '180px' }} />
            </div>

            {/* Configuration Settings panel */}
            <div className="flex-1 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border/40 pb-1">
                <Settings className="h-4 w-4" /> Options &amp; Styles
              </span>

              {/* Logo Uploader */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> Center Logo Branding
                </span>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => logoInputRef.current?.click()}
                    className="rounded-none border-2 text-[10px] h-8"
                  >
                    Choose Logo
                  </Button>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg"
                    className="hidden"
                    aria-label="Upload logo image"
                  />
                  {logoImageSrc && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRemoveLogo}
                      className="rounded-none border-2 text-destructive border-destructive/20 hover:bg-destructive/5 text-[10px] h-8 flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </Button>
                  )}
                </div>
                {logoImageSrc && (
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Logo Loaded (Error correction level forced to High)</p>
                )}
              </div>

              <SliderInput
                id="size-slider"
                label={t.sizeLabel}
                min={128}
                max={512}
                step={32}
                value={size}
                onChange={setSize}
                formatValue={(v) => `${v}×${v} px`}
              />

              {/* Error correction Level config (hide or disable if logo loaded) */}
              <div className="space-y-1.5">
                <label htmlFor="error-level-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Error Correction Level</label>
                <select
                  id="error-level-select"
                  value={logoImageSrc ? 'H' : errorLevel}
                  disabled={!!logoImageSrc}
                  onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="w-full h-9 border-2 border-border rounded-none px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none disabled:opacity-50"
                >
                  <option value="L">Level L (7% recovery)</option>
                  <option value="M">Level M (15% recovery)</option>
                  <option value="Q">Level Q (25% recovery)</option>
                  <option value="H">Level H (30% recovery - Recommended)</option>
                </select>
              </div>

              {/* Download Format selection dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="download-format-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Download Format</label>
                <select
                  id="download-format-select"
                  value={downloadFormat}
                  onChange={(e) => {
                    setDownloadFormat(e.target.value);
                    setSuccess(false);
                  }}
                  className="w-full h-9 border-2 border-border rounded-none px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none"
                >
                  <option value="png">PNG (Lossless - Best for Digital)</option>
                  <option value="svg">SVG (Vector - Best for Print)</option>
                  <option value="jpeg">JPEG (Standard Image)</option>
                </select>
              </div>

              {/* Color pickers */}
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-muted-foreground">
                <ColorPickerField
                  id="fg-color"
                  label={t.fgColorLabel}
                  value={fgColor}
                  onChange={setFgColor}
                />
                <ColorPickerField
                  id="bg-color"
                  label={t.bgColorLabel}
                  value={bgColor}
                  onChange={setBgColor}
                />
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
          {qrContent() && (
            <div className="pt-2">
              <Button
                onClick={handleDownload}
                disabled={loading}
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer rounded-none border-2"
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
      <Card className="p-4 space-y-4 rounded-none border-2 border-border card-depth-1">
        <FaqSection faqs={t.faq} />
      </Card>
    </div>
  );
}
