'use client';

import { useState, useEffect } from 'react';

interface AdContainerProps {
  slot?: 'top' | 'middle' | 'sidebar' | 'bottom';
  className?: string;
}

const SHOW_ADS = false; // Toggle to true when live AdSense ads are configured

export function AdContainer({ slot = 'middle', className = '' }: AdContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!SHOW_ADS) return;
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Different sizes based on slot position for optimal ad performance
  const sizeClasses = {
    top: 'h-[90px] max-w-4xl mx-auto', // Leaderboard 728x90
    middle: 'h-[250px]', // Medium Rectangle 300x250
    sidebar: 'h-[600px]', // Half Page 300x600
    bottom: 'h-[90px] max-w-4xl mx-auto', // Leaderboard 728x90
  };

  if (!SHOW_ADS) {
    return null;
  }

  if (!mounted) {
    return (
      <div 
        className={`w-full ${sizeClasses[slot]} bg-muted/20 border-2 border-dashed border-muted flex items-center justify-center my-6 ${className}`}
        aria-hidden="true" 
      />
    );
  }

  return (
    <div className={`w-full ${sizeClasses[slot]} bg-muted/5 border-2 border-dashed border-muted/30 flex flex-col items-center justify-center my-6 relative overflow-hidden ${className}`}>
      <span className="absolute top-2 left-3 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
        Advertisement
      </span>
      <div className="text-center p-4">
        <p className="text-xs text-muted-foreground font-medium">Google AdSense Slot: {slot.toUpperCase()}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">Fixed sizing prevents layout shift</p>
      </div>
    </div>
  );
}

export default AdContainer;
