'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import t from './locales/en.json';
import { imagesToPdfBuffer } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

interface ImageFile {
  file: File;
  previewUrl: string;
}

export default function ImagesToPdfComponent() {
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('images-to-pdf');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setError(null);
    setSuccess(false);

    const validImages: ImageFile[] = [];
    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];
      if (file.type.startsWith('image/')) {
        validImages.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
      } else {
        trackValidationError('images-to-pdf', 'invalid_file_type');
        setError(t.invalidFileError);
      }
    }

    if (validImages.length > 0) {
      setImages((prev) => [...prev, ...validImages]);
    }
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
    handleFiles(e.dataTransfer.files);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setImages(updated);
  };

  const removeItem = (index: number) => {
    const target = images[index];
    URL.revokeObjectURL(target.previewUrl);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
    setError(null);
  };

  const clearList = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
    setSuccess(false);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const onDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const updated = [...images];
    const draggedItem = updated[draggingIndex];
    updated.splice(draggingIndex, 1);
    updated.splice(index, 0, draggedItem);
    
    setDraggingIndex(index);
    setImages(updated);
  };

  const onDragEnd = () => {
    setDraggingIndex(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertFileToPdfImage = async (file: File): Promise<{ bytes: Uint8Array; isPng: boolean }> => {
    const type = file.type.toLowerCase();
    const isPng = type.includes('png');
    const isJpg = type.includes('jpeg') || type.includes('jpg');

    if (isPng || isJpg) {
      return {
        bytes: new Uint8Array(await file.arrayBuffer()),
        isPng,
      };
    }

    // Fallback: draw unsupported formats (like WebP or SVG) onto canvas to serialize as JPEGs
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas image conversion failed'));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              bytes: new Uint8Array(reader.result as ArrayBuffer),
              isPng: false,
            });
          };
          reader.readAsArrayBuffer(blob);
        }, 'image/jpeg', 0.95);
      };
      img.onerror = () => reject(new Error('Failed to load image file source'));
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError(t.noImagesSelected);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const processedImages = await Promise.all(
        images.map((img) => convertFileToPdfImage(img.file))
      );

      const pdfBytes = await imagesToPdfBuffer(processedImages);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setSuccess(true);
      trackToolCompletion('images-to-pdf');
      trackDownloadAction('images-to-pdf');

      const link = document.createElement('a');
      link.href = url;
      link.download = 'images_compiled.pdf';
      link.click();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : t.invalidFileError;
      setError(errMsg);
      trackValidationError('images-to-pdf', 'conversion_failed');
      logger.error('Failed to compile images to PDF:', err);
    } finally {
      setLoading(false);
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
              onChange={(e) => handleFiles(e.target.files)}
              accept="image/*"
              multiple
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {dragActive ? t.dragDropActive : t.dragDropPlaceholder}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP, SVG, GIF supported</p>
            </div>
          </div>

          {/* Error Message Card */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 flex gap-3 text-xs font-semibold leading-relaxed">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* List of images selected */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t.selectedImages} ({images.length})
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearList}
                  className="text-xs font-bold"
                >
                  {t.clearButton}
                </Button>
              </div>
              
              <p className="text-[10px] text-muted-foreground font-semibold">{t.reorderGuidance}</p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {images.map((item, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDragEnd={onDragEnd}
                    className={`flex items-center justify-between p-3 border-2 rounded-lg bg-card transition-all ${
                      draggingIndex === index 
                        ? 'border-primary bg-primary/5 opacity-50' 
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="cursor-grab text-muted-foreground hover:text-foreground p-1">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <div className="h-9 w-9 border rounded overflow-hidden shrink-0 bg-muted/20 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.previewUrl} 
                          alt="Thumbnail preview" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-foreground truncate max-w-[200px] md:max-w-[280px]">
                          {item.file.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatSize(item.file.size)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Reordering Controls */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="h-7 w-7"
                        aria-label="Move item up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === images.length - 1}
                        className="h-7 w-7"
                        aria-label="Move item down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      {/* Delete item */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Trigger Button */}
              <div className="pt-2">
                <Button
                  onClick={handleConvert}
                  disabled={loading || images.length === 0}
                  className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
                >
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {loading ? t.convertingStatus : t.convertButton}
                </Button>
              </div>
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
                download="images_compiled.pdf"
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
