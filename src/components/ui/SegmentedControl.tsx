'use client';

import { ReactNode } from 'react';

interface Option<T> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = ""
}: SegmentedControlProps<T>) {
  return (
    <div className={`flex border-2 border-border rounded-none overflow-hidden h-9 w-full ${className}`}>
      {options.map((opt, i) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
              i < options.length - 1 ? 'border-r border-border' : ''
            } ${
              isActive 
                ? 'bg-primary text-primary-foreground font-black' 
                : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted/10'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
