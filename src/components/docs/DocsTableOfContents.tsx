'use client';

import { useState, useEffect } from 'react';
import { AlignLeft, ChevronDown } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface DocsTableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export default function DocsTableOfContents({
  items,
  className = '',
}: DocsTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="xl:hidden w-full my-4 border border-border bg-card">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-foreground text-left"
          aria-expanded={mobileOpen}
        >
          <div className="flex items-center gap-2">
            <AlignLeft className="h-3.5 w-3.5 text-primary" />
            <span>On This Page ({items.length} sections)</span>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileOpen && (
          <nav className="p-3 border-t border-border bg-background space-y-1.5 text-xs">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileOpen(false)}
                className={`block py-0.5 text-[11px] ${
                  item.level === 3 ? 'pl-3' : ''
                } text-muted-foreground hover:text-primary transition-colors`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <nav
        className={`hidden xl:block text-xs space-y-3 ${className}`}
        aria-label="Table of contents"
      >
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-muted-foreground pb-1 border-b border-border">
          <AlignLeft className="h-3 w-3 text-primary" />
          <span>On This Page</span>
        </div>

        <ul className="space-y-1.5 border-l border-border pl-2.5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block text-[11px] leading-snug transition-colors ${
                    item.level === 3 ? 'pl-2 text-[10px]' : ''
                  } ${
                    isActive
                      ? 'text-primary font-bold -ml-[11px] border-l-2 border-primary pl-2.5'
                      : 'text-muted-foreground hover:text-foreground font-medium'
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
