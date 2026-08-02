import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cpu, Key, FileText, CheckCircle2 } from 'lucide-react';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'About Us - Privacy-First Browser Utilities',
  description: 'Learn about our local client-side processing architecture. CoolTools runs entirely inside your browser tab to secure your files and private data.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="w-full space-y-10 py-4">
      {/* Header section */}
      <section className="space-y-4 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          About CoolTools
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          CoolTools is a growing collection of professional browser-native utilities built to respect your privacy. 
          Everything runs entirely inside your local device using modern client-side browser APIs.
        </p>
      </section>

      {/* Trust Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border-2 border-border p-6 card-depth-1">
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground mb-2">100% Client-Side</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your files and data never touch external servers. All operations happen in local browser sandbox memory, keeping your documents and secrets secure.
          </p>
        </div>

        <div className="bg-card border-2 border-border p-6 card-depth-1">
          <div className="h-10 w-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Cpu className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground mb-2">Instant Operations</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Eliminates upload and download delay. Our tools compute calculations instantly in local memory for speed and efficiency.
          </p>
        </div>

        <div className="bg-card border-2 border-border p-6 card-depth-1">
          <div className="h-10 w-10 bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
            <Key className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground mb-2">No Registration Required</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No accounts, subscriptions, or login screens. Immediate utility access with zero tracking cookies or authentication hurdles.
          </p>
        </div>

        <div className="bg-card border-2 border-border p-6 card-depth-1">
          <div className="h-10 w-10 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground mb-2">Built for Professionals</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Engineered for developers, students, and professionals requiring rapid, privacy-compliant text formatting, UUID generation, PDF operations, or clock widgets.
          </p>
        </div>
      </section>

      {/* Collection Checklist */}
      <section className="bg-muted/30 border border-border p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Our Core Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-muted-foreground font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>Developer formatting & UUID utilities</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>Text analysis & casing editors</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>Browser-native PDF merge & split tools</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>Productivity timers and clock frames</span>
          </div>
        </div>
      </section>

      {/* Publisher Identity & Editorial Standards */}
      <section className="bg-card border-2 border-border p-6 space-y-4 card-depth-1">
        <h2 className="text-lg font-extrabold text-foreground">Publisher Identity & Editorial Commitment</h2>
        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">CoolTools Platform</strong> is designed, maintained, and published independently by <strong className="text-foreground">Chinmay Patil</strong>. Our primary mission is to eliminate data privacy concerns associated with server-side online utilities by providing open-source, client-side web tools.
          </p>
          <p>
            Every utility on this platform adheres to strict quality benchmarks: zero background data collection, 100% browser sandbox isolation, RFC/ISO standard compliance, and transparent open-source code verification.
          </p>
        </div>
      </section>

      <section className="text-center pt-4">
        <Link 
          href="/" 
          className="inline-flex h-10 items-center justify-center border-2 border-primary bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Explore Available Tools
        </Link>
      </section>

      <AdContainer slot="bottom" />
    </div>
  );
}
