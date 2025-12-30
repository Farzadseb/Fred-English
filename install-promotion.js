// =======================
// PWA INSTALL PROMOTION - تبلیغ نصب برنامه
// =======================

let deferredPrompt;
let installBannerShown = false;
const INSTALL_BANNER_KEY = 'install_banner_shown';

// رویداد beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 beforeinstallprompt رویداد فعال شد');
    
    // جلوگیری از نمایش پیش‌فرض مرورگر
    e.preventDefault();
    
    // ذخیره رویداد برای استفاده بعدی
    deferredPrompt = e;
    
    // بررسی آیا قبلاً بنر نشان داده شده
    const bannerShown = localStorage.getItem(INSTALL_BANNER_KEY);
    
    // اگر قبلاً نشان داده نشده یا بیشتر از 7 روز گذشته
    if (!bannerShown || isBannerExpired(bannerShown)) {
        // نمایش بنر با تاخیر
        setTimeout(() => {
            showInstallBanner();
        }, 3000); // 3 ثانیه تاخیر
    }
    
    // ارسال آنالیتیکس (اختیاری)
    trackPWAInstallEvent('install_prompt_shown');
});

// بررسی منقضی شدن بنر
function isBannerExpired(timestamp) {
    const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 روز به میلی‌ثانیه
    const now = new Date().getTime();
    const bannerTime = parseInt(timestamp);
    
    return (now - bannerTime) > sevenDays;
}

