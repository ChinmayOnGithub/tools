import { Metadata } from 'next';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'Terms of Service - CoolTools',
  description: 'Read the terms of service governing the usage of CoolTools browser utilities. Safe, local processing with zero warranty or server uploads.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="w-full space-y-8 py-4">
      {/* Page Header Card */}
      <header className="border-2 border-border bg-card p-6 sm:p-8 rounded-none card-depth-2 mb-8 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl pl-2">
          Terms of Service
        </h1>
        <p className="text-xs font-normal italic text-muted-foreground pl-2">
          Last updated: June 28, 2026
        </p>
      </header>

      {/* Single Unified Legal Document Sheet */}
      <main className="border-2 border-border bg-card p-6 sm:p-10 rounded-none card-depth-2 space-y-8 text-sm text-muted-foreground/90 leading-relaxed font-medium">
        <p className="pb-4 border-b-2 border-border/40">
          Welcome to CoolTools. By accessing and using our browser-based utility tools, you agree to comply with and be bound by the following terms.
        </p>

        {/* 1. User License */}
        <div className="space-y-3 pb-6 border-b-2 border-border/40">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            1. User License &amp; Local Execution
          </h2>
          <p>
            CoolTools provides free browser-native utilities. 
            All processing is performed directly in your local browser sandbox. 
            We grant you a personal, non-exclusive, non-transferable license to utilize these services for both personal and professional software engineering, educational, or design purposes.
          </p>
        </div>

        {/* 2. Data Sovereignty */}
        <div className="space-y-3 pb-6 border-b-2 border-border/40">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            2. Data Sovereignty
          </h2>
          <p>
            You retain absolute ownership of all input parameters, values, and files processed through the tools. 
            We do not store, copy, or monitor your document variables.
          </p>
        </div>

        {/* 3. Disclaimers */}
        <div className="space-y-3 pb-6 border-b-2 border-border/40">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            3. Disclaimers &amp; Limit of Liability
          </h2>
          <p className="uppercase text-xs font-bold text-foreground/80 leading-normal">
            ALL UTILITIES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTY OF ANY KIND, EXPRESSED OR IMPLIED. 
            WE DO NOT GUARANTEE THAT UTILITY OUTPUTS ARE FREE OF ERRORS. 
            IN NO EVENT SHALL COOLTOOLS BE LIABLE FOR SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE PERFORMANCE OF COMPILER CONVERSIONS OR FILE WRITES.
          </p>
        </div>

        {/* 4. Policy Changes */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            4. Policy Changes
          </h2>
          <p>
            We reserve the right to add new browser utilities, alter existing interfaces, or update terms at any time.
          </p>
        </div>
      </main>

      <AdContainer slot="bottom" />
    </div>
  );
}
