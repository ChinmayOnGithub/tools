'use client';

import { useState, useRef } from 'react';
import { 
  FileText, 
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
import { mergePdfBuffers } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { useEffect } from 'react';

export default function PdfMergeComponent() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
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
      trackToolLaunch('pdf-merge');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setError(null);
    setSuccess(false);

    const validPdfs: File[] = [];
    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        validPdfs.push(file);
      } else {
        trackValidationError('pdf-merge', 'invalid_file_type');
        setError(t.invalidFileError);
      }
    }

    if (validPdfs.length > 0) {
      setFiles((prev) => [...prev, ...validPdfs]);
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

  // Reordering functions
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= files.length) return;

    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setFiles(updated);
  };

  const removeItem = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
    setError(null);
  };

  const clearList = () => {
    setFiles([]);
    setError(null);
    setSuccess(false);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  // HTML5 Drag-and-Drop List item handlers
  const onDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const updated = [...files];
    const draggedItem = updated[draggingIndex];
    updated.splice(draggingIndex, 1);
    updated.splice(index, 0, draggedItem);
    
    setDraggingIndex(index);
    setFiles(updated);
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

  const handleMerge = async () => {
    if (files.length < 2) {
      setError(t.noFilesSelected);
      trackValidationError('pdf-merge', 'insufficient_files');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const buffers = await Promise.all(
        files.map(async (file) => new Uint8Array(await file.arrayBuffer()))
      );
      
      const mergedBytes = await mergePdfBuffers(buffers);
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setSuccess(true);
      trackToolCompletion('pdf-merge');
      trackDownloadAction('pdf-merge');

      // Auto-trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_document.pdf';
      link.click();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : t.invalidFileError;
      setError(errMsg);
      trackValidationError('pdf-merge', 'merge_failed');
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
          {/* File Selection Dropzone */}
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
              accept=".pdf,application/pdf"
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
              <p className="text-xs text-muted-foreground">PDF files only (under 20MB recommended)</p>
            </div>
          </div>

          {/* Error Message Card */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 flex gap-3 text-xs font-semibold leading-relaxed">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* List of files selected */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t.selectedFiles} ({files.length})
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
                {files.map((file, index) => (
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
                      <FileText className="h-4 w-4 text-red-500 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-foreground truncate max-w-[240px] md:max-w-[320px]">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatSize(file.size)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Reordering Controls (Keyboard Friendly) */}
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
                        disabled={index === files.length - 1}
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

              {/* Action Merging Button */}
              <div className="pt-2">
                <Button
                  onClick={handleMerge}
                  disabled={loading || files.length < 2}
                  className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
                >
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {loading ? t.mergingStatus : t.mergeButton}
                </Button>
              </div>
            </div>
          )}

          {/* Success / Download block */}
          {success && downloadUrl && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-xs font-semibold leading-relaxed">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>{t.successMessage}</span>
              </div>
              <a
                href={downloadUrl}
                download="merged_document.pdf"
                className="text-primary underline font-bold pl-7"
              >
                {t.downloadPrompt}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accordion FAQ Area */}
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
