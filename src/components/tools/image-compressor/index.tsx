'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  RefreshCw,
  Sliders,
  Download,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import t from './locales/en.json';
import { calculateAspectRatioDimensions, formatByteSize } from './utils';
import { Button } from '@/components/ui/Button';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import CopyShareToast from '@/components/shared/CopyShareToast';
import FileDropzone from '@/components/shared/FileDropzone';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import { SliderInput } from '@/components/ui/SliderInput';

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
  const [showToast, setShowToast] = useState(false);

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
          throw new Error('Canvas 2D context not available');
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas contents to compressed image blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error('Canvas blob compilation failed');
            }

            if (downloadUrl) {
              URL.revokeObjectURL(downloadUrl);
            }

            setDownloadUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
            setSuccess(true);
            trackToolCompletion('image-compressor');
            trackDownloadAction('image-compressor');
            setShowToast(true);

            // Auto-download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `compressed_${sourceFile.name}`;
            link.click();
          },
          sourceFile.type,
          quality
        );
      } catch (err: unknown) {
        logger.error('Failed to compress image:', err);
        setError('Image compression failed.');
        trackValidationError('image-compressor', 'compression_failed');
      } finally {
        setLoading(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      setError('Image compression failed.');
      setLoading(false);
    };
  };

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setSourceFile(null);
    setPreviewUrl(null);
    setSuccess(false);
    setDownloadUrl(null);
    setCompressedSize(null);
    setError(null);
  };

  const calculateSavings = () => {
    if (!sourceFile || !compressedSize) return 0;
    const diff = sourceFile.size - compressedSize;
    if (diff <= 0) return 0;
    return Math.round((diff / sourceFile.size) * 100);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: Image dropzone and configurations */}
        <div className="space-y-6">
          <InputPanel title="Compress Options">
            <div className="space-y-4">
              {!sourceFile ? (
                <FileDropzone
                  accept="image/*"
                  onFilesSelected={(files) => {
                    if (files && files[0]) handleFile(files[0]);
                  }}
                  category="image"
                  placeholderText={t.dragDropPlaceholder}
                  dragActiveText={t.dragDropActive}
                  descriptionText="PNG, JPG, WebP supported"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border bg-card">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 border rounded-none overflow-hidden shrink-0 bg-muted/20 flex items-center justify-center">
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
                        <span className="text-xs font-bold text-foreground truncate max-w-[150px] md:max-w-[200px]">
                          {sourceFile.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {t.originalSize}: {formatByteSize(sourceFile.size)}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearSelection} className="text-destructive hover:bg-destructive/5 rounded-none h-8 text-[10px] font-bold uppercase tracking-wider">
                      Remove
                    </Button>
                  </div>

                  {/* Sliders Configuration */}
                  <div className="space-y-4 pt-4 border-t border-border/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5" />
                      Compression Options
                    </span>

                    <SliderInput
                      id="quality-slider"
                      label={t.qualityLabel}
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={quality}
                      onChange={setQuality}
                      formatValue={(v) => `${Math.round(v * 100)}%`}
                    />

                    <SliderInput
                      id="dimension-slider"
                      label="Max Dimension Size"
                      min={500}
                      max={3840}
                      step={100}
                      value={maxDimension}
                      onChange={setMaxDimension}
                      formatValue={(v) => `${v} px`}
                    />
                  </div>
                </div>
              )}
            </div>
          </InputPanel>
        </div>

        {/* Right Column: Execution Comparisons, image preview and action triggers */}
        <div className="space-y-6">
          <OutputPanel title="Compress Output">
            <div className="space-y-4">
              {/* Loader */}
              {loading && (
                <div className="bg-muted/30 border border-border p-5 text-center space-y-3 rounded-none">
                  <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto" />
                  <p className="text-xs font-bold text-foreground">{t.compressingStatus}</p>
                </div>
              )}

              {/* Result Metrics */}
              {success && sourceFile && compressedSize && downloadUrl && (
                <div className="space-y-4">
                  <div className="border border-border p-4 bg-muted/5 space-y-3 rounded-none">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-bold">Image compressed successfully!</span>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-3.5 grid grid-cols-3 gap-2 text-center select-none rounded-none font-mono">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Original</span>
                        <span className="text-xs font-extrabold text-foreground mt-0.5 block">{formatByteSize(sourceFile.size)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Compressed</span>
                        <span className="text-xs font-extrabold text-primary mt-0.5 block">{formatByteSize(compressedSize)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Savings</span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                          -{calculateSavings()}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compressed preview */}
                  <div className="flex flex-col items-center justify-center p-4 border border-border bg-white min-h-[180px] rounded-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={downloadUrl} 
                      alt="Compressed output view" 
                      className="max-w-full max-h-[200px] object-contain shadow-sm"
                    />
                  </div>
                </div>
              )}

              {!success && !loading && (
                <div className="border border-border bg-card p-6 text-center">
                  <ImageIcon className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-foreground">Compressed Output Preview</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Configure options on the left to compress images locally</p>
                </div>
              )}

              {error && (
                <div className="bg-destructive/5 border border-destructive/20 text-destructive p-3 flex gap-2 text-xs font-semibold rounded-none">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <ActionBar>
                <div className="flex gap-2" />
                <div className="flex gap-2">
                  {success && downloadUrl ? (
                    <Button onClick={() => {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `compressed_${sourceFile?.name || 'image.png'}`;
                      link.click();
                    }}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download Image
                    </Button>
                  ) : (
                    <Button onClick={handleCompress} disabled={loading || !sourceFile}>
                      {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
                      Compress Image
                    </Button>
                  )}
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="Image successfully compressed." />
    </div>
  );
}
