const CACHE_NAME = 'cooltools-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/manifest.webmanifest',
  '/icon.svg',
];

// Install event: cache initial shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event: clean up outdated cache configurations
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event: serve assets locally or fall back offline
self.addEventListener('fetch', (event) => {
  // Only intercept standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip tracking scripts or external ads
  if (
    url.hostname.includes('google-analytics') || 
    url.hostname.includes('doubleclick') || 
    url.hostname.includes('googleadservices')
  ) {
    return;
  }

  // Network-First for main pages to ensure fresh SEO content, with offline cache fallback
  if (
    event.request.mode === 'navigate' ||
    url.pathname.startsWith('/tools/') ||
    url.pathname.startsWith('/categories/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to offline home page shell if unavailable
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Cache-First for JS, CSS, images, and static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        // Cache valid responses only
        if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
          return response;
        }

        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      });
    })
  );
});
