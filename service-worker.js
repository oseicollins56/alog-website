/* =====================================================
   ALOG Service Worker
   Caches core site assets for offline / fast repeat visits
   ===================================================== */

const CACHE_VERSION = 'alog-v1.0.0';
const CORE_ASSETS = [
  './',
  './index.html',
  './interior.html',
  './construction.html',
  './realestate.html',
  './contact.html',
  './css/styles.css',
  './js/main.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './favicon.ico'
];

/* Install — pre-cache shell */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      cache.addAll(CORE_ASSETS).catch(err => {
        // Still install even if some asset fails (e.g. offline-first dev)
        console.warn('[SW] Pre-cache partial:', err);
      })
    )
  );
  self.skipWaiting();
});

/* Activate — clean up old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch — cache-first for same-origin, network-first for external */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // Cache-first strategy
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(resp => {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const copy = resp.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(req, copy));
          }
          return resp;
        }).catch(() => caches.match('./index.html'));
      })
    );
  } else {
    // Network-first with cache fallback for hosted assets (images, fonts, CDNs)
    event.respondWith(
      fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(req, copy));
        }
        return resp;
      }).catch(() => caches.match(req))
    );
  }
});
