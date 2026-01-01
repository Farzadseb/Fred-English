// config.js - مدیریت تنظیمات و ذخیره‌سازی
console.log('⚙️ سیستم تنظیمات بارگذاری شد');

const ConfigManager = {
    // کلیدهای ذخیره‌سازی در LocalStorage
    keys: {
        botToken: 'fred_telegram_token',
        chatId: 'fred_telegram_chatid',
        userStats: 'fred_user_stats',
        settings: 'fred_app_settings'
    },

    // دریافت یک مقدار (اول از حافظه گوشی، اگر نبود از مقادیر پیش‌فرض)
    get(key, defaultValue = null) {
        const saved = localStorage.getItem(key);
        try {
            return saved ? JSON.parse(saved) : defaultValue;
        } catch {
            return saved || defaultValue;
        }
    },

    // ذخیره یک مقدار در حافظه گوشی
    set(key, value) {
        const valueToSave = typeof value === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem(key, valueToSave);
    },

    // تنظیمات فعال تلگرام
    getTelegramConfig() {
        return {
            token: this.get(this.keys.botToken, ''), // اگر ادمین ست کرده باشد
            chatId: this.get(this.keys.chatId, ''),   // اگر ادمین ست کرده باشد
            apiUrl: 'https://api.telegram.org/bot'
        };
    }
};

// در دسترس قرار دادن تنظیمات برای کل پروژه
window.ConfigManager = ConfigManager;

// تنظیمات اولیه وضعیت اپلیکیشن
window.appState = {
    isQuizActive: false,
    soundEnabled: ConfigManager.get(ConfigManager.keys.settings)?.sound !== false,
    currentLevel: 'A1'
};
