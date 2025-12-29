// =======================
// SERVICE WORKER for PWA
// =======================

const CACHE_NAME = 'english-with-fred-v1.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/quiz-engine.js',
    '/words.js',
    '/telegram-integration.js',
    '/premium-system.js',
    '/leitner-system.js'
];

// نصب Service Worker
self.addEventListener('install', event => {
    console.log('📦 Service Worker در حال نصب...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('🗂️ کش کردن فایل‌ها...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker نصب شد');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ خطا در نصب Service Worker:', error);
            })
    );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker در حال فعال‌سازی...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // حذف کش‌های قدیمی
                    if (cacheName !== CACHE_NAME) {
                        console.log(`🗑️ حذف کش قدیمی: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker فعال شد');
            return self.clients.claim();
        })
    );
});

// پاسخ به درخواست‌ها
self.addEventListener('fetch', event => {
    // فقط درخواست‌های GET را کش می‌کنیم
    if (event.request.method !== 'GET') return;
    
    // از کش کردن فایل‌های خارجی خودداری می‌کنیم
    if (event.request.url.startsWith('chrome-extension://')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // اگر فایل در کش بود
                if (response) {
                    console.log('💾 از کش: ' + event.request.url);
                    return response;
                }
                
                // در غیر این صورت از شبکه بگیر
                console.log('🌐 از شبکه: ' + event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // اگر پاسخ معتبر است، در کش ذخیره کن
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // کلون پاسخ برای کش
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('❌ خطا در دریافت از شبکه:', error);
                        
                        // اگر آفلاین هستیم و فایل HTML می‌خواهیم
                        if (event.request.url.indexOf('.html') > -1) {
                            return caches.match('/index.html');
                        }
                        
                        // صفحه خطای آفلاین
                        return new Response(`
                            <!DOCTYPE html>
                            <html lang="fa" dir="rtl">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>اتصال اینترنت</title>
                                <style>
                                    body {
                                        font-family: Tahoma;
                                        text-align: center;
                                        padding: 50px;
                                        background: #f0f0f0;
                                    }
                                    .offline-message {
                                        background: white;
                                        padding: 40px;
                                        border-radius: 20px;
                                        max-width: 500px;
                                        margin: 0 auto;
                                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                                    }
                                    h1 {
                                        color: #4F46E5;
                                    }
                                    .icon {
                                        font-size: 4rem;
                                        margin-bottom: 20px;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="offline-message">
                                    <div class="icon">📡</div>
                                    <h1>اتصال اینترنت برقرار نیست</h1>
                                    <p>برنامه English with Fred به اتصال اینترنت نیاز دارد.</p>
                                    <p>لطفاً اتصال اینترنت خود را بررسی کنید.</p>
                                    <p>📱 واتساپ پشتیبانی: 09017708544</p>
                                    <button onclick="window.location.reload()" 
                                            style="padding: 10px 20px; margin-top: 20px; background: #4F46E5; color: white; border: none; border-radius: 10px; cursor: pointer;">
                                        تلاش مجدد
                                    </button>
                                </div>
                            </body>
                            </html>
                        `, {
                            headers: { 'Content-Type': 'text/html' }
                        });
                    });
            })
    );
});

// دریافت Push Notification
self.addEventListener('push', event => {
    console.log('🔔 Push Notification دریافت شد');
    
    if (!event.data) return;
    
    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        data = {
            title: 'English with Fred',
            body: 'یادآوری مرور لغات',
            icon: '/icon-192.png'
        };
    }
    
    const options = {
        body: data.body || 'یادآوری مرور لغات جدید',
        icon: data.icon || '/icon-192.png',
        badge: '/icon-96.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now()
        },
        actions: [
            {
                action: 'review',
                title: 'مرور لغات'
            },
            {
                action: 'later',
                title: 'بعداً'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'English with Fred', options)
    );
});

// کلیک روی Notification
self.addEventListener('notificationclick', event => {
    console.log('👆 Notification کلیک شد');
    
    event.notification.close();
    
    if (event.action === 'review') {
        // شروع مرور لغات
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then(clientList => {
                    for (const client of clientList) {
                        if (client.url === '/' && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    if (clients.openWindow) {
                        return clients.openWindow('/');
                    }
                })
        );
    } else if (event.action === 'later') {
        // هیچ کاری نکن
    } else {
        // باز کردن برنامه
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// دریافت پیام از صفحه اصلی
self.addEventListener('message', event => {
    console.log('📨 پیام دریافت شد:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// همگام‌سازی در پس‌زمینه
self.addEventListener('sync', event => {
    console.log('🔄 همگام‌سازی:', event.tag);
    
    if (event.tag === 'sync-telegram-reports') {
        event.waitUntil(syncTelegramReports());
    }
});

// همگام‌سازی گزارش‌های تلگرام
async function syncTelegramReports() {
    console.log('🔄 در حال همگام‌سازی گزارش‌های تلگرام...');
    
    // اینجا می‌توانید گزارش‌های آفلاین را ارسال کنید
    // برای سادگی فعلاً کاری نمی‌کنیم
    
    return Promise.resolve();
}

console.log('🚀 Service Worker آماده است');
