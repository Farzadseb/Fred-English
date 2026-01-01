// telegram-integration.js - مدیریت ارسال گزارش‌ها به تلگرام
console.log('📨 Telegram Integration Loaded');

const TelegramReporter = {
    // تابع اصلی ارسال پیام
    async sendMessage(text) {
        // دریافت تنظیمات از ConfigManager (که قبلاً با Base64 امن شده)
        const config = ConfigManager.getTelegramConfig();
        
        if (!config.token || !config.chatId) {
            console.warn('⚠️ تنظیمات تلگرام (Token/ChatID) در پنل ادمین وارد نشده است.');
            return false;
        }

        const url = `${config.apiUrl}${config.token}/sendMessage`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: config.chatId,
                    text: text,
                    parse_mode: 'HTML'
                }),
                keepalive: true // تضمین ارسال پیام حتی اگر کاربر بلافاصله صفحه را ببندد
            });
            return response.ok;
        } catch (error) {
            console.error('❌ خطا در ارتباط با تلگرام:', error);
            return false;
        }
    },

    // گزارش نمره نهایی آزمون
    sendQuizResult(score, total, level = 'A1') {
        const percentage = Math.round((score / total) * 100);
        const statusIcon = percentage >= 70 ? '✅' : '⚠️';

        const message = `
${statusIcon} <b>گزارش آزمون جدید</b>
--------------------------
📊 نمره: <b>${score}</b> از ${total} (${percentage}%)
📈 سطح: <code>${level}</code>
🕒 زمان: ${new Date().toLocaleTimeString('fa-IR')}
📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}
--------------------------
#QuizResult #EnglishWithFred`;
        
        this.sendMessage(message);
    },

    // گزارش خروج کاربر از برنامه
    sendExitReport() {
        const message = `
🚪 <b>گزارش خروج</b>
--------------------------
کاربر در این لحظه از برنامه خارج شد.
🕒 زمان: ${new Date().toLocaleTimeString('fa-IR')}
--------------------------
#UserExit`;
        
        this.sendMessage(message);
    }
};

// معرفی به فضای سراسری
window.TelegramReporter = TelegramReporter;
