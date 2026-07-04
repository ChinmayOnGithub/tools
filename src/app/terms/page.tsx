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
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: June 28, 2026</p>
      </section>

      <section className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          Welcome to CoolTools. By accessing and using our browser-based utility tools, you agree to comply with and be bound by the following terms.
        </p>

        <hr className="border-border" />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. User License & Local Execution</h2>
          <p>
            CoolTools provides free browser-native utilities. 
            All processing is performed directly in your local browser sandbox. 
            We grant you a personal, non-exclusive, non-transferable license to utilize these services for both personal and professional software engineering, educational, or design purposes.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Data Sovereignty</h2>
          <p>
            You retain absolute ownership of all input parameters, values, and files processed through the tools. 
            We do not store, copy, or monitor your document variables.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Disclaimers & Limit of Liability</h2>
          <p>
            ALL UTILITIES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTY OF ANY KIND, EXPRESSED OR IMPLIED. 
            WE DO NOT GUARANTEE THAT UTILITY OUTPUTS ARE FREE OF ERRORS. 
            IN NO EVENT SHALL COOLTOOLS BE LIABLE FOR SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE PERFORMANCE OF COMPILER CONVERSIONS OR FILE WRITES.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Policy Changes</h2>
          <p>
            We reserve the right to add new browser utilities, alter existing interfaces, or update terms at any time.
          </p>
        </div>
      </section>

      <AdContainer slot="bottom" />
    </div>
  );
}
