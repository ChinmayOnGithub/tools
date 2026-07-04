'use client';

import { useState, useEffect } from 'react';
import { Shield, BarChart3, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Granular preference states
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [adsConsent, setAdsConsent] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        const consentAnalytics = localStorage.getItem('cookie_consent_analytics');
        const consentAds = localStorage.getItem('cookie_consent_ads');
        
        // Show banner if either preference is not set
        if (!consentAnalytics || !consentAds) {
          setIsVisible(true);
        }
      } catch {
        // Safe fallback
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (analyticsState: boolean, adsState: boolean) => {
    const analyticsVal = analyticsState ? 'granted' : 'denied';
    const adsVal = adsState ? 'granted' : 'denied';

    try {
      localStorage.setItem('cookie_consent_analytics', analyticsVal);
      localStorage.setItem('cookie_consent_ads', adsVal);
      
      // Keep main backward-compatible flag active if either consent is given
      localStorage.setItem('cookie_consent', (analyticsState || adsState) ? 'granted' : 'denied');
    } catch {
      // Safe fallback
    }

    // Fire Google Analytics and Microsoft Clarity consent updates
    interface GtagWindow extends Window {
      gtag?: (command: string, action: string, params?: Record<string, string | number | boolean | undefined>) => void;
      clarity?: (command: string, ...args: unknown[]) => void;
    }

    if (typeof window !== 'undefined') {
      const gWindow = window as unknown as GtagWindow;
      if (gWindow.gtag) {
        gWindow.gtag('consent', 'update', {
          ad_storage: adsVal,
          ad_user_data: adsVal,
          ad_personalization: adsVal,
          analytics_storage: analyticsVal,
        });
      }
      if (gWindow.clarity) {
        gWindow.clarity('consent', analyticsState);
      }
    }

    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-card border-2 border-border p-5 card-depth-3 rounded-none space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300"
      role="dialog"
      aria-label="Cookie consent preferences"
      aria-describedby="cookie-consent-desc"
    >
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-xs font-bold text-foreground tracking-tight">Cookie & Consent Choices</h2>
        </div>
        <p id="cookie-consent-desc" className="text-[11px] text-muted-foreground leading-relaxed">
          We use cookies to enhance your experience, monitor website performance, and deliver personalized ads. Read our{' '}
          <Link href="/privacy" className="text-primary hover:underline font-semibold">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* Collapsible Granular Preference Panel using GPU-accelerated transition */}
      <div className={`grid transition-all duration-300 ease-in-out ${isCustomizing ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
        <div className="overflow-hidden space-y-3">
          <div className="pt-3 border-t border-border/60 space-y-3">
            {/* Analytics Toggle */}
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="h-4 w-4 border-2 border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer rounded-none mt-0.5"
                aria-label="Toggle analytics cookies"
              />
              <div className="flex gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block leading-none">Analytics (Clarity & Google)</span>
                  <span className="text-[10px] text-muted-foreground block leading-tight">
                    Helps us monitor usage patterns and optimize speed.
                  </span>
                </div>
              </div>
            </label>

            {/* Advertising Toggle */}
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={adsConsent}
                onChange={(e) => setAdsConsent(e.target.checked)}
                className="h-4 w-4 border-2 border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer rounded-none mt-0.5"
                aria-label="Toggle advertising cookies"
              />
              <div className="flex gap-2">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block leading-none">Personalized Ads (AdSense)</span>
                  <span className="text-[10px] text-muted-foreground block leading-tight">
                    Allows Google to serve relevant ads on our utility tools.
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Button actions layout */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex gap-2">
          {/* Decline All */}
          <Button 
            variant="outline" 
            onClick={() => {
              setAnalyticsConsent(false);
              setAdsConsent(false);
              handleSave(false, false);
            }}
            className="flex-1 text-[10px] font-bold h-8 cursor-pointer rounded-none"
          >
            Decline All
          </Button>

          {/* Customize Toggle or Save Choices */}
          {isCustomizing ? (
            <Button 
              variant="outline"
              onClick={() => handleSave(analyticsConsent, adsConsent)}
              className="flex-1 text-[10px] font-bold h-8 cursor-pointer rounded-none border-primary text-primary hover:bg-primary/5 hover:border-primary"
            >
              Save Choices
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={() => setIsCustomizing(true)}
              className="flex-1 text-[10px] font-bold h-8 cursor-pointer rounded-none flex items-center justify-center gap-1"
            >
              <span>Customize</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Accept All (Primary) */}
        <Button 
          onClick={() => {
            setAnalyticsConsent(true);
            setAdsConsent(true);
            handleSave(true, true);
          }}
          className="w-full text-[10px] font-bold h-9 cursor-pointer rounded-none"
        >
          Accept All Cookies
        </Button>

        {/* Minimize Button in Expanded Customize flow */}
        {isCustomizing && (
          <button
            onClick={() => setIsCustomizing(false)}
            className="w-full text-[10px] text-muted-foreground hover:text-foreground font-medium flex items-center justify-center gap-0.5 pt-1.5 cursor-pointer"
          >
            <span>Hide Settings</span>
            <ChevronUp className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
