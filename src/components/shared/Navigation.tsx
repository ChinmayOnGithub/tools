'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { CATEGORIES } from '@/config/categories';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import ThemeToggle from './ThemeToggle';
import SearchOverlay from './SearchOverlay';

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const availableToolsCount = TOOLS_REGISTRY.filter((t) => t.status === 'published').length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    const handleOpenSearch = () => {
      setIsSearchOpen(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search', handleOpenSearch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search', handleOpenSearch);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Link className="flex items-center space-x-2 font-bold text-lg" href="/" aria-label="Home page">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm mr-1">
                  Cool
                </span>
                Tools
              </Link>
              <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 select-none">
                {availableToolsCount} Ready
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/#categories">
                Categories
              </Link>
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/#about">
                Privacy Pledge
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative inline-flex items-center gap-2 h-9 w-40 sm:w-60 rounded-md border border-input bg-muted/40 px-3 text-xs text-muted-foreground shadow-sm hover:bg-muted/80 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Search tools"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search tools...</span>
              <kbd className="absolute right-2 top-2.5 pointer-events-none hidden sm:inline-flex h-4 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
                /
              </kbd>
            </button>

            {/* Theme Toggle Component */}
            <ThemeToggle />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex md:hidden items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-input bg-transparent shadow-sm cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block px-2">
              Tool Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-accent text-foreground transition-colors font-medium border border-transparent hover:border-border"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
            <div className="border-t pt-3 flex flex-col gap-2">
              <Link
                href="/#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navigation;
