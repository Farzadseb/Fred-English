/**
 * Service Worker - English with Fred
 * نسخه 2.0 - با قابلیت‌های آفلاین پیشرفته
 */

const CACHE_NAME = 'english-fred-v2';
const OFFLINE_URL = '/offline.html';

// منابعی که باید cache شوند
const PRECACHE_RESOURCES = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/words.js',
    '/modal.js',
    '/progress.js',
    '/speech.js',
    '/screen-controller.js',
    '/manifest.json',
    '/favicon.ico',
    
    // منابع ضروری UI
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    
    // فونت‌ها (اختیاری)
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap'
];

// رویداد install
self.addEventListener('install', event => {
    console.log('🛠️ Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching app shell');
                return cache.addAll(PRECACHE_RESOURCES);
            })
            .then(() => {
                console.log('✅ Service Worker installed');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Cache installation failed:', error);
            })
    );
});

// رویداد activate
self.addEventListener('activate', event => {
    console.log('⚡ Service Worker activating...');
    
    // پاک‌سازی cache های قدیمی
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`🗑️ Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// رویداد fetch
self.addEventListener('fetch', event => {
    // اجتناب از درخواست‌های غیر HTTP/S
    if (!event.request.url.startsWith('http')) return;
    
    // استراتژی: Cache First, Fallback to Network
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // اگر در cache موجود بود، برگردان
                if (cachedResponse) {
                    console.log(`📦 Serving from cache: ${event.request.url}`);
                    return cachedResponse;
                }
                
                // در غیر این صورت از شبکه بگیر
                return fetch(event.request)
                    .then(networkResponse => {
                        // اگر response معتبر بود، در cache ذخیره کن
                        if (networkResponse && 
                            networkResponse.status === 200 && 
                            networkResponse.type === 'basic') {
                            
                            const responseToCache = networkResponse.clone();
                            
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                    console.log(`💾 Caching new resource: ${event.request.url}`);
                                });
                        }
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('🌐 Network error, serving offline page:', error);
                        
                        // اگر صفحه اصلی درخواست شده و آفلاین هستیم
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL)
                                .then(offlineResponse => offlineResponse || 
                                    new Response('Offline content not available', {
                                        status: 503,
                                        statusText: 'Service Unavailable'
                                    })
                                );
                        }
                        
                        // برای سایر منابع، خطا برگردان
                        return new Response('Network error', {
                            status: 408,
                            statusText: 'Network Request Failed'
                        });
                    });
            })
    );
});

// رویداد sync (برای sync داده‌ها هنگام آنلاین شدن)
self.addEventListener('sync', event => {
    console.log(`🔄 Background sync: ${event.tag}`);
    
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgressData());
    }
});

// رویداد push (برای نوتیفیکیشن‌ها)
self.addEventListener('push', event => {
    console.log('📢 Push notification received');
    
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'یادآوری تمرین انگلیسی',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        },
        actions: [
            {
                action: 'open',
                title: 'باز کردن'
            },
            {
                action: 'close',
                title: 'بستن'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'English with Fred', options)
    );
});

// رویداد notificationclick
self.addEventListener('notificationclick', event => {
    console.log('🔔 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    // باز کردن برنامه
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clientList => {
            // اگر پنجره باز است، focus کن
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // اگر باز نیست، باز کن
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url || '/');
            }
        })
    );
});

// رویداد message
self.addEventListener('message', event => {
    console.log('📩 Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_RESOURCES') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(event.data.resources))
        );
    }
});

// تابع sync داده‌های پیشرفت
function syncProgressData() {
    console.log('🔄 Syncing progress data...');
    
    // در اینجا می‌توانید داده‌های پیشرفت را به سرور sync کنید
    // فعلاً فقط log می‌گیریم
    
    return Promise.resolve()
        .then(() => {
            console.log('✅ Progress data synced');
        })
        .catch(error => {
            console.error('❌ Sync failed:', error);
        });
}

// تابع دریافت نسخه cache
function getCacheVersion() {
    return CACHE_NAME.split('-').pop() || 'unknown';
}

console.log(`🚀 Service Worker loaded (v${getCacheVersion()})`);
