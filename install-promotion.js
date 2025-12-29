// =======================
// PWA INSTALL PROMOTION
// =======================

// مدیریت نصب PWA
let deferredPrompt;
let installButton = null;
let installBanner = null;

// ایجاد بنر نصب
function createInstallBanner() {
  const banner = document.createElement('div');
  banner.id = 'installBanner';
  banner.className = 'install-banner';
  banner.innerHTML = `
    <div class="banner-content">
      <i class="fas fa-download"></i>
      <div class="banner-text">
        <strong>نصب English with Fred</strong>
        <small>برای دسترسی سریع‌تر و آفلاین</small>
      </div>
      <button id="installBtn" class="install-btn">
        نصب برنامه
      </button>
      <button id="closeBanner" class="close-banner">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  return banner;
}

// رویدادهای نصب
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // نمایش بنر پس از 10 ثانیه
  setTimeout(() => {
    if (deferredPrompt && !localStorage.getItem('pwaDismissed')) {
      showInstallBanner();
    }
  }, 10000);
});

// نمایش بنر
function showInstallBanner() {
  if (!installBanner) {
    installBanner = createInstallBanner();
    installButton = document.getElementById('installBtn');
    const closeButton = document.getElementById('closeBanner');
    
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ کاربر برنامه را نصب کرد');
        hideInstallBanner();
        showNotification('🎉 برنامه با موفقیت نصب شد!', 'success');
        
        // رهگیری نصب
        trackInstall();
      }
      
      deferredPrompt = null;
    });
    
    closeButton.addEventListener('click', () => {
      localStorage.setItem('pwaDismissed', 'true');
      hideInstallBanner();
    });
  }
  
  installBanner.style.display = 'block';
}

// مخفی کردن بنر
function hideInstallBanner() {
  if (installBanner) {
    installBanner.style.display = 'none';
  }
}

// رهگیری نصب
function trackInstall() {
  const installs = parseInt(localStorage.getItem('pwaInstalls') || '0');
  localStorage.setItem('pwaInstalls', (installs + 1).toString());
  localStorage.setItem('lastInstallDate', new Date().toISOString());
}

// چک کردن وضعیت نصب
function checkInstallStatus() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 برنامه به صورت نصب‌شده اجرا می‌شود');
    localStorage.setItem('runningAsPWA', 'true');
    return true;
  }
  return false;
}

// پیشنهاد نصب پس از تعامل مثبت
function suggestInstallAfterSuccess(score) {
  if (score > 70 && deferredPrompt && !localStorage.getItem('pwaDismissed')) {
    setTimeout(() => {
      if (confirm(`🎉 عالی! شما ${score}% گرفتید!\n\nمی‌خواهید برنامه را نصب کنید تا:\n• آفلاین کار کند\n• سرعت بیشتر شود\n• مانند اپلیکیشن واقعی باشد`)) {
        deferredPrompt.prompt();
      }
    }, 2000);
  }
}

// اکسپورت توابع
window.showInstallBanner = showInstallBanner;
window.hideInstallBanner = hideInstallBanner;
window.suggestInstallAfterSuccess = suggestInstallAfterSuccess;
window.checkInstallStatus = checkInstallStatus;

// فعال کردن
document.addEventListener('DOMContentLoaded', function() {
  checkInstallStatus();
});
