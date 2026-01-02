const QuizEngine = {
    currentIndex: 0,
    score: 0,
    totalQuestions: 10,
    mode: 'fa-en',

    start(mode) {
        this.mode = mode;
        this.currentIndex = 0;
        this.score = 0;
        this.nextQuestion();
    },

    nextQuestion() {
        const container = document.getElementById('app-container');
        const db = window.words || [];

        if (this.currentIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }

        const word = db[Math.floor(Math.random() * db.length)];
        this.currentWord = word;

        let question = word.word;
        let answer = word.translation;
        if (this.mode === 'word-def') answer = word.definition;
        if (this.mode === 'def-word') { question = "Definition: " + word.definition; answer = word.word; }

        const distractors = db.filter(w => w.id !== word.id).sort(() => 0.5 - Math.random()).slice(0, 3)
                              .map(w => (this.mode === 'word-def' ? w.definition : (this.mode === 'def-word' ? w.word : w.translation)));
        
        const choices = [answer, ...distractors].sort(() => 0.5 - Math.random());

        container.innerHTML = `
            <div class="quiz-card">
                <h2 onclick="window.speak('${word.word}')">${question} <i class="fas fa-volume-up"></i></h2>
                <div class="choices-grid">
                    ${choices.map(c => `<button class="choice-btn" onclick="QuizEngine.check('${c}', '${answer}')">${c}</button>`).join('')}
                </div>
            </div>`;
    },

    check(selected, correct) {
        if (selected === correct) {
            this.score++;
            if(window.showNotification) window.showNotification('✅ عالی', 'success');
        } else {
            if(window.showNotification) window.showNotification('❌ اشتباه', 'error');
            if(window.MistakeManager) window.MistakeManager.add(this.currentWord);
        }
        this.currentIndex++;
        setTimeout(() => this.nextQuestion(), 1000);
    },

    async showResults() {
        const container = document.getElementById('app-container');
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        container.innerHTML = `<div class="quiz-card"><h2>نمره شما: ${percentage}%</h2><button class="menu-btn blue" onclick="location.reload()">بازگشت</button></div>`;
        
        // ارسال به تلگرام با اطلاعاتی که در admin.html ذخیره کردی
        const token = localStorage.getItem('fred_bot_token');
        const chatId = localStorage.getItem('fred_chat_id');
        if (token && chatId) {
            const text = `📊 نمره جدید فرزاد: ${percentage}%`;
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: text })
            });
        }
    }
};
window.QuizEngine = QuizEngine;
