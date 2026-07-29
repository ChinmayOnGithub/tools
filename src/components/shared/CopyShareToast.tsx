'use client';

import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface CopyShareToastProps {
  show: boolean;
  onClose: () => void;
  message?: string;
}

export default function CopyShareToast({ show, onClose, message = 'Copied result to clipboard!' }: CopyShareToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
      <div className="bg-card border-2 border-primary p-4 shadow-2xl card-depth-2 flex items-start gap-3 relative">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1 pr-6">
          <p className="text-xs font-extrabold text-foreground">{message}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">🔒 100% Client-Side.</span> Press <kbd className="px-1 py-0.5 bg-muted border border-border text-[10px] font-mono font-bold">Ctrl+D</kbd> to bookmark this tool for instant access.
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
