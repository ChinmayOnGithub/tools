'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Star, Trash2, Copy, Check, X, ExternalLink } from 'lucide-react';
import { getHistory, clearHistory, HistoryEntry } from '@/lib/history';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { TOOLS_REGISTRY } from '@/config/tools-registry';

export function HistoryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'recents' | 'favorites'>('recents');
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastViewed, setLastViewed] = useState<number>(0);

  // Sync with localStorage on mount and updates
  useEffect(() => {
    const handleHistoryUpdate = () => {
      setHistoryList(getHistory());
    };
    const handleFavsUpdate = () => {
      setFavoritesList(getFavorites());
    };

    handleHistoryUpdate();
    handleFavsUpdate();

    window.addEventListener('tool_history_update', handleHistoryUpdate);
    window.addEventListener('cooltools_favorites_update', handleFavsUpdate);
    return () => {
      window.removeEventListener('tool_history_update', handleHistoryUpdate);
      window.removeEventListener('cooltools_favorites_update', handleFavsUpdate);
    };
  }, []);

  // Initialize and update lastViewed timestamp when popover opens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('last_viewed_history_time');
      if (saved) {
        setTimeout(() => {
          setLastViewed(parseInt(saved, 10));
        }, 0);
      }
    }
  }, []);

  const handleOpenToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && typeof window !== 'undefined') {
      const now = Date.now();
      localStorage.setItem('last_viewed_history_time', now.toString());
      setLastViewed(now);
      setFavoritesList(getFavorites());
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your tool activity history?')) {
      clearHistory();
    }
  };

  const hasUnread = historyList.some((item) => item.timestamp > lastViewed);

  // Derive favorite tool entries
  const favoritedTools = TOOLS_REGISTRY.filter((t) => favoritesList.includes(t.id));

  // Extract unique recently used tool IDs from history
  const recentToolIds = Array.from(new Set(historyList.map((h) => h.toolId))).slice(0, 5);
  const recentQuickTools = TOOLS_REGISTRY.filter((t) => recentToolIds.includes(t.id));

  return (
    <div className="relative">
      {/* Header History Button Trigger */}
      <button
        onClick={handleOpenToggle}
        className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:bg-muted/50 h-10 w-10 border-2 border-border bg-transparent cursor-pointer relative rounded-none"
        aria-label="View activity and favorites"
      >
        <Clock className="h-5 w-5 text-foreground" />
        {hasUnread && historyList.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-none" />
            <span className="relative inline-flex h-2 w-2 bg-primary rounded-none" />
          </span>
        )}
      </button>

      {/* Invisible overlay background to close popover on clicking outside */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-transparent"
        />
      )}

      {/* Popover Dropdown Content */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border-2 border-border p-4 shadow-2xl z-50 text-left rounded-none space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
          role="dialog"
          aria-label="Activity and favorites panel"
        >
          {/* Tabs Selector */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-border">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('recents')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer rounded-none flex items-center gap-1.5 ${
                  activeTab === 'recents'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Clock className="h-3 w-3" />
                <span>Recent</span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer rounded-none flex items-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Star className="h-3 w-3" />
                <span>Favorites ({favoritesList.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {activeTab === 'recents' && historyList.length > 0 && (
                <button
                  onClick={handleClear}
                  className="inline-flex items-center justify-center h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-muted/50 border-2 border-border hover:border-destructive transition-colors cursor-pointer rounded-none"
                  title="Clear history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50 border-2 border-border hover:border-primary transition-colors cursor-pointer rounded-none"
                aria-label="Close panel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Launch Bar for Recents */}
          {activeTab === 'recents' && recentQuickTools.length > 0 && (
            <div className="p-2 bg-muted/20 border border-border space-y-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                Quick Re-launch:
              </span>
              <div className="flex flex-wrap gap-1">
                {recentQuickTools.map((rt) => (
                  <Link
                    key={rt.id}
                    href={`/tools/${rt.id}`}
                    onClick={() => setIsOpen(false)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-background border border-border text-foreground hover:border-primary hover:text-primary transition-colors truncate max-w-[120px]"
                  >
                    {rt.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1: Recent Activity Log */}
          {activeTab === 'recents' && (
            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {historyList.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                  <Clock className="h-7 w-7 text-muted-foreground/30" />
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">No recent activity</p>
                  <p className="text-[10px] text-muted-foreground/60 max-w-[200px] leading-relaxed">
                    Actions performed across our browser utilities will appear here locally.
                  </p>
                </div>
              ) : (
                historyList.map((item) => {
                  const timeStr = new Date(item.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  return (
                    <div 
                      key={item.id} 
                      className="border-2 border-border p-2.5 bg-muted/10 flex flex-col gap-1.5 relative transition-colors duration-150 hover:border-primary/40 rounded-none"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <Link 
                            href={`/tools/${item.toolId}`}
                            onClick={() => setIsOpen(false)}
                            className="text-[9px] font-extrabold uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1 leading-none"
                          >
                            {item.toolName}
                            <ExternalLink className="h-2 w-2" />
                          </Link>
                          <span className="text-xs font-bold text-foreground mt-0.5 leading-tight">
                            {item.action}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground/60 shrink-0">
                          {timeStr}
                        </span>
                      </div>

                      {item.details && (
                        <div className="flex items-center justify-between gap-2 bg-background border border-border px-2 py-0.5 text-[10px] text-muted-foreground rounded-none">
                          <span className="truncate font-mono select-all flex-1">
                            {item.details}
                          </span>
                          <button
                            onClick={() => handleCopy(item.id, item.details || '')}
                            className="shrink-0 text-muted-foreground hover:text-primary border border-border hover:border-primary p-0.5 transition-colors cursor-pointer rounded-none"
                            title="Copy details"
                          >
                            {copiedId === item.id ? (
                              <Check className="h-3 w-3 text-primary" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: Pinned Favorites */}
          {activeTab === 'favorites' && (
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {favoritedTools.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                  <Star className="h-7 w-7 text-muted-foreground/30" />
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">No favorited tools</p>
                  <p className="text-[10px] text-muted-foreground/60 max-w-[200px] leading-relaxed">
                    Click the &quot;Favorite&quot; button on any tool header to pin it here for quick access.
                  </p>
                </div>
              ) : (
                favoritedTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-2.5 bg-muted/10 border-2 border-border flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <Link
                      href={`/tools/${tool.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex-1 min-w-0 space-y-0.5"
                    >
                      <span className="text-xs font-black text-foreground hover:text-primary transition-colors block truncate">
                        {tool.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {tool.description}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        toggleFavorite(tool.id);
                        setFavoritesList(getFavorites());
                      }}
                      className="text-amber-500 hover:text-muted-foreground p-1 border border-border bg-background cursor-pointer"
                      title="Remove favorite"
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryDrawer;
