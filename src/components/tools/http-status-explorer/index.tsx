'use client';

import { useState, useEffect } from 'react';
import { Search, ShieldCheck, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { HTTP_STATUSES, HttpStatusEntry } from './utils';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';
import t from './locales/en.json';

const CATEGORY_COLORS: Record<string, { badge: string; text: string }> = {
  '2xx': { badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
  '3xx': { badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
  '4xx': { badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
  '5xx': { badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20', text: 'text-rose-600 dark:text-rose-400' },
};

export default function HttpStatusExplorer() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<HttpStatusEntry>(HTTP_STATUSES[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('http-status-explorer');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const clean = query.trim().toLowerCase();
  const filteredList = HTTP_STATUSES.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesQuery = 
      !clean ||
      s.code.toString().includes(clean) ||
      s.phrase.toLowerCase().includes(clean) ||
      s.description.toLowerCase().includes(clean);
    return matchesCat && matchesQuery;
  });

  if (!mounted) return <div className="animate-pulse bg-muted h-64 border border-border" />;

  return (
    <div className="space-y-6 w-full">
      {/* Search & Category Filter */}
      <div className="bg-card border-2 border-border p-4 card-depth-1 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Search HTTP status code"
              className="pl-10 h-10 text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', '2xx', '3xx', '4xx', '5xx'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer rounded-none shrink-0 ${
                  selectedCategory === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {cat === 'all' ? 'All Codes' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Code Selector List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Codes Master List */}
        <div className="lg:col-span-1 border-2 border-border bg-card divide-y divide-border/60 max-h-[520px] overflow-y-auto card-depth-1">
          {filteredList.length > 0 ? (
            filteredList.map((status) => {
              const isSelected = selectedStatus.code === status.code;
              const color = CATEGORY_COLORS[status.category] || CATEGORY_COLORS['2xx'];
              return (
                <button
                  key={status.code}
                  onClick={() => {
                    setSelectedStatus(status);
                    trackToolCompletion('http-status-explorer');
                  }}
                  className={`w-full text-left p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-foreground">{status.code}</span>
                      <span className="text-xs font-bold text-foreground truncate">{status.phrase}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block">{status.categoryName}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 border ${color.badge}`}>
                    {status.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching status codes found.
            </div>
          )}
        </div>

        {/* Selected Code Detail Viewer */}
        <div className="lg:col-span-2 border-2 border-border bg-card p-6 card-depth-1 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-black font-mono text-foreground">
                  {selectedStatus.code}
                </span>
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {selectedStatus.phrase}
                </span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[selectedStatus.category]?.badge}`}>
                {selectedStatus.category} {selectedStatus.categoryName}
              </span>
            </div>

            <div className="text-right text-[11px] text-muted-foreground">
              <span className="block font-bold">RFC Specification</span>
              <span className="font-mono text-foreground font-semibold">{selectedStatus.spec}</span>
            </div>
          </div>

          {/* Meaning Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Standard RFC Meaning</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedStatus.description}
            </p>
          </div>

          {/* Developer Action & Recovery */}
          <div className="p-4 bg-muted/20 border border-border space-y-2">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Developer Action &amp; Best Practices</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedStatus.developerAction}
            </p>
          </div>

          {/* Specs Flags */}
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground pt-2">
            <div className="p-3 bg-muted/10 border border-border flex items-center justify-between">
              <span>Cacheable by default:</span>
              <span className={`font-bold ${selectedStatus.cacheable ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {selectedStatus.cacheable ? 'Yes (with headers)' : 'No'}
              </span>
            </div>
            <div className="p-3 bg-muted/10 border border-border flex items-center justify-between">
              <span>Status Class:</span>
              <span className="font-bold text-foreground">{selectedStatus.categoryName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
