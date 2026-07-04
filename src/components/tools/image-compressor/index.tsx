'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sliders
} from 'lucide-react';
import t from './locales/en.json';
import { calculateAspectRatioDimensions, formatByteSize } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { addHistoryEntry } from '@/lib/history';
import FaqSection from '@/components/shared/FaqSection';

export default function ImageCompressorComponent() {
  const [mounted, setMounted] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [maxDimension, setMaxDimension] = useState(1920);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('image-compressor');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);
    setCompressedSize(null);

    if (!file.type.startsWith('image/')) {
      setError(t.invalidFileError);
      trackValidationError('image-compressor', 'invalid_file_type');
      return;
    }

    setSourceFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCompress = () => {
    if (!sourceFile) {
      setError(t.emptyFileError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const img = new Image();
    img.src = URL.createObjectURL(sourceFile);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      try {
        const canvas = document.createElement('canvas');
        const { width, height } = calculateAspectRatioDimensions(
          img.naturalWidth,
          img.naturalHeight,
          maxDimension
        );

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw image onto canvas boundary
        ctx.drawImage(img, 0, 0, width, height);

        // Serialize blob
        const outputType = sourceFile.type === 'image/png' ? 'image/jpeg' : sourceFile.type;

        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Image compression serialization failed');
          }

          const url = URL.createObjectURL(blob);
          setCompressedSize(blob.size);
          setDownloadUrl(url);
          setSuccess(true);
          trackToolCompletion('image-compressor');
          trackDownloadAction('image-compressor');

          const diff = sourceFile.size - blob.size;
          const pct = diff > 0 ? ((diff / sourceFile.size) * 100).toFixed(1) : '0';
          const savedStr = diff > 0 ? `(Saved ${pct}%)` : '';
          addHistoryEntry('image-compressor', 'Image Compressor', `Compressed ${sourceFile.name} ${savedStr}`);

          const link = document.createElement('a');
          link.href = url;
          const ext = outputType.split('/')[1] || 'jpg';
          link.download = `${sourceFile.name.replace(/\.[^/.]+$/, '')}_compressed.${ext}`;
          link.click();
        }, outputType, quality);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : t.invalidFileError;
        setError(errMsg);
        trackValidationError('image-compressor', 'compression_failed');
        logger.error('Failed to compress image:', err);
      } finally {
        setLoading(false);
      }
    };

    img.onerror = () => {
      setError(t.invalidFileError);
      setLoading(false);
    };
  };

  const clearSelection = () => {
    setSourceFile(null);
    setCompressedSize(null);
    setError(null);
    setSuccess(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const getReductionRatio = () => {
    if (!sourceFile || !compressedSize) return '0%';
    const diff = sourceFile.size - compressedSize;
    if (diff <= 0) return '0%';
    const pct = ((diff / sourceFile.size) * 100).toFixed(1);
    return `${pct}%`;
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />;
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
          {/* File Selector Dropzone */}
          {!sourceFile ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-muted/10 hover:bg-muted/20 hover:border-primary/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {dragActive ? t.dragDropActive : t.dragDropPlaceholder}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP supported</p>
              </div>
            </div>
          ) : (
            /* Selected File details */
            <div className="space-y-4">
              <div className="border-2 border-border p-4 rounded-lg flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 border rounded overflow-hidden shrink-0 bg-muted/20 flex items-center justify-center">
                    {previewUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={previewUrl} 
                        alt="Preview thumbnail" 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-foreground truncate max-w-[240px] md:max-w-[360px]">
                      {sourceFile.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {t.originalSize}: {formatByteSize(sourceFile.size)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearSelection}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Compression Configuration parameters */}
              <div className="space-y-4 border-t pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sliders className="h-4 w-4" /> {t.compressionSettings}
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <label htmlFor="quality-slider">{t.qualityLabel}</label>
                    <span>{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    id="quality-slider"
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Slider for compression quality"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <label htmlFor="dimension-slider">Max Image Dimension</label>
                    <span>{maxDimension}px</span>
                  </div>
                  <input
                    id="dimension-slider"
                    type="range"
                    min="500"
                    max="3840"
                    step="100"
                    value={maxDimension}
                    onChange={(e) => setMaxDimension(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Slider for maximum image dimension size"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message Card */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 flex gap-3 text-xs font-semibold leading-relaxed">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          {sourceFile && !success && (
            <div className="pt-2">
              <Button
                onClick={handleCompress}
                disabled={loading}
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {loading ? t.compressingStatus : t.compressButton}
              </Button>
            </div>
          )}

          {/* Success / Result details */}
          {success && downloadUrl && (
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-emerald-500/5 border-2 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 p-4 rounded-none flex flex-col gap-2 text-xs font-bold leading-relaxed">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.successMessage}</span>
                </div>
                <a
                  href={downloadUrl}
                  download={`${sourceFile?.name.replace(/\.[^/.]+$/, '')}_compressed.jpg`}
                  className="text-primary underline font-bold pl-7"
                >
                  {t.downloadPrompt}
                </a>
              </div>

              {/* Statistics grid */}
              {compressedSize && sourceFile && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border-2 border-border p-3 bg-muted/10 rounded-none">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase">{t.originalSize}</span>
                    <span className="text-xs font-bold text-foreground mt-1 block">{formatByteSize(sourceFile.size)}</span>
                  </div>
                  <div className="border-2 border-border p-3 bg-muted/10 rounded-none">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase">{t.compressedSize}</span>
                    <span className="text-xs font-bold text-foreground mt-1 block">{formatByteSize(compressedSize)}</span>
                  </div>
                  <div className="border-2 border-border p-3 bg-muted/10 rounded-none">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase">{t.reduction}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{getReductionRatio()}</span>
                  </div>
                </div>
              )}
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
