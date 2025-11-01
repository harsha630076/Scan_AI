// Firebase Messaging Service Worker for QuickCal AI
// This service worker handles background message notifications

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdIx65oYnxkr3RFTkSx3Rn5VF0zBZBK7U",
  authDomain: "aiscan-c77ac.firebaseapp.com",
  projectId: "aiscan-c77ac",
  storageBucket: "aiscan-c77ac.firebasestorage.app",
  messagingSenderId: "1058311246857",
  appId: "1:1058311246857:web:f0615b61f864be691f54d8"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'QuickCal AI';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
    tag: payload.data?.tag || 'default',
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  // Handle notification click - open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open
      for (let client of windowClients) {
        if (client.url.includes('localhost:8080') && 'focus' in client) {
          return client.focus();
        }
      }

      // If no suitable window exists, open a new one
      if (clients.openWindow) {
        return clients.openWindow('http://localhost:8080');
      }
    })
  );
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('Firebase messaging service worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('Firebase messaging service worker activated');
  event.waitUntil(clients.claim());
});
