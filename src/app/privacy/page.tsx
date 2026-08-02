import { Metadata } from 'next';
import ResetConsentButton from '@/components/shared/ResetConsentButton';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'Privacy Policy - Privacy-First Browser Tools',
  description:
    'Review the privacy policy of CoolTools. Learn about our 100% local browser-based file processing, Google AdSense cookies, analytics metrics, and data privacy rights.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full space-y-8 py-4">
      {/* Page Header Card */}
      <header className="border-2 border-border bg-card p-6 sm:p-8 rounded-none card-depth-2 mb-8 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl pl-2">
          Privacy Policy
        </h1>
        <p className="text-xs font-normal italic text-muted-foreground pl-2">
          Last updated: June 28, 2026
        </p>
      </header>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
          <div className="border-2 border-border bg-card p-4 rounded-none card-depth-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground mb-4 pb-2 border-b-2 border-border">
              Sections
            </h3>
            <nav className="space-y-3 text-[11px] font-bold text-muted-foreground">
              <a href="#introduction" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                1. Introduction
              </a>
              <a href="#local-processing" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                2. Local Processing
              </a>
              <a href="#cookies-adsense" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                3. Google AdSense Ads
              </a>
              <a href="#analytics-metrics" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                4. Analytics Telemetry
              </a>
              <a href="#local-cache" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                5. Caching &amp; Logs
              </a>
              <a href="#gdpr-ccpa" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                6. GDPR &amp; CCPA Rights
              </a>
              <a href="#coppa-kids" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                7. Children&apos;s Privacy
              </a>
              <a href="#preferences" className="block hover:text-primary hover:translate-x-1 transition-all duration-200">
                8. Consent Dashboard
              </a>
            </nav>
          </div>
        </aside>

        {/* Single Unified Legal Document Sheet */}
        <main className="lg:col-span-3 border-2 border-border bg-card p-6 sm:p-10 rounded-none card-depth-2 space-y-10 text-sm text-muted-foreground/90 leading-relaxed font-medium">

          {/* 1. Introduction */}
          <div id="introduction" className="space-y-4 scroll-mt-24 pb-8 border-b-2 border-border/40">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              1. Introduction &amp; Operator Info
            </h2>
            <p>
              Welcome to CoolTools. We are dedicated to delivering professional browser-based utility tools
              without compromising your data privacy. This Policy details what information we handle, how
              cookies serve personalization, and the security protocols built into the site structure. By using
              our service, you agree to the conditions outlined in this statement.
            </p>
          </div>

          {/* 2. Client-Side Local Processing */}
          <div id="local-processing" className="space-y-4 scroll-mt-24 pb-8 border-b-2 border-border/40">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              2. Client-Side Local Processing
            </h2>
            <p>
              Unlike typical online conversion sites,{' '}
              <strong className="text-foreground font-bold">
                CoolTools does not upload your documents, images, code files, or text data to remote servers.
              </strong>{' '}
              All processing operations (including barcode/QR generation, image compression, PDF merging,
              JWT decoding, and text case conversion) happen entirely locally inside your browser sandbox
              memory using client-side JavaScript libraries. No database stores your raw files, text
              inputs, or generated output assets, preventing data interception.
            </p>
          </div>

          {/* 3. Cookies & AdSense */}
          <div id="cookies-adsense" className="space-y-4 scroll-mt-24 pb-8 border-b-2 border-border/40">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              3. Cookies &amp; Google AdSense Advertising
            </h2>
            <p>
              We run third-party advertising services (Google AdSense) on this platform to fund operations.
              To comply with AdSense policy guidelines, we disclose the following:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  Third-party vendors, including Google, use cookies to serve ads based on your prior visits to
                  this website or other websites.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based
                  on your visit to this site and/or other sites on the Internet.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  You may opt out of personalized advertising by visiting Google&apos;s{' '}
                  <a
                    href="https://settings.google.com/ads"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-bold"
                  >
                    Ads Settings
                  </a>
                  . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for
                  personalized advertising by visiting{' '}
                  <a
                    href="https://www.aboutads.info/choices"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-bold"
                  >
                    www.aboutads.info/choices
                  </a>
                  .
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Analytics */}
          <div id="analytics-metrics" className="space-y-4 scroll-mt-24 pb-8 border-b-2 border-border/40">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              4. Performance Analytics &amp; Metrics
            </h2>
            <p>
              To monitor page speeds, rendering failures, and visitor traffic, we load basic telemetry
              analytics trackers (Google Analytics 4 and Microsoft Clarity) in production builds. These
              trackers record aggregate browser details (such as screen size, region, page visits, and click
              coordinates). No document text, private key inputs, file names, or generated outputs are ever
              read by or sent to these tracking services.
            </p>
          </div>

          {/* 5. Local Caching */}
          <div id="local-cache" className="space-y-4 scroll-mt-24 pb-8 border-b-2 border-border/40">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              5. Local Caching &amp; Data Retention
            </h2>
            <p>
              To improve your user experience, the website caches certain non-personal configuration values
              inside your browser&apos;s HTML5{' '}
              <code className="font-mono bg-muted px-1.5 py-0.5 text-[11px] border border-border">localStorage</code> database:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  <strong className="text-foreground font-bold">Configurations:</strong> Caches user choices like
                  Pomodoro timers, custom stopwatch laps, and theme selections (Light/Dark mode).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  <strong className="text-foreground font-bold">Activity History:</strong> Maintains a temporary local
                  running log of actions performed on tools in the navigation toolbar popover.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  <strong className="text-foreground font-bold">Retention:</strong> This data remains isolated inside
                  your device&apos;s browser profile sandbox and is never synced to cloud networks. You can
                  clear it instantly at any time by wiping your browser history cache.
                </span>
              </li>
            </ul>
          </div>

          {/* 6. GDPR & CCPA */}
          <div id="gdpr-ccpa" className="space-y-4 scroll-mt-24 pb-8 border-b-2 border-border/40">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              6. GDPR &amp; CCPA User Privacy Rights
            </h2>
            <p>
              Depending on your location, you carry specific rights under the European General Data
              Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA):
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  <strong className="text-foreground font-bold">Right to Erasure &amp; Deletion:</strong> Since we do
                  not store personal information on servers, there are no database records to delete. To erase
                  local configuration variables, clear your browser cookies.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  <strong className="text-foreground font-bold">Do Not Sell My Info (CCPA):</strong> We do not sell or
                  share personal data with external brokers. You can control third-party ad personalization
                  cookies using the consent dashboard below or your browser settings.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  <strong className="text-foreground font-bold">Right to Access:</strong> You may request a summary of
                  any information held about you. As we do not maintain a backend user database, there is
                  nothing to retrieve beyond what is stored in your own browser.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-primary/75 shrink-0 mt-2 rounded-none" />
                <span>
                  <strong className="text-foreground font-bold">Right to Object:</strong> You may object to analytics
                  or advertising data collection at any time using the consent controls provided below.
                </span>
              </li>
            </ul>
          </div>

          {/* 7. COPPA */}
          <div id="coppa-kids" className="space-y-4 scroll-mt-24 pb-8 border-b-2 border-border/40">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              7. Children&apos;s Privacy (COPPA Compliance)
            </h2>
            <p>
              We comply with the Children&apos;s Online Privacy Protection Act (COPPA). CoolTools is
              designed for general audiences and does not knowingly collect, request, or store any personal
              information from children under the age of 13. If you believe a minor has entered details or
              shared information, please reset the consent preferences below.
            </p>
          </div>

          {/* 8. Consent Dashboard */}
          <div id="preferences" className="space-y-4 scroll-mt-24">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
              8. Consent Preferences Dashboard
            </h2>
            <p>
              You can adjust or revoke your cookie consent selections at any time. Clicking the button below
              resets your saved consent choices, clears cookie permission records in localStorage, and shows
              the preference consent prompt again.
            </p>

            <div className="bg-muted/10 border-2 border-border p-5 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  Revoke Telemetry &amp; Ad Permissions
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Instantly wipe saved choice parameters. Requires a browser page refresh to load defaults.
                </span>
              </div>
              <ResetConsentButton />
            </div>
          </div>

        </main>
      </div>

      <AdContainer slot="bottom" />
    </div>
  );
}
