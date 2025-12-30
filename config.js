// =======================
// CONFIGURATION FILE - تنظیمات برنامه
// =======================

window.appConfig = {
    // اطلاعات برنامه
    app: {
        name: 'English with Fred',
        version: '3.0.0',
        author: 'Farzad',
        github: 'https://github.com/Farzadseb/Fred-English',
        lastUpdate: '2024-01-15'
    },
    
    // تنظیمات تلگرام
    telegram: {
        botToken: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw',
        chatId: '96991859',
        enabled: true,
        sendResults: true,
        sendProgress: true,
        sendErrors: true
    },
    
    // تنظیمات صدا
    speech: {
        enabled: true,
        defaultRate: 0.5,
        defaultPitch: 1.0,
        defaultVolume: 1.0,
        voiceType: 'female',
        voiceLanguage: 'en-US',
        autoPlay: true,
        autoPlayDelay: 500 // میلی‌ثانیه
    },
    
    // تنظیمات یادگیری
    learning: {
        wordsPerSession: 20,
        reviewInterval: 24, // ساعت
        dailyGoal: 10,
        showExamples: true,
        showPhrasalVerbs: true,
        showCollocations: true,
        autoMarkDifficult: true,
        difficultyThreshold: 3 // تعداد مرور برای علامت‌دار کردن
    },
    
    // تنظیمات آزمون
    quiz: {
        questionsPerQuiz: 10,
        timeLimit: 0, // ثانیه (0 = بدون محدودیت)
        showExplanation: true,
        shuffleQuestions: true,
        shuffleOptions: true,
        passingScore: 70 // درصد
    },
    
    // تنظیمات نمایش
    display: {
        theme: 'dark', // dark, light, auto
        fontSize: 'medium', // small, medium, large
        fontFamily: 'Vazirmatn',
        borderRadius: 'rounded', // none, small, rounded, large
        animationSpeed: 'normal', // slow, normal, fast
        showAnimations: true
    },
    
    // تنظیمات آفلاین
    offline: {
        enabled: true,
        cacheWords: true,
        cacheAudio: false,
        cacheImages: true,
        maxCacheSize: 50 // مگابایت
    },
    
    // تنظیمات حریم خصوصی
    privacy: {
        collectAnalytics: false,
        shareProgress: true,
        saveName: true,
        saveResults: true,
        clearDataOnExit: false
    }
};

// =======================
// CONFIG MANAGER - مدیریت تنظیمات
// =======================

const ConfigManager = {
    // بارگذاری تنظیمات از localStorage
    load() {
        try {
            const savedConfig = localStorage.getItem('appConfig');
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                this.mergeConfigs(parsed);
                console.log('⚙️ تنظیمات بارگذاری شد');
            } else {
                this.save(); // ذخیره تنظیمات پیش‌فرض
            }
        } catch (error) {
            console.error('❌ خطا در بارگذاری تنظیمات:', error);
            this.reset();
        }
        return window.appConfig;
    },
    
    // ذخیره تنظیمات در localStorage
    save() {
        try {
            localStorage.setItem('appConfig', JSON.stringify(window.appConfig));
            localStorage.setItem('configVersion', window.appConfig.app.version);
            console.log('💾 تنظیمات ذخیره شد');
            return true;
        } catch (error) {
            console.error('❌ خطا در ذخیره تنظیمات:', error);
            return false;
        }
    },
    
    // بازنشانی به تنظیمات پیش‌فرض
    reset() {
        const defaultConfig = JSON.parse(JSON.stringify(this.getDefaultConfig()));
        Object.assign(window.appConfig, defaultConfig);
        this.save();
        console.log('🔄 تنظیمات بازنشانی شد');
        return window.appConfig;
    },
    
    // دریافت تنظیمات پیش‌فرض
    getDefaultConfig() {
        return {
            app: {
                name: 'English with Fred',
                version: '3.0.0',
                author: 'Farzad',
                github: 'https://github.com/Farzadseb/Fred-English',
                lastUpdate: new Date().toISOString().split('T')[0]
            },
            telegram: {
                botToken: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw',
                chatId: '96991859',
                enabled: true,
                sendResults: true,
                sendProgress: true,
                sendErrors: true
            },
            speech: {
                enabled: true,
                defaultRate: 0.5,
                defaultPitch: 1.0,
                defaultVolume: 1.0,
                voiceType: 'female',
                voiceLanguage: 'en-US',
                autoPlay: true,
                autoPlayDelay: 500
            },
            learning: {
                wordsPerSession: 20,
                reviewInterval: 24,
                dailyGoal: 10,
                showExamples: true,
                showPhrasalVerbs: true,
                showCollocations: true,
                autoMarkDifficult: true,
                difficultyThreshold: 3
            },
            quiz: {
                questionsPerQuiz: 10,
                timeLimit: 0,
                showExplanation: true,
                shuffleQuestions: true,
                shuffleOptions: true,
                passingScore: 70
            },
            display: {
                theme: 'dark',
                fontSize: 'medium',
                fontFamily: 'Vazirmatn',
                borderRadius: 'rounded',
                animationSpeed: 'normal',
                showAnimations: true
            },
            offline: {
                enabled: true,
                cacheWords: true,
                cacheAudio: false,
                cacheImages: true,
                maxCacheSize: 50
            },
            privacy: {
                collectAnalytics: false,
                shareProgress: true,
                saveName: true,
                saveResults: true,
                clearDataOnExit: false
            }
        };
    },
    
    // ادغام تنظیمات
    mergeConfigs(newConfig) {
        const mergeDeep = (target, source) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    mergeDeep(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
            return target;
        };
        
        mergeDeep(window.appConfig, newConfig);
    },
    
    // دریافت یک مقدار
    get(key) {
        const keys = key.split('.');
        let value = window.appConfig;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return undefined;
            }
        }
        
        return value;
    },
    
    // تنظیم یک مقدار
    set(key, value) {
        const keys = key.split('.');
        let obj = window.appConfig;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!obj[k] || typeof obj[k] !== 'object') {
                obj[k] = {};
            }
            obj = obj[k];
        }
        
        obj[keys[keys.length - 1]] = value;
        this.save();
        return true;
    },
    
    // بررسی وجود کلید
    has(key) {
        return this.get(key) !== undefined;
    },
    
    // گرفتن تمام تنظیمات
    getAll() {
        return JSON.parse(JSON.stringify(window.appConfig));
    },
    
    // گرفتن تنظیمات به صورت فرمت شده برای نمایش
    getFormatted() {
        return JSON.stringify(window.appConfig, null, 2);
    },
    
    // گرفتن تنظیمات تلگرام
    getTelegramConfig() {
        return {
            botToken: window.appConfig.telegram.botToken,
            chatId: window.appConfig.telegram.chatId,
            enabled: window.appConfig.telegram.enabled
        };
    },
    
    // گرفتن تنظیمات صدا
    getSpeechConfig() {
        return {
            rate: window.appConfig.speech.defaultRate,
            pitch: window.appConfig.speech.defaultPitch,
            volume: window.appConfig.speech.defaultVolume,
            enabled: window.appConfig.speech.enabled,
            autoPlay: window.appConfig.speech.autoPlay
        };
    },
    
    // گرفتن تنظیمات یادگیری
    getLearningConfig() {
        return {
            wordsPerSession: window.appConfig.learning.wordsPerSession,
            dailyGoal: window.appConfig.learning.dailyGoal,
            showExamples: window.appConfig.learning.showExamples
        };
    },
    
    // گرفتن تنظیمات نمایش
    getDisplayConfig() {
        return {
            theme: window.appConfig.display.theme,
            fontSize: window.appConfig.display.fontSize,
            borderRadius: window.appConfig.display.borderRadius
        };
    },
    
    // گرفتن آمار استفاده
    getUsageStats() {
        const stats = JSON.parse(localStorage.getItem('usageStats') || '{}');
        return {
            totalSessions: stats.totalSessions || 0,
            totalWordsLearned: stats.totalWordsLearned || 0,
            totalQuizzesTaken: stats.totalQuizzesTaken || 0,
            totalTimeSpent: stats.totalTimeSpent || 0, // دقیقه
            firstUse: stats.firstUse || new Date().toISOString(),
            lastUse: stats.lastUse || new Date().toISOString()
        };
    },
    
    // ذخیره آمار استفاده
    saveUsageStats(stats) {
        const currentStats = this.getUsageStats();
        const updatedStats = { ...currentStats, ...stats, lastUse: new Date().toISOString() };
        localStorage.setItem('usageStats', JSON.stringify(updatedStats));
    },
    
    // افزایش شمارنده آمار
    incrementStat(statName, amount = 1) {
        const stats = this.getUsageStats();
        stats[statName] = (stats[statName] || 0) + amount;
        this.saveUsageStats(stats);
    }
};

