import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - CoolTools',
  description: 'Understand our cookie policy. CoolTools does not use tracking cookies. We only cache configurations locally using HTML5 localStorage.',
  alternates: {
    canonical: 'https://tools.chinmaypatil.com/cookies',
  },
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <section className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Cookie Policy
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: June 28, 2026</p>
      </section>

      <section className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          Unlike modern tracking-heavy platforms, CoolTools does **not** employ tracking cookies to identify your system or build consumer marketing profiles.
        </p>

        <hr className="border-border" />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. What are cookies?</h2>
          <p>
            Cookies are small text documents that sites drop onto browser drives to authenticate logins or save session preferences.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Do we use cookies?</h2>
          <p>
            No. CoolTools does not deploy tracking cookies or cookie-based identification. 
            We do not store database accounts, meaning cookie-based auth sessions are entirely unnecessary.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Browser LocalStorage</h2>
          <p>
            To remember UI adjustments (such as Pomodoro timer configurations, light/dark themes, sound volume, or notification permissions), we cache settings in HTML5 `localStorage` key-value stores. 
            This configuration data stays inside your browser sandbox and is never transmitted.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Third-Party Analytics Scripts</h2>
          <p>
            In production mode, Google Analytics 4 and Microsoft Clarity load scripts to track page transitions. 
            These modules may utilize cookie IDs to track navigation sequences anonymously. 
            You can block these third-party scripts easily by using ad-blocker extensions or turning off cookies in browser options.
          </p>
        </div>
      </section>
    </div>
  );
}
