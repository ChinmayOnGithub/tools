'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, CornerDownLeft, BookOpen, Wrench, Layers } from 'lucide-react';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { getPublishedGuides } from '@/config/docs-registry';
import { WORKFLOWS_DATA } from '@/config/guides-data';
import { trackInternalSearch } from '@/lib/analytics';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanQuery = query.toLowerCase().trim();

  // Compute search results dynamically during render
  const toolResults = cleanQuery === '' ? [] : TOOLS_REGISTRY.filter((tool) => {
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

  const guideResults = cleanQuery === '' ? [] : getPublishedGuides().filter((guide) => {
    return (
      guide.title.toLowerCase().includes(cleanQuery) ||
      guide.shortDescription.toLowerCase().includes(cleanQuery) ||
      guide.categoryTitle.toLowerCase().includes(cleanQuery)
    );
  });

  const workflowResults = cleanQuery === '' ? [] : WORKFLOWS_DATA.filter((wf) => {
    return (
      wf.title.toLowerCase().includes(cleanQuery) ||
      wf.description.toLowerCase().includes(cleanQuery)
    );
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
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

  const totalResults = toolResults.length + guideResults.length + workflowResults.length;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools and guides"
    >
      <div className="w-full max-w-2xl bg-card border-2 border-border card-depth-2 flex flex-col max-h-[75vh] overflow-hidden">
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 border-b h-14 shrink-0">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, problem guides, and RFC standards..."
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
        <div className="flex-1 overflow-y-auto p-4 min-h-[150px] space-y-6">
          {query.trim() === '' ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground font-medium">Search across 37 utilities and 23 technical problem guides</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['JSON Parse Error', 'JWT Expired', 'Zero Width', 'Epoch Seconds', 'PDF Compress', 'Homoglyph'].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setQuery(s)}
                    className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground px-3 py-1.5 border border-border hover:border-primary transition-all font-bold cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults > 0 ? (
            <div className="space-y-5">
              {/* Problem Guides Results */}
              {guideResults.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest block px-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Problem Guides &amp; Solutions ({guideResults.length})</span>
                  </span>
                  {guideResults.map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/guides/${guide.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 bg-muted/20 hover:bg-primary/10 group transition-colors border border-border hover:border-primary"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                        <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors truncate">
                          {guide.title}
                        </span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1">
                          {guide.shortDescription}
                        </span>
                      </div>
                      <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 font-bold uppercase tracking-wider shrink-0">
                        {guide.categoryTitle}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Tools Results */}
              {toolResults.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-2 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Interactive Tools ({toolResults.length})</span>
                  </span>
                  {toolResults.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 hover:bg-muted group transition-colors border border-border hover:border-primary"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                        <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors truncate">
                          {tool.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1">
                          {tool.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] bg-muted px-2 py-0.5 border border-border uppercase font-bold text-muted-foreground">
                          {tool.category}
                        </span>
                        <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Workflow Results */}
              {workflowResults.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-2 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Workflows ({workflowResults.length})</span>
                  </span>
                  {workflowResults.map((wf) => (
                    <Link
                      key={wf.id}
                      href={`/workflows/${wf.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 bg-muted/20 hover:bg-muted group transition-colors border border-border hover:border-primary"
                    >
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {wf.title}
                      </span>
                      <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-foreground">No matching utilities or guides found for &quot;{query}&quot;</p>
              <p className="text-xs text-muted-foreground mt-1">Try searching by error message, keyword, or problem description.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
