// =======================
// TELEGRAM INTEGRATION - با توکن شما
// =======================

// تنظیمات تلگرام - با توکن شما
const TelegramConfig = {
    BOT_TOKEN: '8592902186:AAGdV2eHkocXaRr7kKrxLrap7jWVPm0pq-Q',
    CHAT_ID: '96991859',
    API_URL: 'https://api.telegram.org/bot'
};

// تابع ارسال پیام به تلگرام
async function sendToTelegram(message) {
    // اگر صدا غیرفعال است، ارسال نکن
    if (!window.appState?.soundEnabled) {
        showNotification('🔇 ابتدا صدا را فعال کنید', 'warning');
        return false;
    }
    
    try {
        const url = `${TelegramConfig.API_URL}${TelegramConfig.BOT_TOKEN}/sendMessage`;
        const payload = {
            chat_id: TelegramConfig.CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        };
        
        console.log('📤 در حال ارسال به تلگرام...');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ ارسال موفق به تلگرام');
            showNotification('✅ گزارش به تلگرام ارسال شد', 'success');
            return true;
        } else {
            console.error('❌ خطای تلگرام:', data.description);
            showNotification(`❌ خطا در ارسال: ${data.description}`, 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ خطا در ارسال به تلگرام:', error);
        showNotification('❌ خطا در اتصال به تلگرام', 'error');
        return false;
    }
}

// تابع ارسال گزارش پیشرفت
async function sendTelegramReport() {
    const currentUser = window.appState?.currentUser;
    
    if (!currentUser) {
        showNotification('❌ ابتدا وارد شوید', 'error');
        return;
    }
    
    const userId = currentUser.id;
    const username = currentUser.username;
    const studentCode = currentUser.studentCode || 'ثبت نشده';
    
    const bestScoreKey = `bestScore_${userId}`;
    const historyKey = `testHistory_${userId}`;
    const mistakesKey = `fredMistakes_${userId}`;
    
    const bestScore = localStorage.getItem(bestScoreKey) || '0';
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const mistakes = JSON.parse(localStorage.getItem(mistakesKey) || '[]');
    const now = new Date();
    
    let message = `<b>📊 گزارش پیشرفت English with Fred</b>\n\n`;
    message += `<b>👤 دانش‌آموز:</b> ${username}\n`;
    if (studentCode !== 'ثبت نشده') {
        message += `<b>🔢 کد زبان‌آموز:</b> ${studentCode}\n`;
    }
    message += `<b>🆔 شناسه:</b> ${userId}\n`;
    message += `<b>📅 تاریخ:</b> ${now.toLocaleDateString('fa-IR')}\n`;
    message += `<b>⏰ ساعت:</b> ${now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}\n\n`;
    
    message += `<b>🏆 بهترین امتیاز:</b> ${bestScore}%\n`;
    message += `<b>📊 تعداد آزمون‌ها:</b> ${history.length}\n`;
    message += `<b>❌ اشتباهات ذخیره شده:</b> ${mistakes.length}\n\n`;
    
    if (history.length > 0) {
        const lastTest = history[history.length - 1];
        message += `<b>آخرین آزمون:</b>\n`;
        message += `🎯 حالت: ${getModeName(lastTest.mode)}\n`;
        message += `✅ امتیاز: ${lastTest.score}%\n`;
        message += `⏱️ مدت: ${lastTest.duration} ثانیه\n`;
        message += `🕐 تاریخ: ${new Date(lastTest.date).toLocaleDateString('fa-IR')}\n\n`;
    }
    
    message += `<b>👨‍🏫 مدرس:</b> English with Fred\n`;
    message += `<b>📱 تماس:</b> 09017708544\n\n`;
    message += `<b>✨ هر روز بهتر از دیروز ✨</b>`;
    
    // ارسال به تلگرام
    const success = await sendToTelegram(message);
    
    if (!success) {
        // اگر ارسال نشد، اطلاعات را نمایش بده
        showTelegramReportLocal(message);
    }
}

// نمایش گزارش محلی اگر تلگرام کار نکرد
function showTelegramReportLocal(message) {
    // حذف تگ‌های HTML برای نمایش در alert
    const plainMessage = message
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<br\/?>/g, '\n');
    
    if (confirm('⚠️ ارسال به تلگرام ناموفق بود.\n\nآیا می‌خواهید گزارش را اینجا ببینید؟')) {
        alert(plainMessage);
        
        // پیشنهاد کپی به کلیپ‌بورد
        if (confirm('آیا می‌خواهید گزارش را کپی کنید تا خودتان در تلگرام بفرستید؟')) {
            navigator.clipboard.writeText(plainMessage)
                .then(() => showNotification('📋 گزارش در کلیپ‌بورد کپی شد', 'success'))
                .catch(() => showNotification('❌ خطا در کپی کردن', 'error'));
        }
    }
}

// اکسپورت توابع
window.sendTelegramReport = sendTelegramReport;
