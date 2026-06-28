'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sliders,
  Lock,
  Unlock
} from 'lucide-react';
import t from './locales/en.json';
import { getProportionalHeight, getProportionalWidth } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

export default function ImageResizerComponent() {
  const [mounted, setMounted] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [lockAspect, setLockAspect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('image-resizer');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);

    if (!file.type.startsWith('image/')) {
      setError(t.invalidFileError);
      trackValidationError('image-resizer', 'invalid_file_type');
      return;
    }

    setSourceFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
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

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const parsedWidth = parseInt(val, 10);
    if (lockAspect && !isNaN(parsedWidth) && originalWidth > 0) {
      setHeight(String(getProportionalHeight(originalWidth, originalHeight, parsedWidth)));
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const parsedHeight = parseInt(val, 10);
    if (lockAspect && !isNaN(parsedHeight) && originalHeight > 0) {
      setWidth(String(getProportionalWidth(originalWidth, originalHeight, parsedHeight)));
    }
  };

  const handleResize = () => {
    if (!sourceFile) {
      setError(t.emptyFileError);
      return;
    }

    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);

    if (isNaN(parsedWidth) || parsedWidth <= 0 || isNaN(parsedHeight) || parsedHeight <= 0) {
      setError('Please enter valid width and height values.');
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
        canvas.width = parsedWidth;
        canvas.height = parsedHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        ctx.drawImage(img, 0, 0, parsedWidth, parsedHeight);

        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Image resizing failed');
          }

          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setSuccess(true);
          trackToolCompletion('image-resizer');
          trackDownloadAction('image-resizer');

          const link = document.createElement('a');
          link.href = url;
          link.download = `${sourceFile.name.replace(/\.[^/.]+$/, '')}_resized.${sourceFile.type.split('/')[1] || 'png'}`;
          link.click();
        }, sourceFile.type);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : t.invalidFileError;
        setError(errMsg);
        trackValidationError('image-resizer', 'resize_failed');
        logger.error('Failed to resize image:', err);
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
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth('');
    setHeight('');
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
                      Original Dimensions: {originalWidth}x{originalHeight}px
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

              {/* Resizing Configuration parameters */}
              <div className="space-y-4 border-t pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sliders className="h-4 w-4" /> {t.resizingSettings}
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="width-input" className="text-xs font-bold text-muted-foreground">
                      {t.widthLabel}
                    </label>
                    <Input
                      id="width-input"
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="h-10 text-xs"
                      aria-label="Width input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="height-input" className="text-xs font-bold text-muted-foreground">
                      {t.heightLabel}
                    </label>
                    <Input
                      id="height-input"
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="h-10 text-xs"
                      aria-label="Height input"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <button
                    onClick={() => setLockAspect(!lockAspect)}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer text-muted-foreground text-[11px]"
                  >
                    {lockAspect ? (
                      <Lock className="h-4.5 w-4.5 text-primary" />
                    ) : (
                      <Unlock className="h-4.5 w-4.5" />
                    )}
                    <span>{t.lockAspectLabel}</span>
                  </button>
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
                onClick={handleResize}
                disabled={loading}
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {loading ? t.resizingStatus : t.resizeButton}
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
                download={`${sourceFile?.name.replace(/\.[^/.]+$/, '')}_resized.${sourceFile?.type.split('/')[1] || 'png'}`}
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
