import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring select-none",
        variant === 'default' && "border-primary bg-primary text-primary-foreground",
        variant === 'secondary' && "border-border bg-secondary text-secondary-foreground",
        variant === 'destructive' && "border-destructive bg-destructive text-destructive-foreground",
        variant === 'outline' && "border-border text-foreground",
        className
      )}
      {...props}
    />
  );
}
