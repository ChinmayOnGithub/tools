'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { CATEGORIES } from '@/config/categories';
import ThemeToggle from '@/components/shared/ThemeToggle';
import SearchOverlay from '@/components/shared/SearchOverlay';
import HistoryDrawer from '@/components/shared/HistoryDrawer';
import SiteLogo from '@/components/shared/SiteLogo';

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-background card-depth-2">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <SiteLogo size="md" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <Link className="px-3 py-2 transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50" href="/contact">
                Contact & Feedback
              </Link>
              <Link className="px-3 py-2 transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50" href="/privacy">
                Privacy Policy
              </Link>
            </nav>
          </div>
 
          <div className="flex items-center space-x-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative inline-flex items-center gap-2 h-10 w-40 sm:w-64 border-2 border-border bg-muted/30 px-3 text-xs text-muted-foreground hover:bg-muted/60 hover:border-primary/50 transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search tools"
            >
              <Search className="h-4 w-4" />
              <span className="font-medium">Search tools...</span>
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center justify-center gap-0.5 border border-border bg-background px-1.5 font-mono text-[10px] font-bold text-muted-foreground">
                /
              </kbd>
            </button>

            {/* Theme Toggle Component */}
            <ThemeToggle />

            {/* History Drawer Overlay & Trigger */}
            <HistoryDrawer />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex md:hidden items-center justify-center text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 border-2 border-border bg-transparent cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-border bg-background px-4 py-4 space-y-4 card-depth-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block px-2">
              Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 text-sm hover:bg-primary/5 text-foreground transition-colors font-medium border-2 border-border hover:border-primary"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
            <div className="border-t-2 border-border pt-4 flex flex-col gap-2">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 border-2 border-border text-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Contact & Feedback
              </Link>
              <Link
                href="/privacy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 border-2 border-border text-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors font-medium"
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
