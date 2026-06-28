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
import { scaleCropCoordinates } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

export default function ImageCropperComponent() {
  const [mounted, setMounted] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

  // CSS Display dimensions
  const [displayWidth, setDisplayWidth] = useState(300);
  const [displayHeight, setDisplayHeight] = useState(300);

  // Crop Box offsets (in display coordinates)
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(50);
  const [cropW, setCropW] = useState(200);
  const [cropH, setCropH] = useState(200);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('image-cropper');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);

    if (!file.type.startsWith('image/')) {
      setError(t.invalidFileError);
      trackValidationError('image-cropper', 'invalid_file_type');
      return;
    }

    setSourceFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);

      // Fit preview into standard bounds
      const maxDim = 320;
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((maxDim / w) * h);
          w = maxDim;
        } else {
          w = Math.round((maxDim / h) * w);
          h = maxDim;
        }
      }

      setDisplayWidth(w);
      setDisplayHeight(h);

      // Centered 70% crop box default
      const defaultW = Math.round(w * 0.7);
      const defaultH = Math.round(h * 0.7);
      setCropW(defaultW);
      setCropH(defaultH);
      setCropX(Math.round((w - defaultW) / 2));
      setCropY(Math.round((h - defaultH) / 2));
    };
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

  const handleCrop = () => {
    if (!sourceFile) {
      setError(t.emptyFileError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const scaled = scaleCropCoordinates(
      displayWidth,
      displayHeight,
      naturalWidth,
      naturalHeight,
      cropX,
      cropY,
      cropW,
      cropH
    );

    const img = new Image();
    img.src = URL.createObjectURL(sourceFile);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = scaled.width;
        canvas.height = scaled.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Crop drawn using coordinates mapping
        ctx.drawImage(
          img,
          scaled.x,
          scaled.y,
          scaled.width,
          scaled.height,
          0,
          0,
          scaled.width,
          scaled.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Image cropping failed');
          }

          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setSuccess(true);
          trackToolCompletion('image-cropper');
          trackDownloadAction('image-cropper');

          const link = document.createElement('a');
          link.href = url;
          link.download = `${sourceFile.name.replace(/\.[^/.]+$/, '')}_cropped.${sourceFile.type.split('/')[1] || 'png'}`;
          link.click();
        }, sourceFile.type);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : t.invalidFileError;
        setError(errMsg);
        trackValidationError('image-cropper', 'crop_failed');
        logger.error('Failed to crop image:', err);
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
    setNaturalWidth(0);
    setNaturalHeight(0);
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
            /* Crop workspace */
            <div className="flex flex-col md:flex-row gap-6">
              {/* Visual preview box */}
              <div className="flex flex-col items-center justify-center border-2 border-border p-4 rounded-lg bg-muted/5 shrink-0">
                <div
                  ref={containerRef}
                  style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
                  className="relative overflow-hidden border border-muted-foreground/30 select-none bg-checkered"
                >
                  {previewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Crop target"
                      style={{ width: '100%', height: '100%' }}
                      className="pointer-events-none"
                    />
                  )}
                  {/* Cropping box overlay */}
                  <div
                    style={{
                      left: `${cropX}px`,
                      top: `${cropY}px`,
                      width: `${cropW}px`,
                      height: `${cropH}px`,
                    }}
                    className="absolute border-2 border-primary bg-primary/10 shadow-overlay"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border border-white/50 border-dashed w-full h-1/3 absolute top-1/3 pointer-events-none" />
                      <div className="border border-white/50 border-dashed h-full w-1/3 absolute left-1/3 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground mt-2 font-semibold">
                  Source: {naturalWidth}x{naturalHeight}px
                </span>
              </div>

              {/* Adjust parameters block */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sliders className="h-4 w-4" /> Parameters
                  </span>
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

                {/* X Position slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <label htmlFor="crop-x-slider">Crop X Offset</label>
                    <span>{cropX}px</span>
                  </div>
                  <input
                    id="crop-x-slider"
                    type="range"
                    min="0"
                    max={String(displayWidth - cropW)}
                    value={cropX}
                    onChange={(e) => setCropX(Math.min(parseInt(e.target.value, 10), displayWidth - cropW))}
                    className="w-full h-1.5 bg-border rounded cursor-pointer accent-primary"
                    aria-label="Crop X position offset slider"
                  />
                </div>

                {/* Y Position slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <label htmlFor="crop-y-slider">Crop Y Offset</label>
                    <span>{cropY}px</span>
                  </div>
                  <input
                    id="crop-y-slider"
                    type="range"
                    min="0"
                    max={String(displayHeight - cropH)}
                    value={cropY}
                    onChange={(e) => setCropY(Math.min(parseInt(e.target.value, 10), displayHeight - cropH))}
                    className="w-full h-1.5 bg-border rounded cursor-pointer accent-primary"
                    aria-label="Crop Y position offset slider"
                  />
                </div>

                {/* Width slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <label htmlFor="crop-width-slider">Crop Width</label>
                    <span>{cropW}px</span>
                  </div>
                  <input
                    id="crop-width-slider"
                    type="range"
                    min="20"
                    max={String(displayWidth - cropX)}
                    value={cropW}
                    onChange={(e) => setCropW(Math.min(parseInt(e.target.value, 10), displayWidth - cropX))}
                    className="w-full h-1.5 bg-border rounded cursor-pointer accent-primary"
                    aria-label="Crop width dimension slider"
                  />
                </div>

                {/* Height slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <label htmlFor="crop-height-slider">Crop Height</label>
                    <span>{cropH}px</span>
                  </div>
                  <input
                    id="crop-height-slider"
                    type="range"
                    min="20"
                    max={String(displayHeight - cropY)}
                    value={cropH}
                    onChange={(e) => setCropH(Math.min(parseInt(e.target.value, 10), displayHeight - cropY))}
                    className="w-full h-1.5 bg-border rounded cursor-pointer accent-primary"
                    aria-label="Crop height dimension slider"
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
                onClick={handleCrop}
                disabled={loading}
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {loading ? t.croppingStatus : t.cropButton}
              </Button>
            </div>
          )}

          {/* Success / Result details */}
          {success && downloadUrl && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-xs font-semibold leading-relaxed">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>{t.successMessage}</span>
              </div>
              <a
                href={downloadUrl}
                download={`${sourceFile?.name.replace(/\.[^/.]+$/, '')}_cropped.${sourceFile?.type.split('/')[1] || 'png'}`}
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
