import React from 'react';
import { Info, AlertTriangle, Lightbulb, ShieldAlert, AlertCircle } from 'lucide-react';

interface DocsCalloutProps {
  variant?: 'info' | 'warning' | 'tip' | 'security' | 'important';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const CALLOUT_STYLES = {
  info: {
    border: 'border-blue-500/40 bg-blue-500/5',
    icon: Info,
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-600 dark:text-blue-400',
    defaultTitle: 'Note',
  },
  warning: {
    border: 'border-amber-500/40 bg-amber-500/5',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-600 dark:text-amber-400',
    defaultTitle: 'Warning',
  },
  tip: {
    border: 'border-emerald-500/40 bg-emerald-500/5',
    icon: Lightbulb,
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-600 dark:text-emerald-400',
    defaultTitle: 'Tip',
  },
  security: {
    border: 'border-purple-500/40 bg-purple-500/5',
    icon: ShieldAlert,
    iconColor: 'text-purple-500',
    titleColor: 'text-purple-600 dark:text-purple-400',
    defaultTitle: 'Security Note',
  },
  important: {
    border: 'border-primary/40 bg-primary/5',
    icon: AlertCircle,
    iconColor: 'text-primary',
    titleColor: 'text-primary font-black',
    defaultTitle: 'Important',
  },
};

export default function DocsCallout({
  variant = 'info',
  title,
  children,
  className = '',
}: DocsCalloutProps) {
  const style = CALLOUT_STYLES[variant] || CALLOUT_STYLES.info;
  const IconComp = style.icon;

  return (
    <aside
      className={`border-l-4 border-2 p-4 my-4 ${style.border} ${className}`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <IconComp className={`h-4 w-4 ${style.iconColor} shrink-0 mt-0.5`} />
        <div className="space-y-1 text-xs leading-relaxed">
          <strong className={`block font-bold text-[11px] uppercase tracking-wider ${style.titleColor}`}>
            {title || style.defaultTitle}
          </strong>
          <div className="text-foreground/90 font-medium">{children}</div>
        </div>
      </div>
    </aside>
  );
}
