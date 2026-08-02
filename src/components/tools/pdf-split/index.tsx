'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertTriangle,
  RefreshCw,
  Sliders,
  Sparkles,
  Download
} from 'lucide-react';
import t from './locales/en.json';
import { parsePageRanges, splitPdfBuffer } from './utils';
import { getPdfPageThumbnail } from '@/lib/pdf-core';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PDFDocument } from 'pdf-lib';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import CopyShareToast from '@/components/shared/CopyShareToast';
import FileDropzone from '@/components/shared/FileDropzone';

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
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('range');
  const [rangeInput, setRangeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [filesList, setFilesList] = useState<{ name: string; url: string }[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pagesThumbnails, setPagesThumbnails] = useState<Record<number, string>>({});

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
    };
  }, [sourceFile, totalPages]);



  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError(t.invalidFileError);
      return;
    }

    setError(null);
    setSuccess(false);
    setFilesList([]);
    setSourceFile(file);
    setPagesThumbnails({});
    setSelectedPages(new Set());
    setRangeInput('');

    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(buffer, { updateMetadata: false });
      setTotalPages(doc.getPageCount());
    } catch (err: unknown) {
      logger.error('Failed to parse page count:', err);
      setError(t.invalidFileError);
    }
  };



  const removeFile = () => {
    setSourceFile(null);
    setTotalPages(null);
    setSuccess(false);
    setFilesList([]);
    setSelectedPages(new Set());
    setPagesThumbnails({});
    setRangeInput('');
    setError(null);
  };

  const handlePageClick = (pageNum: number) => {
    const nextSelected = new Set(selectedPages);
    if (nextSelected.has(pageNum)) {
      nextSelected.delete(pageNum);
    } else {
      nextSelected.add(pageNum);
    }
    setSelectedPages(nextSelected);

    // Convert Set of selected page indices to range input string format
    const pageIndices = Array.from(nextSelected);
    const rangeStr = indicesToRangeString(pageIndices);
    setRangeInput(rangeStr);
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    if (!totalPages) return;

    try {
      const pages = parsePageRanges(val, totalPages);
      setSelectedPages(new Set(pages));
    } catch {
      // Ignore intermediate typing errors in range parser
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSplit = async () => {
    if (!sourceFile || totalPages === null) {
      setError('No source file loaded.');
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
      setShowToast(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'PDF split process failed.';
      setError(errMsg);
      trackValidationError('pdf-split', 'split_failed');
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
        {/* Left Column: Dropzone, options and visual grid selection */}
        <div className="space-y-6">
          <InputPanel title="PDF Document Source">
            <div className="space-y-4">
              {!sourceFile ? (
                <FileDropzone
                  accept=".pdf,application/pdf"
                  onFilesSelected={(files) => {
                    if (files && files[0]) processFile(files[0]);
                  }}
                  category="pdf"
                  placeholderText={t.dragDropPlaceholder}
                  dragActiveText={t.dragDropActive}
                  descriptionText="Select a PDF to extract pages locally"
                />
              ) : (
                <div className="flex items-center justify-between p-3 border border-border bg-card">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-foreground truncate max-w-[200px]">
                        {sourceFile.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground flex gap-2">
                        <span>{formatSize(sourceFile.size)}</span>
                        {totalPages && <span className="text-primary font-semibold">({totalPages} pages)</span>}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={removeFile} className="text-destructive hover:bg-destructive/5 rounded-none h-8 text-[10px] font-bold uppercase tracking-wider">
                    Remove
                  </Button>
                </div>
              )}

              {/* Configurations */}
              {sourceFile && (
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Extraction Mode</label>
                    <div className="flex border border-border rounded-none overflow-hidden h-7 max-w-xs">
                      <button
                        onClick={() => setSplitMode('range')}
                        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-r border-border transition-colors flex-1 ${
                          splitMode === 'range'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        Extract Ranges
                      </button>
                      <button
                        onClick={() => setSplitMode('all')}
                        className={`px-3 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors flex-1 ${
                          splitMode === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        Split All Pages
                      </button>
                    </div>
                  </div>

                  {splitMode === 'range' && (
                    <div className="space-y-1.5">
                      <label htmlFor="range-input" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Page Ranges
                      </label>
                      <Input
                        id="range-input"
                        type="text"
                        value={rangeInput}
                        onChange={(e) => handleRangeInputChange(e.target.value)}
                        placeholder="e.g. 1-3, 5, 7-9"
                        className="text-xs font-semibold rounded-none border border-border bg-card h-9"
                      />
                      <p className="text-[9px] text-muted-foreground">
                        Use commas to separate page indexes or ranges (1-indexed)
                      </p>
                    </div>
                  )}

                  {/* Visual grid */}
                  {splitMode === 'range' && totalPages && totalPages > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          Visual Page Selector
                        </span>
                        <span className="text-[9px] text-muted-foreground">Click pages to toggle selection range</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1.5 border border-border bg-muted/5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          const isSelected = selectedPages.has(pageNum);
                          const thumb = pagesThumbnails[pageNum];

                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => handlePageClick(pageNum)}
                              className={`relative border p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all select-none rounded-none bg-card hover:bg-muted/10 ${
                                isSelected 
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                  : 'border-border'
                              }`}
                            >
                              <div className="h-16 w-11 border rounded-none shrink-0 overflow-hidden bg-muted/20 flex items-center justify-center mt-1">
                                {thumb ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img 
                                    src={thumb} 
                                    alt={`Page ${pageNum}`} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <span className="text-[9px] font-bold text-foreground mt-1.5">
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
            </div>
          </InputPanel>
        </div>

        {/* Right Column: Execution & Splitting Downloads */}
        <div className="space-y-6">
          <OutputPanel title="Split Output">
            <div className="space-y-4">
              {/* Output State Details */}
              <div className="border border-border bg-card p-6 text-center">
                <Sliders className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">Split Document</p>
                <p className="text-[10px] text-muted-foreground mt-1">Extract selected page indexes locally in browser</p>
              </div>

              {error && (
                <div className="bg-destructive/5 border border-destructive/20 text-destructive p-3 flex gap-2 text-xs font-semibold rounded-none">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Download list if multiple files */}
              {success && filesList.length > 0 && (
                <div className="space-y-2 max-h-[200px] overflow-y-auto border border-border p-2 divide-y divide-border/40">
                  {filesList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 text-xs font-semibold">
                      <span className="truncate max-w-[150px] font-mono text-[10px]">{item.name}</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.url;
                        link.download = item.name;
                        link.click();
                      }} className="h-7 text-[9px] font-extrabold uppercase tracking-wider rounded-none">
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <ActionBar>
                <div className="flex gap-2" />
                <div className="flex gap-2">
                  <Button onClick={handleSplit} disabled={loading || !sourceFile || (splitMode === 'range' && !rangeInput.trim())}>
                    {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
                    Extract Pages
                  </Button>
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="PDF document successfully split." />
    </div>
  );
}
