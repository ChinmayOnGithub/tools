'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Clipboard } from 'lucide-react';

interface InputPanelProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onPasteClick?: () => void;
  className?: string;
}

export function InputPanel({ 
  title, 
  children, 
  actions, 
  onPasteClick, 
  className 
}: InputPanelProps) {
  return (
    <Card className={cn("rounded-none border border-border card-depth-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-border/50 bg-muted/10">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-3">
          {onPasteClick && (
            <button
              onClick={onPasteClick}
              className="inline-flex items-center gap-1 px-2 py-0.5 border border-border bg-background text-[9px] font-extrabold uppercase tracking-widest hover:border-primary hover:text-primary transition-all cursor-pointer rounded-none"
              title="Paste from clipboard"
              type="button"
            >
              <Clipboard className="h-3 w-3" />
              <span>Paste</span>
            </button>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

export default InputPanel;
