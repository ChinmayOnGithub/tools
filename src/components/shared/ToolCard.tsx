'use client';

import Link from 'next/link';
import { Icon } from './Icon';
import { ArrowUpRight } from 'lucide-react';
import { ToolEntry } from '@/config/tools-registry';
import { CATEGORIES } from '@/config/categories';
import { trackRelatedToolClick } from '@/lib/analytics';

interface ToolCardProps {
  tool: ToolEntry;
  trackingLabel?: string;
}

const CATEGORY_COLOR_MAP: Record<string, {
  bar: string;
  iconBg: string;
  badge: string;
  borderHover: string;
  textHover: string;
}> = {
  red: {
    bar: 'bg-red-500',
    iconBg: 'bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-500 group-hover:text-white',
    badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
    borderHover: 'hover:border-red-500',
    textHover: 'group-hover:text-red-600 dark:group-hover:text-red-400',
  },
  blue: {
    bar: 'bg-blue-500',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    borderHover: 'hover:border-blue-500',
    textHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
  },
  emerald: {
    bar: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    borderHover: 'hover:border-emerald-500',
    textHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
  },
  orange: {
    bar: 'bg-orange-500',
    iconBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white',
    badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
    borderHover: 'hover:border-orange-500',
    textHover: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
  },
  violet: {
    bar: 'bg-violet-500',
    iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white',
    badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
    borderHover: 'hover:border-violet-500',
    textHover: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
  },
  amber: {
    bar: 'bg-amber-500',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    borderHover: 'hover:border-amber-500',
    textHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
  },
};

export function ToolCard({ tool, trackingLabel }: ToolCardProps) {
  const isPublished = tool.status === 'published';
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const colorKey = category?.color || 'orange';
  const colors = CATEGORY_COLOR_MAP[colorKey] || CATEGORY_COLOR_MAP.orange;

  const getStatusBadge = (status: ToolEntry['status']) => {
    const badges = {
      planned: { text: 'Planned', color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20' },
      draft: { text: 'Draft', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20' },
      'in-development': { text: 'In Dev', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
      testing: { text: 'Testing', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' },
      published: { text: 'Active', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' },
      maintenance: { text: 'Maintenance', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20' },
    };
    return badges[status];
  };

  const statusBadge = getStatusBadge(tool.status);

  const handleClick = () => {
    if (trackingLabel) {
      const parts = trackingLabel.split(' -> ');
      if (parts.length === 2) {
        trackRelatedToolClick(parts[0], parts[1]);
      }
    }
  };

  return (
    <Link href={`/tools/${tool.id}`} className="group block" onClick={handleClick}>
      <div className={`relative h-full bg-card border-2 transition-all duration-200 overflow-hidden ${
        isPublished 
          ? `border-border ${colors.borderHover} card-depth-1 hover:card-depth-2 hover:-translate-y-0.5` 
          : 'border-muted bg-muted/5 opacity-75 hover:opacity-100'
      }`}>
        
        {/* Top accent bar */}
        <div className={`h-1 w-full ${isPublished ? colors.bar : 'bg-muted'}`} />
        
        <div className="p-5">
          {/* Icon and status row */}
          <div className="flex items-start justify-between mb-4">
            <div className={`h-12 w-12 flex items-center justify-center shrink-0 transition-all duration-200 ${
              isPublished 
                ? colors.iconBg
                : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name={tool.icon} className="h-6 w-6" />
            </div>
            
            {isPublished && (
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          {/* Category and badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-[10px] px-2 py-1 border uppercase tracking-wider font-bold ${colors.badge}`}>
              {category?.title || tool.category}
            </span>
            {!isPublished && (
              <span className={`text-[10px] px-2 py-1 border uppercase tracking-wider font-bold ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-base font-bold mb-2 line-clamp-1 transition-colors ${
            isPublished ? `text-foreground ${colors.textHover}` : 'text-muted-foreground'
          }`}>
            {tool.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Bottom status indicator for published tools */}
        {isPublished && (
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.bar} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
        )}
      </div>
    </Link>
  );
}

export default ToolCard;
