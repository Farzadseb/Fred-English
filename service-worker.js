// Service Worker برای قابلیت آفلاین
const CACHE_NAME = 'english-with-fred-v3';
const APP_VERSION = '3.0.0';
const ASSETS_TO_CACHE = [
    // فایل‌های اصلی
    './',
    './index.html',
    './style.css',
    './app.js',
    './learning-engine.js',
    './a1-words.js',
    './quiz-engine.js',
    './telegram-integration.js',
    
    // فایل‌های جدید
    './manifest.json',
    './install-promotion.js',
    './config.js',
    
    // منابع خارجی
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    
    // فایل‌های استاتیک
    './icon-192x192.png',
    './icon-512x512.png',
    './images/flower-bg.png'
];

// متدهای کمکی
const isCacheable = (request) => {
    const url = new URL(request.url);
    
    // فقط درخواست‌های GET و از همین origin
    if (request.method !== 'GET') return false;
    
    // منابع خارجی خاص
    if (url.origin.includes('cdnjs.cloudflare.com') || 
        url.origin.includes('cdn.jsdelivr.net') ||
        url.origin.includes('api.telegram.org')) {
        return true;
    }
    
    // فایل‌های استاتیک
    if (url.pathname.endsWith('.css') || 
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.json') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.svg')) {
        return true;
    }
    
    // صفحات HTML
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        return true;
    }
    
    return false;
};

