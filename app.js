// =======================
// APP CORE - English with Fred
// =======================

// وضعیت برنامه
const appState = {
    soundEnabled: true,
    theme: 'dark',
    notifications: true,
    autoSpeak: true
};

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log("🌟 English with Fred بارگذاری شد");
    
    // راه‌اندازی اولیه
    initializeApp();
    
    // نمایش پیام خوش‌آمدگویی
    setTimeout(() => {
        if (!localStorage.getItem('welcomeShown')) {
            showNotification('🌟 به English with Fred خوش آمدید!', 'success');
            localStorage.setItem('welcomeShown', 'true');
        }
    }, 1500);
    
    // ثبت Service Worker برای PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker ثبت شد:', registration.scope);
            })
            .catch(error => {
                console.log('❌ ثبت Service Worker با خطا مواجه شد:', error);
            });
    }
});

// راه‌اندازی برنامه
function initializeApp() {
    // تنظیم تم از localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // تنظیم بهترین امتیاز
    updateBestScore();
    
    // تنظیم ستاره‌ها
    updateStars();
    
    // تنظیم تعداد اشتباهات
    if (window.MistakeStorage) {
        MistakeStorage.updateMistakesCount();
    }
    
    // اضافه کردن event listeners
    setupEventListeners();
    
    console.log("✅ برنامه راه‌اندازی شد");
}

// تنظیم event listeners
function setupEventListeners() {
    // دکمه سکوت جهانی
    const globalMuteBtn = document.getElementById('globalMuteBtn');
    if (globalMuteBtn) {
        globalMuteBtn.addEventListener('click', toggleGlobalMute);
    }
    
    // دکمه تغییر تم
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // دکمه‌های سکوت در صفحات مختلف
    const muteButtons = document.querySelectorAll('.mute-btn');
    muteButtons.forEach(btn => {
        if (!btn.id) {
            btn.addEventListener('click', toggleGlobalMute);
        }
    });
    
    // دکمه‌های تم در صفحات مختلف
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        if (!btn.id || btn.id === 'themeToggle') {
            btn.addEventListener('click', toggleTheme);
        }
    });
}

