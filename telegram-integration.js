// اتصال به تلگرام
const TelegramIntegration = {
    send: function(message) {
        const token = localStorage.getItem('admin_tg_token');
        const chatId = "آیدی_عددی_شما"; // آیدی خود را اینجا قرار دهید

        if (!token) return;

        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `📊 گزارش جدید:\n${message}`,
                parse_mode: "HTML"
            })
        }).catch(err => console.error("Telegram Error:", err));
    }
};
