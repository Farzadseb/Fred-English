// mistake-storage.js
const MistakeManager = {
    add(word) {
        let mistakes = JSON.parse(localStorage.getItem('fred_mistakes') || '[]');
        if (!mistakes.find(m => m.id === word.id)) {
            mistakes.push(word);
            localStorage.setItem('fred_mistakes', JSON.stringify(mistakes));
        }
    },
    showReview() {
        let mistakes = JSON.parse(localStorage.getItem('fred_mistakes') || '[]');
        if (mistakes.length === 0) {
            alert("هنوز کلمه اشتباهی برای مرور ندارید!");
            return;
        }
        window.words = mistakes;
        window.QuizEngine.start('fa-en');
    }
};
window.MistakeManager = MistakeManager;
