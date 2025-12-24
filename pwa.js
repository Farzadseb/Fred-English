// pwa.js - مدیریت PWA و نصب برنامه

// ===== PWA Installation =====
function checkPWAInstallation() {
    // Check display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 App is running as installed PWA');
        isPWAInstalled = true;
        document.getElementById('install-btn').style.display = 'none';
    } else if (window.navigator.standalone) {
        console.log('📱 App is running as iOS standalone');
        isPWAInstalled = true;
        document.getElementById('install-btn').style.display = 'none';
    }
}

function showInstallButton() {
    if (!isPWAInstalled) {
        document.getElementById('install-btn').style.display = 'flex';
    }
}

function showInstallPrompt() {
    if (deferredPrompt && !isPWAInstalled) {
        document.getElementById('install-prompt').style.display = 'flex';
    }
}

function hideInstallPrompt() {
    document.getElementById('install-prompt').style.display = 'none';
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
                isPWAInstalled = true;
                hideInstallPrompt();
                document.getElementById('install-btn').style.display = 'none';
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            
            deferredPrompt = null;
        });
    } else {
        // Fallback for browsers that don't support beforeinstallprompt
        alert('برای نصب برنامه:\n\n1. در مرورگر Safari: دکمه اشتراک گذاری ⬆️ را بزنید\n2. "به صفحه اصلی اضافه کن" را انتخاب کنید\n\nدر مرورگر Chrome: روی آیکون منو ⋮ کلیک کرده و "نصب برنامه" را انتخاب کنید.');
    }
}

// ===== PWA Service Worker =====
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✅ ServiceWorker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('❌ ServiceWorker registration failed:', error);
            });
    }
}

// ===== PWA Event Listeners =====
// Listen for PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWA install prompt received');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

// Listen for app installation
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    isPWAInstalled = true;
    hideInstallPrompt();
    document.getElementById('install-btn').style.display = 'none';
});

// ===== Scroll Prevention =====
(function preventScroll() {
    let lastTouchY = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        lastTouchY = startY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - lastTouchY;
        lastTouchY = touchY;
        
        // Prevent rubber-band scrolling at the top
        if (window.scrollY <= 0 && deltaY > 0) {
            e.preventDefault();
        }
        
        // Prevent rubber-band scrolling at the bottom
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll && deltaY < 0) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent zoom with double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Disable context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
})();
