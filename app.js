// =======================
// APP CORE FUNCTIONS
// =======================

// وضعیت برنامه
const appState = {
    soundEnabled: true,
    currentTheme: 'dark', // پیش‌فرض تم شب
    userId: null
};

// مدیریت صفحات
function switchView(viewName) {
    // مخفی کردن تمام صفحات
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // نمایش صفحه مورد نظر
    const targetView = document.getElementById(viewName);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // اگر به خانه برگشتیم، بهترین امتیاز را آپدیت کنیم
    if (viewName === 'home') {
        updateBestScore();
    }
}

// مدیریت تم
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeToggle');
    
    if (appState.currentTheme === 'light') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        appState.currentTheme = 'dark';
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
        showNotification('🌙 تم تاریک فعال شد', 'success');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        appState.currentTheme = 'light';
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
        showNotification('☀️ تم روشن فعال شد', 'success');
    }
}

// مدیریت صدا (Mute گرد)
function toggleGlobalMute() {
    const muteBtn = document.querySelector('.mute-btn');
    
    appState.soundEnabled = !appState.soundEnabled;
    
    if (appState.soundEnabled) {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        muteBtn.classList.remove('active');
        showNotification('🔊 صدا روشن شد', 'success');
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        muteBtn.classList.add('active');
        showNotification('🔇 صدا خاموش شد', 'warning');
    }
    
    localStorage.setItem('soundEnabled', appState.soundEnabled);
}

// به‌روزرسانی بهترین امتیاز
function updateBestScore() {
    const bestScore = localStorage.getItem('bestScore') || '0';
    document.getElementById('bestScore').textContent = bestScore + '%';
}

// نمایش اعلان
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    
    if (!notification) {
        console.warn('عنصر notification پیدا نشد');
        return;
    }
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 
                         'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.className = 'notification';
    notification.classList.add(type);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 📱 **واتساپ شما**
function joinWhatsApp() {
    const phone = "989017708544"; // شماره شما
    const message = "سلام! می‌خواهم در دوره English with Fred ثبت نام کنم.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// =======================
// سیستم تلگرام - نسخه ساده و تضمینی
// =======================

const TelegramConfig = {
    botUsername: 'EnglishWithFredBot',
    teacherPhone: '09017708544',
    teacherName: 'English with Fred'
};

// تولید گزارش پیشرفت
function createProgressReport() {
    const userId = localStorage.getItem('userId') || 'user_' + Date.now();
    const bestScore = localStorage.getItem('bestScore') || '0';
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    const totalTests = testHistory.length;
    
    // محاسبه آمار
    let avgScore = 0;
    if (totalTests > 0) {
        const total = testHistory.reduce((sum, test) => sum + test.score, 0);
        avgScore = Math.round(total / totalTests);
    }
    
    const today = new Date().toLocaleDateString('fa-IR');
    const time = new Date().toLocaleTimeString('fa-IR');
    
    return {
        fullReport: `
📊 گزارش پیشرفت English with Fred

👤 دانش‌آموز: ${userId}
📅 تاریخ: ${today} - ${time}
⭐ بهترین امتیاز: ${bestScore}%
📈 میانگین امتیاز: ${avgScore}%
📊 تعداد آزمون‌ها: ${totalTests}

👨‍🏫 مدرس: ${TelegramConfig.teacherName}
📱 تماس: ${TelegramConfig.teacherPhone}

✨ هر روز بهتر از دیروز ✨
        `.trim(),
        shortReport: `گزارش English with Fred - بهترین امتیاز: ${bestScore}%`
    };
}

// 🤖 **ارسال گزارش به تلگرام - نسخه ساده**
function sendTelegramReport() {
    const report = createProgressReport();
    
    // کدگذاری پیام (بدون فاصله قبل از encodedMessage)
    const encodedMessage = encodeURIComponent(report.shortReport);
    const telegramLink = `https://t.me/${TelegramConfig.botUsername}?text=${encodedMessage}`;
    
    console.log('🔗 لینک تلگرام:', telegramLink);
    
    // باز کردن تلگرام
    const telegramWindow = window.open(telegramLink, '_blank');
    
    // نمایش پیام به کاربر
    showNotification('📤 در حال ارسال به تلگرام...', 'info');
    
    // بررسی اگر پنجره باز نشد (popup blocker)
    setTimeout(() => {
        if (!telegramWindow || telegramWindow.closed) {
            const choice = confirm(
                'تلگرام باز نشد. می‌خواهید:\n\n' +
                '✅ OK = گزارش در حافظه کپی شود\n' +
                '❌ Cancel = از واتساپ استفاده کنید'
            );
            
            if (choice) {
                copyToClipboard(report.fullReport);
                showNotification('📋 گزارش در حافظه کپی شد!', 'success');
                
                // راهنمایی بیشتر
                setTimeout(() => {
                    alert(
                        '📋 گزارش در حافظه کپی شد!\n\n' +
                        'حالا می‌توانید:\n' +
                        '1. تلگرام را باز کنید\n' +
                        '2. به @EnglishWithFredBot بروید\n' +
                        '3. پیام را Paste کنید (Ctrl+V)\n' +
                        '4. دکمه SEND را بزنید\n\n' +
                        'مدرس به زودی با شما تماس می‌گیرد 📞'
                    );
                }, 500);
            } else {
                // استفاده از واتساپ
                const whatsappLink = `https://wa.me/98${TelegramConfig.teacherPhone.substring(1)}?text=${encodedMessage}`;
                window.open(whatsappLink, '_blank');
                showNotification('📱 در حال بازکردن واتساپ...', 'info');
            }
        } else {
            showNotification('✅ تلگرام باز شد! دکمه SEND را بزنید.', 'success');
        }
    }, 1000);
}

// کپی به کلیپ‌بورد
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => console.log('✅ متن کپی شد'))
            .catch(err => {
                console.error('❌ خطا در کپی:', err);
                fallbackCopyToClipboard(text);
            });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// روش قدیمی کپی
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        console.log('✅ متن کپی شد (روش قدیمی)');
    } catch (err) {
        console.error('❌ خطا در کپی:', err);
    }
    
    document.body.removeChild(textarea);
}

