'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sliders,
  Sparkles
} from 'lucide-react';
import t from './locales/en.json';
import { parsePageRanges, splitPdfBuffer } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PDFDocument } from 'pdf-lib';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('pdf-split');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setFilesList([]);
    setTotalPages(null);

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
      setTotalPages(doc.getPageCount());
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
    handleFile(incomingFiles[0]); // Only split first file dropped
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
                <p className="text-xs text-muted-foreground">PDF files only (under 20MB recommended)</p>
              </div>
            </div>
          ) : (
            /* Selected File details */
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
                      <span>{t.totalPages}: {totalPages}</span>
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
          )}

          {/* Error Message Card */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 flex gap-3 text-xs font-semibold leading-relaxed">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Split settings config block */}
          {sourceFile && totalPages !== null && (
            <div className="space-y-4 pt-2 border-t">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.splitOptions}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={() => setSplitMode('range')}
                  className={`p-4 border-2 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    splitMode === 'range' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Range Extract
                  </span>
                  <span className="text-[10px] text-muted-foreground">Extract custom select pages into a new PDF.</span>
                </button>

                <button
                  onClick={() => setSplitMode('all')}
                  className={`p-4 border-2 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    splitMode === 'all' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-primary" /> Split All
                  </span>
                  <span className="text-[10px] text-muted-foreground">Export each page into an individual file.</span>
                </button>
              </div>

              {/* Range settings input */}
              {splitMode === 'range' && (
                <div className="space-y-2 pt-2">
                  <label htmlFor="range-input" className="text-xs font-bold text-muted-foreground block">
                    {t.splitRangeLabel}
                  </label>
                  <Input
                    id="range-input"
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={t.rangeInputPlaceholder}
                    className="h-10 text-xs"
                    aria-label="Input page range"
                  />
                </div>
              )}

              {/* Action Splitting Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSplit}
                  disabled={loading || (splitMode === 'range' && rangeInput.trim() === '')}
                  className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
                >
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {loading ? t.splittingStatus : t.splitButton}
                </Button>
              </div>
            </div>
          )}

          {/* Success / Files download block */}
          {success && filesList.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex items-center gap-2 text-xs font-semibold leading-relaxed">
                <CheckCircle className="h-5 w-5" />
                <span>{t.successMessage}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block pb-1 border-b">
                  Extracts ({filesList.length})
                </span>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {filesList.map((f, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-2.5 border rounded-lg bg-card text-xs font-semibold"
                    >
                      <span className="truncate max-w-[200px] md:max-w-[400px] text-foreground">{f.name}</span>
                      <a
                        href={f.url}
                        download={f.name}
                        onClick={() => trackDownloadAction('pdf-split')}
                        className="h-7 px-3 bg-primary text-primary-foreground font-bold rounded flex items-center gap-1 shadow hover:bg-primary/90 text-[10px]"
                      >
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
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