// نمایش بنر نصب
function showInstallBanner() {
    if (installBannerShown) return;
    
    const installBanner = document.getElementById('installBanner');
    if (!installBanner) return;
    
    // ایجاد بنر اگر وجود ندارد
    if (!installBanner.innerHTML.trim()) {
        installBanner.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">
                    <i class="fas fa-download"></i>
                </div>
                <div class="banner-text">
                    <strong>📱 نصب برنامه English with Fred</strong>
                    <small>برای دسترسی سریع‌تر و تجربه بهتر، برنامه را نصب کنید</small>
                    <div class="banner-features">
                        <span><i class="fas fa-bolt"></i> سریع‌تر</span>
                        <span><i class="fas fa-wifi-slash"></i> آفلاین</span>
                        <span><i class="fas fa-home"></i> دسترسی آسان</span>
                    </div>
                </div>
                <div class="banner-actions">
                    <button class="install-btn" onclick="installPWA()">
                        <i class="fas fa-download"></i> نصب برنامه
                    </button>
                    <button class="later-btn" onclick="hideInstallBanner(7)">
                        بعداً
                    </button>
                    <button class="close-banner" onclick="hideInstallBanner(30)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    // نمایش بنر با انیمیشن
    installBanner.style.display = 'block';
    setTimeout(() => {
        installBanner.classList.add('show');
    }, 100);
    
    installBannerShown = true;
    
    // ذخیره زمان نمایش
    localStorage.setItem(INSTALL_BANNER_KEY, new Date().getTime().toString());
    
    // رهگیری آنالیتیکس
    trackPWAInstallEvent('install_banner_shown');
}

// مخفی کردن بنر نصب
function hideInstallBanner(daysToHide = 7) {
    const installBanner = document.getElementById('installBanner');
    if (!installBanner) return;
    
    // انیمیشن خروج
    installBanner.classList.remove('show');
    
    setTimeout(() => {
        installBanner.style.display = 'none';
        installBannerShown = false;
    }, 300);
    
    // محاسبه زمان نمایش مجدد
    const hideUntil = new Date();
    hideUntil.setDate(hideUntil.getDate() + daysToHide);
    localStorage.setItem(INSTALL_BANNER_KEY, hideUntil.getTime().toString());
    
    // رهگیری آنالیتیکس
    trackPWAInstallEvent('install_banner_dismissed', { days: daysToHide });
}

// نصب PWA
async function installPWA() {
    if (!deferredPrompt) {
        console.log('⚠️ رویداد نصب در دسترس نیست');
        showInstallInstructions();
        return;
    }
    
    try {
        // نمایش prompt نصب
        deferredPrompt.prompt();
        
        // منتظر انتخاب کاربر بمان
        const choiceResult = await deferredPrompt.userChoice;
        
        // رهگیری نتیجه
        trackPWAInstallEvent('install_choice', { outcome: choiceResult.outcome });
        
        if (choiceResult.outcome === 'accepted') {
            console.log('✅ کاربر نصب را پذیرفت');
            
            // نمایش پیام موفقیت
            showNotification('✅ برنامه با موفقیت نصب شد!', 'success');
            
            // مخفی کردن بنر
            hideInstallBanner(30); // 30 روز مخفی شود
            
            // رهگیری نصب موفق
            trackPWAInstallEvent('install_success');
            
            // بروزرسانی دکمه‌ها
            updateInstallButton();
        } else {
            console.log('❌ کاربر نصب را رد کرد');
            
            // نمایش پیام
            showNotification('💡 هر زمان می‌توانید از منو نصب کنید', 'info');
            
            // مخفی کردن بنر به مدت 3 روز
            hideInstallBanner(3);
            
            // رهگیری رد نصب
            trackPWAInstallEvent('install_declined');
        }
        
        // پاک کردن deferredPrompt
        deferredPrompt = null;
        
    } catch (error) {
        console.error('❌ خطا در نصب:', error);
        
        // نمایش دستورالعمل نصب دستی
        showInstallInstructions();
        
        // رهگیری خطا
        trackPWAInstallEvent('install_error', { error: error.message });
    }
}

// نمایش دستورالعمل نصب دستی
function showInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
        instructions = `
            <strong>📱 نصب در iOS:</strong><br>
            1. دکمه Share را در پایین صفحه بزنید<br>
            2. گزینه "Add to Home Screen" را انتخاب کنید<br>
            3. روی "Add" در بالا سمت راست بزنید
        `;
    } else if (isAndroid) {
        instructions = `
            <strong>📱 نصب در Android:</strong><br>
            1. منوی سه نقطه (⋮) را در مرورگر بزنید<br>
            2. گزینه "Install app" یا "Add to Home screen" را انتخاب کنید<br>
            3. روی "Install" کلیک کنید
        `;
    } else {
        instructions = `
            <strong>💻 نصب در دسکتاپ:</strong><br>
            1. در مرورگر Chrome یا Edge روی آیکون نصب در آدرس بار کلیک کنید<br>
            2. گزینه "Install English with Fred" را انتخاب کنید<br>
            3. روی "Install" کلیک کنید
        `;
    }
    
    // نمایش پیام
    const notification = document.getElementById('notification');
    if (notification) {
        notification.innerHTML = `
            <div class="install-instructions">
                <i class="fas fa-mobile-alt"></i>
                <div>
                    <h4>نصب برنامه</h4>
                    <p>${instructions}</p>
                </div>
                <button onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        notification.style.display = 'block';
        
        // مخفی کردن خودکار پس از 10 ثانیه
        setTimeout(() => {
            notification.style.display = 'none';
        }, 10000);
    }
}

// بروزرسانی دکمه نصب بعد از نصب
function updateInstallButton() {
    const installBtn = document.querySelector('.install-btn');
    if (installBtn) {
        installBtn.innerHTML = '<i class="fas fa-check"></i> نصب شده';
        installBtn.disabled = true;
        installBtn.style.opacity = '0.7';
    }
}

// بررسی آیا برنامه نصب شده است
function checkIfInstalled() {
    // روش‌های مختلف بررسی نصب
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
    
    if (isStandalone || isFullscreen || isMinimalUI) {
        console.log('✅ برنامه نصب شده است');
        return true;
    }
    
    // بررسی دیگر نشانه‌ها
    if (window.navigator.standalone) {
        return true;
    }
    
    return false;
}

// رهگیری رویدادهای نصب (اختیاری)
function trackPWAInstallEvent(eventName, data = {}) {
    // این تابع می‌تواند برای ارسال آمار به سرور استفاده شود
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        ...data
    };
    
    console.log('📊 رویداد PWA:', eventData);
    
    // ذخیره در localStorage برای آمار داخلی
    const pwaStats = JSON.parse(localStorage.getItem('pwa_stats') || '{}');
    pwaStats[eventName] = pwaStats[eventName] || [];
    pwaStats[eventName].push(eventData);
    localStorage.setItem('pwa_stats', JSON.stringify(pwaStats));
    
    // ارسال به تلگرام (اختیاری)
    if (window.appConfig?.telegram?.sendErrors && eventName.includes('error')) {
        const message = `🚨 رویداد PWA: ${eventName}\n📱 دستگاه: ${navigator.platform}\n📅 زمان: ${new Date().toLocaleString('fa-IR')}`;
        if (window.sendToTelegram) {
            window.sendToTelegram(message);
        }
    }
}

// بررسی دوره‌ی نصب برنامه
function checkInstallStatus() {
    const isInstalled = checkIfInstalled();
    
    if (isInstalled) {
        console.log('🎉 برنامه از قبل نصب شده است');
        document.body.classList.add('pwa-installed');
        
        // مخفی کردن بنر نصب
        hideInstallBanner(30);
        
        // رهگیری
        trackPWAInstallEvent('already_installed');
    } else {
        console.log('📦 برنامه نصب نشده است');
        document.body.classList.add('pwa-not-installed');
    }
    
    return isInstalled;
}

// اکسپورت توابع
window.installPWA = installPWA;
window.hideInstallBanner = hideInstallBanner;
window.showInstallBanner = showInstallBanner;
window.checkIfInstalled = checkIfInstalled;
window.checkInstallStatus = checkInstallStatus;

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Install Promotion در حال راه‌اندازی...');
    
    // بررسی وضعیت نصب
    setTimeout(() => {
        checkInstallStatus();
    }, 1000);
    
    // گوش دادن به تغییرات display-mode
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
        if (e.matches) {
            console.log('🔄 برنامه به حالت standalone تغییر کرد');
            trackPWAInstallEvent('display_mode_changed', { mode: 'standalone' });
        }
    });
});

// استایل اضافی برای بنر نصب (اضافه به style.css)
const installBannerStyles = `
.install-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 1rem;
    z-index: 10000;
    box-shadow: 0 -2px 20px rgba(0,0,0,0.3);
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.install-banner.show {
    transform: translateY(0);
}

.banner-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 800px;
    margin: 0 auto;
    gap: 1rem;
}

