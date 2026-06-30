'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import t from './locales/en.json';
import { formatBytes, compressPdfWorker } from './utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trackToolLaunch, trackToolCompletion, trackValidationError, trackDownloadAction } from '@/lib/analytics';

type PresetKey = 'screen' | 'ebook' | 'printer' | 'prepress';

export default function PdfCompressComponent() {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<PresetKey>('ebook'); // 'ebook' is Balanced [DEFAULT]
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Results
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const compressedBlobUrlRef = useRef<string | null>(null);
  const [isAlreadyOptimized, setIsAlreadyOptimized] = useState(false);
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safety limits (50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const updateCompressedBlobUrl = (url: string | null) => {
    compressedBlobUrlRef.current = url;
    setCompressedBlobUrl(url);
  };

  const cleanupBlobUrl = () => {
    if (compressedBlobUrlRef.current) {
      URL.revokeObjectURL(compressedBlobUrlRef.current);
      compressedBlobUrlRef.current = null;
    }
    setCompressedBlobUrl(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('pdf-compress');
    }, 0);
    return () => {
      clearTimeout(timer);
      // Cleanup object URLs to prevent memory leaks when navigating away
      if (compressedBlobUrlRef.current) {
        URL.revokeObjectURL(compressedBlobUrlRef.current);
      }
    };
  }, []);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    
    setError(null);
    setSuccess(false);
    cleanupBlobUrl();
    setCompressedSize(null);
    setIsAlreadyOptimized(false);

    const selectedFile = incomingFiles[0];

    // Verify it is a PDF
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError(t.invalidFile);
      trackValidationError('pdf-compress', 'invalid_file_type');
      return;
    }

    // Verify file size safety limits
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(t.sizeLimitExceeded);
      trackValidationError('pdf-compress', 'file_size_limit_exceeded');
      return;
    }

    setFile(selectedFile);
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
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    cleanupBlobUrl();
    setCompressedSize(null);
    setIsAlreadyOptimized(false);
  };

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    cleanupBlobUrl();
    setCompressedSize(null);
    setIsAlreadyOptimized(false);
    setProgressMessage('Initializing core compiler...');

    try {
      const outputBuffer = await compressPdfWorker(file, preset, (message) => {
        setProgressMessage(message);
      });

      const outputBlob = new Blob([outputBuffer], { type: 'application/pdf' });
      const sizeAfter = outputBlob.size;

      // Check if output is larger or barely smaller
      if (sizeAfter >= file.size) {
        setIsAlreadyOptimized(true);
      }

      setCompressedSize(sizeAfter);
      const blobUrl = URL.createObjectURL(outputBlob);
      updateCompressedBlobUrl(blobUrl);
      setSuccess(true);
      trackToolCompletion('pdf-compress');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(errorMsg);
      setError(t.errorOccurred);
      trackValidationError('pdf-compress', 'worker_processing_failure');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlobUrl || !file) return;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = compressedBlobUrl;
    
    // Suffix file name
    const extensionIndex = file.name.lastIndexOf('.pdf');
    const newName = extensionIndex !== -1 
      ? `${file.name.slice(0, extensionIndex)}-compressed.pdf`
      : `${file.name}-compressed.pdf`;
      
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    trackDownloadAction('pdf-compress');
  };

  if (!mounted) return null;

  // Calculate percentage savings
  const calculateSavings = () => {
    if (!file || !compressedSize) return 0;
    const diff = file.size - compressedSize;
    if (diff <= 0) return 0;
    return Math.round((diff / file.size) * 100);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <Card className="border-2 border-border card-depth-1">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            {t.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File input / uploader */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-primary bg-primary/5 scale-[0.99]'
                  : 'border-border bg-muted/5 hover:border-primary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground">
                Drag & drop your PDF here, or <span className="text-primary hover:underline">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports standard PDF files up to 50MB
              </p>
            </div>
          ) : (
            <div className="border-2 border-border p-4 bg-muted/10 rounded flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatBytes(file.size)}</p>
                </div>
              </div>
              
              {!loading && !success && (
                <button
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive p-1.5 transition-colors cursor-pointer"
                  aria-label="Remove selected file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Preset parameters configuration */}
          {!success && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {t.selectPreset}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Object.keys(t.presets) as PresetKey[]).map((key) => {
                  const item = t.presets[key];
                  return (
                    <label
                      key={key}
                      className={`border-2 p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
                        preset === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preset"
                        checked={preset === key}
                        onChange={() => setPreset(key)}
                        disabled={loading}
                        className="sr-only"
                      />
                      <div>
                        <span className={`text-xs font-bold block ${preset === key ? 'text-primary' : 'text-foreground'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground leading-relaxed mt-1 block">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loader status log */}
          {loading && (
            <div className="bg-muted/30 border-2 border-border p-5 text-center space-y-3">
              <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto" />
              <p className="text-xs font-bold text-foreground">{t.compressing}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{progressMessage}</p>
            </div>
          )}

          {/* Error messages */}
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive/20 p-4 text-center space-y-2 text-destructive">
              <AlertTriangle className="h-5 w-5 mx-auto" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          {/* Success states */}
          {success && file && compressedSize && (
            <div className="border-2 border-border p-5 space-y-4 bg-muted/5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold">{t.done}</span>
              </div>

              {isAlreadyOptimized ? (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-3.5 text-xs flex gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{t.alreadyOptimized}</span>
                </div>
              ) : (
                <div className="bg-primary/5 border border-primary/20 p-4 grid grid-cols-3 gap-2 text-center select-none">
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Before</span>
                    <span className="text-xs font-extrabold text-foreground mt-0.5 block">{formatBytes(file.size)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">After</span>
                    <span className="text-xs font-extrabold text-primary mt-0.5 block">{formatBytes(compressedSize)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Reduced</span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      -{calculateSavings()}%
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleDownload} 
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  {t.downloadBtn}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={removeFile}
                  className="flex-1 cursor-pointer"
                >
                  {t.resetBtn}
                </Button>
              </div>
            </div>
          )}

          {/* Compress Trigger */}
          {!success && !loading && (
            <Button
              onClick={handleCompress}
              disabled={!file}
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              {t.compressBtn}
            </Button>
          )}

          {/* Privacy reminder note */}
          <div className="text-center pt-2 select-none border-t border-border/50">
            <span className="text-[10px] text-muted-foreground block leading-normal">
              🛡️ {t.privacyNote}
            </span>
            <span className="text-[9px] text-muted-foreground/60 block mt-1">
              Note: WebAssembly processing runs on worker memory ceilings. For very large PDF files, desktop systems with sufficient memory allocations are recommended.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
