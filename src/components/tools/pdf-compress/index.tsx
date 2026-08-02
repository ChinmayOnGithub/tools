'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  AlertTriangle,
  RefreshCw,
  Download,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import t from './locales/en.json';
import { formatBytes, compressPdfWorker } from './utils';
import { Button } from '@/components/ui/Button';

// Primitives
import ToolLayout from '@/components/shared/ToolLayout';
import InputPanel from '@/components/shared/InputPanel';
import OutputPanel from '@/components/shared/OutputPanel';
import ActionBar from '@/components/shared/ActionBar';
import CopyShareToast from '@/components/shared/CopyShareToast';
import FileDropzone from '@/components/shared/FileDropzone';
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
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('pdf-compress');
    }, 0);
    return () => {
      clearTimeout(timer);
      if (compressedBlobUrlRef.current) {
        URL.revokeObjectURL(compressedBlobUrlRef.current);
      }
    };
  }, []);

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

  const removeFile = () => {
    setFile(null);
    setSuccess(false);
    cleanupBlobUrl();
    setCompressedSize(null);
    setIsAlreadyOptimized(false);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgressMessage('Initializing compression worker...');

    try {
      const compressedArrayBuffer = await compressPdfWorker(file, preset, (msg) => {
        setProgressMessage(msg);
      });

      // Check if size savings occurred
      if (compressedArrayBuffer.byteLength >= file.size) {
        setIsAlreadyOptimized(true);
        // Fallback to original buffer
        const blob = new Blob([await file.arrayBuffer()], { type: 'application/pdf' });
        updateCompressedBlobUrl(URL.createObjectURL(blob));
        setCompressedSize(file.size);
      } else {
        const blob = new Blob([compressedArrayBuffer], { type: 'application/pdf' });
        updateCompressedBlobUrl(URL.createObjectURL(blob));
        setCompressedSize(compressedArrayBuffer.byteLength);
      }

      setSuccess(true);
      trackToolCompletion('pdf-compress');
      trackDownloadAction('pdf-compress');
      setShowToast(true);

      // Auto download
      const link = document.createElement('a');
      link.href = compressedBlobUrlRef.current || '';
      link.download = `compressed_${file.name}`;
      link.click();
    } catch (err: unknown) {
      console.error('Failed to compress PDF document:', err);
      const msg = err instanceof Error ? err.message : 'Compression failed.';
      setError(msg);
      trackValidationError('pdf-compress', 'compression_failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = () => {
    if (!file || !compressedSize) return 0;
    const diff = file.size - compressedSize;
    if (diff <= 0) return 0;
    return Math.round((diff / file.size) * 100);
  };

  if (!mounted) {
    return <div className="animate-pulse bg-muted h-64 rounded-none w-full border border-border" />;
  }

  return (
    <div className="space-y-6 w-full">
      <ToolLayout>
        {/* Left Column: File selection and presets */}
        <div className="space-y-6">
          <InputPanel title="Compress Options">
            <div className="space-y-4">
              {!file ? (
                <FileDropzone
                  accept=".pdf,application/pdf"
                  onFilesSelected={handleFiles}
                  category="pdf"
                  placeholderText="Drag & drop PDF here, or click to upload"
                  dragActiveText="Drop PDF here"
                  descriptionText="Select a PDF to compress locally (up to 50MB)"
                />
              ) : (
                <div className="flex items-center justify-between p-3 border border-border bg-card">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-foreground truncate max-w-[150px] md:max-w-[220px]">
                        {file.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                  </div>
                  {!loading && !success && (
                    <Button variant="outline" size="sm" onClick={removeFile} className="text-destructive hover:bg-destructive/5 rounded-none h-8 text-[10px] font-bold uppercase tracking-wider">
                      Remove
                    </Button>
                  )}
                </div>
              )}

              {/* Compression presets */}
              {!success && (
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-primary" />
                    Select Compression Preset
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {(Object.keys(t.presets) as PresetKey[]).map((key) => {
                      const item = t.presets[key];
                      return (
                        <label
                          key={key}
                          className={`border p-3 flex flex-col justify-between cursor-pointer transition-all rounded-none ${
                            preset === key
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/40'
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
                            <span className={`text-[11px] font-bold block ${preset === key ? 'text-primary' : 'text-foreground'}`}>
                              {item.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground leading-normal mt-0.5 block">
                              {item.desc}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </InputPanel>
        </div>

        {/* Right Column: Execution loader, success metrics, and downloads */}
        <div className="space-y-6">
          <OutputPanel title="Compression Output">
            <div className="space-y-4">
              {/* Loader visual status */}
              {loading && (
                <div className="bg-muted/30 border border-border p-5 text-center space-y-3 rounded-none">
                  <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto" />
                  <p className="text-xs font-bold text-foreground">{t.compressing}</p>
                  <p className="text-[9px] text-muted-foreground font-mono truncate">{progressMessage}</p>
                </div>
              )}

              {/* Success metrics */}
              {success && file && compressedSize && (
                <div className="border border-border p-4 space-y-4 bg-muted/5 rounded-none">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold">{t.done}</span>
                  </div>

                  {isAlreadyOptimized ? (
                    <div className="bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 text-xs leading-normal">
                      {t.alreadyOptimized}
                    </div>
                  ) : (
                    <div className="bg-primary/5 border border-primary/20 p-3.5 grid grid-cols-3 gap-2 text-center select-none rounded-none font-mono">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Original</span>
                        <span className="text-xs font-extrabold text-foreground mt-0.5 block">{formatBytes(file.size)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Compressed</span>
                        <span className="text-xs font-extrabold text-primary mt-0.5 block">{formatBytes(compressedSize)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">Savings</span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                          -{calculateSavings()}%
                        </span>
                      </div>
                    </div>
                  )}
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
                  {success && compressedBlobUrl ? (
                    <Button onClick={() => {
                      const link = document.createElement('a');
                      link.href = compressedBlobUrl;
                      link.download = `compressed_${file?.name || 'document.pdf'}`;
                      link.click();
                    }}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download PDF
                    </Button>
                  ) : (
                    <Button onClick={handleCompress} disabled={loading || !file}>
                      {loading ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
                      Compress PDF
                    </Button>
                  )}
                </div>
              </ActionBar>
            </div>
          </OutputPanel>
        </div>
      </ToolLayout>

      <CopyShareToast show={showToast} onClose={() => setShowToast(false)} message="PDF document successfully compressed." />
    </div>
  );
}
