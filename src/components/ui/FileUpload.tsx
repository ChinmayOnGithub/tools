'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  subLabel?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSizeMB = 5,
  label = 'Drag & drop a file here, or click to upload',
  subLabel = 'PNG, JPG, WebP supported',
  className = '',
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    /* Outer padding card */
    <div className="p-4 bg-card border-2 border-border card-depth-1">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        aria-label={label}
        className={`
          border-2 border-dashed border-border/70 p-8 
          flex flex-col items-center justify-center text-center 
          cursor-pointer transition-all duration-200 rounded-none outline-none
          hover:border-primary/60 hover:bg-muted/20
          focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
          ${isDragging ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}
          ${className}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept={accept}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Upload icon bubble */}
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-all duration-200 ${
            isDragging
              ? 'bg-orange-500/20 scale-110'
              : 'bg-orange-500/10 hover:scale-105'
          }`}
        >
          <Upload
            className={`h-5 w-5 transition-colors ${
              isDragging ? 'text-orange-400' : 'text-orange-500'
            }`}
          />
        </div>

        <span className="text-xs font-bold text-foreground tracking-tight max-w-[200px]">
          {label}
        </span>
        <span className="text-[10px] text-muted-foreground mt-2 font-medium">
          {subLabel}
        </span>
        <span className="text-[9px] text-muted-foreground/50 mt-1 font-semibold">
          Max {maxSizeMB} MB
        </span>
      </div>
    </div>
  );
}
