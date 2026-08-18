const CACHE_PREFIX = 'nautilus-tortoise-tracker-';
const CACHE = `${CACHE_PREFIX}v8-20260818-production-repair`;
const SHELL = [
  './','./index.html','./config.js','./styles.css','./manifest.webmanifest',
  './icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/tortoise-placeholder.svg','./icons/tortoise-padloper.svg','./icons/qr/T0047.svg','./icons/qr/T0128.svg','./icons/qr/T0387.svg',
  './src/app.js','./src/platform.js','./src/i18n.js','./src/demo-data.js','./src/storage.js',
  './src/offline.js','./src/quality.js','./src/privacy.js','./src/analytics.js',
  './src/repository.js','./src/supabase-api.js','./src/map.js','./src/export.js','./src/analysis.js','./src/charts.js','./src/performance.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  if(req.mode==='navigate' || url.pathname.endsWith('/config.js')){
    event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;}).catch(()=>caches.match(req).then(hit=>hit||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>{
    const network=fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;}).catch(()=>hit);
    return hit || network;
  }));
});
self.addEventListener('message', event => { if(event.data === 'SKIP_WAITING') self.skipWaiting(); });
