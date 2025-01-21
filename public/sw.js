const CACHE_NAME = 'besitos-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/src/1.gif',
  '/icons/72/icon-72x72.png',
  '/icons/96/icon-96x96.png',
  '/icons/128/icon-128x128.png',
  '/icons/144/icon-144x144.png',
  '/icons/152/icon-152x152.png',
  '/icons/192/icon-192x192.png',
  '/icons/384/icon-384x384.png',
  '/icons/512/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
}); 