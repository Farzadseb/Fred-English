// service-worker.js
const CACHE_NAME = 'english-fred-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './quiz-engine.js',
  './words.js',
  './manifest.json'
];

// نصب Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ کش کردن فایل‌های اصلی');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🧹 حذف کش قدیمی: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// مدیریت درخواست‌ها
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// مدیریت Push Notification
self.addEventListener('push', event => {
  const options = {
    body: 'یادگیری زبان انگلیسی را ادامه دهید! 📚',
    icon: 'icon-192x192.png',
    badge: 'icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: './'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('English with Fred', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