.banner-icon {
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.2);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.banner-text {
    flex: 1;
}

.banner-text strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.3rem;
}

.banner-text small {
    font-size: 0.85rem;
    opacity: 0.9;
}

.banner-features {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.8rem;
}

.banner-features span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
}

.banner-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.install-btn {
    background: white;
    color: #3b82f6;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
}

.install-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.later-btn {
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
}

.close-banner {
    background: transparent;
    color: white;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.close-banner:hover {
    background: rgba(255, 255, 255, 0.1);
}

.install-instructions {
    background: white;
    border-radius: 15px;
    padding: 1rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    max-width: 500px;
    margin: 0 auto;
}

.install-instructions i {
    font-size: 2rem;
    color: #3b82f6;
}

.install-instructions h4 {
    margin: 0 0 0.5rem 0;
    color: #3b82f6;
}

.install-instructions p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
}

.install-instructions button {
    background: transparent;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1rem;
}

body.pwa-installed .install-promo {
    display: none;
}

@media (max-width: 768px) {
    .banner-content {
        flex-direction: column;
        text-align: center;
        gap: 0.8rem;
    }
    
    .banner-features {
        justify-content: center;
    }
    
    .banner-actions {
        width: 100%;
        justify-content: center;
    }
}
`;

// اضافه کردن استایل به صفحه
const styleSheet = document.createElement('style');
styleSheet.textContent = installBannerStyles;
document.head.appendChild(styleSheet);

console.log('✅ Install Promotion آماده است');
