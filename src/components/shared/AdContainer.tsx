'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdContainerProps {
  slot?: 'top' | 'middle' | 'sidebar' | 'bottom';
  className?: string;
}

export function AdContainer({ slot = 'middle', className = '' }: AdContainerProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  
  // Map slots to corresponding Env Slot IDs
  const getSlotId = (slotName: string) => {
    switch (slotName) {
      case 'top': return process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP;
      case 'middle': return process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE;
      case 'sidebar': return process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR;
      case 'bottom': return process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM;
      default: return undefined;
    }
  };

  const adSlot = getSlotId(slot);
  const showAds = !!(adClient && adSlot);

  useEffect(() => {
    if (!showAds) return;
    try {
      // Initialize the AdSense unit
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense initialization failed:', err);
    }
  }, [showAds]);

  // CSS classes for Ad units to match Google standards and prevent layout shift
  const sizeClasses = {
    top: 'min-h-[90px] max-w-4xl mx-auto', // Leaderboard 728x90
    middle: 'min-h-[250px]', // Medium Rectangle 300x250
    sidebar: 'min-h-[600px]', // Half Page 300x600
    bottom: 'min-h-[90px] max-w-4xl mx-auto', // Leaderboard 728x90
  };

  // If live AdSense is not configured, show a visual placeholder block for layout preview
  if (!showAds) {
    return (
      <div 
        className={`w-full ${sizeClasses[slot]} bg-muted/15 border-2 border-dashed border-muted flex flex-col items-center justify-center my-6 relative overflow-hidden ${className}`}
        aria-hidden="true" 
      >
        <span className="absolute top-2 left-3 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
          Advertisement
        </span>
        <div className="text-center p-4">
          <p className="text-xs text-muted-foreground font-bold">Google AdSense: {slot.toUpperCase()} Slot Placeholder</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Responsive framework ready. Configure env variables to activate live ads.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${sizeClasses[slot]} my-6 flex justify-center items-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AdContainer;
