'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Trash, Check, Upload } from 'lucide-react';
import { useMemo, useState, DragEvent } from 'react';

interface TextInputAreaProps {
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  label: string;
  readOnly?: boolean;
  rows?: number;
  showStats?: boolean;
  className?: string;
  onFileDrop?: (file: File) => void;
}

export function TextInputArea({
  value,
  onChange,
  placeholder = "Type or paste content...",
  label,
  readOnly = false,
  rows = 12,
  showStats = true,
  className = "",
  onFileDrop
}: TextInputAreaProps) {
  const { copied, copy } = useCopyToClipboard('text-input-area');
  const [isDragging, setIsDragging] = useState(false);

  const stats = useMemo(() => {
    if (!value) {
      return { chars: 0, words: 0, lines: 0 };
    }
    const chars = value.length;
    const words = value.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lines = value.split('\n').length;
    return { chars, words, lines };
  }, [value]);

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (readOnly || !onFileDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    if (readOnly || !onFileDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    if (readOnly || !onFileDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileDrop(file);
    }
  };

  return (
    <Card 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full rounded-none border-2 border-border card-depth-1 relative ${className}`}
    >
      {/* Visual drag overlay overlaying the text area */}
      {isDragging && onFileDrop && (
        <div className="absolute inset-0 bg-background/95 z-30 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-150">
          <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
            <Upload className="h-5 w-5 text-orange-500 animate-bounce" />
          </div>
          <span className="text-xs font-bold text-foreground">Drop File Here</span>
          <span className="text-[10px] text-muted-foreground mt-1">Read and import text content from file</span>
        </div>
      )}

      <CardHeader className="py-2 px-4 border-b border-border bg-muted/10 flex flex-row justify-between items-center space-y-0 shrink-0">
        <CardTitle className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
        
        <div className="flex gap-2">
          {!readOnly && onChange && value && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              className="rounded-none border-2 h-7 text-[10px] flex items-center gap-1 hover:bg-destructive/5 hover:text-destructive"
              title="Clear input"
            >
              <Trash className="h-3 w-3" /> Clear
            </Button>
          )}
          {value && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => copy(value)}
              className="rounded-none border-2 h-7 text-[10px] w-20 flex items-center justify-center gap-1"
              title="Copy all text"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative bg-background flex flex-col min-h-0">
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={onFileDrop ? `${placeholder} (Or drag and drop a file here)` : placeholder}
          readOnly={readOnly}
          rows={rows}
          className={`w-full flex-1 min-h-[250px] border-none bg-transparent p-4 font-mono text-xs outline-none focus:ring-0 resize-y ${
            readOnly ? 'bg-muted/5' : ''
          }`}
          aria-label={label}
        />
        
        {showStats && (
          <div className="flex justify-end gap-3.5 px-4 py-2 border-t border-border/40 bg-muted/5 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground select-none font-mono shrink-0">
            <span>Chars: {stats.chars}</span>
            <span>Words: {stats.words}</span>
            <span>Lines: {stats.lines}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
