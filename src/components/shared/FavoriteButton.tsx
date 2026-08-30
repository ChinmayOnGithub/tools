'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

interface FavoriteButtonProps {
  toolId: string;
  className?: string;
}

export function FavoriteButton({ toolId, className = '' }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFavorited(isFavorite(toolId));
    }, 0);

    const handleUpdate = () => {
      setFavorited(isFavorite(toolId));
    };

    window.addEventListener('cooltools_favorites_update', handleUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('cooltools_favorites_update', handleUpdate);
    };
  }, [toolId]);

  const handleToggle = () => {
    const next = toggleFavorite(toolId);
    setFavorited(next);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer select-none rounded-none ${
        favorited
          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          : 'bg-muted/20 text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
      } ${className}`}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`h-3.5 w-3.5 ${favorited ? 'fill-current text-amber-500' : ''}`} />
      <span>{favorited ? 'Favorited' : 'Favorite'}</span>
    </button>
  );
}