// متدهای منو
function reviewMistakesPage() {
    showNotification('⏳ این بخش به زودی اضافه می‌شود', 'info');
}

function showProgressReport() {
    const report = createProgressReport();
    alert(report.fullReport);
}

function exitApp() {
    if (confirm('آیا مطمئن هستید که می‌خواهید از برنامه خارج شوید؟')) {
        showNotification('👋 از همراهی شما متشکریم! دوباره برگردید.', 'info');
        // در حالت PWA می‌توانید برنامه را ببندید
        // window.close(); // فقط در برخی موارد کار می‌کند
    }
}

function showMistakesReview() {
    showNotification('🔍 امکان مرور پاسخ‌ها به زودی اضافه می‌شود', 'info');
}

// =======================
// سیستم صدا و تلفظ
// =======================

// فعال‌سازی Text-to-Speech با تنظیمات خاص
function speak(text) {
    if (!appState.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
        // متوقف کردن تلفظ قبلی
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // سرعت متوسط
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // تلاش برای انتخاب صدای زن
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.lang.includes('en') && 
            voice.name.toLowerCase().includes('female')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        } else if (voices.length > 0) {
            // اولین صدای انگلیسی
            const englishVoice = voices.find(voice => voice.lang.includes('en'));
            if (englishVoice) utterance.voice = englishVoice;
        }
        
        speechSynthesis.speak(utterance);
    } else {
        console.warn('❌ Text-to-Speech پشتیبانی نمی‌شود');
    }
}

// تلفظ سوال فعلی
function speakCurrentQuestion() {
    if (!appState.soundEnabled) {
        showNotification('🔇 صدا خاموش است', 'warning');
        return;
    }
    
    const questionText = document.getElementById('questionText');
    if (questionText) {
        const text = questionText.textContent || questionText.innerText;
        
        // بررسی آیا متن انگلیسی است (حداقل شامل یک حرف انگلیسی)
        const hasEnglish = /[A-Za-z]/.test(text);
        if (hasEnglish) {
            speak(text);
        } else {
            showNotification('⚠️ متن انگلیسی برای تلفظ پیدا نشد', 'info');
        }
    }
}

// تلفظ متن کلیک شده
function speakText(element) {
    if (!appState.soundEnabled) {
        showNotification('🔇 صدا خاموش است', 'warning');
        return;
    }
    
    const text = element.textContent || element.innerText;
    speak(text);
}

