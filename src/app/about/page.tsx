import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cpu, Code2, Lock, ExternalLink, Terminal } from 'lucide-react';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'About Us - Privacy-First Browser Utilities & Developer Tools',
  description: 'Learn about our local client-side processing architecture, open web standards, and developer trust model. CoolTools processes data in your browser tab without tool-processing servers.',
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
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          CoolTools is an open-source web utilities platform built by an independent developer for programmers, designers, and privacy-conscious users. The platform hosts two distinct types of utilities: <strong>Browser-Local Tools</strong> that execute computations entirely inside your device memory without server uploads, and <strong>Live Public API Tools</strong> that retrieve current information directly from official public data providers.
        </p>
      </section>

      {/* Trust Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-2">
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Client-Side Processing</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your files, JSON payloads, tokens, and documents are handled in local browser memory via standard FileReader, Canvas, and WebAssembly APIs. No backend tool-processing API receives or stores your input data.
          </p>
        </div>

        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-2">
          <div className="h-10 w-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
            <Cpu className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">WebAssembly &amp; Web Crypto</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We utilize standard browser capabilities—including the W3C Web Crypto API for CSPRNG passwords and SHA digests, pdf-lib for document restructuring, and Ghostscript WASM for PDF optimization.
          </p>
        </div>

        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-2">
          <div className="h-10 w-10 bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-2">
            <Code2 className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Standards Alignment</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Where applicable, tools implement authoritative specifications such as RFC 8259 (JSON), RFC 7519 (JWT), RFC 4122 (UUIDv4), RFC 3986 (URI), and Unicode 15.0 guidelines.
          </p>
        </div>

        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-2">
          <div className="h-10 w-10 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-foreground">Transparent Verification</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We encourage users to verify all network activity using browser Developer Tools (F12) to confirm that no input data leaves their machine during tool usage.
          </p>
        </div>
      </section>

      {/* How Local Processing Works Step-by-Step */}
      <section className="bg-card border-2 border-border p-6 space-y-4 card-depth-1">
        <h2 className="text-lg font-extrabold text-foreground">How Local Processing Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-muted/20 border border-border space-y-1.5">
            <span className="font-mono text-primary font-bold text-[10px]">STEP 01</span>
            <h3 className="font-bold text-foreground">User Selection</h3>
            <p className="text-muted-foreground leading-relaxed">You paste text or select a file locally on your device.</p>
          </div>
          <div className="p-3.5 bg-muted/20 border border-border space-y-1.5">
            <span className="font-mono text-primary font-bold text-[10px]">STEP 02</span>
            <h3 className="font-bold text-foreground">Browser Memory</h3>
            <p className="text-muted-foreground leading-relaxed">Data is read into JavaScript memory using HTML5 FileReader / ArrayBuffer.</p>
          </div>
          <div className="p-3.5 bg-muted/20 border border-border space-y-1.5">
            <span className="font-mono text-primary font-bold text-[10px]">STEP 03</span>
            <h3 className="font-bold text-foreground">Native Computation</h3>
            <p className="text-muted-foreground leading-relaxed">Algorithms run on your CPU via Web APIs or WebAssembly workers.</p>
          </div>
          <div className="p-3.5 bg-muted/20 border border-border space-y-1.5">
            <span className="font-mono text-primary font-bold text-[10px]">STEP 04</span>
            <h3 className="font-bold text-foreground">Direct Download</h3>
            <p className="text-muted-foreground leading-relaxed">Outputs are rendered or exported directly to your disk with zero network hops.</p>
          </div>
        </div>
        <div className="pt-2 text-xs">
          <Link
            href="/docs/security-network-audit"
            className="text-primary font-bold hover:underline inline-flex items-center gap-1"
          >
            Read our DevTools Network Inspection Guide →
          </Link>
        </div>
      </section>

      {/* Publisher Identity & Open Source */}
      <section className="bg-card border-2 border-border p-6 space-y-4 card-depth-1">
        <h2 className="text-lg font-extrabold text-foreground">Publisher Identity &amp; Open Source Project</h2>
        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">CoolTools Platform</strong> is designed, maintained, and published by <strong className="text-foreground">Chinmay Patil</strong>. The project was created to provide a modern, transparent alternative to legacy online converter websites that unnecessarily upload confidential documents and tokens to private backend servers.
          </p>
          <p>
            The source code is hosted publicly on GitHub. You can inspect the implementation of every tool, review changes, submit bug reports, or contribute improvements directly.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <a
              href="https://github.com/ChinmayOnGithub/tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-border bg-muted/40 text-foreground text-xs font-bold hover:border-primary hover:text-primary transition-all"
            >
              <Terminal className="h-4 w-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            <Link
              href="/contact"
              className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline"
            >
              Contact Developer
            </Link>
          </div>
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
