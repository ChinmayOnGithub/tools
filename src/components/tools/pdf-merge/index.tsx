'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import t from './locales/en.json';
import { mergePdfBuffers } from './utils';
import { getPdfPageThumbnail } from '@/lib/pdf-core';
import { Button } from '@/components/ui/Button';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { PDFDocument } from 'pdf-lib';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import CopyShareToast from '@/components/shared/CopyShareToast';
import FileDropzone from '@/components/shared/FileDropzone';

interface MergeFileItem {
  file: File;
  thumbnail?: string;
  totalPages?: number;
}

export default function PdfMergeComponent() {
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<MergeFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('pdf-merge');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Process thumbnails for newly added files in the background
  useEffect(() => {
    let active = true;

    const loadThumbnails = async () => {
      const updatedFiles = [...files];
      let changed = false;

      for (let i = 0; i < updatedFiles.length; i++) {
        const item = updatedFiles[i];
        if (!item.thumbnail) {
          try {
            const buffer = new Uint8Array(await item.file.arrayBuffer());
            const thumb = await getPdfPageThumbnail(buffer, 1, 0.2);
            const doc = await PDFDocument.load(buffer, { updateMetadata: false });
            
            if (!active) return;
            
            updatedFiles[i] = {
              ...item,
              thumbnail: thumb,
              totalPages: doc.getPageCount(),
            };
            changed = true;
          } catch (err) {
            console.warn('Failed to render page preview for file:', item.file.name, err);
            // set a placeholder to avoid re-rendering loop
            updatedFiles[i] = {
              ...item,
              thumbnail: 'failed',
              totalPages: 0,
            };
            changed = true;
          }
        }
      }

      if (changed && active) {
        setFiles(updatedFiles);
      }
    };

    if (files.some(f => !f.thumbnail)) {
      loadThumbnails();
    }

    return () => {
      active = false;
    };
  }, [files]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError(null);
    setSuccess(false);

    const pdfFiles: MergeFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        pdfFiles.push({ file });
      }
    }

    if (pdfFiles.length === 0) {
      setError(t.invalidFileError);
      return;
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  };

  const clearList = () => {
    setFiles([]);
    setSuccess(false);
    setDownloadUrl(null);
    setError(null);
  };

  // Reorder list functions
  const moveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
    setSuccess(false);
  };

  const moveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
    setSuccess(false);
  };

  // Drag and drop sorting inside lists
  const onDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    
    setFiles((prev) => {
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

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Select at least 2 PDF files to merge.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const buffers = await Promise.all(
        files.map(async (item) => new Uint8Array(await item.file.arrayBuffer()))
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
      setShowToast(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : t.invalidFileError;
      setError(errMsg);
      trackValidationError('pdf-merge', 'merge_failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: Drag/Drop and File List */}
        <div className="space-y-6">
          <InputPanel title="PDF Documents">
            <div className="space-y-4">
              {/* Dropzone Area */}
              <FileDropzone
                accept=".pdf,application/pdf"
                multiple
                onFilesSelected={handleFiles}
                category="pdf"
                placeholderText={t.dragDropPlaceholder}
                dragActiveText={t.dragDropActive}
                descriptionText="Select multiple PDFs to merge locally"
              />

              {/* selected list */}
              {files.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t.selectedFiles} ({files.length})
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
                    {files.map((item, index) => (
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
                          
                          {/* Document Preview Thumbnail */}
                          <div className="h-10 w-8 border rounded-none bg-muted/20 shrink-0 overflow-hidden flex items-center justify-center">
                            {item.thumbnail && item.thumbnail !== 'failed' ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={item.thumbnail} 
                                alt={`Page 1 of ${item.file.name}`} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FileText className="h-4 w-4 text-red-500" />
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-foreground truncate max-w-[150px] md:max-w-[220px]">
                              {item.file.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground flex gap-2">
                              <span>{formatSize(item.file.size)}</span>
                              {item.totalPages !== undefined && (
                                <span className="text-primary font-semibold">({item.totalPages} pages)</span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => moveUp(index, e)}
                            disabled={index === 0}
                            className="p-1 border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none rounded-none"
                            type="button"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => moveDown(index, e)}
                            disabled={index === files.length - 1}
                            className="p-1 border border-border hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none rounded-none"
                            type="button"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => removeFile(index, e)}
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

        {/* Right Column: Execution & Download options */}
        <div className="space-y-6">
          <OutputPanel title="Merge Output">
            <div className="space-y-4">
              <div className="border border-border bg-card p-6 text-center">
                <FileText className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">Merge Documents</p>
                <p className="text-[10px] text-muted-foreground mt-1">Combine selected PDF files locally in your browser</p>
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
                      link.download = 'merged_document.pdf';
                      link.click();
                    }}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download PDF
                    </Button>
                  ) : (
                    <Button onClick={handleMerge} disabled={loading || files.length < 2}>
                      {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
                      Merge PDFs
                    </Button>
                  )}
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="PDF files successfully merged and exported." />
    </div>
  );
}
