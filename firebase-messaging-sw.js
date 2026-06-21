// Firebase Cloud Messaging - 백그라운드/종료 상태 알림 수신용
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBeZSWJBV3iaVDavqwQJM_P1MA8ZxVFgzo",
  authDomain: "ds-baemin-dashboard.firebaseapp.com",
  projectId: "ds-baemin-dashboard",
  storageBucket: "ds-baemin-dashboard.firebasestorage.app",
  messagingSenderId: "656597410347",
  appId: "1:656597410347:web:7eb54ef4b9dc7c9906c06e"
});

const messaging = firebase.messaging();

// 백그라운드(앱이 닫혀 있거나 다른 탭일 때) 수신
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || '🛵 DS배민현황';
  const body  = payload.notification?.body  || payload.data?.body  || '목표를 달성했습니다!';

  self.registration.showNotification(title, {
    body: body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    tag: payload.data?.tag || 'baemin-fcm',
    vibrate: [200, 100, 200, 100, 400],
    data: { url: './index.html' },
  });
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('./index.html');
    })
  );
});
