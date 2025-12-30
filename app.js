// =======================
// APP CORE - English with Fred
// =======================

// وضعیت برنامه
const appState = {
    soundEnabled: true,
    theme: 'dark',
    notifications: true,
    autoSpeak: true,
    currentUser: null
};

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log("🌟 English with Fred بارگذاری شد");
    
    // چک کردن آیا کاربر از قبل ثبت‌نام کرده
    const savedUser = localStorage.getItem('fredUser');
    
    if (savedUser) {
        // کاربر از قبل ثبت‌نام کرده
        try {
            appState.currentUser = JSON.parse(savedUser);
            initializeApp();
            switchView('home');
            updateUserDisplay();
            
            // نمایش پیام خوش‌آمدگویی با تأخیر ۲ ثانیه
            setTimeout(() => {
                showWelcomeMessage();
            }, 2000);
        } catch (e) {
            console.error("❌ خطا در خواندن اطلاعات کاربر:", e);
            switchView('login');
        }
    } else {
        // کاربر جدید
        switchView('login');
    }
    
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

// ذخیره اطلاعات کاربر
function saveUserInfo() {
    const usernameInput = document.getElementById('usernameInput');
    const studentCodeInput = document.getElementById('studentCode');
    
    const username = usernameInput.value.trim();
    const studentCode = studentCodeInput.value.trim();
    
    if (!username) {
        showNotification('⚠️ لطفاً نام خود را وارد کنید', 'error');
        usernameInput.focus();
        return;
    }
    
    // ایجاد شناسه یکتا برای کاربر
    const userId = 'user' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // ذخیره اطلاعات کاربر
    appState.currentUser = {
        id: userId,
        username: username,
        studentCode: studentCode || null,
        joinedAt: new Date().toISOString(),
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        }
    };
    
    localStorage.setItem('fredUser', JSON.stringify(appState.currentUser));
    
    // شروع برنامه
    initializeApp();
    switchView('home');
    updateUserDisplay();
    
    // نمایش پیام خوش‌آمدگویی برای 5 ثانیه
    showNotification(`👋 سلام ${username}! خوش آمدید`, 'success', 5000);
    
    // نمایش پیام انگیزشی با تأخیر ۲ ثانیه
    setTimeout(() => {
        showWelcomeMessage();
    }, 2000);
}

// به‌روزرسانی نمایش نام کاربر
function updateUserDisplay() {
    if (!appState.currentUser) return;
    
    const usernameElements = document.querySelectorAll('#currentUsername, #quizUsername, #resultsUsername, #mistakesUsername, #learningUsername');
    usernameElements.forEach(element => {
        if (element) {
            element.textContent = appState.currentUser.username;
        }
    });
}

// نمایش پیام خوش‌آمدگویی
function showWelcomeMessage() {
    if (appState.currentUser) {
        const welcomeMessages = [
            `🌟 ${appState.currentUser.username} عزیز، به English with Fred خوش آمدید!`,
            `🎯 ${appState.currentUser.username} جان، بیایید انگلیسی رو با هم یاد بگیریم!`,
            `🚀 ${appState.currentUser.username} عزیز، آماده‌ای برای چالش لغات؟`
        ];
        const randomMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        showNotification(randomMsg, 'success');
    }
}

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
    
    console.log("✅ برنامه راه‌اندازی شد برای کاربر:", appState.currentUser?.username);
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
    const userKey = appState.currentUser ? `bestScore_${appState.currentUser.id}` : 'bestScore';
    const bestScore = localStorage.getItem(userKey) || '0';
    const bestScoreElement = document.getElementById('bestScore');
    
    if (bestScoreElement) {
        bestScoreElement.textContent = `${bestScore}%`;
    }
}