// تغییر وضعیت سکوت
function toggleGlobalMute() {
    appState.soundEnabled = !appState.soundEnabled;
    const icon = this ? this.querySelector('i') : document.querySelector('#globalMuteBtn i');
    
    if (icon) {
        icon.className = appState.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
    
    showNotification(
        appState.soundEnabled ? '🔊 صدا فعال شد' : '🔇 صدا غیرفعال شد',
        'info'
    );
    
    localStorage.setItem('soundEnabled', appState.soundEnabled);
}

// تغییر تم
function toggleTheme() {
    const newTheme = appState.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// اعمال تم
function setTheme(theme) {
    appState.theme = theme;
    document.body.className = theme + '-theme';
    
    // به‌روزرسانی آیکون
    const themeIcons = document.querySelectorAll('.theme-btn i');
    themeIcons.forEach(icon => {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
    
    localStorage.setItem('theme', theme);
    
    // اعلان
    if (appState.notifications) {
        showNotification(
            theme === 'light' ? '🌞 تم روشن فعال شد' : '🌙 تم تاریک فعال شد',
            'info'
        );
    }
}

// به‌روزرسانی بهترین امتیاز
function updateBestScore() {
    const bestScore = localStorage.getItem('bestScore') || '0';
    const bestScoreElement = document.getElementById('bestScore');
    
    if (bestScoreElement) {
        bestScoreElement.textContent = `${bestScore}%`;
    }
}

// به‌روزرسانی ستاره‌ها
function updateStars() {
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    const stars = document.querySelectorAll('.stars i');
    
    if (stars.length === 0) return;
    
    // محاسبه تعداد ستاره‌ها (از ۰ تا ۵)
    const starCount = Math.floor(bestScore / 20);
    
    stars.forEach((star, index) => {
        if (index < starCount) {
            star.className = 'fas fa-star';
            star.style.color = '#fbbf24';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#cbd5e1';
        }
    });
}

// نمایش گزارش پیشرفت
function showProgressReport() {
    const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
    
    if (history.length === 0) {
        showNotification('📊 هنوز آزمونی انجام نشده است', 'info');
        return;
    }
    
    let report = `📈 گزارش پیشرفت:\n\n`;
    report += `تعداد آزمون‌ها: ${history.length}\n`;
    
    // محاسبه میانگین
    const totalScore = history.reduce((sum, test) => sum + test.score, 0);
    const averageScore = Math.round(totalScore / history.length);
    
    report += `میانگین امتیاز: ${averageScore}%\n`;
    report += `بهترین امتیاز: ${localStorage.getItem('bestScore') || '0'}%\n`;
    
    // آخرین آزمون
    const lastTest = history[history.length - 1];
    report += `\nآخرین آزمون:\n`;
    report += `حالت: ${getModeName(lastTest.mode)}\n`;
    report += `امتیاز: ${lastTest.score}%\n`;
    report += `تاریخ: ${new Date(lastTest.date).toLocaleDateString('fa-IR')}`;
    
    alert(report);
}

// ثبت نام در واتساپ
function joinWhatsApp() {
    const phoneNumber = '09017708544';
    const message = 'سلام! می‌خواهم در English with Fred ثبت نام کنم.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    if (confirm('آیا می‌خواهید به واتساپ منتقل شوید؟')) {
        window.open(url, '_blank');
    }
}

// ارسال گزارش به تلگرام
function sendTelegramReport() {
    const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
    const bestScore = localStorage.getItem('bestScore') || '0';
    const mistakes = JSON.parse(localStorage.getItem('fredMistakes') || '[]');
    
    let report = `📊 گزارش English with Fred\n\n`;
    report += `🏆 بهترین امتیاز: ${bestScore}%\n`;
    report += `📈 تعداد آزمون‌ها: ${history.length}\n`;
    report += `❌ تعداد اشتباهات: ${mistakes.length}\n`;
    
    if (history.length > 0) {
        const lastTest = history[history.length - 1];
        report += `\nآخرین آزمون:\n`;
        report += `• حالت: ${getModeName(lastTest.mode)}\n`;
        report += `• امتیاز: ${lastTest.score}%\n`;
        report += `• تاریخ: ${new Date(lastTest.date).toLocaleDateString('fa-IR')}`;
    }
    
    // استفاده از تلگرام Web
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://farzadseb.github.io/Fred-English/')}&text=${encodeURIComponent(report)}`;
    
    window.open(telegramUrl, '_blank', 'width=600,height=400');
    
    showNotification('📤 گزارش برای ارسال به تلگرام آماده شد', 'success');
}

// خروج از برنامه
function exitApp() {
    if (confirm('آیا می‌خواهید از برنامه خارج شوید؟')) {
        // اگر PWA نصب شده، ببند
        if (window.matchMedia('(display-mode: standalone)').matches) {
            window.close();
        } else {
            showNotification('👋 امیدواریم باز هم برگردید!', 'info');
            setTimeout(() => {
                window.history.back();
            }, 2000);
        }
    }
}

// تایید خروج از آزمون
function confirmExitQuiz() {
    if (confirm('آیا می‌خواهید آزمون را رها کنید؟\n\nامتیاز شما ذخیره نخواهد شد.')) {
        switchView('home');
    }
}

// تابع نمایش اعلان
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // مخفی کردن بعد از ۳ ثانیه
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
    
    console.log(`🔔 ${message}`);
}

// تابع تغییر صفحه
function switchView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.add('active');
        console.log(`🔄 تغییر به صفحه: ${viewId}`);
    }
}

// نام حالت آزمون
function getModeName(mode) {
    const modes = {
        'english-persian': 'انگلیسی → فارسی',
        'persian-english': 'فارسی → انگلیسی',
        'word-definition': 'کلمه → تعریف',
        'definition-word': 'تعریف → کلمه',
        'practice-mode': 'تمرین اشتباهات'
    };
    return modes[mode] || mode;
}

// اکسپورت توابع
window.toggleGlobalMute = toggleGlobalMute;
window.toggleTheme = toggleTheme;
window.showProgressReport = showProgressReport;
window.joinWhatsApp = joinWhatsApp;
window.sendTelegramReport = sendTelegramReport;
window.exitApp = exitApp;
window.confirmExitQuiz = confirmExitQuiz;
window.showNotification = showNotification;
window.switchView = switchView;
window.getModeName = getModeName;
window.updateStars = updateStars;
