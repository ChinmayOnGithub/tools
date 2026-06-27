import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import SkipNavLink from '@/components/shared/SkipNavLink';
import Navigation from '@/components/shared/Navigation';
import AnalyticsTracker from '@/components/shared/AnalyticsTracker';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.chinmaypatil.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free Online Tools Platform - Browser-Based Utilities',
    template: '%s - Free Online Browser Tool',
  },
  description: 'Free online browser-based tools for PDF, images, coding, text editing, and calculations. Secure, private, and processes data client-side.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Free Online Tools Platform',
    description: 'Secure, private, client-side utility tools.',
    url: siteUrl,
    siteName: 'Online Tools Platform',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools Platform',
    description: 'Secure, private, client-side utility tools.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                `}
              </Script>
              <AnalyticsTracker />
            </>
          )}
          {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_CLARITY_ID && (
            <Script id="microsoft-clarity" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `}
            </Script>
          )}
          <SkipNavLink />
          <Navigation />
          
          <main id="content" className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 outline-none">
            {children}
          </main>

          <footer className="border-t-2 border-border bg-muted/30 mt-auto">
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-border">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-extrabold tracking-tight">
                    COOL
                  </span>
                  <span className="font-extrabold tracking-tight">TOOLS</span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm justify-center md:justify-end">
                  <Link href="/about" className="text-muted-foreground hover:text-foreground font-medium transition-colors">About</Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Contact</Link>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Terms of Service</Link>
                  <Link href="/cookies" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Cookie Policy</Link>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground font-medium transition-colors">GitHub</a>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-6">
                &copy; {new Date().getFullYear()} CoolTools. All tools run 100% locally in your browser. No files are uploaded.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
