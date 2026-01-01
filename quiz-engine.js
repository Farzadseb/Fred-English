// quiz-engine.js - موتور هوشمند آزمون با منطق رکورد و انگیزش
console.log('🎯 Final Quiz Engine Loaded');

const QuizEngine = {
    currentWord: null,
    score: 0,
    totalAsked: 0,
    maxQuestions: 10,
    quizMode: 'normal',

    // ۱. شروع سوال جدید با منطق تطبیقی
    nextQuestion() {
        if (this.totalAsked >= this.maxQuestions) {
            this.showFinalResults();
            return;
        }

        const appContainer = document.getElementById('app-container');
        
        // انتخاب لغت: عادی یا لغات سخت (Spaced Repetition)
        if (this.quizMode === 'hard_words') {
            const hWords = MistakeManager.getHardestWords(10);
            const randomHard = hWords[Math.floor(Math.random() * hWords.length)];
            this.currentWord = (window.A1Words?.words || []).find(w => w.id === randomHard.id) || window.getRandomWord();
        } else {
            const hWords = MistakeManager.getHardestWords(5);
            if (hWords.length > 0 && Math.random() < 0.25) { // ۲۵٪ احتمال لغت سخت
                const randomHard = hWords[Math.floor(Math.random() * hWords.length)];
                this.currentWord = (window.A1Words?.words || []).find(w => w.id === randomHard.id) || window.getRandomWord();
            } else {
                this.currentWord = window.getRandomWord() || { english: 'Error', persian: 'خطا', example: 'Check database' };
            }
        }

        this.renderQuestion(appContainer);
    },

    // ۲. رندر سوال (UI)
    renderQuestion(container) {
        let options = this._generateOptions(this.currentWord.persian);
        const progress = (this.totalAsked / this.maxQuestions) * 100;

        container.innerHTML = `
            <div class="quiz-card animate-in">
                <div class="progress-container"><div class="progress-bar" style="width: ${progress}%"></div></div>
                <div class="quiz-header">
                    <span class="q-count">سوال ${this.totalAsked + 1} از ${this.maxQuestions}</span>
                    <button onclick="window.speakText(QuizEngine.currentWord.english, 0.8)" class="btn-audio">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <h2 class="word-display">${this.currentWord.english}</h2>
                <div class="options-grid">
                    ${options.map(opt => `<button onclick="QuizEngine.checkAnswer('${opt}')" class="btn-option">${opt}</button>`).join('')}
                </div>
            </div>
        `;
        window.speakText(this.currentWord.english, 0.8);
    },

    // ۳. بررسی جواب و تعامل با MistakeManager
    checkAnswer(selected) {
        const isCorrect = (selected === this.currentWord.persian);
        this.totalAsked++;

        if (isCorrect) {
            this.score++;
            MistakeManager.reduceMistake(this.currentWord.id);
        } else {
            MistakeManager.addMistake(this.currentWord);
        }
        this.showFeedback(isCorrect);
    },

    // ۴. فیدبک بعد از هر سوال
    showFeedback(isCorrect) {
        const appContainer = document.getElementById('app-container');
        const color = isCorrect ? 'var(--success)' : 'var(--danger)';
        
        appContainer.innerHTML = `
            <div class="feedback-card animate-in" style="border-top: 6px solid ${color}">
                <h3 style="color: ${color}">${isCorrect ? '✅ عالی بود!' : '❌ اشتباه شد!'}</h3>
                <div class="golden-notes">
                    <p><b>معنی:</b> ${this.currentWord.persian}</p>
                    <p><b>مثال:</b> ${this.currentWord.example}</p>
                    ${this.currentWord.collocation ? `<p class="collo"><b>نکته:</b> ${this.currentWord.collocation}</p>` : ''}
                </div>
                <button onclick="QuizEngine.nextQuestion()" class="btn-next">
                    ${this.totalAsked >= this.maxQuestions ? 'نتیجه نهایی' : 'سوال بعدی'} <i class="fas fa-arrow-left"></i>
                </button>
            </div>
        `;
        if (!isCorrect) window.speakText(this.currentWord.english, 0.6);
    },

    // ۵. صفحه نتایج (انگیزشی + رکورد شخصی)
    showFinalResults() {
        const appContainer = document.getElementById('app-container');
        const percent = Math.round((this.score / this.maxQuestions) * 100);
        
        // پیام انگیزشی
        let motivational = percent >= 90 ? '🎉 نابغه! رکورد زدی!' : 
                           percent >= 70 ? '💪 عالی! ادامه بده!' : 
                           percent >= 50 ? '👍 خوبه! دفعه بعد بهتر می‌شی!' : '🌱 تمرین بیشتر، نتیجه بهتر!';

        // مدیریت رکورد (Best Score)
        const userId = window.appState?.currentUser?.id || 'anon';
        const bestKey = `bestScore_${userId}`;
        const prevBest = parseInt(localStorage.getItem(bestKey) || '0');
        let recordMsg = `🏆 بهترین امتیاز قبلی: ${prevBest}%`;
        
        if (percent > prevBest) {
            localStorage.setItem(bestKey, percent);
            recordMsg = `🔥 رکورد جدید: ${percent}% (قبلی: ${prevBest}%)`;
        }

        // ارسال به تلگرام
        if(window.TelegramReporter) TelegramReporter.sendQuizResult(this.score, this.maxQuestions, 'A1');

        appContainer.innerHTML = `
            <div class="final-card animate-in">
                <div class="result-circle"><span>${percent}%</span></div>
                <h2 class="motivational">${motivational}</h2>
                <p class="record-text">${recordMsg}</p>
                <p>درست: <b>${this.score}</b> | کل: <b>${this.maxQuestions}</b></p>
                <div class="final-actions">
                    <button onclick="location.reload()" class="btn-restart">تکرار آزمون</button>
                    <button onclick="QuizEngine.startHardMode()" class="btn-hard-mode">تمرین لغات سخت</button>
                    <button onclick="location.href='/'" class="btn-home">بازگشت به منو</button>
                </div>
            </div>
        `;
    },

    startHardMode() {
        if (MistakeManager.getMistakes().length < 3) {
            alert("هنوز لغات اشتباه کافی برای تمرین نداری!");
            return;
        }
        this.score = 0;
        this.totalAsked = 0;
        this.quizMode = 'hard_words';
        this.nextQuestion();
    },

    _generateOptions(correct) {
        let opts = [correct];
        const allWords = window.A1Words?.words || [];
        while (opts.length < 4) {
            let r = allWords[Math.floor(Math.random() * allWords.length)]?.persian || 'لغت نمونه';
            if (!opts.includes(r)) opts.push(r);
        }
        return opts.sort(() => Math.random() - 0.5);
    }
};

window.QuizEngine = QuizEngine;
