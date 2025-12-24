// Service Worker برای English with Fred
const CACHE_NAME = 'english-fred-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/dic.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// نصب Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// فعال سازی Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
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
        // اگر در کش موجود بود برگردان
        if (response) {
          return response;
        }
        
        // در غیر این صورت از شبکه بگیر
        return fetch(event.request)
          .then(response => {
            // فقط اگر موفق بود در کش ذخیره کن
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
            // اگر آفلاین هستیم و فایل پیدا نشد
            if (event.request.url.indexOf('.html') > -1) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// گوش دادن به پیام‌ها
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
