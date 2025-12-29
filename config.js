// =======================
// CONFIG FILE - فایل تنظیمات امن
// این فایل را در .gitignore قرار دهید
// =======================

// 🔐 اطلاعات حساس
const APP_CONFIG = {
    // اطلاعات شما
    CONTACT: {
        WHATSAPP: '09017708544',
        WHATSAPP_LINK: 'https://wa.me/989017708544',
        TELEGRAM: '@EnglishWithFredBot',
        PHONE: '09017708544',
        EMAIL: '', // اگر دارید اضافه کنید
        TEACHER_NAME: 'English with Fred'
    },
    
    // تنظیمات تلگرام
    TELEGRAM: {
        BOT_TOKEN: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw',
        CHAT_ID: '96991859',
        BOT_USERNAME: 'EnglishWithFredBot',
        ENABLE_AUTO_REPORT: true
    },
    
    // تنظیمات برنامه
    APP: {
        VERSION: '1.0.0',
        BUILD_DATE: '2024-01-15',
        DEFAULT_LANGUAGE: 'fa',
        ENABLE_PWA: true,
        ENABLE_OFFLINE: true,
        MAX_WORDS_FREE: 100,
        DAILY_TESTS_FREE: 3
    },
    
    // تنظیمات سیستم پریمیوم
    PREMIUM: {
        TEACHER_CODE: 'FRED2024',
        MONTHLY_PRICE: 25000,
        THREE_MONTHS_PRICE: 60000,
        TRIAL_DAYS: 7,
        ENABLE_FREEMIUM: true
    },
    
    // تنظیمات لایتنر
    LEITNER: {
        BOX_COUNT: 6,
        INTERVALS: [1, 3, 7, 14, 30, 60],
        ENABLE_FOR_PREMIUM_ONLY: true
    }
};

// جلوگیری از دسترسی مستقیم
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'APP_CONFIG', {
        value: Object.freeze(APP_CONFIG),
        writable: false,
        configurable: false,
        enumerable: false
    });
}

console.log('✅ تنظیمات برنامه بارگذاری شد');
console.log('📞 پشتیبانی:', APP_CONFIG.CONTACT.WHATSAPP);

// اکسپورت برای ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
