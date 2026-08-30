import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://*.googletagmanager.com https://*.google-analytics.com https://pagead2.googlesyndication.com https://*.clarity.ms;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.google-analytics.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.clarity.ms https://*.bing.com https://avatars.githubusercontent.com https://flagcdn.com https://upload.wikimedia.org https://apod.nasa.gov https://*.nasa.gov;
  font-src 'self' data:;
  connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.clarity.ms https://*.bing.com https://*.google.com https://*.googleadservices.com https://api.nasa.gov https://api.github.com https://raw.githubusercontent.com https://*.open-meteo.com https://api.frankfurter.app https://api.frankfurter.dev https://restcountries.com https://date.nager.at;
  frame-src 'self' https://googleads.g.doubleclick.net https://*.doubleclick.net https://pagead2.googlesyndication.com https://www.youtube.com https://*.youtube.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim().replace(/;$/, '');

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
