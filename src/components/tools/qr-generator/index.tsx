'use client';

import { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  Copy,
  Wifi,
  Type
} from 'lucide-react';
import t from './locales/en.json';

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
import { Input } from '@/components/ui/Input';
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
  const [showToast, setShowToast] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { copy } = useCopyToClipboard('qr-generator');

  // URL query parameter piping hook
  useUrlQueryInput(setInputText);

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

  const generateQrCode = useCallback(async () => {
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

      // Draw standard base QR code matrix inside the hidden canvas
      await QRCode.toCanvas(canvas, content, opts);

      // Render custom logo block if loaded
      if (logoImageSrc) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new window.Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load logo image source'));
            img.src = logoImageSrc;
          });

          // Compute size proportions safely (30% scale bounds)
          const maxLogoSize = Math.floor(size * 0.22);
          let logoW = img.width;
          let logoH = img.height;

          if (logoW > maxLogoSize || logoH > maxLogoSize) {
            const aspect = logoW / logoH;
            if (aspect > 1) {
              logoW = maxLogoSize;
              logoH = Math.floor(maxLogoSize / aspect);
            } else {
              logoH = maxLogoSize;
              logoW = Math.floor(maxLogoSize * aspect);
            }
          }

          const x = Math.floor((size - logoW) / 2);
          const y = Math.floor((size - logoH) / 2);

          // Clear center region or draw white border bounding box to preserve readability
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - 3, y - 3, logoW + 6, logoH + 6);

          // Draw the center logo branding
          ctx.drawImage(img, x, y, logoW, logoH);
        }
      }

      trackToolCompletion('qr-generator');
    } catch (err: unknown) {
      logger.error('Failed to generate QR Code canvas:', err);
      const msg = err instanceof Error ? err.message : 'QR Code generation failed.';
      setError(msg);
      trackValidationError('qr-generator', 'canvas_draw_error');
    } finally {
      setLoading(false);
    }
  }, [qrContent, size, fgColor, bgColor, errorLevel, logoImageSrc]);

  // Re-generate QR Code whenever configurations change
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        generateQrCode();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mounted, generateQrCode]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    trackDownloadAction('qr-generator');

    if (downloadFormat === 'svg') {
      const content = qrContent();
      const activeErrorLevel = logoImageSrc ? 'H' : errorLevel;

      QRCode.toString(content, {
        type: 'svg',
        width: size,
        margin: 2,
        errorCorrectionLevel: activeErrorLevel,
        color: {
          dark: fgColor,
          light: bgColor
        }
      }, (err, svgString) => {
        if (err) {
          logger.error('Failed to compile SVG string output:', err);
          return;
        }
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } else {
      const type = downloadFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const ext = downloadFormat === 'jpeg' ? 'jpg' : 'png';
      
      const url = canvas.toDataURL(type);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 500KB
    if (file.size > 500 * 1024) {
      setError('Logo size exceeds 500KB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoImageSrc(event.target?.result as string || null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoImageSrc(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleCopyCodeValue = () => {
    const value = qrContent();
    if (!value) return;
    copy(value);
    setShowToast(true);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full border border-border rounded-none" />;
  }

  const modeToggles = (
    <div className="flex border border-border rounded-none overflow-hidden h-7">
      <button
        onClick={() => setPresetMode('text')}
        className={`px-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-border transition-colors ${
          presetMode === 'text'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        <Type className="h-3 w-3" /> Text / URL
      </button>
      <button
        onClick={() => setPresetMode('wifi')}
        className={`px-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          presetMode === 'wifi'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background hover:bg-muted text-muted-foreground'
        }`}
      >
        <Wifi className="h-3 w-3" /> WiFi Access
      </button>
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: Input Configurations */}
        <div className="space-y-6">
          <InputPanel title="QR Code Options" actions={modeToggles}>
            <div className="space-y-4">
              {presetMode === 'text' ? (
                <div className="space-y-1.5">
                  <label htmlFor="text-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Text or URL</label>
                  <Input
                    id="text-input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="https://tools.chinmaypatil.com"
                    className="h-9 text-xs font-semibold rounded-none border border-border bg-card font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-3.5 pt-2 border-t border-border/40">
                  <div className="space-y-1.5">
                    <label htmlFor="wifi-ssid" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Network SSID (Name)</label>
                    <Input
                      id="wifi-ssid"
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="MyHomeWiFi"
                      className="h-9 text-xs font-semibold rounded-none border border-border bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="wifi-pass" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password (Security Key)</label>
                    <Input
                      id="wifi-pass"
                      type="password"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="secret123"
                      className="h-9 text-xs font-semibold rounded-none border border-border bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="wifi-sec" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Security Type</label>
                    <select
                      id="wifi-sec"
                      value={wifiSecurity}
                      onChange={(e) => setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                      className="w-full h-9 border border-border px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none rounded-none cursor-pointer"
                    >
                      <option value="WPA">WPA / WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open (No Password)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Slider Size */}
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

              {/* Error correction Level */}
              <div className="space-y-1.5">
                <label htmlFor="error-level-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Error Correction Level</label>
                <select
                  id="error-level-select"
                  value={logoImageSrc ? 'H' : errorLevel}
                  disabled={!!logoImageSrc}
                  onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="w-full h-9 border border-border rounded-none px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none disabled:opacity-50"
                >
                  <option value="L">Level L (7% recovery)</option>
                  <option value="M">Level M (15% recovery)</option>
                  <option value="Q">Level Q (25% recovery)</option>
                  <option value="H">Level H (30% recovery - Recommended)</option>
                </select>
              </div>

              {/* Logo Uploader */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> Center Logo Branding
                </span>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => logoInputRef.current?.click()}
                    className="rounded-none border text-[10px] h-8"
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
                      className="rounded-none border text-destructive border-destructive/20 hover:bg-destructive/5 text-[10px] h-8 flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </Button>
                  )}
                </div>
                {logoImageSrc && (
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Logo Loaded (Error correction level forced to High)</p>
                )}
              </div>

              {/* Color pickers */}
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-muted-foreground pt-2 border-t border-border/40">
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
          </InputPanel>
        </div>

        {/* Right Column: Visual Preview & Export */}
        <div className="space-y-6">
          <OutputPanel title="Visual Preview">
            <div className="space-y-4">
              {/* Canvas Preview Area */}
              <div className="flex flex-col items-center justify-center p-6 border border-border bg-white min-h-[220px] rounded-none">
                <canvas ref={canvasRef} className="max-w-full h-auto shadow-sm" style={{ width: '200px', height: '200px' }} />
              </div>

              {/* Format selection */}
              <div className="space-y-1.5">
                <label htmlFor="download-format-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Download Format</label>
                <select
                  id="download-format-select"
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="w-full h-9 border border-border rounded-none px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none"
                >
                  <option value="png">PNG (Lossless - Best for Digital)</option>
                  <option value="svg">SVG (Vector - Best for Print)</option>
                  <option value="jpeg">JPEG (Standard Image)</option>
                </select>
              </div>

              {error && (
                <div className="bg-destructive/5 border border-destructive/20 text-destructive p-3 flex gap-2 text-xs font-semibold rounded-none">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <ActionBar>
                <div className="flex gap-2">
                  <PipeButton value={qrContent()} />
                  <Button variant="outline" size="sm" onClick={handleCopyCodeValue}>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Value
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDownload} disabled={loading}>
                    {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1" />}
                    Export Image
                  </Button>
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="Copied QR Code value payload to clipboard." />
    </div>
  );
}
