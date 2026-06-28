import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CoolTools - Privacy-First Browser Utilities',
    short_name: 'CoolTools',
    description: 'A growing collection of fast, browser-native developer, text, PDF, and productivity tools that run 100% locally.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
