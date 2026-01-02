// quiz-engine.js - نسخه نهایی و متصل به پنجره اصلی
const QuizEngine = {
    currentIndex: 0,
    score: 0,
    totalQuestions: 10,
    currentWord: null,
    mode: 'fa-en',

    start(mode) {
        console.log("Quiz started with mode:", mode);
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
        
        let questionTitle = this.currentWord.word;
        let correctAnswer = (this.mode === 'word-def') ? this.currentWord.definition : this.currentWord.translation;

        if (this.mode === 'def-word') {
            questionTitle = "Definition:";
            correctAnswer = this.currentWord.word;
        }

        const distractors = db.filter(w => w.id !== this.currentWord.id)
                              .sort(() => 0.5 - Math.random())
                              .slice(0, 3)
                              .map(w => {
                                  if (this.mode === 'word-def') return w.definition;
                                  if (this.mode === 'def-word') return w.word;
                                  return w.translation;
                              });
        
        const choices = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        container.innerHTML = `
            <div class="quiz-card animate-in">
                <div class="word-header" onclick="window.SpeechEngine.speak('${this.currentWord.word}')">
                    <h2 style="color:#2563eb; font-size: 1.8rem;">${questionTitle}</h2>
                    ${this.mode !== 'def-word' ? '<i class="fas fa-volume-up"></i>' : ''}
                </div>
                
                ${this.mode === 'def-word' ? `<p style="background:#0f172a; padding:10px; border-radius:8px; margin-bottom:10px; font-size:0.9rem; text-align:left; direction:ltr;">${this.currentWord.definition}</p>` : ''}

                <div class="details-box" style="text-align:left; direction:ltr; background:#0f172a; padding:15px; border-radius:12px; margin:15px 0;">
                    <p style="margin:5px 0;"><b>• Collocation:</b> <span style="color:#10b981;">${this.currentWord.collocation || '---'}</span></p>
                    <p style="margin:5px 0;"><b>• Phrasal:</b> <span style="color:#f59e0b">${this.currentWord.phrasal || '---'}</span></p>
                    <p style="font-style:italic; color:#94a3b8; border-top:1px solid #1e293b; padding-top:8px; margin-top:8px;">"${this.currentWord.example || ''}"</p>
                </div>

                <div class="choices-grid">
                    ${choices.map(c => `<button class="choice-btn" onclick="window.QuizEngine.check('${c}', '${correctAnswer}')">${c}</button>`).join('')}
                </div>
                
                <button class="btn-cancel" style="background:none; border:none; color:#ef4444; margin-top:15px; cursor:pointer;" onclick="location.reload()">انصراف و بازگشت</button>
            </div>`;
    },

    check(selected, correct) {
        const btns = document.querySelectorAll('.choice-btn');
        btns.forEach(b => {
            b.disabled = true;
            if(b.textContent === correct) b.style.background = "#10b981";
            else if(b.textContent === selected) b.style.background = "#ef4444";
        });

        if (selected === correct) {
            this.score++;
        } else {
            if(window.MistakeManager) window.MistakeManager.add(this.currentWord);
        }
        
        this.currentIndex++;
        setTimeout(() => this.nextQuestion(), 1200);
    },

    showResults(onlyShow = false) {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        document.getElementById('app-container').innerHTML = `
            <div class="quiz-card report-box" style="text-align:right;">
                <h3 style="text-align:center; color:#2563eb;">📊 کارنامه نهایی</h3>
                <div style="background:linear-gradient(135deg, #2563eb, #1e40af); color:white; padding:20px; border-radius:15px; text-align:center; margin:20px 0;">
                    <div style="font-size:3rem; font-weight:bold;">${percentage}%</div>
                </div>
                <button class="menu-btn blue" style="width:100%" onclick="location.reload()">برگشت به منو</button>
            </div>`;
    }
};
window.QuizEngine = QuizEngine;