// =======================
// INITIALIZATION - راه‌اندازی اولیه
// =======================

// وقتی DOM لود شد
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Config Manager در حال بارگذاری...');
    
    // بارگذاری تنظیمات
    ConfigManager.load();
    
    // تنظیم تاریخ آپدیت
    ConfigManager.set('app.lastUpdate', new Date().toISOString().split('T')[0]);
    
    // ثبت اولین استفاده
    const stats = ConfigManager.getUsageStats();
    if (!stats.firstUse) {
        ConfigManager.saveUsageStats({
            firstUse: new Date().toISOString(),
            lastUse: new Date().toISOString(),
            totalSessions: 1
        });
    } else {
        ConfigManager.incrementStat('totalSessions');
    }
    
    // اعمال تنظیمات نمایش
    applyDisplayConfig();
    
    console.log('✅ Config Manager آماده است');
    console.log('📊 تنظیمات فعلی:', ConfigManager.getFormatted());
});

// اعمال تنظیمات نمایش
function applyDisplayConfig() {
    const displayConfig = ConfigManager.getDisplayConfig();
    
    // اعمال تم
    if (displayConfig.theme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    } else if (displayConfig.theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        // auto - از تنظیمات سیستم استفاده کن
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    }
    
    // اعمال سایز فونت
    document.documentElement.style.fontSize = {
        'small': '14px',
        'medium': '16px',
        'large': '18px'
    }[displayConfig.fontSize] || '16px';
    
    // اعمال border-radius
    const radiusValue = {
        'none': '0',
        'small': '8px',
        'rounded': '12px',
        'large': '20px'
    }[displayConfig.borderRadius] || '12px';
    
    document.documentElement.style.setProperty('--radius-md', radiusValue);
    document.documentElement.style.setProperty('--radius-lg', radiusValue);
    
    // اعمال سرعت انیمیشن
    const animationSpeed = {
        'slow': '0.5s',
        'normal': '0.3s',
        'fast': '0.1s'
    }[displayConfig.animationSpeed] || '0.3s';
    
    document.documentElement.style.setProperty('--transition-speed', animationSpeed);
}

// =======================
// EXPORTS - اکسپورت
// =======================

window.ConfigManager = ConfigManager;
window.applyDisplayConfig = applyDisplayConfig;

// اکسپورت برای ماژول‌ها
export { ConfigManager, applyDisplayConfig };

// ایجاد shortcut برای دسترسی آسان
window.config = window.appConfig;
window.configManager = ConfigManager;

// لاگ نهایی
console.log('⚡ Config Module بارگذاری شد');
