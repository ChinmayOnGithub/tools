'use client';

import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { 
  Settings, 
  Download, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import t from './locales/en.json';
import { validateBarcodeContent } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import FaqSection from '@/components/shared/FaqSection';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

export default function BarcodeGeneratorComponent() {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('CODE128-DEMO');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [downloadFormat, setDownloadFormat] = useState('svg');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('barcode-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const generateBarcode = (triggerDownload = false) => {
    if (!inputText.trim()) {
      setError(t.emptyInputError);
      return;
    }

    if (!validateBarcodeContent(format, inputText)) {
      if (format === 'EAN13') {
        setError(t.invalidEanError);
      } else if (format === 'EAN8') {
        setError(t.invalidEan8Error);
      } else {
        setError('Invalid format inputs.');
      }
      trackValidationError('barcode-generator', 'validation_failed');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const svg = svgRef.current;
      if (!svg) {
        throw new Error('SVG container not found');
      }

      JsBarcode(svg, inputText, {
        format,
        width,
        height,
        displayValue: true,
      });

      if (triggerDownload) {
        const svgString = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const baseName = `barcode_${inputText}`;

        if (downloadFormat === 'svg') {
          const url = URL.createObjectURL(svgBlob);
          setDownloadUrl(url);
          setSuccess(true);
          trackToolCompletion('barcode-generator');
          trackDownloadAction('barcode-generator');

          const link = document.createElement('a');
          link.href = url;
          link.download = `${baseName}.svg`;
          link.click();
        } else {
          const img = new Image();
          const url = URL.createObjectURL(svgBlob);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = 2; // 2x density for crisp digital printing
            const svgBox = svg.getBoundingClientRect();
            canvas.width = (svgBox.width || 300) * scale;
            canvas.height = (svgBox.height || 100) * scale;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              if (downloadFormat === 'jpeg') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              canvas.toBlob((blob) => {
                if (blob) {
                  const imgUrl = URL.createObjectURL(blob);
                  setDownloadUrl(imgUrl);
                  setSuccess(true);
                  trackToolCompletion('barcode-generator');
                  trackDownloadAction('barcode-generator');

                  const link = document.createElement('a');
                  link.href = imgUrl;
                  link.download = `${baseName}.${downloadFormat}`;
                  link.click();
                }
              }, downloadFormat === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
            }
            URL.revokeObjectURL(url);
          };
          img.src = url;
        }
      }
    } catch (err: unknown) {
      setError('Failed to construct barcode. Please check your data.');
      trackValidationError('barcode-generator', 'generation_failed');
      logger.error('Failed to render barcode:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    generateBarcode(true);
  };

  // Re-generate preview dynamically when fields change
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      generateBarcode(false);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, inputText, format, width, height]);

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
            <label htmlFor="code-input" className="text-xs font-bold text-muted-foreground">Code Content</label>
            <Input
              id="code-input"
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
            <div className="flex flex-col items-center justify-center p-4 border-2 border-border bg-white shrink-0 w-full md:w-80 min-h-[180px] rounded-none">
              <div className="w-full overflow-hidden flex items-center justify-center">
                <svg ref={svgRef} className="max-w-full h-auto text-foreground" />
              </div>
            </div>

            {/* Custom parameters configuration panel */}
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> {t.settingsHeader}
              </span>

              {/* Format selection dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="format-select" className="text-xs font-bold text-muted-foreground">{t.formatLabel}</label>
                <select
                  id="format-select"
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    setSuccess(false);
                    if (e.target.value === 'EAN13') setInputText('1234567890128');
                    else if (e.target.value === 'EAN8') setInputText('12345670');
                    else setInputText('CODE128-DEMO');
                  }}
                  className="w-full h-10 border-2 border-border rounded-none px-3 bg-background text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="CODE128">CODE128 (Standard)</option>
                  <option value="EAN13">EAN13 (Retail Standard)</option>
                  <option value="EAN8">EAN8 (Compact Retail)</option>
                  <option value="UPC">UPC-A</option>
                  <option value="ITF14">ITF-14</option>
                  <option value="codabar">Codabar</option>
                </select>
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
                  <option value="svg">SVG (Vector - Best for Print)</option>
                  <option value="png">PNG (Lossless - Best for Digital)</option>
                  <option value="jpeg">JPEG (Standard Image)</option>
                </select>
              </div>

              {/* Line width slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                  <label htmlFor="width-slider">{t.sizeLabel}</label>
                  <span>{width}px</span>
                </div>
                <input
                  id="width-slider"
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-border rounded-none cursor-pointer accent-primary"
                  aria-label="Barcode line width slider"
                />
              </div>

              {/* Line height slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                  <label htmlFor="height-slider">{t.heightLabel}</label>
                  <span>{height}px</span>
                </div>
                <input
                  id="height-slider"
                  type="range"
                  min="50"
                  max="150"
                  step="10"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-border rounded-none cursor-pointer accent-primary"
                  aria-label="Barcode line height slider"
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
          {inputText && !error && (
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
                download={`barcode_${inputText}.${downloadFormat}`}
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
