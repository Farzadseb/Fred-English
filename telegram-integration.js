// telegram-integration.js - ارسال گزارش به تلگرام (نسخه مستقل)
console.log('📨 Telegram Integration Loaded');

const TelegramReporter = {
    // تابع اصلی برای ارسال پیام به بات تلگرام
    async sendMessage(text) {
        // خواندن مستقیم تنظیمات ذخیره شده توسط پنل ادمین
        const token = localStorage.getItem('telegramBotToken');
        const chatId = localStorage.getItem('telegramChatId');
        
        // اگر توکن یا چت‌آیدی ذخیره نشده باشد، ارسال انجام نمی‌شود
        if (!token || !chatId) {
            console.warn('⚠️ تنظیمات تلگرام یافت نشد. لطفاً در پنل ادمین وارد کنید.');
            return false;
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML'
                }),
                keepalive: true // برای اطمینان از ارسال حتی هنگام بستن صفحه
            });
            return response.ok;
        } catch (error) {
            console.error('❌ خطا در ارسال به تلگرام:', error);
            return false;
        }
    },

    // ایجاد و ارسال متن گزارش نمره
    sendQuizResult(score, total) {
        const percentage = Math.round((score / total) * 100);
        const statusIcon = percentage >= 70 ? '✅' : '⚠️';
        const date = new Date().toLocaleDateString('fa-IR');
        const time = new Date().toLocaleTimeString('fa-IR');

        const message = `
${statusIcon} <b>گزارش تمرین لغات</b>
--------------------------
📊 نمره: <b>${score}</b> از ${total}
📈 درصد موفقیت: <b>${percentage}%</b>
📅 تاریخ: <code>${date}</code>
🕒 زمان: <code>${time}</code>
--------------------------
#EnglishWithFred #QuizResult`;
        
        this.sendMessage(message);
    }
};

// معرفی به فضای سراسری مرورگر
window.TelegramReporter = TelegramReporter;
