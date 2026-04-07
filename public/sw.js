const CACHE_NAME = 'xbee-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icon.svg',
];

const OFFLINE_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Xbee — Offline</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0a0b;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}.c{max-width:360px}.icon{width:64px;height:64px;margin:0 auto 1.5rem;border-radius:16px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:28px}h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#888;font-size:.9rem;line-height:1.6;margin-bottom:1.5rem}button{background:#f59e0b;color:#000;border:none;padding:10px 28px;border-radius:12px;font-weight:700;font-size:.9rem;cursor:pointer}button:hover{background:#d97706}</style></head><body><div class="c"><div class="icon">🐝</div><h1>You're offline</h1><p>Xbee needs an internet connection. Check your Wi-Fi or mobile data and try again.</p><button onclick="location.reload()">Retry</button></div></body></html>`;

// Install — cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, cache fallback, offline page for navigation
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navigation requests (page loads) — show offline page on failure
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) =>
            cached || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } })
          )
        )
    );
    return;
  }

  // All other requests — network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  let data = { title: 'Xbee', body: 'New activity on Xbee!', url: '/', type: 'general' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 200, 50, 100],
    tag: data.type || 'general',
    renotify: true,
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click — deep link routing
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if found
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin)) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Open new tab
      return clients.openWindow(targetUrl);
    })
  );
});
