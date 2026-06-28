'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import t from './locales/en.json';
import { compressPdfBuffer } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';
import { logger } from '@/lib/logger';

export default function PdfCompressComponent() {
  const [mounted, setMounted] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('pdf-compress');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);
    setCompressedSize(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError(t.invalidFileError);
      trackValidationError('pdf-compress', 'invalid_file_type');
      return;
    }

    setSourceFile(file);
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

  const handleCompress = async () => {
    if (!sourceFile) {
      setError(t.emptyFileError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const buffer = new Uint8Array(await sourceFile.arrayBuffer());
      const optimizedBytes = await compressPdfBuffer(buffer);
      
      const blob = new Blob([optimizedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCompressedSize(optimizedBytes.length);
      setDownloadUrl(url);
      setSuccess(true);
      trackToolCompletion('pdf-compress');
      trackDownloadAction('pdf-compress');

      const link = document.createElement('a');
      link.href = url;
      link.download = `${sourceFile.name.replace(/\.pdf$/i, '')}_compressed.pdf`;
      link.click();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : t.invalidFileError;
      setError(errMsg);
      trackValidationError('pdf-compress', 'compress_failed');
      logger.error('Failed to compress PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSourceFile(null);
    setCompressedSize(null);
    setError(null);
    setSuccess(false);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getReductionRatio = () => {
    if (!sourceFile || !compressedSize) return '0%';
    const diff = sourceFile.size - compressedSize;
    if (diff <= 0) return '0%';
    const pct = ((diff / sourceFile.size) * 100).toFixed(1);
    return `${pct}%`;
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
                  <span className="text-[10px] text-muted-foreground">
                    {t.fileSize}: {formatSize(sourceFile.size)}
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

          {/* Action Trigger Button */}
          {sourceFile && !success && (
            <div className="pt-2">
              <Button
                onClick={handleCompress}
                disabled={loading}
                className="w-full font-bold flex items-center justify-center gap-2 h-11 text-sm cursor-pointer"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {loading ? t.compressingStatus : t.compressButton}
              </Button>
            </div>
          )}

          {/* Success / Result details */}
          {success && downloadUrl && (
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-xs font-semibold leading-relaxed">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t.successMessage}</span>
                </div>
                <a
                  href={downloadUrl}
                  download={`${sourceFile?.name.replace(/\.pdf$/i, '')}_compressed.pdf`}
                  className="text-primary underline font-bold pl-7"
                >
                  {t.downloadPrompt}
                </a>
              </div>

              {/* Statistics grid */}
              {compressedSize && sourceFile && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border rounded-lg p-3 bg-muted/10">
                    <span className="text-[10px] text-muted-foreground block font-semibold uppercase">{t.fileSize}</span>
                    <span className="text-xs font-bold text-foreground mt-1 block">{formatSize(sourceFile.size)}</span>
                  </div>
                  <div className="border rounded-lg p-3 bg-muted/10">
                    <span className="text-[10px] text-muted-foreground block font-semibold uppercase">{t.compressedSize}</span>
                    <span className="text-xs font-bold text-foreground mt-1 block">{formatSize(compressedSize)}</span>
                  </div>
                  <div className="border rounded-lg p-3 bg-muted/10">
                    <span className="text-[10px] text-muted-foreground block font-semibold uppercase">{t.reduction}</span>
                    <span className="text-xs font-bold text-emerald-500 mt-1 block">{getReductionRatio()}</span>
                  </div>
                </div>
              )}
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
