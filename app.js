// =======================
// APP CORE FUNCTIONS
// =======================

// وضعیت برنامه
const appState = {
    soundEnabled: true,
    currentTheme: 'light',
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
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        appState.currentTheme = 'light';
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
}

// مدیریت صدا
function toggleSound() {
    const soundBtn = document.getElementById('soundToggle');
    
    appState.soundEnabled = !appState.soundEnabled;
    
    if (appState.soundEnabled) {
        soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        showNotification('🔊 صدا روشن شد', 'success');
    } else {
        soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
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
    
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 📱 **واتساپ شما**
function joinWhatsApp() {
    const phone = "+989017708544"; // شماره شما
    const message = "سلام! می‌خواهم در دوره English with Fred ثبت نام کنم.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// 🤖 **تلگرام شما**
function sendTelegramReport() {
    // اطلاعات تلگرام شما
    const telegramConfig = {
        botToken: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw',
        chatId: '96991859',
        botUsername: 'EnglishWithFredBot'
    };
    
    // اگر ربات واقعی نداریم، از لینک تلگرام استفاده می‌کنیم
    if (!telegramConfig.botToken) {
        sendViaTelegramLink();
        return;
    }
    
    // ارسال واقعی از طریق API تلگرام
    sendViaTelegramAPI();
}

// ارسال از طریق لینک تلگرام
function sendViaTelegramLink() {
    const message = `
📊 **گزارش پیشرفت English with Fred**
👤 دانش‌آموز: ${appState.userId}
📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}
⭐ بهترین امتیاز: ${localStorage.getItem('bestScore') || '0'}%
📊 تعداد آزمون‌ها: ${JSON.parse(localStorage.getItem('testHistory') || '[]').length}

این گزارش به صورت خودکار ارسال شده است.
    `.trim();
    
    const encodedMessage = encodeURIComponent(message);
    const telegramLink = `https://t.me/EnglishWithFredBot?text=${encodedMessage}`;
    window.open(telegramLink, '_blank');
    
    showNotification('📤 لینک تلگرام باز شد. پیام را ارسال کنید.', 'info');
}

// ارسال از طریق API تلگرام
async function sendViaTelegramAPI() {
    const telegramConfig = {
        botToken: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw',
        chatId: '96991859'
    };
    
    try {
        const message = `
📊 گزارش آزمون English with Fred
👤 دانش‌آموز: ${appState.userId}
📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}
⭐ بهترین امتیاز: ${localStorage.getItem('bestScore') || '0'}%
        `.trim();
        
        showNotification('🔄 در حال ارسال به تلگرام...', 'info');
        
        const response = await fetch(
            `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: telegramConfig.chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            }
        );
        
        if (response.ok) {
            showNotification('✅ گزارش به تلگرام ارسال شد', 'success');
        } else {
            throw new Error('خطا در ارسال گزارش');
        }
    } catch (error) {
        console.error('خطا در ارسال به تلگرام:', error);
        showNotification('❌ خطا در ارسال گزارش. از روش لینک استفاده کنید.', 'error');
        
        // استفاده از روش لینک به عنوان fallback
        setTimeout(() => sendViaTelegramLink(), 1000);
    }
}

// متدهای منو
function reviewMistakesPage() {
    showNotification('⏳ این بخش به زودی اضافه می‌شود', 'info');
}

function showProgressReport() {
    showNotification('📊 در حال آماده‌سازی گزارش پیشرفت...', 'info');
}

function exitApp() {
    if (confirm('آیا مطمئن هستید که می‌خواهید از برنامه خارج شوید؟')) {
        showNotification('👋 از همراهی شما متشکریم! دوباره برگردید.', 'info');
    }
}

function showMistakesReview() {
    showNotification('🔍 امکان مرور پاسخ‌ها به زودی اضافه می‌شود', 'info');
}

// فعال‌سازی Text-to-Speech با تنظیمات خاص
function speak(text) {
    if (!appState.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
        // متوقف کردن تلفظ قبلی
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.5; // سرعت 0.5
        utterance.pitch = 1;
        
        // تلاش برای انتخاب صدای زن
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.lang === 'en-US' && 
            voice.name.toLowerCase().includes('female')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// تلفظ سوال (اگر انگلیسی باشد)
function speakQuestion() {
    if (!appState.soundEnabled) {
        showNotification('🔇 صدا خاموش است', 'warning');
        return;
    }
    
    const questionText = document.getElementById('questionText').textContent;
    
    // فقط اگر سوال انگلیسی است تلفظ کن
    const englishRegex = /^[A-Za-z\s]+$/;
    if (englishRegex.test(questionText.trim())) {
        speak(questionText);
    } else {
        showNotification('این سوال انگلیسی نیست', 'info');
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری تنظیمات از localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedSound = localStorage.getItem('soundEnabled') !== 'false'; // پیش‌فرض true
    
    // اعمال تم
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        appState.currentTheme = 'dark';
    }
    
    // اعمال تنظیمات صدا
    appState.soundEnabled = savedSound;
    if (!savedSound) {
        document.getElementById('soundToggle').innerHTML = '<i class="fas fa-volume-mute"></i>';
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
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
    
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
            speakQuestion();
        }
        
        // Esc برای بازگشت
        if (e.code === 'Escape') {
            switchView('home');
        }
    });
    
    console.log('🤖 تلگرام: @EnglishWithFredBot');
    console.log('📱 واتساپ: 090177708544');
});
