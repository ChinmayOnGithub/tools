import { Metadata } from 'next';
import ResetConsentButton from '@/components/shared/ResetConsentButton';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'Cookie Policy - CoolTools',
  description: 'Understand our cookie policy. CoolTools does not use tracking cookies. We only cache configurations locally using HTML5 localStorage.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/cookies',
  },
};

export default function CookiesPage() {
  return (
    <div className="w-full space-y-8 py-4">
      {/* Page Header Card */}
      <header className="border-2 border-border bg-card p-6 sm:p-8 rounded-none card-depth-2 mb-8 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl pl-2">
          Cookie Policy
        </h1>
        <p className="text-xs font-normal italic text-muted-foreground pl-2">
          Last updated: June 28, 2026
        </p>
      </header>

      {/* Single Unified Legal Document Sheet */}
      <main className="border-2 border-border bg-card p-6 sm:p-10 rounded-none card-depth-2 space-y-8 text-sm text-muted-foreground/90 leading-relaxed font-medium">
        <p className="pb-4 border-b-2 border-border/40">
          Unlike modern tracking-heavy platforms, CoolTools does **not** employ tracking cookies to identify your system or build consumer marketing profiles.
        </p>

        {/* 1. What are cookies */}
        <div className="space-y-3 pb-6 border-b-2 border-border/40">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            1. What are cookies?
          </h2>
          <p>
            Cookies are small text documents that sites drop onto browser drives to authenticate logins or save session preferences.
          </p>
        </div>

        {/* 2. Do we use cookies */}
        <div className="space-y-3 pb-6 border-b-2 border-border/40">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            2. Do we use cookies?
          </h2>
          <p>
            No. CoolTools does not deploy tracking cookies or cookie-based identification. 
            We do not store database accounts, meaning cookie-based auth sessions are entirely unnecessary.
          </p>
        </div>

        {/* 3. Browser LocalStorage */}
        <div className="space-y-3 pb-6 border-b-2 border-border/40">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            3. Browser LocalStorage
          </h2>
          <p>
            To remember UI adjustments (such as Pomodoro timer configurations, light/dark themes, sound volume, or notification permissions), we cache settings in HTML5 <code className="font-mono bg-muted px-1.5 py-0.5 text-[11px] border border-border">localStorage</code> key-value stores. 
            This configuration data stays inside your browser sandbox and is never transmitted.
          </p>
        </div>

        {/* 4. Third-Party Analytics */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
            4. Third-Party Analytics Scripts
          </h2>
          <p>
            In production mode, Google Analytics 4 and Microsoft Clarity load scripts to track page transitions. 
            These modules may utilize cookie IDs to track navigation sequences anonymously. 
            You can block these third-party scripts easily by using ad-blocker extensions or turning off cookies in browser options.
          </p>
          
          <div className="bg-muted/10 border-2 border-border p-5 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2">
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

      <AdContainer slot="bottom" />
    </div>
  );
}
