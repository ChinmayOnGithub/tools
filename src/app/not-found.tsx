import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[50vh] px-4">
      <div className="mb-6 text-amber-500" role="img" aria-label="Warning label">
        <AlertTriangle className="h-12 w-12 mx-auto" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 text-base text-muted-foreground max-w-md leading-relaxed">
        The tool or page you are looking for does not exist or has been moved. All core utilities are registered on our homepage.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center border-2 border-primary bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
