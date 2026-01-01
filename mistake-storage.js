// mistake-storage.js - مدیریت هوشمند لغات دشوار
console.log('🧠 MistakeManager (Adaptive Learning) Active');

const MistakeManager = {
    // کلید اصلی ذخیره‌سازی
    storageKey: 'fred_mistakes_v1',

    // مدیریت چند کاربره (جداسازی حافظه بر اساس نام کاربری یا آیدی)
    getStorageKey() {
        const userId = window.appState?.currentUser?.id || 'default_user';
        return `${this.storageKey}_${userId}`;
    },

    // ۱. دریافت لیست لغات دشوار
    getMistakes() {
        const data = ConfigManager.get(this.getStorageKey(), []);
        return Array.isArray(data) ? data : [];
    },

    // ۲. اضافه کردن لغت به لیست (یا افزایش نمره منفی)
    addMistake(word) {
        let mistakes = this.getMistakes();
        const existingIndex = mistakes.findIndex(m => m.id === word.id);

        if (existingIndex > -1) {
            // اگر قبلاً بود، نمره منفی را بالا ببر
            mistakes[existingIndex].wrongCount += 1;
            mistakes[existingIndex].lastTime = new Date().toISOString();
        } else {
            // اگر جدید بود، با مشخصات کامل ذخیره کن
            mistakes.push({
                id: word.id,
                english: word.english,
                persian: word.persian,
                wrongCount: 1,
                lastTime: new Date().toISOString()
            });
        }

        ConfigManager.set(this.getStorageKey(), mistakes);
        
        // نمایش نوتیفیکیشن برای فیدبک به کاربر
        if (window.showNotification) {
            window.showNotification(`📌 لغت "${word.english}" به تمرینات اضافه شد`, 'info');
        }
    },

    // ۳. کاهش نمره منفی (وقتی کاربر لغت را درست جواب می‌دهد) - طبق پیشنهاد شما
    reduceMistake(wordId) {
        let mistakes = this.getMistakes();
        const index = mistakes.findIndex(m => m.id === wordId);

        if (index > -1) {
            mistakes[index].wrongCount -= 1;
            
            // اگر نمره منفی به صفر رسید، یعنی کاربر یاد گرفته -> حذف از لیست
            if (mistakes[index].wrongCount <= 0) {
                mistakes.splice(index, 1);
                console.log(`✅ لغت ${wordId} کاملاً یاد گرفته شد و حذف گردید.`);
            } else {
                mistakes[index].lastTime = new Date().toISOString();
            }
            
            ConfigManager.set(this.getStorageKey(), mistakes);
        }
    },

    // ۴. دریافت سخت‌ترین لغات (با اولویت‌بندی زمانی و تعدادی)
    getHardestWords(limit = 10) {
        return this.getMistakes()
            .sort((a, b) => {
                // اولویت اول: تعداد اشتباه بیشتر
                if (b.wrongCount !== a.wrongCount) {
                    return b.wrongCount - a.wrongCount;
                }
                // اولویت دوم: لغاتی که زمان بیشتری است دیده نشده‌اند (Spaced Repetition)
                return new Date(a.lastTime) - new Date(b.lastTime);
            })
            .slice(0, limit);
    },

    // پاکسازی کامل
    reset() {
        ConfigManager.set(this.getStorageKey(), []);
    }
};

// معرفی به فضای سراسری
window.MistakeManager = MistakeManager;
