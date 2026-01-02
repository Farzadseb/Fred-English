// quiz-engine.js - موتور آزمون و گزارش‌دهی
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
        
        let correctAnswer = (this.mode === 'word-def') ? this.currentWord.definition : this.currentWord.translation;
        const distractors = db.filter(w => w.id !== this.currentWord.id)
                              .sort(() => 0.5 - Math.random()).slice(0, 3)
                              .map(w => (this.mode === 'word-def' ? w.definition : w.translation));
        
        const choices = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        container.innerHTML = `
            <div class="quiz-card animate-in">
                <h2 onclick="window.SpeechEngine.speak('${this.currentWord.word}')" style="cursor:pointer; color:#2563eb;">
                    ${this.currentWord.word} <i class="fas fa-volume-up"></i>
                </h2>
                <div class="details-box" style="text-align:left; direction:ltr; background:#0f172a; padding:12px; border-radius:10px; margin:15px 0;">
                    <p style="margin:5px 0; color:#10b981;"><b>Collocation:</b> ${this.currentWord.collocation || '---'}</p>
                    <p style="margin:5px 0; color:#f59e0b;"><b>Phrasal:</b> ${this.currentWord.phrasal || '---'}</p>
                    <p style="margin:5px 0; color:#94a3b8; font-style:italic;">"${this.currentWord.example || ''}"</p>
                </div>
                <div class="choices-grid">
                    ${choices.map(c => `<button class="choice-btn" onclick="QuizEngine.check('${c}', '${correctAnswer}')">${c}</button>`).join('')}
                </div>
                <button onclick="location.reload()" style="margin-top:20px; background:none; border:none; color:#ef4444; cursor:pointer;">انصراف</button>
            </div>`;
    },

    check(selected, correct) {
        if (selected === correct) {
            this.score++;
            window.showNotification('Excellent!', 'success');
        } else {
            window.showNotification('Wrong!', 'error');
            if(window.MistakeManager) window.MistakeManager.add(this.currentWord);
        }
        this.currentIndex++;
        setTimeout(() => this.nextQuestion(), 1200);
    },

    showResults(onlyShow = false) {
        if(onlyShow && this.currentIndex === 0) {
            alert("ابتدا یک آزمون را تمام کنید."); return;
        }
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        document.getElementById('app-container').innerHTML = `
            <div class="quiz-card report-box" style="text-align:right;">
                <h3 style="text-align:center;">📊 کارنامه فرزاد</h3>
                <div style="background:#2563eb; color:white; padding:20px; border-radius:15px; text-align:center; margin:15px 0;">
                    <div style="font-size:2.5rem;">${percentage}%</div>
                </div>
                <p>👨‍🏫 مدرس: English with Fred</p>
                <p>📱 تماس: 09017708544</p>
                <button class="menu-btn blue" style="width:100%" onclick="location.reload()">بازگشت به منو</button>
            </div>`;
        if(!onlyShow && window.TelegramReporter) window.TelegramReporter.sendQuizResult(this.score, this.totalQuestions);
    }
};
