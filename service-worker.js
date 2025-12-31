// Service Worker برای English with Fred
const CACHE_NAME = 'english-fred-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/quiz-engine.js',
  '/telegram-integration.js',
  '/words.js',
  '/a1-words.js',
  '/learning-engine.js',
  '/install-promotion.js',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

// نصب Service Worker
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker در حال نصب...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📁 کش کردن فایل‌ها');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker فعال شد');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ حذف کش قدیمی: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// رویداد fetch
self.addEventListener('fetch', (event) => {
  // فقط درخواست‌های GET را کش می‌کنیم
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // اگر در کش موجود بود، از کش برگردان
        if (cachedResponse) {
          console.log(`✅ از کش: ${event.request.url}`);
          return cachedResponse;
        }

        // اگر در کش نبود، از شبکه بگیر
        console.log(`🌐 از شبکه: ${event.request.url}`);
        return fetch(event.request)
          .then((networkResponse) => {
            // فقط پاسخ‌های معتبر را کش کن
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // پاسخ را در کش ذخیره کن
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log(`💾 ذخیره در کش: ${event.request.url}`);
              });

            return networkResponse;
          })
          .catch(() => {
            // اگر شبکه در دسترس نبود، صفحه آفلاین را نشان بده
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});
