const QuizEngine = {
    currentIndex: 0,
    score: 0,
    totalQuestions: 10,
    currentWord: null,
    mode: 'fa-en',

    // این تابع فقط وقتی اجرا می‌شود که تو روی دکمه‌های منو کلیک کنی
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

        // انتخاب کلمه به صورت تصادفی
        this.currentWord = db[Math.floor(Math.random() * db.length)];
        
        // تنظیم جواب درست بر اساس نوع دکمه‌ای که زده شده
        let correctAnswer = (this.mode === 'word-def') ? this.currentWord.definition : this.currentWord.translation;

        // ساختن گزینه‌های اشتباه
        const distractors = db.filter(w => w.id !== this.currentWord.id)
                              .sort(() => 0.5 - Math.random())
                              .slice(0, 3)
                              .map(w => (this.mode === 'word-def' ? w.definition : w.translation));
        
        const choices = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        // ساختن ظاهر کارت سوال (با بخش جدید Phrasal Verb)
        container.innerHTML = `
            <div class="quiz-card animate-in">
                <div class="word-header" onclick="window.SpeechEngine.speak('${this.currentWord.word}')">
                    <h2 style="color:#2563eb;">${this.currentWord.word} <i class="fas fa-volume-up"></i></h2>
                </div>

                <div class="details-box" style="text-align:left; direction:ltr; background:#0f172a; padding:15px; border-radius:12px; margin:15px 0; border:1px solid #334155;">
                    <p style="margin:5px 0;"><b style="color:#10b981;">• Collocation:</b> <span style="color:#e2e8f0">${this.currentWord.collocation || '---'}</span></p>
                    <p style="margin:5px 0;"><b style="color:#f59e0b;">• Phrasal Verbs:</b> <span style="color:#e2e8f0; font-size:0.9rem;">${this.currentWord.phrasal || '---'}</span></p>
                    <p style="margin:10px 0 0 0; font-style:italic; color:#94a3b8; border-top:1px solid #1e293b; padding-top:8px;">"${this.currentWord.example || ''}"</p>
                </div>

                <div class="choices-grid">
                    ${choices.map(c => `<button class="choice-btn" onclick="QuizEngine.check('${c}', '${correctAnswer}')">${c}</button>`).join('')}
                </div>
                
                <button class="btn-cancel" style="background:none; border:none; color:#ef4444; margin-top:15px; cursor:pointer;" onclick="location.reload()">انصراف و بازگشت</button>
            </div>`;
    },

    check(selected, correct) {
        // رنگی کردن دکمه‌ها بعد از انتخاب کاربر
        const buttons = document.querySelectorAll('.choice-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correct) btn.style.background = "#10b981";
            else if (btn.textContent === selected) btn.style.background = "#ef4444";
        });

        if (selected === correct) {
            this.score++;
            window.showNotification('عالی بود! ✅', 'success');
        } else {
            window.showNotification('اشتباه شد ❌', 'error');
            if(window.MistakeManager) window.MistakeManager.add(this.currentWord);
        }
        
        this.currentIndex++;
        setTimeout(() => this.nextQuestion(), 1200);
    },

    showResults() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        document.getElementById('app-container').innerHTML = `
            <div class="quiz-card report-box" style="text-align:right;">
                <h3 style="text-align:center; color:#2563eb;">📊 کارنامه فرزاد</h3>
                <div style="background:linear-gradient(135deg, #2563eb, #1e40af); color:white; padding:20px; border-radius:15px; text-align:center; margin:20px 0;">
                    <div style="font-size:3rem; font-weight:bold;">${percentage}%</div>
                    <div>نمره نهایی شما</div>
                </div>
                <p>👨‍🏫 مدرس: English with Fred</p>
                <p>📱 تماس: 09017708544</p>
                <button class="menu-btn blue" style="width:100%; margin-top:15px;" onclick="location.reload()">بازگشت به منو</button>
            </div>`;

        if (window.TelegramReporter) {
            window.TelegramReporter.sendQuizResult(this.score, this.totalQuestions);
        }
    }
};

// این خط خیلی مهم است تا بقیه فایل‌ها بتوانند به موتور آزمون دسترسی داشته باشند
window.QuizEngine = QuizEngine;
