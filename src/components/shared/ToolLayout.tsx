'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ToolLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export function ToolLayout({ children, sidebar, className }: ToolLayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full", className)}>
      <div className="lg:col-span-2 space-y-6">
        {children}
      </div>
      {sidebar && (
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 space-y-6">
          {sidebar}
        </aside>
      )}
    </div>
  );
}

export default ToolLayout;
