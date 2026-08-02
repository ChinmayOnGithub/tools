'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shuffle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PipeTarget {
  id: string;
  name: string;
}

const PIPE_TARGETS: PipeTarget[] = [
  { id: 'json-formatter', name: 'JSON Formatter' },
  { id: 'json-validator', name: 'JSON Validator' },
  { id: 'base64-converter', name: 'Base64 Converter' },
  { id: 'url-encoder', name: 'URL Encoder' },
  { id: 'hash-generator', name: 'Hash Generator' },
  { id: 'case-converter', name: 'Case Converter' },
  { id: 'word-counter', name: 'Word Counter' },
];

interface PipeButtonProps {
  value: string;
  className?: string;
  iconOnly?: boolean;
}

export function PipeButton({ value, className, iconOnly = false }: PipeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handlePipeTo = (targetId: string) => {
    setIsOpen(false);
    if (!value) return;
    const encoded = encodeURIComponent(value);
    router.push(`/tools/${targetId}?input=${encoded}`);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={!value}
        className={className}
        title="Pipe this output to another tool"
        type="button"
      >
        <Shuffle className={iconOnly ? "h-3.5 w-3.5" : "h-3.5 w-3.5 mr-1.5"} />
        {!iconOnly && (
          <>
            <span>Pipe Output</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1 z-50 w-48 bg-card border-2 border-border shadow-2xl card-depth-2 focus:outline-none rounded-none">
          <div className="px-3 py-1.5 border-b border-border bg-muted/40 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            Select Target Tool
          </div>
          <div className="py-1 max-h-56 overflow-y-auto">
            {PIPE_TARGETS.map((target) => (
              <button
                key={target.id}
                onClick={() => handlePipeTo(target.id)}
                className="w-full text-left px-3 py-2 text-xs font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between cursor-pointer rounded-none"
              >
                <span>{target.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PipeButton;
