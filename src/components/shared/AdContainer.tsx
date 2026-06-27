'use client';

import { useState, useEffect } from 'react';

export function AdContainer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="w-full min-h-[250px] bg-muted/20 border border-dashed border-muted rounded-lg flex items-center justify-center my-6" 
        aria-hidden="true" 
      />
    );
  }

  return (
    <div className="w-full min-h-[250px] bg-muted/10 border border-dashed border-muted/50 rounded-lg flex flex-col items-center justify-center my-6 relative overflow-hidden">
      <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        Advertisement
      </span>
      <div className="text-center p-4">
        <p className="text-xs text-muted-foreground">Google AdSense Placement Placeholder</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">CLS Prevention Active (Fixed Sizing)</p>
      </div>
    </div>
  );
}

export default AdContainer;
