// mistake-storage.js - مدیریت کلمات اشتباه
const MistakeManager = {
    dbName: 'fred_mistakes',

    // ذخیره کلمه اشتباه
    add(wordObj) {
        let mistakes = JSON.parse(localStorage.getItem(this.dbName) || '[]');
        if (!mistakes.find(m => m.id === wordObj.id)) {
            mistakes.push(wordObj);
            localStorage.setItem(this.dbName, JSON.stringify(mistakes));
        }
    },

    // نمایش لیست اشتباهات
    showReview() {
        let mistakes = JSON.parse(localStorage.getItem(this.dbName) || '[]');
        if (mistakes.length === 0) {
            window.showNotification('هنوز کلمه اشتباهی ندارید!', 'success');
            return;
        }
        
        // شروع یک کوییز فقط با کلمات اشتباه
        window.words = mistakes; 
        QuizEngine.start('fa-en');
    },

    clear() {
        localStorage.removeItem(this.dbName);
    }
};
window.MistakeManager = MistakeManager;
