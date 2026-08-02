'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { trackInternalSearch } from '@/lib/analytics';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute search results dynamically during render (no useEffect/state required)
  const results = query.trim() === '' ? [] : TOOLS_REGISTRY.filter((tool) => {
    const cleanQuery = query.toLowerCase().trim();
    return (
      tool.name.toLowerCase().includes(cleanQuery) ||
      tool.description.toLowerCase().includes(cleanQuery) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(cleanQuery)) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(cleanQuery))
    );
  }).sort((a, b) => {
    const aVal = a.status === 'published' ? 0 : 1;
    const bVal = b.status === 'published' ? 0 : 1;
    return aVal - bVal;
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Wait for transition animation to complete
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => setQuery(''), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debounce search query tracking
  useEffect(() => {
    if (query.trim() === '') return;

    const timer = setTimeout(() => {
      trackInternalSearch(query.trim());
    }, 1500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div className="w-full max-w-2xl bg-card border-2 border-border card-depth-2 flex flex-col max-h-[70vh] overflow-hidden">
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 border-b h-14 shrink-0">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all browser utilities..."
            className="flex-1 h-full bg-transparent border-none text-sm placeholder:text-muted-foreground outline-none text-foreground focus:ring-0"
            aria-label="Search inputs"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
          <button 
            onClick={onClose} 
            className="hover:bg-muted p-1 border-2 border-transparent hover:border-border transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close search overlay"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Box */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[150px]">
          {query.trim() === '' ? (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground">Type to search tools by name, tag, or utility...</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['PDF', 'Image', 'JSON', 'Base64', 'Timer', 'QR Code', 'Color', 'Converter'].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setQuery(s)}
                    className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground px-3 py-1.5 border-2 border-border hover:border-primary transition-all font-bold cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2 px-2">
                Matching Utilities ({results.length})
              </span>
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 hover:bg-accent group transition-colors border-2 border-transparent hover:border-primary mb-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {tool.name}
                    </span>
                    <span className="text-xs text-muted-foreground leading-normal">
                      {tool.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.status !== 'published' && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 border border-amber-500/20 font-bold uppercase tracking-wider select-none">
                        Coming Soon
                      </span>
                    )}
                    <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 border border-primary/20 capitalize font-bold uppercase tracking-wider">
                      {tool.category}
                    </span>
                    <CornerDownLeft className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground/80 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-foreground">No utilities found for &quot;{query}&quot;</p>
              <p className="text-xs text-muted-foreground mt-1">Try searching by category or other aliases.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
