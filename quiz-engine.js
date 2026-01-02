// موتور آزمون با قابلیت نمایش Collocation و Phrasal Verbs
const QuizEngine = {
    currentIndex: 0,
    score: 0,

    start: function(mode) {
        this.currentIndex = 0;
        this.score = 0;
        this.renderQuestion();
    },

    renderQuestion: function() {
        const item = a1Words[this.currentIndex];
        const container = document.getElementById('quiz-container');
        const progress = ((this.currentIndex + 1) / a1Words.length) * 100;

        container.innerHTML = `
            <div class="welcome-card ltr-content" style="animation:none; width:90%; margin:15px auto;">
                <div class="mini-progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>

                <div class="word-header" style="display:flex; align-items:center; gap:10px;">
                    <h1 style="margin:0; font-size:2rem;">${item.word}</h1>
                    <button class="glossy-speaker" onclick="speak('${item.word}')">🔊</button>
                </div>
                
                <p class="rtl-text" style="direction:rtl; text-align:right; color:#FFD700;">معنی: ${item.translation}</p>
                <hr style="opacity:0.2">
                
                <div class="educational-content">
                    <p><strong>Collocation:</strong> ${item.collocation.phrase}</p>
                    <p class="rtl-text" style="direction:rtl; text-align:right; font-size:0.9rem; opacity:0.8;">${item.collocation.meaning}</p>
                    
                    <p style="margin-top:15px;"><strong>Phrasal Verbs:</strong></p>
                    ${item.phrasalVerbs.map(pv => `
                        <div class="pv-box" style="background:rgba(255,255,255,0.05); padding:8px; border-radius:10px; margin-bottom:8px;">
                            <p style="margin:0; color:#007AFF;">🔹 ${pv.term}</p>
                            <p style="margin:5px 0; font-size:0.85rem;">Ex: ${pv.example}</p>
                            <p class="rtl-text" style="direction:rtl; text-align:right; margin:0; font-size:0.85rem; opacity:0.7;">معنی: ${pv.mean}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="quiz-actions" style="margin-top:20px;">
                    <button class="apple-btn btn-green" onclick="QuizEngine.next(true)">یاد گرفتم ✅</button>
                    <button class="apple-btn btn-red" onclick="QuizEngine.handleMistake()">سخت بود ❌</button>
                </div>
            </div>
        `;
    },

    handleMistake: function() {
        const currentWord = a1Words[this.currentIndex];
        MistakeStorage.save(currentWord); // ذخیره در فایل mistake-storage.js
        this.next(false);
    },

    next: function(isCorrect) {
        this.currentIndex++;
        if (this.currentIndex < a1Words.length) {
            this.renderQuestion();
        } else {
            this.finish();
        }
    },

    finish: function() {
        const report = `دانش‌آموز ${AppConfig.currentUser} تمرین را با موفقیت به پایان رساند.`;
        TelegramIntegration.send(report);
        alert("تمرین تمام شد! گزارش برای مدرس ارسال شد.");
        goBack();
    }
};
