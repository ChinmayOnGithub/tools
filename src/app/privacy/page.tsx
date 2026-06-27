import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Privacy-First Browser Tools',
  description: 'Review the privacy-first policy of CoolTools. We process all files, text, and data locally in your browser memory. Zero files are uploaded.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: June 28, 2026</p>
      </section>

      <section className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          At CoolTools, privacy is not a feature; it is our core product philosophy. 
          This Privacy Policy explains how we ensure your data remains secure while using our browser-based utility tools.
        </p>

        <hr className="border-border" />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Zero Server Uploads</h2>
          <p>
            Unlike typical online conversion platforms, CoolTools does **not** upload your documents, files, or text values to external servers. 
            All parsing, conversions, and generation happen locally inside your web browser sandbox memory.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Offline Capabilities</h2>
          <p>
            Because all calculators, code beautifiers, and converters execute locally, the platform works 100% offline without active internet connections once loaded in your browser. 
            No backend services or API routes are used for calculations.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. LocalStorage Caching</h2>
          <p>
            Certain components (like custom durations on the Pomodoro timer) write configuration settings to your browser&apos;s HTML5 `localStorage` buffer. 
            This configuration data remains in your local sandbox and is never shared, synced, or sent to cloud databases.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Anonymous Analytics</h2>
          <p>
            To monitor site load speeds, errors, and tool usage frequencies, we load basic telemetry analytics (Google Analytics 4 and Microsoft Clarity) only in production builds. 
            No personal data, user documents, inputs, or generated outputs are recorded or shared with these metrics.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Contact Information</h2>
          <p>
            For privacy questions or repository feedback, contact us directly at{' '}
            <a href="mailto:contact@chinmaypatil.com" className="text-primary hover:underline font-semibold">
              contact@chinmaypatil.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
