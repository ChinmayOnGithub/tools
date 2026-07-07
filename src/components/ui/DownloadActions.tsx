'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface FormatOption {
  value: string;
  label: string;
}

interface DownloadActionsProps {
  /** Title shown in the card header */
  title?: string;
  /** Unique ID prefix to avoid duplicate element IDs when used multiple times */
  idPrefix?: string;
  filename: string;
  onFilenameChange: (val: string) => void;
  placeholder?: string;
  formats?: FormatOption[];
  selectedFormat?: string;
  onFormatChange?: (val: string) => void;
  onDownload: () => void;
  downloadLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function DownloadActions({
  title = 'Exporter Settings',
  idPrefix = 'dl',
  filename,
  onFilenameChange,
  placeholder = 'Filename...',
  formats,
  selectedFormat,
  onFormatChange,
  onDownload,
  downloadLabel = 'Download',
  disabled = false,
  className = '',
}: DownloadActionsProps) {
  const filenameId = `${idPrefix}-filename`;
  const formatId = `${idPrefix}-format`;

  return (
    <Card className={`rounded-none border-2 border-border card-depth-2 ${className}`}>
      <CardHeader className="py-2 px-4 border-b border-border bg-muted/10 shrink-0">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider select-none">
          {title}
        </span>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          {/* Filename input */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <label
              htmlFor={filenameId}
              className="text-[10px] font-black text-muted-foreground uppercase tracking-wider select-none"
            >
              Filename
            </label>
            <Input
              id={filenameId}
              value={filename}
              onChange={(e) => onFilenameChange(e.target.value)}
              placeholder={placeholder}
              className="h-9 text-xs font-semibold rounded-none border-2 border-border"
            />
          </div>

          {/* Optional format selector */}
          {formats && onFormatChange && (
            <div className="space-y-1.5 shrink-0">
              <label
                htmlFor={formatId}
                className="text-[10px] font-black text-muted-foreground uppercase tracking-wider select-none"
              >
                Format
              </label>
              <select
                id={formatId}
                value={selectedFormat}
                onChange={(e) => onFormatChange(e.target.value)}
                className="w-full sm:w-40 h-9 border-2 border-border rounded-none px-2 bg-background
                  text-xs font-semibold text-foreground focus-visible:outline-none
                  hover:border-primary/60 focus:border-primary transition-colors cursor-pointer"
              >
                {formats.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Download button */}
          <Button
            onClick={onDownload}
            disabled={disabled}
            className="w-full sm:w-auto shrink-0 rounded-none border-2 h-9 flex items-center justify-center gap-1.5 font-bold text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            {downloadLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
