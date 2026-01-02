const QuizEngine = {
    currentIndex: 0,
    score: 0,
    totalQuestions: 10,
    currentWord: null,

    nextQuestion() {
        const container = document.getElementById('app-container');
        const db = window.words || [];
        if (db.length < 4) { container.innerHTML = "کلمات کافی نیست!"; return; }

        if (this.currentIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }

        this.currentWord = db[Math.floor(Math.random() * db.length)];
        const distractors = db.filter(w => w.id !== this.currentWord.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.translation);
        const choices = [this.currentWord.translation, ...distractors].sort(() => 0.5 - Math.random());

        container.innerHTML = `
            <div class="quiz-card">
                <div style="color: #64748b; margin-bottom: 10px;">${this.currentIndex + 1} / ${this.totalQuestions}</div>
                <h2 onclick="window.SpeechEngine.speak('${this.currentWord.word}')" style="cursor:pointer; color: #2563eb;">
                    <i class="fas fa-volume-up"></i> ${this.currentWord.word}
                </h2>
                <div class="choices-grid">
                    ${choices.map(c => `<button class="choice-btn" onclick="QuizEngine.check('${c}')">${c}</button>`).join('')}
                </div>
            </div>`;
    },

    check(selected) {
        if (selected === this.currentWord.translation) {
            this.score++;
            window.showNotification('✅ عالی بود!', 'success');
        } else {
            window.showNotification(`❌ پاسخ: ${this.currentWord.translation}`, 'error');
        }
        this.currentIndex++;
        setTimeout(() => this.nextQuestion(), 1200);
    },

    showResults() {
        document.getElementById('app-container').innerHTML = `
            <div class="quiz-card">
                <h3>🏁 پایان!</h3>
                <h1 style="font-size: 3rem;">${this.score} / ${this.totalQuestions}</h1>
                <button class="btn-save" style="width: 100%" onclick="location.reload()">دوباره</button>
            </div>`;
        if (window.TelegramReporter) window.TelegramReporter.sendQuizResult(this.score, this.totalQuestions);
    }
};
window.QuizEngine = QuizEngine;
