// Service Worker - English with Fred
const APP_VERSION = '1.0.0';
const CACHE_NAME = `english-fred-${APP_VERSION}`;
const urlsToCache = ['./', './index.html', './words.js'];

self.addEventListener('install', event => {
    console.log(`📦 Installing v${APP_VERSION}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Cache opened');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ All resources cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Cache failed:', error);
            })
    );
});

self.addEventListener('activate', event => {
    console.log(`🚀 Service Worker v${APP_VERSION} activated`);
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
        }).then(() => {
            console.log('✅ Claiming clients');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log(`✅ Cache hit: ${event.request.url}`);
                    return response;
                }
                console.log(`🌐 Fetching: ${event.request.url}`);
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                                console.log(`💾 Cached: ${event.request.url}`);
                            });
                        return response;
                    })
                    .catch(error => {
                        console.log('❌ Network failed');
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('./');
                        }
                    });
            })
    );
});

self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'English with Fred';
    const options = {
        body: data.body || 'یادگیری انگلیسی ادامه بده! 📚',
        icon: './icon-192.png',
        badge: './icon-192.png',
        vibrate: [200,100,200],
        data: { url: data.url || './' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({type:'window',includeUncontrolled:true})
            .then(windowClients => {
                for (let client of windowClients) {
                    if (client.url === event.notification.data.url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data.url);
                }
            })
    );
});
