// =======================
// TELEGRAM INTEGRATION - نسخه کامل با شناسایی کاربر
// =======================

// تنظیمات تلگرام (اینجا قرار دهید یا در config.js)
const TelegramConfig = {
    BOT_TOKEN: window.TELEGRAM_CONFIG?.BOT_TOKEN || '',
    CHAT_ID: window.TELEGRAM_CONFIG?.CHAT_ID || '',
    API_URL: 'https://api.telegram.org/bot'
};

// تابع ارسال پیام به تلگرام
async function sendToTelegram(message) {
    // اگر توکن تنظیم نشده
    if (!TelegramConfig.BOT_TOKEN || TelegramConfig.BOT_TOKEN.includes('AAG')) {
        console.warn('⚠️ توکن تلگرام تنظیم نشده یا قدیمی است');
        return showTelegramFallback(message);
    }
    
    // ارسال به تلگرام
    try {
        const url = `${TelegramConfig.API_URL}${TelegramConfig.BOT_TOKEN}/sendMessage`;
        const payload = {
            chat_id: TelegramConfig.CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.ok) {
            showNotification('✅ گزارش به تلگرام ارسال شد', 'success');
            return true;
        } else {
            console.error('❌ خطای تلگرام:', data.description);
            return showTelegramFallback(message);
        }
    } catch (error) {
        console.error('❌ خطا در ارسال به تلگرام:', error);
        return showTelegramFallback(message);
    }
}

// روش جایگزین اگر ارسال مستقیم شکست خورد
function showTelegramFallback(message) {
    const shareText = `${message}\n\n📍 برنامه: English with Fred\n🔗 لینک: ${window.location.href}`;
    
    // روش ۱: کپی به کلیپ‌بورد
    navigator.clipboard.writeText(shareText)
        .then(() => {
            if (confirm('📋 گزارش در کلیپ‌بورد کپی شد!\n\nآیا می‌خواهید آن را در تلگرام پیست کنید؟')) {
                // باز کردن تلگرام بدون اجبار
                window.open('https://t.me', '_blank');
            } else {
                showNotification('📋 گزارش در کلیپ‌بورد کپی شد', 'success');
            }
        })
        .catch(() => {
            // روش ۲: نمایش در پنجره
            showNotification('📤 گزارش آماده ارسال است', 'info');
            setTimeout(() => {
                alert('📊 گزارش:\n\n' + shareText + '\n\nاین متن را در تلگرام کپی کنید.');
            }, 500);
        });
    
    return false;
}

// تابع ارسال گزارش پیشرفت
async function sendTelegramReport() {
    const currentUser = window.appState?.currentUser;
    const userId = currentUser?.id || 'anonymous';
    const username = currentUser?.username || 'کاربر ناشناس';
    const phone = currentUser?.phone || 'ثبت نشده';
    
    const bestScoreKey = currentUser ? `bestScore_${userId}` : 'bestScore';
    const historyKey = currentUser ? `testHistory_${userId}` : 'testHistory';
    const mistakesKey = currentUser ? `fredMistakes_${userId}` : 'fredMistakes';
    
    const bestScore = localStorage.getItem(bestScoreKey) || '0';
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const mistakes = JSON.parse(localStorage.getItem(mistakesKey) || '[]');
    const now = new Date();
    
    let message = `<b>📊 گزارش English with Fred</b>\n`;
    message += `<b>👤 کاربر:</b> ${username}\n`;
    message += `<b>📱 شماره:</b> ${phone}\n`;
    message += `<b>🆔 شناسه:</b> ${userId.substring(0, 8)}...\n`;
    message += `<b>⏰ زمان:</b> ${now.toLocaleTimeString('fa-IR')}\n`;
    message += `<b>📅 تاریخ:</b> ${now.toLocaleDateString('fa-IR')}\n\n`;
    
    message += `<b>🏆 بهترین امتیاز:</b> ${bestScore}%\n`;
    message += `<b>📈 تعداد آزمون‌ها:</b> ${history.length}\n`;
    message += `<b>❌ اشتباهات ذخیره شده:</b> ${mistakes.length}\n\n`;
    
    if (history.length > 0) {
        const lastTest = history[history.length - 1];
        message += `<b>آخرین آزمون:</b>\n`;
        message += `🎯 حالت: ${getModeName(lastTest.mode)}\n`;
        message += `✅ امتیاز: ${lastTest.score}%\n`;
        message += `⏱️ مدت: ${lastTest.duration} ثانیه\n`;
        message += `🕐 ساعت: ${lastTest.time || '--'}\n`;
    }
    
    message += `\n🔗 <a href="${window.location.href}">لینک برنامه</a>`;
    
    // ارسال به تلگرام
    await sendToTelegram(message);
}

// پیام ارشادی بدون باز کردن تلگرام
function showMotivationalTelegramMessage() {
    const currentUser = window.appState?.currentUser;
    const username = currentUser?.username || 'کاربر';
    
    const messages = [
        `🌟 ${username} عزیز، پیشرفت‌ات عالی است! ادامه بده!`,
        `💪 ${username} جان، هر روز بهتر از دیروز!`,
        `🎯 ${username} عزیز، تمرین مستمر کلید موفقیت است!`,
        `🔥 ${username} جان، تو می‌توانی به تمام اهداف‌ات برسی!`,
        `🚀 ${username} عزیز، همین امروز یک قدم به هدفت نزدیک‌تر شو!`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // فقط نمایش در برنامه - نه در تلگرام
    showNotification(randomMessage, 'success');
    
    // در تاریخچه ذخیره کن
    const motivKey = window.appState?.currentUser ? `motivMessages_${window.appState.currentUser.id}` : 'motivMessages';
    const motivHistory = JSON.parse(localStorage.getItem(motivKey) || '[]');
    motivHistory.push({
        message: randomMessage,
        username: username,
        time: new Date().toISOString()
    });
    localStorage.setItem(motivKey, JSON.stringify(motivHistory.slice(-10))); // فقط 10 تای آخر
}

// اکسپورت توابع
window.sendTelegramReport = sendTelegramReport;
window.showMotivationalTelegramMessage = showMotivationalTelegramMessage;
