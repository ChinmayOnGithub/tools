'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';

export default function ResetConsentButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    try {
      localStorage.removeItem('cookie_consent');
      // Force reload to trigger default consent states and show banner
      window.location.reload();
    } catch {
      // Safe fallback
    }
  };

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      className="text-xs font-bold gap-2 cursor-pointer mt-2"
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Reset Cookie Consent Choices
    </Button>
  );
}
