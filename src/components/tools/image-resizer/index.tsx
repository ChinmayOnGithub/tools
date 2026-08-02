'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  RefreshCw,
  Sliders,
  Lock,
  Unlock,
  Download,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import t from './locales/en.json';
import { getProportionalHeight, getProportionalWidth } from './utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import CopyShareToast from '@/components/shared/CopyShareToast';
import FileDropzone from '@/components/shared/FileDropzone';
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
  const [showToast, setShowToast] = useState(false);

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
      setError('Please enter valid width and height dimensions.');
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
          throw new Error('Canvas 2D context not available');
        }

        ctx.drawImage(img, 0, 0, parsedWidth, parsedHeight);

        // Convert canvas contents to resized image blob
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Canvas blob compilation failed');
          }

          if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
          }

          const resizedUrl = URL.createObjectURL(blob);
          setDownloadUrl(resizedUrl);
          setSuccess(true);
          trackToolCompletion('image-resizer');
          trackDownloadAction('image-resizer');
          setShowToast(true);

          // Auto-download
          const link = document.createElement('a');
          link.href = resizedUrl;
          link.download = `resized_${sourceFile.name}`;
          link.click();
        }, sourceFile.type);
      } catch (err: unknown) {
        logger.error('Failed to resize image:', err);
        setError('Image resize failed.');
        trackValidationError('image-resizer', 'resize_failed');
      } finally {
        setLoading(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      setError('Failed to load image source.');
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
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth('');
    setHeight('');
    setError(null);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: Image Dropzone and dimensions settings */}
        <div className="space-y-6">
          <InputPanel title="Resizing Options">
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
                          Original: {originalWidth}×{originalHeight} px
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearSelection} className="text-destructive hover:bg-destructive/5 rounded-none h-8 text-[10px] font-bold uppercase tracking-wider">
                      Remove
                    </Button>
                  </div>

                  {/* Dimension parameters */}
                  <div className="space-y-4 pt-4 border-t border-border/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5" />
                      Resize Settings
                    </span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="width-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {t.widthLabel}
                        </label>
                        <Input
                          id="width-input"
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          className="h-9 text-xs rounded-none border border-border bg-card"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="height-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {t.heightLabel}
                        </label>
                        <Input
                          id="height-input"
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          className="h-9 text-xs rounded-none border border-border bg-card"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <button
                        onClick={() => setLockAspect(!lockAspect)}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer text-muted-foreground text-[10px] font-bold uppercase tracking-wider"
                        type="button"
                      >
                        {lockAspect ? (
                          <Lock className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Unlock className="h-3.5 w-3.5" />
                        )}
                        <span>{t.lockAspectLabel}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </InputPanel>
        </div>

        {/* Right Column: Execution previews, dimensions comparison, and downloads */}
        <div className="space-y-6">
          <OutputPanel title="Resized Output">
            <div className="space-y-4">
              {/* Loader */}
              {loading && (
                <div className="bg-muted/30 border border-border p-5 text-center space-y-3 rounded-none">
                  <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto" />
                  <p className="text-xs font-bold text-foreground">Resizing image...</p>
                </div>
              )}

              {/* Success metrics */}
              {success && sourceFile && downloadUrl && (
                <div className="space-y-4">
                  <div className="border border-border p-4 bg-muted/5 space-y-3 rounded-none">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-bold">Image resized successfully!</span>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-3.5 grid grid-cols-2 gap-2 text-center select-none rounded-none font-mono">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Before</span>
                        <span className="text-xs font-extrabold text-foreground mt-0.5 block">{originalWidth}×{originalHeight} px</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">After</span>
                        <span className="text-xs font-extrabold text-primary mt-0.5 block">{width}×{height} px</span>
                      </div>
                    </div>
                  </div>

                  {/* Resized output preview */}
                  <div className="flex flex-col items-center justify-center p-4 border border-border bg-white min-h-[180px] rounded-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={downloadUrl} 
                      alt="Resized output view" 
                      className="max-w-full max-h-[200px] object-contain shadow-sm"
                    />
                  </div>
                </div>
              )}

              {!success && !loading && (
                <div className="border border-border bg-card p-6 text-center">
                  <ImageIcon className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-foreground">Resized Output Preview</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Configure dimensions on the left to resize images locally</p>
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
                      link.download = `resized_${sourceFile?.name || 'image.png'}`;
                      link.click();
                    }}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download Image
                    </Button>
                  ) : (
                    <Button onClick={handleResize} disabled={loading || !sourceFile}>
                      {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
                      Resize Image
                    </Button>
                  )}
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="Image successfully resized." />
    </div>
  );
}
