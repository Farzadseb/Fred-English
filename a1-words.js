// config.js - مدیریت مرکزی تنظیمات و امنیت داده‌ها
console.log('⚙️ Config Engine Initialized');

const ConfigManager = {
    // کلیدهای ذخیره‌سازی
    keys: {
        botToken: 'fred_tk_secure',
        chatId: 'fred_cid_secure',
        settings: 'fred_app_pref',
        stats: 'fred_user_progress'
    },

    // تابع کمکی برای انکریپت ساده (پیشنهاد شما)
    _encrypt(data) {
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    },

    // تابع کمکی برای دکریپت
    _decrypt(cipher) {
        try {
            return JSON.parse(decodeURIComponent(escape(atob(cipher))));
        } catch (e) {
            return null;
        }
    },

    // ذخیره داده‌ها
    set(key, value) {
        const encryptedValue = this._encrypt(value);
        localStorage.setItem(key, encryptedValue);
    },

    // بازخوانی داده‌ها
    get(key, defaultValue = null) {
        const saved = localStorage.getItem(key);
        if (!saved) return defaultValue;
        const decrypted = this._decrypt(saved);
        return decrypted !== null ? decrypted : defaultValue;
    },

    // تنظیمات تلگرام برای بقیه فایل‌ها
    getTelegramConfig() {
        return {
            token: this.get(this.keys.botToken, ''),
            chatId: this.get(this.keys.chatId, ''),
            apiUrl: 'https://api.telegram.org/bot'
        };
    },

    // متد پاکسازی (Reset)
    clearAll() {
        Object.values(this.keys).forEach(k => localStorage.removeItem(k));
        window.location.reload();
    }
};

// وضعیت لحظه‌ای اپلیکیشن (Global State)
window.appState = {
    isQuizActive: false,
    soundEnabled: ConfigManager.get(ConfigManager.keys.settings)?.sound !== false,
    currentLevel: 'A1',
    userStats: ConfigManager.get(ConfigManager.keys.stats, { correct: 0, wrong: 0 })
};

window.ConfigManager = ConfigManager;