// نصب Service Worker
self.addEventListener('install', (event) => {
    console.log(`📦 نصب Service Worker نسخه ${APP_VERSION}`);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📁 کش کردن فایل‌های ضروری');
                
                // کش فایل‌های اصلی
                return cache.addAll(ASSETS_TO_CACHE.map(url => {
                    try {
                        return new Request(url, { mode: 'no-cors' });
                    } catch (error) {
                        return url;
                    }
                }))
                .then(() => {
                    console.log('✅ فایل‌های ضروری کش شدند');
                })
                .catch((error) => {
                    console.error('⚠️ برخی فایل‌ها کش نشدند:', error);
                });
            })
            .then(() => {
                console.log('🚀 Service Worker نصب شد');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ خطا در نصب Service Worker:', error);
            })
    );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
    console.log('🎯 Service Worker فعال شد');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // حذف کش‌های قدیمی
                        if (cacheName !== CACHE_NAME) {
                            console.log(`🗑️ حذف کش قدیمی: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // کنترل همه کلاینت‌ها
                return self.clients.claim();
            })
            .then(() => {
                console.log('✅ Service Worker آماده است');
                
                // ارسال پیام به همه کلاینت‌ها
                self.clients.matchAll()
                    .then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({
                                type: 'SW_ACTIVATED',
                                version: APP_VERSION
                            });
                        });
                    });
            })
    );
});

// مدیریت درخواست‌های fetch
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // برای API تلگرام، از شبکه بگیر
    if (url.href.includes('api.telegram.org')) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    // اگر آفلاین بودیم، خطا برگردان
                    return new Response(JSON.stringify({
                        error: 'آفلاین هستید',
                        saved: true
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
        return;
    }
    
    // برای منابع خارجی Chart.js و Font Awesome
    if (url.origin.includes('cdn.jsdelivr.net') || 
        url.origin.includes('cdnjs.cloudflare.com')) {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    // اگر در کش بود برگردان
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // از شبکه بگیر و کش کن
                    return fetch(request)
                        .then((response) => {
                            // فقط پاسخ‌های معتبر را کش کن
                            if (response && response.status === 200 && response.type === 'basic') {
                                const responseToCache = response.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(request, responseToCache);
                                    });
                            }
                            return response;
                        })
                        .catch(() => {
                            // اگر آفلاین هستیم و فایل مهمی مثل Chart.js را پیدا نکردیم
                            if (url.href.includes('chart.js')) {
                                return new Response('', {
                                    headers: { 'Content-Type': 'application/javascript' }
                                });
                            }
                        });
                })
        );
        return;
    }
    
    // فقط فایل‌های قابل کش را مدیریت کن
    if (!isCacheable(request)) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // استراتژی: Cache First, then Network
                if (cachedResponse) {
                    // آپدیت کش در پس‌زمینه
                    event.waitUntil(
                        fetch(request)
                            .then((response) => {
                                if (response && response.status === 200 && response.type === 'basic') {
                                    const responseToCache = response.clone();
                                    caches.open(CACHE_NAME)
                                        .then((cache) => {
                                            cache.put(request, responseToCache);
                                        });
                                }
                            })
                            .catch(() => {
                                // خطای شبکه - کش موجود است
                            })
                    );
                    
                    return cachedResponse;
                }
                
                // اگر در کش نبود، از شبکه بگیر
                return fetch(request)
                    .then((response) => {
                        // بررسی که پاسخ معتبر باشد
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // کش کردن پاسخ
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // اگر آفلاین هستیم و فایل HTML خواسته شد
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('./index.html');
                        }
                        
                        // اگر فایل CSS خواسته شد
                        if (request.url.includes('.css')) {
                            return caches.match('./style.css');
                        }
                        
                        // اگر فایل JS خواسته شد
                        if (request.url.includes('.js')) {
                            if (request.url.includes('app.js')) {
                                return caches.match('./app.js');
                            }
                            if (request.url.includes('learning-engine.js')) {
                                return caches.match('./learning-engine.js');
                            }
                        }
                        
                        // اگر آیکون خواسته شد
                        if (request.url.includes('.png') || request.url.includes('.ico')) {
                            return caches.match('./icon-192x192.png');
                        }
                        
                        // پیش‌فرض
                        return new Response('آفلاین هستید', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// دریافت پیام از کلاینت
self.addEventListener('message', (event) => {
    const data = event.data;
    
    if (data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME)
            .then(() => {
                event.ports[0].postMessage({ success: true });
            });
    }
    
    if (data.type === 'GET_CACHE_INFO') {
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.keys();
            })
            .then((keys) => {
                event.ports[0].postMessage({
                    count: keys.length,
                    version: APP_VERSION
                });
            });
    }
});

// دریافت push notification (اختیاری)
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        const title = data.title || 'English with Fred';
        const options = {
            body: data.body || 'یادآوری برای یادگیری لغات',
            icon: './icon-192x192.png',
            badge: './icon-192x192.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || './',
                timestamp: Date.now()
            },
            actions: [
                {
                    action: 'learn',
                    title: '📚 یادگیری'
                },
                {
                    action: 'review',
                    title: '🔄 مرور'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (error) {
        console.error('❌ خطا در نمایش نوتیفیکیشن:', error);
    }
});

// کلیک روی notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const urlToOpen = event.notification.data.url || './';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then((clientList) => {
            // اگر پنجره باز است، فوکوس کن
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // اگر پنجره‌ای باز نیست، باز کن
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
        .then(() => {
            // هندل اکشن‌های دکمه‌ها
            if (event.action === 'learn') {
                clients.openWindow('./#learning');
            } else if (event.action === 'review') {
                clients.openWindow('./#quiz');
            }
        })
    );
});

// هندل sync event برای همگام‌سازی داده‌ها
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-telegram-messages') {
        event.waitUntil(
            syncTelegramMessages()
        );
    }
});

// تابع همگام‌سازی پیام‌های تلگرام
async function syncTelegramMessages() {
    const offlineMessages = await getOfflineMessages();
    
    for (const message of offlineMessages) {
        try {
            await sendToTelegramAPI(message);
            await removeOfflineMessage(message.id);
        } catch (error) {
            console.error('❌ خطا در ارسال پیام:', error);
            break; // اگر خطا داشت، متوقف شو
        }
    }
}

// توابع کمکی
async function getOfflineMessages() {
    return new Promise((resolve) => {
        caches.open('telegram-offline')
            .then(cache => cache.keys())
            .then(keys => {
                const messages = [];
                keys.forEach(key => {
                    messages.push({
                        id: key.url,
                        data: key
                    });
                });
                resolve(messages);
            });
    });
}

async function sendToTelegramAPI(message) {
    // اینجا منطق ارسال به تلگرام
    return Promise.resolve();
}

async function removeOfflineMessage(id) {
    return caches.open('telegram-offline')
        .then(cache => cache.delete(id));
}

// لاگ وضعیت
console.log(`🔧 Service Worker نسخه ${APP_VERSION} بارگذاری شد`);
