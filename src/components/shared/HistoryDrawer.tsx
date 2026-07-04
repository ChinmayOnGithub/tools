'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Trash2, Copy, Check, X, ExternalLink } from 'lucide-react';
import { getHistory, clearHistory, HistoryEntry } from '@/lib/history';

export function HistoryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastViewed, setLastViewed] = useState<number>(0);

  // Sync with localStorage on mount and updates
  useEffect(() => {
    const handleUpdate = () => {
      setHistoryList(getHistory());
    };

    handleUpdate(); // Initial load
    window.addEventListener('tool_history_update', handleUpdate);
    return () => {
      window.removeEventListener('tool_history_update', handleUpdate);
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

  return (
    <div className="relative">
      {/* Header History Button Trigger */}
      <button
        onClick={handleOpenToggle}
        className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:bg-muted/50 h-10 w-10 border-2 border-border bg-transparent cursor-pointer relative rounded-none"
        aria-label="View activity history"
      >
        <Clock className="h-5 w-5 text-foreground" />
        {hasUnread && historyList.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-none"></span>
            <span className="relative inline-flex h-2 w-2 bg-primary rounded-none"></span>
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
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border-2 border-border p-4 shadow-2xl z-50 text-left rounded-none space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          role="dialog"
          aria-label="Activity history panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Recent Activity</h2>
            </div>
            <div className="flex items-center gap-1.5">
              {historyList.length > 0 && (
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

          {/* List scroll container */}
          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {historyList.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                <Clock className="h-7 w-7 text-muted-foreground/30" />
                <p className="text-[10px] font-bold uppercase text-muted-foreground">No activity logs</p>
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
                    className="border-2 border-border p-3 bg-muted/10 flex flex-col gap-2 relative transition-colors duration-150 hover:border-primary/40 rounded-none"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col min-w-0">
                        <Link 
                          href={`/tools/${item.toolId}`}
                          onClick={() => setIsOpen(false)}
                          className="text-[9px] font-extrabold uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1 leading-none"
                        >
                          {item.toolName}
                          <ExternalLink className="h-2 w-2" />
                        </Link>
                        <span className="text-xs font-bold text-foreground mt-1 leading-tight">
                          {item.action}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground/60 shrink-0 mt-0.5">
                        {timeStr}
                      </span>
                    </div>

                    {item.details && (
                      <div className="flex items-center justify-between gap-2 bg-background border border-border px-2 py-1 text-[10px] text-muted-foreground rounded-none">
                        <span className="truncate font-mono select-all flex-1">
                          {item.details}
                        </span>
                        <button
                          onClick={() => handleCopy(item.id, item.details || '')}
                          className="shrink-0 text-muted-foreground hover:text-primary border border-border hover:border-primary p-1 transition-colors cursor-pointer rounded-none"
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
        </div>
      )}
    </div>
  );
}

export default HistoryDrawer;
