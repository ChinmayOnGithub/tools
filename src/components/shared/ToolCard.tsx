'use client';

import Link from 'next/link';
import { Icon } from './Icon';
import { ArrowUpRight } from 'lucide-react';
import { ToolEntry } from '@/config/tools-registry';
import { trackRelatedToolClick } from '@/lib/analytics';

interface ToolCardProps {
  tool: ToolEntry;
  trackingLabel?: string;
}

export function ToolCard({ tool, trackingLabel }: ToolCardProps) {
  const isPublished = tool.status === 'published';

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
          ? 'border-border hover:border-primary card-depth-1 hover:card-depth-2 hover:-translate-y-0.5' 
          : 'border-muted bg-muted/5 opacity-75 hover:opacity-100'
      }`}>
        
        {/* Top accent bar */}
        <div className={`h-1 w-full ${isPublished ? 'bg-primary' : 'bg-muted'}`} />
        
        <div className="p-5">
          {/* Icon and status row */}
          <div className="flex items-start justify-between mb-4">
            <div className={`h-12 w-12 flex items-center justify-center shrink-0 transition-all duration-200 ${
              isPublished 
                ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground' 
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
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-1 border border-border uppercase tracking-wider font-bold">
              {tool.category}
            </span>
            {!isPublished && (
              <span className={`text-[10px] px-2 py-1 border uppercase tracking-wider font-bold ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-base font-bold mb-2 line-clamp-1 transition-colors ${
            isPublished ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground'
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
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        )}
      </div>
    </Link>
  );
}

export default ToolCard;
