// quiz-engine.js - نسخه نهایی با پشتیبانی از جزئیات کامل لغات
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
        
        let questionText = this.currentWord.word;
        let correctAnswer = this.currentWord.translation;
        
        if (this.mode === 'word-def') {
            correctAnswer = this.currentWord.definition;
        }

        const distractors = db.filter(w => w.id !== this.currentWord.id)
                              .sort(() => 0.5 - Math.random())
                              .slice(0, 3)
                              .map(w => (this.mode === 'word-def' ? w.definition : w.translation));
        
        const choices = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        container.innerHTML = `
            <div class="quiz-card animate-in">
                <div class="word-header" onclick="window.SpeechEngine.speak('${this.currentWord.word}')">
                    <h2 style="color:#2563eb; margin-bottom:5px;">${this.currentWord.word}</h2>
                    <i class="fas fa-volume-up" style="color:#64748b"></i>
                </div>

                <div class="details-box" style="text-align:left; direction:ltr; background:#0f172a; padding:15px; border-radius:12px; margin:15px 0; border:1px solid #334155;">
                    <p style="margin:5px 0;"><b style="color:#10b981;">• Collocation:</b> <span style="color:#e2e8f0">${this.currentWord.collocation || '---'}</span></p>
                    <p style="margin:5px 0;"><b style="color:#f59e0b;">• Phrasal Verbs:</b> <span style="color:#e2e8f0; font-size:0.9rem;">${this.currentWord.phrasal || '---'}</span></p>
                    <p style="margin:10px 0 5px 0; font-style:italic; color:#94a3b8; border-top:1px solid #1e293b; padding-top:8px;">"${this.currentWord.example || ''}"</p>
                </div>

                <div class="choices-grid" style="display:grid; grid-template-columns:1fr; gap:10px;">
                    ${choices.map(c => `<button class="choice-btn" onclick="QuizEngine.check('${c}', '${correctAnswer}')">${c}</button>`).join('')}
                </div>
                
                <button class="btn-cancel" style="background:none; border:none; color:#ef4444; margin-top:15px; cursor:pointer;" onclick="location.reload()">انصراف و بازگشت</button>
            </div>`;
    },

    check(selected, correct) {
        const btns = document.querySelectorAll('.choice-btn');
        btns.forEach(b => {
            if(b.textContent === correct) b.style.background = "#10b981";
            else if(b.textContent === selected) b.style.background = "#ef4444";
            b.disabled = true;
        });

        if (selected === correct) {
            this.score++;
            window.showNotification('عالی بود! ✅', 'success');
        } else {
            window.showNotification('اشتباه شد ❌', 'error');
            if(window.MistakeManager) window.MistakeManager.add(this.currentWord);
        }
        
        this.currentIndex++;
        setTimeout(() => this.nextQuestion(), 1500);
    },

    showResults() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        const date = new Date().toLocaleDateString('fa-IR');
        const time = new Date().toLocaleTimeString('fa-IR');
        const studentID = "STU-" + Math.floor(Math.random() * 9000 + 1000);

        document.getElementById('app-container').innerHTML = `
            <div class="quiz-card report-box" style="text-align:right; border: 2px solid #2563eb;">
                <h3 style="text-align:center; color:#2563eb;">📊 گزارش پیشرفت English with Fred</h3>
                <hr style="opacity:0.2; margin:15px 0;">
                <p>👤 <b>دانش‌آموز:</b> <code>${studentID}</code></p>
                <p>📅 <b>تاریخ:</b> ${date} - ${time}</p>
                
                <div style="background:linear-gradient(135deg, #2563eb, #1e40af); color:white; padding:20px; border-radius:15px; text-align:center; margin:20px 0;">
                    <div style="font-size:0.9rem; opacity:0.9;">امتیاز نهایی شما</div>
                    <div style="font-size:3rem; font-weight:bold;">${percentage}%</div>
                    <div style="font-size:0.8rem; opacity:0.8;">تعداد درست: ${this.score} از ${this.totalQuestions}</div>
                </div>

                <div style="font-size:0.9rem; background:#1e293b; padding:10px; border-radius:10px;">
                    <p style="margin:5px 0;">👨‍🏫 <b>مدرس:</b> English with Fred</p>
                    <p style="margin:5px 0;">📱 <b>تماس:</b> 09017708544</p>
                </div>

                <p style="text-align:center; color:#10b981; font-weight:bold; margin-top:20px;">✨ هر روز بهتر از دیروز ✨</p>
                
                <button class="menu-btn blue" style="width:100%; margin-top:15px; padding:15px;" onclick="location.reload()">
                    <i class="fas fa-home"></i> بازگشت به منوی اصلی
                </button>
            </div>`;

        if (window.TelegramReporter) {
            window.TelegramReporter.sendQuizResult(this.score, this.totalQuestions);
        }
    }
};
window.QuizEngine = QuizEngine;
