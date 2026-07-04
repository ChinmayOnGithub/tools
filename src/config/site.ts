export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.chinmaypatil.com')
  .replace(/\/+$/, '')
  .replace(/\$+$/, '');
