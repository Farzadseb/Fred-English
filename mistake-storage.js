// mistake-storage.js - مدیریت هوشمند یادگیری و اشتباهات
console.log('🧠 Adaptive Learning System (MistakeManager) Ready');

const MistakeManager = {
    // کلید ثابت برای جلوگیری از خطای undefined
    storageKey: 'fred_mistakes_v1',

    // مدیریت چند کاربره (Per-User Support)
    getStorageKey() {
        const userId = window.appState?.currentUser?.id || 'anonymous';
        return `${this.storageKey}_${userId}`;
    },

    // دریافت لیست لغات دشوار
    getMistakes() {
        const data = ConfigManager.get(this.getStorageKey(), []);
        return Array.isArray(data) ? data : [];
    },

    // اضافه کردن یا آپدیت اشتباه
    addMistake(word) {
        let mistakes = this.getMistakes();
        const existingIndex = mistakes.findIndex(m => m.id === word.id);

        if (existingIndex > -1) {
            mistakes[existingIndex].wrongCount += 1;
            mistakes[existingIndex].lastTime = new Date().toISOString();
        } else {
            mistakes.push({
                id: word.id,
                english: word.english,
                persian: word.persian,
                wrongCount: 1,
                lastTime: new Date().toISOString()
            });
        }

        ConfigManager.set(this.getStorageKey(), mistakes);
        
        // نوتیفیکیشن (اگر تابع آن در app.js تعریف شده باشد)
        if (window.showNotification) {
            window.showNotification(`📌 لغت "${word.english}" برای تمرین ذخیره شد.`, 'info');
        }
    },

    // کاهش نمره منفی (وقتی کاربر درست جواب می‌دهد) - پیشنهاد طلایی شما
    reduceMistake(wordId) {
        let mistakes = this.getMistakes();
        const index = mistakes.findIndex(m => m.id === wordId);

        if (index > -1) {
            mistakes[index].wrongCount -= 1;
            
            // اگر کاربر لغت را کاملاً یاد گرفته (نمره به صفر رسید) حذفش کن
            if (mistakes[index].wrongCount <= 0) {
                mistakes.splice(index, 1);
                console.log(`✅ لغت با آیدی ${wordId} از لیست دشوارها حذف شد (یادگیری کامل).`);
            } else {
                mistakes[index].lastTime = new Date().toISOString();
            }
            
            ConfigManager.set(this.getStorageKey(), mistakes);
        }
    },

    // الگوریتم Spaced Repetition برای اولویت‌بندی (پیشنهاد شما)
    getHardestWords(limit = 10) {
        return this.getMistakes()
            .sort((a, b) => {
                // اولویت ۱: تعداد اشتباه بیشتر
                if (b.wrongCount !== a.wrongCount) {
                    return b.wrongCount - a.wrongCount;
                }
                // اولویت ۲: لغاتی که قدیمی‌تر هستند (زمان بیشتری از دیدنشان گذشته)
                return new Date(a.lastTime) - new Date(b.lastTime);
            })
            .slice(0, limit);
    },

    removeMistake(wordId) {
        const mistakes = this.getMistakes().filter(m => m.id !== wordId);
        ConfigManager.set(this.getStorageKey(), mistakes);
    },

    reset() {
        ConfigManager.set(this.getStorageKey(), []);
    }
};

// معرفی به فضای سراسری
window.MistakeManager = MistakeManager;
