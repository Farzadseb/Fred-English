// =======================
// TELEGRAM INTEGRATION - ارسال خودکار بدون نمایش دکمه
// =======================

// تنظیمات تلگرام
const TelegramConfig = {
    BOT_TOKEN: '8592902186:AAGdV2eHkocXaRr7kKrxLrap7jWVPm0pq-Q',
    CHAT_ID: '96991859',
    API_URL: 'https://api.telegram.org/bot'
};

// تابع ارسال پیام به تلگرام
async function sendToTelegram(message, silent = true) {
    if (!TelegramConfig.BOT_TOKEN) {
        console.log('⚠️ توکن تلگرام تنظیم نشده است');
        return false;
    }
    
    try {
        const url = `${TelegramConfig.API_URL}${TelegramConfig.BOT_TOKEN}/sendMessage`;
        const payload = {
            chat_id: TelegramConfig.CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        };
        
        console.log('📤 در حال ارسال خودکار به تلگرام...');
        
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
            console.log('✅ ارسال خودکار به تلگرام موفق بود');
            if (!silent) {
                showNotification('✅ گزارش به تلگرام ارسال شد', 'success');
            }
            return true;
        } else {
            console.error('❌ خطای تلگرام:', data.description);
            if (!silent) {
                showNotification(`❌ خطا در ارسال: ${data.description}`, 'error');
            }
            return false;
        }
    } catch (error) {
        console.error('❌ خطا در ارسال به تلگرام:', error);
        if (!silent) {
            showNotification('❌ خطا در اتصال به تلگرام', 'error');
        }
        return false;
    }
}

// ارسال خودکار گزارش پس از آزمون
async function sendTelegramReportAuto(score, mode, duration) {
    const currentUser = window.appState?.currentUser;
    
    if (!currentUser) {
        console.log('❌ کاربر لاگین نکرده است');
        return;
    }
    
    const userId = currentUser.id;
    const username = currentUser.username;
    const studentCode = currentUser.studentCode || 'ثبت نشده';
    const now = new Date();
    
    let message = `<b>📊 گزارش آزمون English with Fred</b>\n\n`;
    message += `<b>👤 دانش‌آموز:</b> ${username}\n`;
    if (studentCode !== 'ثبت نشده') {
        message += `<b>🔢 کد زبان‌آموز:</b> ${studentCode}\n`;
    }
    message += `<b>🆔 شناسه:</b> ${userId}\n`;
    message += `<b>📅 تاریخ:</b> ${now.toLocaleDateString('fa-IR')}\n`;
    message += `<b>⏰ ساعت:</b> ${now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}\n\n`;
    
    message += `<b>🎯 آزمون:</b> ${getModeName(mode)}\n`;
    message += `<b>✅ امتیاز:</b> ${score}%\n`;
    message += `<b>⏱️ مدت زمان:</b> ${duration} ثانیه\n\n`;
    
    // پیام انگیزشی بر اساس امتیاز
    if (score >= 90) {
        message += `<b>✨ عملکرد:</b> عالی! شما یک نابغه هستید! 🧠\n`;
    } else if (score >= 70) {
        message += `<b>✨ عملکرد:</b> خوب! ادامه دهید! 👍\n`;
    } else if (score >= 50) {
        message += `<b>✨ عملکرد:</b> متوسط! نیاز به تمرین بیشتر! 💪\n`;
    } else {
        message += `<b>✨ عملکرد:</b> نیاز به تلاش بیشتر! 📚\n`;
    }
    
    message += `\n<b>👨‍🏫 مدرس:</b> English with Fred\n`;
    message += `<b>📱 تماس:</b> 09017708544\n\n`;
    message += `<b>🎯 شعار:</b> هر روز بهتر از دیروز!`;
    
    // ارسال به تلگرام در پس‌زمینه (silent = true)
    sendToTelegram(message, true);
}

// ارسال خودکار گزارش هنگام خروج
async function sendExitTelegramReport() {
    const currentUser = window.appState?.currentUser;
    
    if (!currentUser) {
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
    
    let message = `<b>📤 گزارش خروج English with Fred</b>\n\n`;
    message += `<b>👤 دانش‌آموز:</b> ${username}\n`;
    if (studentCode !== 'ثبت نشده') {
        message += `<b>🔢 کد زبان‌آموز:</b> ${studentCode}\n`;
    }
    message += `<b>🆔 شناسه:</b> ${userId}\n`;
    message += `<b>📅 تاریخ خروج:</b> ${now.toLocaleDateString('fa-IR')}\n`;
    message += `<b>⏰ ساعت خروج:</b> ${now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}\n\n`;
    
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
    message += `<b>👋 تا بعد! امیدواریم بازگردید! 🎯</b>`;
    
    // ارسال به تلگرام در پس‌زمینه (silent = true)
    sendToTelegram(message, true);
}

// تابع ارسال گزارش پیشرفت (برای مواقع خاص - فعلاً استفاده نمی‌شود)
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
    
    let message = `<b>📊 گزارش کامل English with Fred</b>\n\n`;
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
    message += `<b>🎯 شعار:</b> هر روز بهتر از دیروز!`;
    
    // ارسال به تلگرام (silent = false برای نمایش اعلان)
    const success = await sendToTelegram(message, false);
    
    if (success) {
        showNotification('✅ گزارش کامل ارسال شد', 'success');
    }
}

// اکسپورت توابع
window.sendTelegramReport = sendTelegramReport;
window.sendTelegramReportAuto = sendTelegramReportAuto;
window.sendExitTelegramReport = sendExitTelegramReport;
