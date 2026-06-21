const CACHE = 'ds-baemin-v3';
const ASSETS = ['./index.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// 알림 클릭 시 앱 포커스
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('./');
    })
  );
});

// ── Web Push 수신 (앱이 백그라운드/종료 상태여도 동작) ──
self.addEventListener('push', e => {
  let payload = { title: '🛵 DS배민현황', body: '목표를 달성했습니다!' };
  try {
    if (e.data) payload = e.data.json();
  } catch (err) {
    if (e.data) payload.body = e.data.text();
  }

  const title = payload.title || '🛵 DS배민현황';
  const options = {
    body: payload.body || '목표 달성 알림',
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    tag: payload.tag || 'baemin-push',
    vibrate: [200, 100, 200, 100, 400],
    requireInteraction: false,
    data: { url: './index.html' },
  };

  e.waitUntil(self.registration.showNotification(title, options));
});
