'use client';

import { ReactNode } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusBannerProps {
  type: 'success' | 'error';
  message: string | ReactNode;
  className?: string;
}

export function StatusBanner({
  type,
  message,
  className = ""
}: StatusBannerProps) {
  const isSuccess = type === 'success';

  return (
    <div className={`p-4 rounded-none text-xs font-bold border-2 leading-relaxed flex items-start gap-2.5 ${
      isSuccess 
        ? 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-600/30' 
        : 'bg-destructive/5 text-destructive border-destructive/30'
    } ${className}`}>
      {isSuccess ? (
        <>
          <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="flex-1">{message}</div>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-destructive" />
          <div className="flex-1">{message}</div>
        </>
      )}
    </div>
  );
}
