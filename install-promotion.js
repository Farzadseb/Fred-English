// =======================
// PWA INSTALL PROMOTION
// =======================

let deferredPrompt;
let installShown = false;

// ذخیره تاریخ آخرین نمایش بنر
function setInstallBannerShown() {
    const today = new Date().toDateString();
    localStorage.setItem('installBannerLastShown', today);
    installShown = true;
}

// بررسی آیا امروز بنر نشان داده شده
function wasInstallBannerShownToday() {
    const lastShown = localStorage.getItem('installBannerLastShown');
    const today = new Date().toDateString();
    return lastShown === today;
}

// نمایش بنر نصب
function showInstallBanner() {
    if (installShown || wasInstallBannerShownToday()) return;
    
    const banner = document.getElementById('installBanner');
    if (!banner) return;
    
    banner.style.display = 'block';
    setInstallBannerShown();
    
    // مخفی کردن خودکار بعد از 15 ثانیه
    setTimeout(() => {
        banner.style.display = 'none';
    }, 15000);
}

// پیشنهاد نصب پس از موفقیت در آزمون
function suggestInstallAfterSuccess(score) {
    if (score >= 70 && !installShown && !wasInstallBannerShownToday()) {
        setTimeout(() => {
            const banner = document.getElementById('installBanner');
            if (banner) {
                banner.innerHTML = `
                    <div class="banner-content">
                        <i class="fas fa-download"></i>
                        <div class="banner-text">
                            <strong>🎉 عالی! ${score}% امتیاز گرفتید!</strong>
                            <small>برنامه را نصب کنید تا همیشه دسترسی داشته باشید</small>
                        </div>
                        <button class="install-btn" onclick="installPWA()">
                            <i class="fas fa-download"></i> نصب
                        </button>
                        <button class="close-banner" onclick="hideInstallBanner()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                banner.style.display = 'block';
                setInstallBannerShown();
            }
        }, 1000);
    }
}

// مخفی کردن بنر
function hideInstallBanner() {
    const banner = document.getElementById('installBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// نصب PWA
async function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ کاربر نصب را پذیرفت');
            showNotification('✅ برنامه در حال نصب است...', 'success');
            hideInstallBanner();
        }
        deferredPrompt = null;
    }
}

// Event Listeners
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // نمایش بنر بعد از 3 ثانیه
    setTimeout(() => {
        showInstallBanner();
    }, 3000);
});

window.addEventListener('appinstalled', () => {
    console.log('✅ PWA نصب شد');
    deferredPrompt = null;
    hideInstallBanner();
    showNotification('✅ برنامه با موفقیت نصب شد!', 'success');
});

// اکسپورت توابع
window.showInstallBanner = showInstallBanner;
window.hideInstallBanner = hideInstallBanner;
window.installPWA = installPWA;
window.suggestInstallAfterSuccess = suggestInstallAfterSuccess;
