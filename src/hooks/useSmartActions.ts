'use client';

import { useEffect, useRef } from 'react';

interface SmartActionsConfig {
  value: string;
  onPasteAction: (pastedText: string) => void;
  focusSelector?: string;
}

export function useSmartActions({
  value,
  onPasteAction,
  focusSelector = 'textarea',
}: SmartActionsConfig) {
  const isFirstMount = useRef(true);

  // Autofocus the input element on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      const timer = setTimeout(() => {
        const inputEl = document.querySelector(focusSelector) as HTMLTextAreaElement | HTMLInputElement;
        if (inputEl) {
          inputEl.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusSelector]);

  // Smart Paste Handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalPaste = (e: ClipboardEvent) => {
      // If the user is actively focused on an input/textarea, do not intercept paste
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // If there is already text inputted, do not override
      if (value.trim()) return;

      const pastedText = e.clipboardData?.getData('text');
      if (pastedText) {
        e.preventDefault();
        onPasteAction(pastedText);

        // Refocus the input field
        const inputEl = document.querySelector(focusSelector) as HTMLTextAreaElement | HTMLInputElement;
        if (inputEl) {
          inputEl.focus();
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [value, onPasteAction, focusSelector]);
}
