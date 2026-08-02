'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import { 
  Download, 
  AlertTriangle,
  RefreshCw,
  Copy
} from 'lucide-react';
import t from './locales/en.json';
import { validateBarcodeContent } from './utils';

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
  const [showToast, setShowToast] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const { copy } = useCopyToClipboard('barcode-generator');

  // URL query parameter piping hook
  useUrlQueryInput(setInputText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('barcode-generator');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const drawBarcode = useCallback(() => {
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
      return;
    }

    setError(null);

    try {
      const svg = svgRef.current;
      if (svg) {
        JsBarcode(svg, inputText, {
          format,
          width,
          height,
          displayValue: true,
        });
      }
    } catch (err) {
      logger.error('Failed to draw barcode SVG:', err);
    }
  }, [inputText, format, width, height]);

  // Redraw when settings change
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        drawBarcode();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mounted, drawBarcode]);

  const handleDownload = () => {
    if (!inputText.trim() || error) return;

    const svg = svgRef.current;
    if (!svg) {
      setError('SVG element not found.');
      return;
    }

    setLoading(true);
    try {
      const svgString = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const baseName = `barcode_${inputText}`;

      if (downloadFormat === 'svg') {
        const url = URL.createObjectURL(svgBlob);
        trackToolCompletion('barcode-generator');
        trackDownloadAction('barcode-generator');

        const link = document.createElement('a');
        link.href = url;
        link.download = `${baseName}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const img = new Image();
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = 2; // 2x density for crisp digital printing
          const svgBox = svg.getBoundingClientRect();
          const w = (svgBox.width || svg.clientWidth || 300) * scale;
          const h = (svgBox.height || svg.clientHeight || 150) * scale;
          
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            
            const type = downloadFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
            const ext = downloadFormat === 'jpeg' ? 'jpg' : 'png';
            const imgUrl = canvas.toDataURL(type);
            
            const link = document.createElement('a');
            link.href = imgUrl;
            link.download = `${baseName}.${ext}`;
            link.click();
            
            trackToolCompletion('barcode-generator');
            trackDownloadAction('barcode-generator');
          }
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    } catch (err: unknown) {
      logger.error('Failed to export barcode file:', err);
      const msg = err instanceof Error ? err.message : 'Export failed.';
      setError(msg);
      trackValidationError('barcode-generator', 'export_failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyValue = () => {
    if (!inputText) return;
    copy(inputText);
    setShowToast(true);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 w-full border border-border rounded-none" />;
  }

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: Input options */}
        <div className="space-y-6">
          <InputPanel 
            title="Barcode Options"
            onPasteClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (text) setInputText(text.trim());
              } catch {
                const el = document.getElementById('barcode-input');
                if (el) el.focus();
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="barcode-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Barcode Data</label>
                <Input
                  id="barcode-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="CODE128-DEMO"
                  className="h-9 text-xs font-semibold rounded-none border border-border bg-card font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="format-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Barcode Standard</label>
                <select
                  id="format-select"
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    if (e.target.value === 'EAN13') setInputText('1234567890128');
                    else if (e.target.value === 'EAN8') setInputText('12345670');
                    else setInputText('CODE128-DEMO');
                  }}
                  className="w-full h-9 border border-border rounded-none px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none"
                >
                  <option value="CODE128">CODE128 (Standard)</option>
                  <option value="EAN13">EAN13 (Retail Standard)</option>
                  <option value="EAN8">EAN8 (Compact Retail)</option>
                  <option value="UPC">UPC-A</option>
                  <option value="ITF14">ITF-14</option>
                  <option value="codabar">Codabar</option>
                </select>
              </div>

              <SliderInput
                id="width-slider"
                label="Line Width"
                min={1}
                max={4}
                step={1}
                value={width}
                onChange={setWidth}
                formatValue={(v) => `${v} px`}
              />

              <SliderInput
                id="height-slider"
                label="Line Height"
                min={50}
                max={150}
                step={10}
                value={height}
                onChange={setHeight}
                formatValue={(v) => `${v} px`}
              />
            </div>
          </InputPanel>
        </div>

        {/* Right Column: Visual Preview & Download */}
        <div className="space-y-6">
          <OutputPanel title="Visual Preview">
            <div className="space-y-4">
              {/* SVG Output Container */}
              <div className="flex flex-col items-center justify-center p-6 border border-border bg-white min-h-[220px] rounded-none">
                <svg ref={svgRef} className="max-w-full h-auto" />
              </div>

              {/* Download Format */}
              <div className="space-y-1.5">
                <label htmlFor="download-format-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Download Format</label>
                <select
                  id="download-format-select"
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="w-full h-9 border border-border rounded-none px-2 bg-background text-xs font-semibold text-foreground focus-visible:outline-none"
                >
                  <option value="svg">SVG (Vector - Best for Print)</option>
                  <option value="png">PNG (Lossless - Best for Digital)</option>
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
                  <PipeButton value={inputText} />
                  <Button variant="outline" size="sm" onClick={handleCopyValue}>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Data
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDownload} disabled={loading}>
                    {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1" />}
                    Export Barcode
                  </Button>
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="Copied barcode data to clipboard." />
    </div>
  );
}
