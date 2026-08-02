'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActionBarProps {
  children: ReactNode;
  className?: string;
}

export function ActionBar({ children, className }: ActionBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 border border-border rounded-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export default ActionBar;
