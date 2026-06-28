'use client';

import { Search } from 'lucide-react';

export function HomeSearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 w-full max-w-lg h-14 border-2 border-border bg-card px-5 text-sm text-muted-foreground card-depth-1 hover:card-depth-2 hover:border-primary/50 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Open search dialog"
    >
      <Search className="h-5 w-5 text-primary" />
      <span className="flex-1 font-medium">Search professional browser tools...</span>
      <kbd className="hidden sm:inline-flex h-6 select-none items-center justify-center gap-0.5 border-2 border-border bg-muted px-2 font-mono text-[11px] font-bold text-muted-foreground">
        /
      </kbd>
    </button>
  );
}

export default HomeSearchTrigger;
