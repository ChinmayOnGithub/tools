'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon } from 'lucide-react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('App-level error caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[50vh] px-4">
      <div className="mb-6 text-destructive" role="img" aria-label="Error symbol">
        <AlertOctagon className="h-12 w-12 mx-auto" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Application Error
      </h1>
      <p className="mt-4 text-base text-muted-foreground max-w-md leading-relaxed">
        The application encountered an unexpected error. No data was leaked or uploaded. Please try reloading.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center border-2 border-primary bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center border-2 border-border bg-background px-6 text-sm font-bold transition-all hover:bg-accent hover:text-accent-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
