'use client';

import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  id: string; // Unique log ID
  toolId: string;
  toolName: string;
  timestamp: string; // ISO string
  actionLabel: string; // e.g. "Formatted JSON", "Generated 5 UUIDs"
  metricText?: string; // e.g. "4.2 KB", "1,200 chars", "2.1 MB"
}

export function useWorkspace() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedFavs = localStorage.getItem('workspace_favorites');
        if (storedFavs) setFavorites(JSON.parse(storedFavs));

        const storedRecents = localStorage.getItem('workspace_recents');
        if (storedRecents) setRecents(JSON.parse(storedRecents));

        const storedHistory = localStorage.getItem('workspace_history');
        if (storedHistory) setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to load workspace data', e);
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync favorites
  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      localStorage.setItem('workspace_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  // Add tool to Recents list (last 10 unique tools)
  const addRecent = useCallback((toolId: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const next = [toolId, ...filtered].slice(0, 10);
      localStorage.setItem('workspace_recents', JSON.stringify(next));
      return next;
    });
  }, []);

  // Add item to Local History log (max 30 items)
  const addHistoryItem = useCallback((toolId: string, toolName: string, actionLabel: string, metricText?: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      toolId,
      toolName,
      timestamp: new Date().toISOString(),
      actionLabel,
      metricText,
    };

    setHistory((prev) => {
      const next = [newItem, ...prev].slice(0, 30);
      localStorage.setItem('workspace_history', JSON.stringify(next));
      return next;
    });
  }, []);

  // Clear entire local history log
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('workspace_history');
  }, []);

  return {
    favorites,
    recents,
    history,
    loaded,
    toggleFavorite,
    addRecent,
    addHistoryItem,
    clearHistory,
  };
}
