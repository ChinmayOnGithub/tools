'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sliders,
  Sparkles
} from 'lucide-react';
import t from './locales/en.json';
import { parsePageRanges, splitPdfBuffer } from './utils';
import { getPdfPageThumbnail } from '@/lib/pdf-core';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PDFDocument } from 'pdf-lib';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

// Helper to convert array of 1-indexed numbers to range string
function indicesToRangeString(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      if (start === end) {
        ranges.push(`${start}`);
      } else {
        ranges.push(`${start}-${end}`);
      }
      start = sorted[i];
      end = sorted[i];
    }
  }
  if (start === end) {
    ranges.push(`${start}`);
  } else {
    ranges.push(`${start}-${end}`);
  }
  return ranges.join(', ');
}

export default function PdfSplitComponent() {
  const [mounted, setMounted] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loadingPageCount, setLoadingPageCount] = useState(false);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('range');
  const [rangeInput, setRangeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [filesList, setFilesList] = useState<{ name: string; url: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Visual selection state
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pagesThumbnails, setPagesThumbnails] = useState<Record<number, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('pdf-split');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // progressive background rendering of page previews
  useEffect(() => {
    if (!sourceFile || !totalPages) return;
    let active = true;

    const loadPagePreviews = async () => {
      const buffer = new Uint8Array(await sourceFile.arrayBuffer());
      for (let i = 1; i <= totalPages; i++) {
        if (!active) return;
        try {
          const thumb = await getPdfPageThumbnail(buffer, i, 0.22);
          if (!active) return;
          setPagesThumbnails(prev => ({ ...prev, [i]: thumb }));
        } catch (err) {
          console.warn(`Failed to render thumbnail for page ${i}:`, err);
        }
      }
    };

    loadPagePreviews();

    return () => {
      active = false;
      setPagesThumbnails({});
    };
  }, [sourceFile, totalPages]);

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setFilesList([]);
    setTotalPages(null);
    setSelectedPages(new Set());
    setRangeInput('');

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError(t.invalidFileError);
      trackValidationError('pdf-split', 'invalid_file_type');
      return;
    }

    setSourceFile(file);
    setLoadingPageCount(true);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { updateMetadata: false });
      const pagesCount = doc.getPageCount();
      setTotalPages(pagesCount);
      
      // Select page 1 by default
      setSelectedPages(new Set([1]));
      setRangeInput('1');
    } catch (err) {
      setError(t.invalidFileError);
      trackValidationError('pdf-split', 'parse_failed');
      logger.error('Failed to parse PDF document page size:', err);
    } finally {
      setLoadingPageCount(false);
    }
  };

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    handleFile(incomingFiles[0]);
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

  // Sync textbox change back to visual grid selection
  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    if (!totalPages) return;
    
    try {
      const sortedIndices = parsePageRanges(val, totalPages);
      const parsedSet = new Set(sortedIndices.map(idx => idx + 1));
      setSelectedPages(parsedSet);
      setError(null);
    } catch {
      // Allow invalid typing buffer in textbox without immediately throwing error
    }
  };

  // Sync visual click back to textbox range string
  const handlePageClick = (pageNum: number) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(pageNum)) {
      newSet.delete(pageNum);
    } else {
      newSet.add(pageNum);
    }
    setSelectedPages(newSet);
    
    const rangeStr = indicesToRangeString(Array.from(newSet));
    setRangeInput(rangeStr);
  };

  const handleSplit = async () => {
    if (!sourceFile || totalPages === null) {
      setError(t.emptyFileError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setFilesList([]);

    try {
      const buffer = new Uint8Array(await sourceFile.arrayBuffer());

      if (splitMode === 'range') {
        const pageIndices = parsePageRanges(rangeInput, totalPages);
        const splitBytes = await splitPdfBuffer(buffer, pageIndices);
        const blob = new Blob([splitBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const newFileName = `${sourceFile.name.replace(/\.pdf$/i, '')}_extracted.pdf`;
        setFilesList([{ name: newFileName, url: url }]);
        setSuccess(true);
        trackToolCompletion('pdf-split');
        trackDownloadAction('pdf-split');

        // Auto trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = newFileName;
        link.click();
      } else {
        // Split every page
        const sourceDoc = await PDFDocument.load(buffer);
        const generated: { name: string; url: string }[] = [];

        for (let i = 0; i < totalPages; i++) {
          const splitDoc = await PDFDocument.create();
          const [copiedPage] = await splitDoc.copyPages(sourceDoc, [i]);
          splitDoc.addPage(copiedPage);
          const bytes = await splitDoc.save();

          const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          generated.push({
            name: `${sourceFile.name.replace(/\.pdf$/i, '')}_page_${i + 1}.pdf`,
            url: url,
          });
        }

        setFilesList(generated);
        setSuccess(true);
        trackToolCompletion('pdf-split');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : t.invalidRangeError;
      setError(errMsg);
      trackValidationError('pdf-split', 'split_failed');
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSourceFile(null);
    setTotalPages(null);
    setFilesList([]);
    setError(null);
    setSuccess(false);
    setRangeInput('');
    setSelectedPages(new Set());
    setPagesThumbnails({});
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                onChange={(e) => handleFiles(e.target.files)}
                accept=".pdf,application/pdf"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {dragActive ? t.dragDropActive : t.dragDropPlaceholder}
                </p>
                <p className="text-xs text-muted-foreground">PDF files processed safely client-side</p>
              </div>
            </div>
          ) : (
            /* Selected File details */
            <div className="space-y-6">
              <div className="border-2 border-border p-4 rounded-lg flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-6 w-6 text-red-500 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-foreground truncate max-w-[280px] md:max-w-[400px]">
                      {sourceFile.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex gap-3">
                      <span>{formatSize(sourceFile.size)}</span>
                      {loadingPageCount ? (
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Counting Pages
                        </span>
                      ) : (
                        <span className="text-primary font-bold">{t.totalPages}: {totalPages}</span>
                      )}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearSelection}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  aria-label="Remove document"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Configurations */}
              <div className="space-y-4 border-t pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-primary" /> {t.splitOptions}
                </span>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-2 font-bold text-foreground select-none cursor-pointer">
                    <input
                      type="radio"
                      name="splitMode"
                      value="range"
                      checked={splitMode === 'range'}
                      onChange={() => setSplitMode('range')}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <span>{t.splitRangeLabel}</span>
                  </label>

                  <label className="flex items-center gap-2 font-bold text-foreground select-none cursor-pointer">
                    <input
                      type="radio"
                      name="splitMode"
                      value="all"
                      checked={splitMode === 'all'}
                      onChange={() => setSplitMode('all')}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <span>{t.splitAllLabel}</span>
                  </label>
                </div>

                {/* Range inputs */}
                {splitMode === 'range' && (
                  <div className="space-y-2 pt-2">
                    <label htmlFor="range-input" className="text-xs font-bold text-muted-foreground">
                      Enter Page Range
                    </label>
                    <Input
                      id="range-input"
                      type="text"
                      value={rangeInput}
                      onChange={(e) => handleRangeInputChange(e.target.value)}
                      placeholder={t.rangeInputPlaceholder}
                      className="text-xs font-bold"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      e.g., 1-4, 7, 9-12 (pages start from 1)
                    </p>
                  </div>
                )}
              </div>

              {/* Visual Page Selector Grid */}
              {splitMode === 'range' && totalPages && totalPages > 0 && (
                <div className="space-y-3.5 border-t pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {t.visualSelection}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t.visualSelectionDesc}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-1.5 border rounded-lg bg-muted/5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isSelected = selectedPages.has(pageNum);
                      const thumb = pagesThumbnails[pageNum];

                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageClick(pageNum)}
                          className={`relative border rounded-lg p-2 flex flex-col items-center justify-between cursor-pointer transition-all select-none bg-card hover:bg-muted/10 ${
                            isSelected 
                              ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          {/* Corner checkbox indicator */}
                          <div className="absolute top-1 right-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="h-3.5 w-3.5 rounded border-input text-primary accent-primary pointer-events-none"
                            />
                          </div>

                          {/* Render Page Thumbnail */}
                          <div className="h-20 w-14 border rounded shrink-0 overflow-hidden bg-muted/20 flex items-center justify-center mt-2.5">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={thumb} 
                                alt={`Page ${pageNum}`} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-1 animate-pulse">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <span className="text-[10px] font-bold text-foreground mt-2">
                            Page {pageNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message Card */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 flex gap-3 text-xs font-semibold leading-relaxed rounded-lg">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          {sourceFile && !success && (
            <div className="pt-2">
              <Button
                onClick={handleSplit}
                disabled={loading || (splitMode === 'range' && !rangeInput.trim())}
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {loading ? t.splittingStatus : t.splitButton}
              </Button>
            </div>
          )}

          {/* Success / Result details */}
          {success && filesList.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-xs font-semibold leading-relaxed">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t.successMessage}</span>
                </div>
              </div>

              {/* Extracted file list */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {filesList.map((item, idx) => (
                  <div key={idx} className="border p-3 rounded-lg flex items-center justify-between bg-card text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-red-500 shrink-0" />
                      <span className="font-bold text-foreground truncate max-w-[280px] md:max-w-[400px]">
                        {item.name}
                      </span>
                    </div>
                    <a
                      href={item.url}
                      download={item.name}
                      className="text-primary font-bold underline shrink-0 hover:text-primary-dark"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
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
