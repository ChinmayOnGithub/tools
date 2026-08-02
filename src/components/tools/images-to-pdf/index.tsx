'use client';

import { useState, useEffect } from 'react';
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  AlertTriangle,
  RefreshCw,
  FileImage,
  Download
} from 'lucide-react';
import t from './locales/en.json';
import { imagesToPdfBuffer } from './utils';
import { Button } from '@/components/ui/Button';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import CopyShareToast from '@/components/shared/CopyShareToast';
import FileDropzone from '@/components/shared/FileDropzone';

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
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

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



  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setImages(updated);
    setSuccess(false);
  };

  const removeItem = (index: number) => {
    const target = images[index];
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  };

  const clearList = () => {
    images.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setImages([]);
    setSuccess(false);
    setDownloadUrl(null);
    setError(null);
  };

  // Drag and drop list sorting
  const onDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    
    setImages((prev) => {
      const list = [...prev];
      const draggedItem = list[draggingIndex];
      list.splice(draggingIndex, 1);
      list.splice(index, 0, draggedItem);
      return list;
    });
    setDraggingIndex(index);
  };

  const onDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError('Please select at least one image to compile.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const imageBuffers = await Promise.all(
        images.map(async (item) => ({
          bytes: new Uint8Array(await item.file.arrayBuffer()),
          isPng: item.file.type === 'image/png' || item.file.name.endsWith('.png')
        }))
      );

      const pdfBytes = await imagesToPdfBuffer(imageBuffers);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setSuccess(true);
      trackToolCompletion('images-to-pdf');
      trackDownloadAction('images-to-pdf');

      // Auto-trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'images_compiled.pdf';
      link.click();
      setShowToast(true);
    } catch (err: unknown) {
      logger.error('Failed compiling images to PDF:', err);
      const msg = err instanceof Error ? err.message : 'PDF compilation failed.';
      setError(msg);
      trackValidationError('images-to-pdf', 'compile_failed');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: Input Selection */}
        <div className="space-y-6">
          <InputPanel title="Selected Images">
            <div className="space-y-4">
              {/* Dropzone */}
              <FileDropzone
                accept="image/png, image/jpeg, image/webp"
                multiple
                onFilesSelected={handleFiles}
                category="image"
                placeholderText={t.dragDropPlaceholder}
                dragActiveText={t.dragDropActive}
                descriptionText="Select multiple images (PNG, JPG, WebP) to compile"
              />

              {/* selected list */}
              {images.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t.selectedImages} ({images.length})
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearList}
                      className="text-[10px] font-extrabold uppercase tracking-wider text-destructive border-border hover:bg-destructive/5 rounded-none"
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <p className="text-[9px] text-muted-foreground font-semibold">{t.reorderGuidance}</p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 divide-y divide-border/40">
                    {images.map((item, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragEnd={onDragEnd}
                        className={`flex items-center justify-between py-2.5 px-2 bg-card border border-transparent transition-all ${
                          draggingIndex === index 
                            ? 'border-primary bg-primary/5 opacity-50' 
                            : 'hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="cursor-grab text-muted-foreground hover:text-foreground p-1">
                            <GripVertical className="h-3.5 w-3.5" />
                          </div>
                          
                          {/* Image preview Thumbnail */}
                          <div className="h-10 w-10 border rounded-none bg-muted/20 shrink-0 overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={item.previewUrl} 
                              alt={`Preview of ${item.file.name}`} 
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-foreground truncate max-w-[150px] md:max-w-[220px]">
                              {item.file.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              {formatSize(item.file.size)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => moveItem(index, 'up')}
                            disabled={index === 0}
                            className="p-1 border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none rounded-none"
                            type="button"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => moveItem(index, 'down')}
                            disabled={index === images.length - 1}
                            className="p-1 border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none rounded-none"
                            type="button"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1 border border-border hover:border-destructive hover:text-destructive transition-colors rounded-none"
                            type="button"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InputPanel>
        </div>

        {/* Right Column: Converter actions */}
        <div className="space-y-6">
          <OutputPanel title="Conversion Output">
            <div className="space-y-4">
              <div className="border border-border bg-card p-6 text-center">
                <FileImage className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">Convert to PDF</p>
                <p className="text-[10px] text-muted-foreground mt-1">Compile select image files locally into a single document</p>
              </div>

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
                      link.download = 'images_compiled.pdf';
                      link.click();
                    }}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download PDF
                    </Button>
                  ) : (
                    <Button onClick={handleConvert} disabled={loading || images.length === 0}>
                      {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
                      Compile to PDF
                    </Button>
                  )}
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="PDF document successfully compiled from images." />
    </div>
  );
}
