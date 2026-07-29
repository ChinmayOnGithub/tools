'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            logger.info('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch((err) => {
            logger.error('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  return null;
}
