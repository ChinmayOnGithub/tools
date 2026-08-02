'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList) => void;
  category: 'pdf' | 'image' | 'developer' | 'text' | 'calculator' | 'converter';
  placeholderText?: string;
  dragActiveText?: string;
  descriptionText?: string;
  className?: string;
}

const CATEGORY_STYLE_MAP = {
  pdf: {
    border: 'border-red-500/30 hover:border-red-500/80',
    activeBorder: 'border-red-500 bg-red-500/5',
    icon: 'text-red-500',
  },
  image: {
    border: 'border-blue-500/30 hover:border-blue-500/80',
    activeBorder: 'border-blue-500 bg-blue-500/5',
    icon: 'text-blue-500',
  },
  developer: {
    border: 'border-emerald-500/30 hover:border-emerald-500/80',
    activeBorder: 'border-emerald-500 bg-emerald-500/5',
    icon: 'text-emerald-500',
  },
  text: {
    border: 'border-orange-500/30 hover:border-orange-500/80',
    activeBorder: 'border-orange-500 bg-orange-500/5',
    icon: 'text-orange-500',
  },
  calculator: {
    border: 'border-violet-500/30 hover:border-violet-500/80',
    activeBorder: 'border-violet-500 bg-violet-500/5',
    icon: 'text-violet-500',
  },
  converter: {
    border: 'border-amber-500/30 hover:border-amber-500/80',
    activeBorder: 'border-amber-500 bg-amber-500/5',
    icon: 'text-amber-500',
  },
};

export default function FileDropzone({
  accept,
  multiple = false,
  onFilesSelected,
  category,
  placeholderText = 'Drag & drop file here, or click to upload',
  dragActiveText = 'Drop file here',
  descriptionText,
  className,
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const style = CATEGORY_STYLE_MAP[category] || CATEGORY_STYLE_MAP.developer;

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 rounded-none bg-card",
        dragActive ? style.activeBorder : style.border,
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload files"
      />
      <div className="flex flex-col items-center gap-3">
        <Upload className={cn("h-8 w-8 animate-bounce", style.icon)} />
        <p className="text-xs font-semibold text-foreground">
          {dragActive ? dragActiveText : placeholderText}
        </p>
        {descriptionText && (
          <p className="text-[10px] text-muted-foreground">{descriptionText}</p>
        )}
      </div>
    </div>
  );
}
