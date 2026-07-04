'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Trash2, Copy, Check, X, ExternalLink } from 'lucide-react';
import { getHistory, clearHistory, HistoryEntry } from '@/lib/history';

export function HistoryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  return (
    <>
      {/* Header History Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center text-sm font-medium transition-colors hover:bg-muted/50 h-10 w-10 border-2 border-border bg-transparent cursor-pointer relative"
        aria-label="View activity history"
      >
        <Clock className="h-5 w-5 text-foreground" />
        {historyList.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        )}
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-200"
        />
      )}

      {/* Drawer Content */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-background border-l-2 border-border p-6 shadow-2xl transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Activity History</h2>
            </div>
            <div className="flex items-center gap-1">
              {historyList.length > 0 && (
                <button
                  onClick={handleClear}
                  className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted/50 border border-transparent transition-colors cursor-pointer"
                  title="Clear history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {historyList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Clock className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-xs font-semibold text-muted-foreground">No recent activity</p>
                <p className="text-[10px] text-muted-foreground/60 max-w-[200px]">
                  Actions performed across generators, formatters, and compilers appear here locally.
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
                    className="border-2 border-border p-3 bg-muted/10 flex flex-col gap-2 relative transition-colors duration-150 hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col min-w-0">
                        <Link 
                          href={`/tools/${item.toolId}`}
                          onClick={() => setIsOpen(false)}
                          className="text-[10px] font-extrabold uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {item.toolName}
                          <ExternalLink className="h-2 w-2" />
                        </Link>
                        <span className="text-xs font-bold text-foreground mt-0.5 leading-tight">
                          {item.action}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground/60 shrink-0 mt-0.5">
                        {timeStr}
                      </span>
                    </div>

                    {item.details && (
                      <div className="flex items-center justify-between gap-2 bg-background/50 border border-border px-2 py-1 text-[10px] text-muted-foreground">
                        <span className="truncate font-mono select-all">
                          {item.details}
                        </span>
                        <button
                          onClick={() => handleCopy(item.id, item.details || '')}
                          className="shrink-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          title="Copy details"
                        >
                          {copiedId === item.id ? (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
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
      </div>
    </>
  );
}

export default HistoryDrawer;
