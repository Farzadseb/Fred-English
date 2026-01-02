const QuizEngine = {
    currentIndex: 0,
    score: 0,
    totalQuestions: 10,
    currentWord: null,
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

        this.currentWord = db[Math.floor(Math.random() * db.length)];
        const distractors = db.filter(w => w.id !== this.currentWord.id).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.translation);
        const choices = [this.currentWord.translation, ...distractors].sort(() => 0.5 - Math.random());

        container.innerHTML = `
            <div class="quiz-card">
                <h2 onclick="window.SpeechEngine.speak('${this.currentWord.word}')" style="cursor:pointer;">
                    <i class="fas fa-volume-up"></i> ${this.currentWord.word}
                </h2>
                <div class="details-box">
                    <p class="colloc"><b>Collocation:</b> ${this.currentWord.collocation || '---'}</p>
                    <p class="example"><i>"${this.currentWord.example || ''}"</i></p>
                </div>
                <div class="choices-grid">
                    ${choices.map(c => `<button class="choice-btn" onclick="QuizEngine.check('${c}')">${c}</button>`).join('')}
                </div>
            </div>`;
    },

    check(selected) {
        if (selected === this.currentWord.translation) {
            this.score++;
            window.showNotification('Excellent!', 'success');
        } else {
            window.showNotification(`Wrong!`, 'error');
            MistakeManager.add(this.currentWord); // ذخیره در لایتنر
        }
        this.currentIndex++;
        setTimeout(() => this.nextQuestion(), 1200);
    },

    showResults(onlyShow = false) {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        const date = new Date().toLocaleDateString('fa-IR');
        const time = new Date().toLocaleTimeString('fa-IR');
        const studentID = "user_" + Math.floor(Math.random() * 900000);

        const reportHTML = `
            <div class="quiz-card report-box">
                <h3 style="color:#2563eb">📊 گزارش پیشرفت English with Fred</h3>
                <p>👤 دانش‌آموز: <code>${studentID}</code></p>
                <p>📅 تاریخ: ${date} - ${time}</p>
                <div class="score-circle">🏆 امتیاز: ${percentage}%</div>
                <p>👨‍🏫 مدرس: English with Fred</p>
                <p>📱 تماس: 09017708544</p>
                <p style="color:#10b981; font-weight:bold">✨ هر روز بهتر از دیروز ✨</p>
                <button class="menu-btn blue" style="width:100%" onclick="location.reload()">بازگشت به منو</button>
            </div>`;

        document.getElementById('app-container').innerHTML = reportHTML;

        if (!onlyShow && window.TelegramReporter) {
            window.TelegramReporter.sendQuizResult(this.score, this.totalQuestions);
        }
    }
};
window.QuizEngine = QuizEngine;
