'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface OutputPanelProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function OutputPanel({ title, children, actions, className }: OutputPanelProps) {
  return (
    <Card className={cn("rounded-none border border-border card-depth-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-border/50 bg-muted/10">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

export default OutputPanel;
