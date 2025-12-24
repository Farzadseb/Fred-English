// ===== Initialize در app.js خط مربوطه =====
// در فایل app.js پیدا کن (خطوط نزدیگ به انتهای DOMContentLoaded):
// ❌ قدیمی (۵ ثانیه):
// setTimeout(() => {
//     if (deferredPrompt && !isPWAInstalled) {
//         showInstallPrompt();
//     }
// }, 5000);

// ✅ جدید (۱۵ ثانیه):
setTimeout(() => {
    if (deferredPrompt && !isPWAInstalled) {
        setTimeout(() => {
            showInstallPrompt();
        }, 15000);
    }
}, 1000);
