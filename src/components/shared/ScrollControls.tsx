'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function ScrollControls() {
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show controls when scrolled more than 300px
      setShowControls(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (!showControls) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <button
        onClick={scrollToTop}
        className="h-11 w-11 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 flex items-center justify-center card-depth-2 hover:card-depth-3 group"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
      <button
        onClick={scrollToBottom}
        className="h-11 w-11 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 flex items-center justify-center card-depth-2 hover:card-depth-3 group"
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ScrollControls;
