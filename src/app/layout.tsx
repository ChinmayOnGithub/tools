import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from '@/components/theme-provider';
import SkipNavLink from '@/components/shared/SkipNavLink';
import Navigation from '@/components/shared/Navigation';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
          <SkipNavLink />
          <Navigation />
          
          <main id="content" className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 outline-none">
            {children}
          </main>

          <footer className="border-t bg-muted/40">
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground text-center md:text-left">
                &copy; {new Date().getFullYear()} CoolTools. All tools run 100% locally in your browser. No files are uploaded.
              </p>
              <div className="flex space-x-6 text-xs text-muted-foreground justify-center">
                <Link href="/#about" className="hover:underline">Privacy Policy</Link>
                <Link href="/#terms" className="hover:underline">Terms of Service</Link>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