// راه‌اندازی سیستم صدا
function initializeSpeechSystem() {
    if ('speechSynthesis' in window) {
        // بارگذاری صداها
        speechSynthesis.getVoices();
        
        // برخی مرورگرها نیاز دارند صداها دوباره لود شوند
        setTimeout(() => {
            const voices = speechSynthesis.getVoices();
            console.log(`🎵 ${voices.length} صدای TTS پیدا شد`);
            
            // نمایش صداهای انگلیسی
            const englishVoices = voices.filter(v => v.lang.includes('en'));
            console.log(`🎤 ${englishVoices.length} صدای انگلیسی:`, 
                englishVoices.map(v => `${v.name} (${v.lang})`));
        }, 1000);
    }
}

// =======================
// بارگذاری اولیه
// =======================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 English with Fred در حال راه‌اندازی...');
    
    // بارگذاری تنظیمات از localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'; // پیش‌فرض تم تاریک
    const savedSound = localStorage.getItem('soundEnabled') !== 'false'; // پیش‌فرض true
    
    // اعمال تم پیش‌فرض تاریک
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        appState.currentTheme = 'dark';
    } else {
        document.body.classList.add('light-theme');
        appState.currentTheme = 'light';
    }
    
    // تنظیم آیکون دکمه تم
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = appState.currentTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }
    
    // اعمال تنظیمات صدا
    appState.soundEnabled = savedSound;
    const muteBtn = document.querySelector('.mute-btn');
    if (muteBtn) {
        muteBtn.innerHTML = appState.soundEnabled 
            ? '<i class="fas fa-volume-up"></i>' 
            : '<i class="fas fa-volume-mute"></i>';
        
        if (!appState.soundEnabled) {
            muteBtn.classList.add('active');
        }
    }
    
    // ایجاد ID کاربر اگر وجود ندارد
    if (!localStorage.getItem('userId')) {
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    appState.userId = localStorage.getItem('userId');
    
    // آپدیت اطلاعات
    updateBestScore();
    
    // بررسی وضعیت دیتا
    if (window.words && words.length > 0) {
        console.log(`✅ ${words.length} لغت با موفقیت لود شد`);
    } else {
        console.warn('⚠️ لغات لود نشده‌اند');
        showNotification('لطفاً لغات را به فایل words.js اضافه کنید', 'warning', 5000);
    }
    
    // رویداد کلیک برای دکمه‌ها
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // راه‌اندازی سیستم صدا
    initializeSpeechSystem();
    
    // رویدادهای صفحه‌کلید
    document.addEventListener('keydown', function(e) {
        // کلید 1-4 برای انتخاب گزینه‌ها
        if (e.key >= '1' && e.key <= '4' && document.getElementById('quiz').classList.contains('active')) {
            const options = document.querySelectorAll('.option-btn');
            const index = parseInt(e.key) - 1;
            if (options[index]) {
                options[index].click();
            }
        }
        
        // Space برای تلفظ سوال
        if (e.code === 'Space' && document.getElementById('quiz').classList.contains('active')) {
            e.preventDefault();
            speakCurrentQuestion();
        }
        
        // Esc برای بازگشت
        if (e.code === 'Escape') {
            switchView('home');
        }
        
        // Ctrl+T برای تغییر تم
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Ctrl+M برای قطع صدا
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            toggleGlobalMute();
        }
    });
    
    console.log('🤖 تلگرام: @EnglishWithFredBot');
    console.log('📱 واتساپ: 09017708544');
    console.log('👤 کاربر: ' + appState.userId);
    console.log('🎨 تم: ' + appState.currentTheme);
    console.log('🔊 صدا: ' + (appState.soundEnabled ? 'فعال' : 'غیرفعال'));
    console.log('✅ برنامه آماده است!');
    
    // نمایش خوش‌آمدگویی
    setTimeout(() => {
        showNotification('🎉 به English with Fred خوش آمدید!', 'success', 2000);
    }, 1000);
});

// =======================
// توابع عمومی برای استفاده در سایر فایل‌ها
// =======================

// برای استفاده در quiz-engine.js
window.appState = appState;
window.switchView = switchView;
window.showNotification = showNotification;
window.speakCurrentQuestion = speakCurrentQuestion;
window.toggleGlobalMute = toggleGlobalMute;
window.sendTelegramReport = sendTelegramReport;
