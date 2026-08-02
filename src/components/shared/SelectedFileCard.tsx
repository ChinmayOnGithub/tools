'use client';

import { ReactNode } from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SelectedFileCardProps {
  /** The selected file object */
  file: File;
  /** Optional formatted size string (e.g. "1.2 MB"). Falls back to raw bytes if omitted. */
  formattedSize?: string;
  /** Optional extra metadata shown next to size (e.g. "12 pages", "1920×1080") */
  meta?: string;
  /** Optional thumbnail URL for image previews */
  previewUrl?: string;
  /** Icon type to show when no preview is available */
  iconType?: 'document' | 'image';
  /** Whether the remove button should be hidden (e.g. during processing) */
  disableRemove?: boolean;
  /** Callback when the user clicks Remove */
  onRemove: () => void;
  className?: string;
  /** Optional slot for extra content on the right (e.g. a badge or status) */
  children?: ReactNode;
}

/** Canonical "selected file" row shown after a file is chosen via FileDropzone. */
export default function SelectedFileCard({
  file,
  formattedSize,
  meta,
  previewUrl,
  iconType = 'document',
  disableRemove = false,
  onRemove,
  className,
  children,
}: SelectedFileCardProps) {
  const sizeLabel = formattedSize ?? `${(file.size / 1024).toFixed(1)} KB`;

  return (
    <div className={cn('flex items-center justify-between p-3 border border-border bg-card', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Thumbnail or icon */}
        {previewUrl ? (
          <div className="h-10 w-10 border rounded-none overflow-hidden shrink-0 bg-muted/20 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview thumbnail" className="h-full w-full object-cover" />
          </div>
        ) : iconType === 'image' ? (
          <ImageIcon className="h-8 w-8 text-primary shrink-0" />
        ) : (
          <FileText className="h-8 w-8 text-primary shrink-0" />
        )}

        {/* Name + size */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-foreground truncate max-w-[150px] md:max-w-[220px]">
            {file.name}
          </span>
          <span className="text-[9px] text-muted-foreground flex items-center gap-1.5">
            <span>{sizeLabel}</span>
            {meta && <span className="text-primary font-semibold">· {meta}</span>}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {children}
        {!disableRemove && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:bg-destructive/5 rounded-none h-8 text-[10px] font-bold uppercase tracking-wider"
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