// به‌روزرسانی ستاره‌ها
function updateStars() {
    const userKey = appState.currentUser ? `bestScore_${appState.currentUser.id}` : 'bestScore';
    const bestScore = parseInt(localStorage.getItem(userKey) || '0');
    const stars = document.querySelectorAll('.stars i');
    const bestScoreElement = document.getElementById('bestScore');
    
    if (bestScoreElement) {
        bestScoreElement.textContent = `${bestScore}%`;
    }
    
    if (stars.length === 0) return;
    
    // منطق پر کردن ستاره‌ها (هر 20% یک ستاره)
    const starCount = Math.floor(bestScore / 20);
    
    stars.forEach((star, index) => {
        if (index < starCount) {
            star.className = 'fas fa-star';
            star.style.color = '#FFD700'; // زرد طلایی
        } else {
            star.className = 'far fa-star';
            star.style.color = '#cbd5e1';
        }
    });
}

// نمایش گزارش پیشرفت
function showProgressReport() {
    const userKey = appState.currentUser ? `testHistory_${appState.currentUser.id}` : 'testHistory';
    const history = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    if (history.length === 0) {
        showNotification('📊 هنوز آزمونی انجام نشده است', 'info');
        return;
    }
    
    const bestScoreKey = appState.currentUser ? `bestScore_${appState.currentUser.id}` : 'bestScore';
    const bestScore = localStorage.getItem(bestScoreKey) || '0';
    
    let report = `📈 گزارش پیشرفت ${appState.currentUser ? appState.currentUser.username : 'کاربر'}:\n\n`;
    report += `تعداد آزمون‌ها: ${history.length}\n`;
    
    // محاسبه میانگین
    const totalScore = history.reduce((sum, test) => sum + test.score, 0);
    const averageScore = Math.round(totalScore / history.length);
    
    report += `میانگین امتیاز: ${averageScore}%\n`;
    report += `بهترین امتیاز: ${bestScore}%\n`;
    
    // آخرین آزمون
    const lastTest = history[history.length - 1];
    report += `\nآخرین آزمون:\n`;
    report += `حالت: ${getModeName(lastTest.mode)}\n`;
    report += `امتیاز: ${lastTest.score}%\n`;
    report += `تاریخ: ${new Date(lastTest.date).toLocaleDateString('fa-IR')}\n`;
    report += `ساعت: ${lastTest.time || '--'}`;
    
    // استفاده از alert با استایل بهتر
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${appState.theme === 'dark' ? '#2d3748' : 'white'};
        color: ${appState.theme === 'dark' ? '#e2e8f0' : '#1e293b'};
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 90%;
        width: 400px;
        font-family: Vazirmatn, sans-serif;
        border: 2px solid #3b82f6;
    `;
    
    modal.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <h3 style="color: #3b82f6; margin: 0 0 10px 0;">📊 گزارش پیشرفت</h3>
            <div style="font-size: 14px; color: ${appState.theme === 'dark' ? '#94a3b8' : '#64748b'};">
                ${report.replace(/\n/g, '<br>')}
            </div>
        </div>
        <button onclick="this.parentElement.remove()" 
                style="background: #3b82f6; color: white; border: none; padding: 8px 20px; 
                       border-radius: 8px; cursor: pointer; display: block; margin: 0 auto;">
            بستن
        </button>
    `;
    
    document.body.appendChild(modal);
    
    // کلیک خارج از modal برای بستن
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ثبت نام در واتساپ - بدون پرسیدن سوال
function joinWhatsApp() {
    const phoneNumber = '09017708544';
    const username = appState.currentUser ? appState.currentUser.username : 'کاربر جدید';
    const message = `سلام! من ${username} هستم. می‌خواهم در English with Fred ثبت نام کنم.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // مستقیماً باز کردن واتس‌اپ بدون پرسیدن سوال
    window.open(url, '_blank');
    
    showNotification('📱 در حال انتقال به واتس‌اپ...', 'info');
}

// خروج / تغییر کاربر - با ارسال خودکار به تلگرام
function showExitOptions() {
    const currentUser = window.appState?.currentUser;
    
    if (!currentUser) {
        switchView('login');
        return;
    }
    
    if (confirm('آیا می‌خواهید از حساب کاربری خارج شوید؟\n\nپس از خروج می‌توانید با نام دیگری وارد شوید.')) {
        // ارسال خودکار گزارش به تلگرام قبل از خروج
        if (window.sendExitTelegramReport) {
            window.sendExitTelegramReport();
        }
        
        // پاک کردن اطلاعات کاربر جاری
        localStorage.removeItem('fredUser');
        appState.currentUser = null;
        
        // رفتن به صفحه ورود
        switchView('login');
        showNotification('👋 با موفقیت خارج شدید', 'info');
    }
}

// تایید خروج از آزمون - با پیام انگیزشی بامزه
function confirmExitQuiz() {
    const motivationalMessages = [
        "🎮 بازی رو نیمه‌کاره رها می‌کنی؟ ادامه بده!",
        "🐱 تو که گربه نیستی که ۹ جان داشته باشی! ادامه بده!",
        "🎯 فقط چند قدم مونده به خط پایان! ادامه بده!",
        "🚀 تقریباً رسیدی! بذار تمومش کنیم!",
        "🏆 مدال نزدیکه! رها نکن!"
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    if (confirm(randomMessage + '\n\nآیا مطمئنید می‌خواهید آزمون را رها کنید؟')) {
        switchView('home');
        showNotification('🏠 بازگشت به صفحه اصلی', 'info');
    }
}

// تلفظ متن با سرعت ۰.۵ و صدای زن آمریکایی - کاملاً اصلاح شده
function speakText(text, rate = 0.5) {
    if (!appState.soundEnabled || !('speechSynthesis' in window)) {
        console.log('🔇 صدا غیرفعال است یا پشتیبانی نمی‌شود');
        return;
    }
    
    // متوقف کردن تلفظ قبلی
    speechSynthesis.cancel();
    
    // مطمئن شویم که صداها بارگذاری شده‌اند
    let voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
        // اگر صداها بارگذاری نشده‌اند، منتظر بمان
        speechSynthesis.addEventListener('voiceschanged', () => {
            voices = speechSynthesis.getVoices();
            speakWithVoice(text, rate, voices);
        }, { once: true });
        return;
    }
    
    speakWithVoice(text, rate, voices);
}

// تابع کمکی برای تلفظ
function speakWithVoice(text, rate, voices) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.volume = 1;
    utterance.pitch = 1;
    
    // پیدا کردن صدای زن آمریکایی
    let femaleVoice = null;
    
    // اولویت‌بندی برای صداهای زن آمریکایی
    const preferredVoices = [
        'Samantha', // صدای زن پیش‌فرض iOS
        'Karen',    // صدای زن مک
        'Google US English Female',
        'Microsoft Zira Desktop',
        'English (America)'
    ];
    
    for (const voiceName of preferredVoices) {
        femaleVoice = voices.find(voice => 
            voice.lang === 'en-US' && 
            voice.name.includes(voiceName)
        );
        if (femaleVoice) break;
    }
    
    // اگر پیدا نشد، اولین صدای انگلیسی آمریکایی
    if (!femaleVoice) {
        femaleVoice = voices.find(voice => voice.lang === 'en-US');
    }
    
    if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log(`🔊 استفاده از صدا: ${femaleVoice.name}`);
    }
    
    utterance.onstart = () => {
        console.log('🔊 تلفظ شروع شد:', text);
    };
    
    utterance.onend = () => {
        console.log('🔇 تلفظ پایان یافت');
    };
    
    utterance.onerror = (event) => {
        console.error('❌ خطا در تلفظ:', event.error);
    };
    
    // تاخیر کوچک برای اطمینان از آماده بودن
    setTimeout(() => {
        speechSynthesis.speak(utterance);
    }, 100);
}

// تابع نمایش اعلان با مدت زمان قابل تنظیم
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // مخفی کردن بعد از زمان مشخص
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
    
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
window.showExitOptions = showExitOptions;
window.confirmExitQuiz = confirmExitQuiz;
window.showNotification = showNotification;
window.switchView = switchView;
window.getModeName = getModeName;
window.updateStars = updateStars;
window.speakText = speakText;
window.saveUserInfo = saveUserInfo;
