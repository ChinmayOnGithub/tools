'use client';

import { useEffect } from 'react';

interface ShortcutConfig {
  onRun?: () => void;
  onCopy?: () => void;
  onClear?: () => void;
  onFocusInput?: () => void;
  onToggleSearch?: () => void;
  onEscape?: () => void;
}

export function useGlobalShortcuts({
  onRun,
  onCopy,
  onClear,
  onFocusInput,
  onToggleSearch,
  onEscape,
}: ShortcutConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close overlays / reset dialogs
      if (e.key === 'Escape') {
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        return;
      }

      // Ctrl + K to toggle search
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        if (onToggleSearch) {
          e.preventDefault();
          onToggleSearch();
        }
        return;
      }

      // Ctrl + / to focus input area
      if (e.ctrlKey && e.key === '/') {
        if (onFocusInput) {
          e.preventDefault();
          onFocusInput();
        }
        return;
      }

      // Ctrl + Enter to run/execute
      if (e.ctrlKey && e.key === 'Enter') {
        if (onRun) {
          e.preventDefault();
          onRun();
        }
        return;
      }

      // Ctrl + L to clear/reset inputs
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        // Prevent default browser URL bar focus on Ctrl+L
        if (onClear) {
          e.preventDefault();
          onClear();
        }
        return;
      }

      // Ctrl + Shift + C or custom Copy hotkey (optional custom logic, standard Ctrl+C left for browser selection copy)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        if (onCopy) {
          e.preventDefault();
          onCopy();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onRun, onCopy, onClear, onFocusInput, onToggleSearch, onEscape]);
}
