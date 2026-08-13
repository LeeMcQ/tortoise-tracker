const CACHE = 'nautilus-conservation-v2-20260813';
const SHELL = [
  './','./index.html','./config.js','./styles.css','./manifest.webmanifest',
  './icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png',
  './src/app.js','./src/i18n.js','./src/demo-data.js','./src/storage.js',
  './src/offline.js','./src/quality.js','./src/privacy.js','./src/analytics.js',
  './src/repository.js','./src/supabase-api.js','./src/map.js','./src/export.js','./src/performance.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
self.addEventListener('message', event => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });
