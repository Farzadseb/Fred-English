// quiz-engine.js - نسخه نهایی و یکپارچه
console.log('QuizEngine is ready!');

const QuizEngine = {
    currentIndex: 0,
    score: 0,
    totalQuestions: 10,
    currentWord: null,
    mode: 'fa-en',

    start(mode) {
        console.log('Starting quiz in mode:', mode);
        this.mode = mode;
        this.currentIndex = 0;
        this.score = 0;
        this.nextQuestion();
    },

    nextQuestion() {
        const container = document.getElementById('app-container');
        const db = window.words || [];

        if (db.length === 0) {
            container.innerHTML = '<div class="quiz-card"><h3 style="color:red;">خطا: کلمات یافت نشد!</h3><p>فایل a1-words.js را بررسی کنید.</p></div>';
            return;
        }

        if (this.currentIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }

        this.currentWord = db[Math.floor(Math.random() * db.length)];

        let questionText = this.currentWord.word;
        let correctAnswer = this.currentWord.translation;

        if (this.mode === 'word-def') {
            correctAnswer = this.currentWord.definition || "No definition available";
        } else if (this.mode === 'def-word') {
            questionText = "Definition:";
            correctAnswer = this.currentWord.word;
        }

        const distractors = db
            .filter(w => w.id !== this.currentWord.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => {
                if (this.mode === 'word-def') return w.definition || w.translation;
                if (this.mode === 'def-word') return w.word;
                return w.translation;
            });

        const choices = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        container.innerHTML = `
            <div class="quiz-card animate-in">
                <div class="word-header" onclick="window.speak ? window.speak('${this.currentWord.word}') : console.log('Speech tool not found')">
                    <h2 style="color:#2563eb;">${questionText}</h2>
                    ${this.mode !== 'def-word' ? '<i class="fas fa-volume-up" style="color:#64748b"></i>' : ''}
                </div>

                ${this.mode === 'def-word' ? `<div style="background:#0f172a; padding:10px; border-radius:10px; margin-bottom:15px; text-align:left; direction:ltr; font-size:0.9rem;">${this.currentWord.definition}</div>` : ''}

                <div class="details-box" style="text-align:left; direction:ltr; background:#0f172a; padding:15px; border-radius:12px; margin:15px 0; border:1px solid #334155;">
                    <p style="margin:5px 0;"><b style="color:#10b981;">• Collocation:</b> ${this.currentWord.collocation || '---'}</p>
                    <p style="margin:5px 0;"><b style="color:#f59e0b;">• Phrasal:</b> ${this.currentWord.phrasal || '---'}</p>
                    <p style="margin:10px 0 0 0; font-style:italic; color:#94a3b8; border-top:1px solid #1e293b; padding-top:8px;">"${this.currentWord.example || ''}"</p>
                </div>

                <div class="choices-grid">
                    ${choices.map(c => `
                        <button class="choice-btn" onclick="QuizEngine.check('${c.replace(/'/g, "\\'")}', '${correctAnswer.replace(/'/g, "\\")}')">
                            ${c}
                        </button>
                    `).join('')}
                </div>
                
                <button class="btn-cancel" style="background:none; border:none; color:#ef4444; margin-top:15px; cursor:pointer;" onclick="location.reload()">انصراف و بازگشت</button>
            </div>`;
    },

    check(selected, correct) {
        const btns = document.querySelectorAll('.choice-btn');
        btns.forEach(b => {
            b.disabled = true;
            if (b.innerText.trim() === correct.trim()) b.style.background = "#10b981";
            else if (b.innerText.trim() === selected.trim()) b.style.background = "#ef4444";
        });

        if (selected.trim() === correct.trim()) {
            this.score++;
            if (window.showNotification) window.showNotification('Excellent! ✅', 'success');
        } else {
            if (window.showNotification) window.showNotification('Wrong! ❌', 'error');
            if (window.MistakeManager) window.MistakeManager.add(this.currentWord);
        }
        
        setTimeout(() => {
            this.currentIndex++;
            this.nextQuestion();
        }, 1200);
    },

    showResults() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        document.getElementById('app-container').innerHTML = `
            <div class="quiz-card report-box" style="text-align:center;">
                <h3 style="color:#2563eb;">📊 کارنامه فرزاد</h3>
                <div style="background:linear-gradient(135deg, #2563eb, #1e40af); color:white; padding:30px; border-radius:20px; text-align:center; margin:20px 0;">
                    <div style="font-size:3.5rem; font-weight:bold;">${percentage}%</div>
                    <p>درست: ${this.score} از ${this.totalQuestions}</p>
                </div>
                <button class="menu-btn blue" style="width:100%" onclick="location.reload()">بازگشت به منو</button>
            </div>`;
        
        if (window.TelegramReporter) window.TelegramReporter.sendQuizResult(this.score, this.totalQuestions);
    }
};

window.QuizEngine = QuizEngine;
