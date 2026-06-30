'use client';

import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
          setIsVisible(true);
        }
      } catch {
        // Safe fallback
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (granted: boolean) => {
    const value = granted ? 'granted' : 'denied';
    try {
      localStorage.setItem('cookie_consent', value);
    } catch {
      // Safe fallback
    }

    // Fire Google Analytics and Microsoft Clarity consent update
    interface GtagWindow extends Window {
      gtag?: (command: string, action: string, params?: Record<string, string | number | boolean | undefined>) => void;
      clarity?: (command: string, ...args: unknown[]) => void;
    }

    if (typeof window !== 'undefined') {
      const gWindow = window as unknown as GtagWindow;
      if (gWindow.gtag) {
        gWindow.gtag('consent', 'update', {
          ad_storage: value,
          ad_user_data: value,
          ad_personalization: value,
          analytics_storage: value,
        });
      }
      if (gWindow.clarity) {
        gWindow.clarity('consent', granted);
      }
    }

    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-card border-2 border-border p-5 card-depth-2 z-50 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300"
      role="dialog"
      aria-label="Cookie consent banner"
      aria-describedby="cookie-consent-desc"
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-foreground">Cookie & Consent Choices</h2>
          <p id="cookie-consent-desc" className="text-[11px] text-muted-foreground leading-relaxed">
            We load anonymous telemetry analytics to monitor tools. Your document files are always processed locally on your device and never uploaded. Read our{' '}
            <Link href="/privacy" className="text-primary hover:underline font-semibold">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <button 
          onClick={() => handleConsent(false)}
          className="text-muted-foreground hover:text-foreground shrink-0 p-0.5 cursor-pointer"
          aria-label="Close consent dialog"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 text-xs">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleConsent(false)}
          className="text-[10px] font-bold h-8 cursor-pointer"
        >
          Decline
        </Button>
        <Button 
          onClick={() => handleConsent(true)}
          className="text-[10px] font-bold h-8 cursor-pointer"
        >
          Accept Cookies
        </Button>
      </div>
    </div>
  );
}
