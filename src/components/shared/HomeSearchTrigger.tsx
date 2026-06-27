'use client';

import { Search } from 'lucide-react';

export function HomeSearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 w-full max-w-lg h-12 rounded-xl border bg-card px-4 text-sm text-muted-foreground shadow-sm hover:bg-muted/30 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Open search dialog"
    >
      <Search className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1">Search 100+ private browser tools...</span>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        /
      </kbd>
    </button>
  );
}

export default HomeSearchTrigger;
