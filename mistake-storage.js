// مدیریت ذخیره‌سازی اشتباهات در LocalStorage
const MistakeStorage = {
    save: function(wordObj) {
        let mistakes = this.getAll();
        // جلوگیری از ذخیره تکراری
        if (!mistakes.find(m => m.id === wordObj.id)) {
            mistakes.push(wordObj);
            localStorage.setItem('user_mistakes', JSON.stringify(mistakes));
        }
    },

    getAll: function() {
        return JSON.parse(localStorage.getItem('user_mistakes')) || [];
    },

    remove: function(wordId) {
        let mistakes = this.getAll().filter(m => m.id !== wordId);
        localStorage.setItem('user_mistakes', JSON.stringify(mistakes));
    },

    clearAll: function() {
        localStorage.removeItem('user_mistakes');
    }
};
