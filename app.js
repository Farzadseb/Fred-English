/**
 * English with Fred - Main Application
 * Version: 1.0.0
 * Author: Fred
 */

// حالت برنامه
const App = {
    view: 'home',
    mode: null,
    bestScore: Number(localStorage.getItem('bestScore')) || 0,
    muted: localStorage.getItem('muted') === 'true',
    theme: localStorage.getItem('theme') || 'light',
    quiz: {
        current: null,
        isActive: false
    },
    settings: {
        autoSpeak: true,
        showHints: true,
        difficulty: 'medium'
    }
};

// المنت‌های DOM
const DOM = {
    home: $('#home'),
    quiz: $('#quiz'),
    progressReport: $('#progressReport'),
    muteBtn: $('#muteBtn'),
    muteIcon: $('#muteIcon'),
    themeBtn: $('#themeBtn'),
    themeIcon: $('#themeIcon'),
    scoreValue: $('#scoreValue'),
    starsContainer: $('#starsContainer'),
    notification: $('#notification'),
    reviewMistakesBtn: $('#reviewMistakesBtn'),
    progressReportBtn: $('#progressReportBtn'),
    whatsappBtn: $('#whatsappBtn'),
    exitBtn: $('#exitBtn'),
    modeCards: $$('.mode-card'),
    currentQuestion: $('#currentQuestion'),
    quizScore: $('#quizScore'),
    progressFill: $('#progressFill'),
    questionText: $('#questionText'),
    speakQuestion: $('#speakQuestion'),
    answerInput: $('#answerInput'),
    submitAnswer: $('#submitAnswer'),
    backHome: $('#backHome'),
    feedback: $('#feedback'),
    backFromReport: $('#backFromReport'),
    progressContent: $('#progressContent')
};

// Helper Functions
function $(id) { return document.getElementById(id); }
function $$(selector) { return document.querySelectorAll(selector); }

/* ========== مدیریت صفحه‌ها ========== */
function switchView(viewId) {
    // مخفی کردن همه صفحات
    DOM.home.classList.remove('active');
    DOM.quiz.classList.remove('active');
    DOM.progressReport.classList.remove('active');
    
    // نمایش صفحه انتخاب شده
    switch(viewId) {
        case 'home':
            DOM.home.classList.add('active');
            App.view = 'home';
            resetQuizState();
            break;
            
        case 'quiz':
            DOM.quiz.classList.add('active');
            App.view = 'quiz';
            // Focus روی input
            setTimeout(() => DOM.answerInput.focus(), 300);
            break;
            
        case 'progressReport':
            DOM.progressReport.classList.add('active');
            App.view = 'progressReport';
            loadProgressReport();
            break;
    }
    
    // اسکرول به بالا
    window.scrollTo(0, 0);
}

/* ========== نوتیفیکیشن ========== */
function showNotification(text, duration = 2000) {
    const notification = DOM.notification;
    notification.textContent = text;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

/* ========== تم (پوسته) ========== */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    App.theme = savedTheme;
    
    if (App.theme === 'dark') {
        document.body.classList.add('dark');
        DOM.themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        DOM.themeIcon.textContent = '🌙';
    }
}

function toggleTheme() {
    if (App.theme === 'light') {
        App.theme = 'dark';
        document.body.classList.add('dark');
        DOM.themeIcon.textContent = '☀️';
    } else {
        App.theme = 'light';
        document.body.classList.remove('dark');
        DOM.themeIcon.textContent = '🌙';
    }
    
    localStorage.setItem('theme', App.theme);
    showNotification(App.theme === 'dark' ? 'تم تاریک فعال شد' : 'تم روشن فعال شد');
}

/* ========== صدا ========== */
function initMute() {
    const savedMute = localStorage.getItem('muted') === 'true';
    App.muted = savedMute;
    
    if (App.muted) {
        DOM.muteIcon.textContent = '🔇';
        DOM.muteBtn.classList.add('muted');
    } else {
        DOM.muteIcon.textContent = '🎤';
        DOM.muteBtn.classList.remove('muted');
    }
}

function toggleMute() {
    App.muted = !App.muted;
    localStorage.setItem('muted', App.muted);
    
    if (App.muted) {
        DOM.muteIcon.textContent = '🔇';
        DOM.muteBtn.classList.add('muted');
        showNotification('صدا خاموش شد');
        
        // متوقف کردن صدا اگر در حال پخش است
        if (typeof window.stopSpeaking === 'function') {
            window.stopSpeaking();
        }
    } else {
        DOM.muteIcon.textContent = '🎤';
        DOM.muteBtn.classList.remove('muted');
        showNotification('صدا روشن شد');
    }
}

// تابع کمکی برای چک کردن حالت mute
window.isMuted = () => App.muted;

/* ========== امتیاز و ستاره‌ها ========== */
function updateScoreDisplay() {
    DOM.scoreValue.textContent = App.bestScore + '%';
    
    // آپدیت ستاره‌ها
    const stars = DOM.starsContainer.querySelectorAll('.star');
    const filledStars = Math.floor(App.bestScore / 20);
    
    stars.forEach((star, index) => {
        if (index < filledStars) {
            star.classList.add('filled');
            star.textContent = '★';
        } else {
            star.classList.remove('filled');
            star.textContent = '☆';
        }
    });
}

function updateBestScore(newScore) {
    if (newScore > App.bestScore) {
        App.bestScore = newScore;
        localStorage.setItem('bestScore', newScore);
        updateScoreDisplay();
        
        // نمایش انیمیشن دستاورد
        if (newScore >= 50 && App.bestScore < 50) {
            ModalHelper.showAchievementModal(
                'نیمه راه! 🎯',
                'به ۵۰٪ امتیاز رسیدی! ادامه بده!'
            );
        } else if (newScore >= 80 && App.bestScore < 80) {
            ModalHelper.showAchievementModal(
                'عالی! 🌟',
                'امتیازت بالای ۸۰٪ است! تو یک استادی!'
            );
        } else if (newScore === 100) {
            ModalHelper.showAchievementModal(
                'کامل! 🏆',
                '۱۰۰٪ امتیاز! تو واقعاً بی‌نظیری!'
            );
        }
    }
}

/* ========== موتور آزمون ========== */
let currentQuiz = null;

function startQuiz(mode) {
    // اعتبارسنجی لغات
    if (!window.words || window.words.length < 5) {
        ModalHelper.showInfoModal(
            '⚠️ لغات کافی نیست',
            'لطفاً فایل words.js را بررسی کنید. حداقل ۵ لغت نیاز است.',
            '⚠️'
        );
        return;
    }
    
    // ایجاد آزمون جدید
    const selectedWords = [...window.words]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    
    currentQuiz = {
        mode: mode,
        index: 0,
        score: 0,
        questions: selectedWords,
        startTime: Date.now(),
        answers: []
    };
    
    App.quiz.isActive = true;
    switchView('quiz');
    showNextQuestion();
}

function showNextQuestion() {
    if (!currentQuiz || currentQuiz.index >= currentQuiz.questions.length) {
        return finishQuiz();
    }
    
    const question = currentQuiz.questions[currentQuiz.index];
    let displayText = '';
    let correctAnswer = '';
    let shouldSpeak = false;
    
    // تنظیم سوال بر اساس حالت
    switch(currentQuiz.mode) {
        case 'english-persian':
            displayText = question.english;
            correctAnswer = question.persian.toLowerCase().trim();
            shouldSpeak = true;
            break;
            
        case 'persian-english':
            displayText = question.persian;
            correctAnswer = question.english.toLowerCase().trim();
            shouldSpeak = false;
            break;
            
        case 'word-definition':
            displayText = question.english;
            correctAnswer = question.definition.toLowerCase().trim();
            shouldSpeak = true;
            break;
            
        case 'definition-word':
            displayText = question.definition;
            correctAnswer = question.english.toLowerCase().trim();
            shouldSpeak = false;
            break;
            
        case 'review-mistakes':
            // حالت مرور اشتباهات
            if (window.currentReviewQuiz && window.currentReviewQuiz.questions) {
                const reviewQ = window.currentReviewQuiz.questions[currentQuiz.index];
                displayText = reviewQ.mode === 'english-persian' ? reviewQ.word.english : 
                             reviewQ.mode === 'persian-english' ? reviewQ.word.persian :
                             reviewQ.mode === 'word-definition' ? reviewQ.word.english :
                             reviewQ.word.definition;
                
                correctAnswer = reviewQ.mode === 'english-persian' ? reviewQ.word.persian :
                               reviewQ.mode === 'persian-english' ? reviewQ.word.english :
                               reviewQ.mode === 'word-definition' ? reviewQ.word.definition :
                               reviewQ.word.english;
                correctAnswer = correctAnswer.toLowerCase().trim();
            }
            break;
    }
    
    // ذخیره جواب صحیح
    currentQuiz.currentAnswer = correctAnswer;
    
    // نمایش سوال
    DOM.questionText.textContent = displayText;
    DOM.currentQuestion.textContent = currentQuiz.index + 1;
    DOM.quizScore.textContent = currentQuiz.score;
    
    // آپدیت progress bar
    const progressPercent = ((currentQuiz.index) / currentQuiz.questions.length) * 100;
    DOM.progressFill.style.width = `${progressPercent}%`;
    
    // پاک کردن input و بازخورد
    DOM.answerInput.value = '';
    DOM.feedback.textContent = 'پاسخ خود را وارد کنید...';
    DOM.feedback.className = 'feedback-box';
    
    // Focus روی input
    setTimeout(() => {
        DOM.answerInput.focus();
    }, 100);
    
    // پخش صدا اگر لازم باشد
    if (shouldSpeak && !App.muted && App.settings.autoSpeak) {
        setTimeout(() => speakText(displayText), 500);
    }
    
    // تنظیم event برای دکمه تکرار صدا
    DOM.speakQuestion.onclick = () => {
        if (!App.muted) {
            speakText(displayText);
        }
    };
}

function checkAnswer() {
    if (!currentQuiz) return;
    
    const userAnswer = DOM.answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuiz.currentAnswer;
    
    if (!userAnswer) {
        showNotification('لطفاً پاسخ خود را وارد کنید', 1500);
        DOM.answerInput.focus();
        return;
    }
    
    // الگوریتم تطبیق هوشمند
    let isCorrect = false;
    const normalizedUser = userAnswer.replace(/[.,!?;]/g, '').toLowerCase();
    const normalizedCorrect = correctAnswer.replace(/[.,!?;]/g, '').toLowerCase();
    
    // تطبیق دقیق
    if (normalizedUser === normalizedCorrect) {
        isCorrect = true;
    }
    // تطبیق جزئی (برای کلمات طولانی)
    else if (normalizedCorrect.length > 4 && 
             normalizedCorrect.includes(normalizedUser) && 
             normalizedUser.length > normalizedCorrect.length * 0.7) {
        isCorrect = true;
    }
    // تطبیق با کلمات مترادف (برای فارسی)
    else if (checkPersianSynonyms(normalizedUser, normalizedCorrect)) {
        isCorrect = true;
    }
    
    // ثبت پاسخ
    currentQuiz.answers.push({
        question: DOM.questionText.textContent,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        timestamp: Date.now()
    });
    
    // نمایش بازخورد
    if (isCorrect) {
        currentQuiz.score++;
        DOM.feedback.textContent = '✅ پاسخ درست است!';
        DOM.feedback.className = 'feedback-box correct';
        DOM.quizScore.textContent = currentQuiz.score;
        
        // پخش صدا
        if (!App.muted) {
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
            audio.volume = 0.3;
            audio.play();
        }
        
        // ثبت در ProgressTracker
        if (typeof ProgressTracker !== 'undefined') {
            ProgressTracker.recordQuestion(
                currentQuiz.mode, 
                true, 
                currentQuiz.questions[currentQuiz.index]
            );
        }
    } else {
        DOM.feedback.textContent = `❌ پاسخ صحیح: ${correctAnswer}`;
        DOM.feedback.className = 'feedback-box wrong';
        
        // ثبت در ProgressTracker
        if (typeof ProgressTracker !== 'undefined') {
            ProgressTracker.recordQuestion(
                currentQuiz.mode, 
                false, 
                currentQuiz.questions[currentQuiz.index]
            );
        }
    }
    
    // رفتن به سوال بعدی
    currentQuiz.index++;
    
    if (currentQuiz.index < currentQuiz.questions.length) {
        setTimeout(showNextQuestion, 1500);
    } else {
        setTimeout(finishQuiz, 1500);
    }
}

function finishQuiz() {
    if (!currentQuiz) return;
    
    const totalQuestions = currentQuiz.questions.length;
    const score = currentQuiz.score;
    const percentage = Math.round((score / totalQuestions) * 100);
    const timeSpent = Math.round((Date.now() - currentQuiz.startTime) / 1000);
    
    // آپدیت بهترین امتیاز
    updateBestScore(percentage);
    
    // ثبت جلسه
    if (typeof ProgressTracker !== 'undefined') {
        ProgressTracker.recordSession(currentQuiz.mode, percentage, totalQuestions);
    }
    
    // نمایش نتایج
    let resultMessage = '';
    let resultIcon = '';
    
    if (percentage >= 90) {
        resultMessage = 'عالی! 🎉 در سطح حرفه‌ای هستید!';
        resultIcon = '🏆';
    } else if (percentage >= 70) {
        resultMessage = 'خیلی خوب! 👍 نیاز به کمی تمرین دارید';
        resultIcon = '⭐';
    } else if (percentage >= 50) {
        resultMessage = 'قابل قبول! 📚 بیشتر تمرین کنید';
        resultIcon = '📖';
    } else {
        resultMessage = 'نیاز به تمرین بیشتر! 💪 ادامه دهید';
        resultIcon = '🎯';
    }
    
    ModalHelper.showCustomModal(
        'نتیجه آزمون ' + resultIcon,
        `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 15px;">${percentage}%</div>
            
            <div style="background: #f5f5f5; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>امتیاز:</span>
                    <span style="font-weight: bold;">${score} از ${totalQuestions}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>زمان:</span>
                    <span>${timeSpent} ثانیه</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>حالت:</span>
                    <span>${getModeName(currentQuiz.mode)}</span>
                </div>
            </div>
            
            <div style="color: #4CAF50; font-weight: bold; margin: 15px 0;">
                ${resultMessage}
            </div>
            
            <button class="btn btn-primary" onclick="ModalHelper.closeModal(this.closest('.custom-modal').id);" style="margin-top: 15px;">
                ادامه
            </button>
        </div>
        `
    );
    
    // بازگشت به خانه
    setTimeout(() => {
        switchView('home');
        App.quiz.isActive = false;
        currentQuiz = null;
    }, 500);
}

function getModeName(mode) {
    const modes = {
        'english-persian': 'انگلیسی به فارسی',
        'persian-english': 'فارسی به انگلیسی',
        'word-definition': 'کلمه به تعریف',
        'definition-word': 'تعریف به کلمه',
        'review-mistakes': 'مرور اشتباهات'
    };
    return modes[mode] || mode;
}

function resetQuizState() {
    DOM.answerInput.value = '';
    DOM.feedback.textContent = 'پاسخ خود را وارد کنید...';
    DOM.feedback.className = 'feedback-box';
    currentQuiz = null;
    App.quiz.isActive = false;
}

/* ========== گزارش پیشرفت ========== */
function loadProgressReport() {
    if (!DOM.progressContent) return;
    
    if (typeof ProgressTracker === 'undefined' || !ProgressTracker.getStats) {
        DOM.progressContent.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                <h3 style="color: #4CAF50; margin-bottom: 10px;">سیستم گزارش‌گیری</h3>
                <p style="color: #666; margin-bottom: 15px;">برای مشاهده گزارش، لطفاً حداقل یک آزمون کامل بدهید.</p>
                <button onclick="switchView('home')" class="btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    شروع آزمون
                </button>
            </div>
        `;
        return;
    }
    
    try {
        const stats = ProgressTracker.getStats();
        const report = ProgressTracker.getProgressReport ? ProgressTracker.getProgressReport() : null;
        
        DOM.progressContent.innerHTML = `
            <div class="progress-overview">
                <div class="stat-card primary">
                    <div class="stat-icon">📈</div>
                    <div class="stat-info">
                        <div class="stat-label">دقت کلی</div>
                        <div class="stat-value">${stats.accuracy || 0}%</div>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-info">
                            <div class="stat-label">پاسخ درست</div>
                            <div class="stat-value">${stats.correctAnswers || 0}</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">❌</div>
                        <div class="stat-info">
                            <div class="stat-label">پاسخ غلط</div>
                            <div class="stat-value">${stats.wrongAnswers || 0}</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-info">
                            <div class="stat-label">روز متوالی</div>
                            <div class="stat-value">${stats.streak || 0}</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-info">
                            <div class="stat-label">اشتباهات فعال</div>
                            <div class="stat-value">${stats.activeMistakes || 0}</div>
                        </div>
                    </div>
                </div>
                
                <div class="recent-sessions">
                    <h3 style="color: #4CAF50; margin: 20px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">
                        📝 آخرین جلسات
                    </h3>
                    ${report && report.recentSessions && report.recentSessions.length > 0 ? 
                        report.recentSessions.slice(0, 5).map(session => `
                            <div class="session-item">
                                <div class="session-header">
                                    <span class="session-mode">${getModeName(session.mode)}</span>
                                    <span class="session-score ${session.score >= 80 ? 'high' : session.score >= 60 ? 'medium' : 'low'}">
                                        ${session.score}%
                                    </span>
                                </div>
                                <div class="session-details">
                                    <span class="session-date">${session.date || 'نامشخص'}</span>
                                    <span class="session-questions">${session.total || 0} سوال</span>
                                </div>
                            </div>
                        `).join('') : 
                        '<div class="empty-state">هنوز جلسه‌ای ثبت نشده است</div>'
                    }
                </div>
                
                <div class="action-buttons" style="margin-top: 25px; display: flex; gap: 10px;">
                    <button onclick="ProgressTracker.reviewMistakes()" class="btn" style="flex: 1; background: #FF9800; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">
                        🎯 مرور اشتباهات
                    </button>
                    <button onclick="clearProgressData()" class="btn" style="flex: 1; background: #F44336; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">
                        🗑️ پاک کردن داده‌ها
                    </button>
                </div>
            </div>
            
            <style>
                .progress-overview {
                    padding: 10px;
                }
                
                .stat-card {
                    background: white;
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    transition: transform 0.3s;
                }
                
                body.dark .stat-card {
                    background: #2d3748;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                }
                
                .stat-card.primary {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                }
                
                .stat-icon {
                    font-size: 28px;
                }
                
                .stat-info {
                    flex: 1;
                }
                
                .stat-label {
                    font-size: 12px;
                    opacity: 0.8;
                    margin-bottom: 4px;
                }
                
                .stat-value {
                    font-size: 24px;
                    font-weight: bold;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin: 20px 0;
                }
                
                .session-item {
                    background: white;
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 10px;
                    border-right: 4px solid #4CAF50;
                    transition: all 0.3s;
                }
                
                body.dark .session-item {
                    background: #2d3748;
                }
                
                .session-item:hover {
                    transform: translateX(5px);
                }
                
                .session-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .session-mode {
                    font-weight: bold;
                    color: #4CAF50;
                }
                
                .session-score {
                    font-weight: bold;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 14px;
                }
                
                .session-score.high {
                    background: #e8f5e9;
                    color: #2e7d32;
                }
                
                .session-score.medium {
                    background: #fff3e0;
                    color: #f57c00;
                }
                
                .session-score.low {
                    background: #ffebee;
                    color: #c62828;
                }
                
                .session-details {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #666;
                }
                
                body.dark .session-details {
                    color: #aaa;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 30px;
                    color: #666;
                    font-style: italic;
                }
            </style>
        `;
    } catch (error) {
        console.error('Error loading progress report:', error);
        DOM.progressContent.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #F44336;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <h3 style="margin-bottom: 10px;">خطا در بارگذاری گزارش</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function clearProgressData() {
    ModalHelper.showConfirmModal(
        '⚠️ پاک کردن داده‌ها',
        'آیا مطمئن هستید که می‌خواهید تمام داده‌های پیشرفت را پاک کنید؟ این عمل قابل بازگشت نیست.',
        () => {
            localStorage.removeItem('progress');
            localStorage.removeItem('bestScore');
            App.bestScore = 0;
            updateScoreDisplay();
            showNotification('داده‌ها با موفقیت پاک شدند', 2000);
            loadProgressReport();
        },
        () => {
            showNotification('عملیات لغو شد', 1500);
        }
    );
}

/* ========== توابع کمکی فارسی ========== */
function checkPersianSynonyms(userWord, correctWord) {
    // لیست محدودی از مترادف‌های رایج فارسی
    const persianSynonyms = {
        'سلام': ['درود', 'سلامتی', 'درود بر شما'],
        'کتاب': ['دفتر', 'کتابچه', 'نسخه'],
        'معلم': ['آموزگار', 'مربی', 'استاد'],
        'دانش‌آموز': ['شاگرد', 'محصل', 'طلب علم'],
        'مدرسه': ['آموزشگاه', 'مکتب', 'دبستان']
    };
    
    // بررسی مترادف‌ها
    for (const [key, synonyms] of Object.entries(persianSynonyms)) {
        if (correctWord.includes(key) || key === correctWord) {
            if (synonyms.includes(userWord) || userWord.includes(key)) {
                return true;
            }
        }
    }
    
    return false;
}

/* ========== مدیریت نصب PWA ========== */
let deferredPrompt;
let isPWAInstalled = false;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    isPWAInstalled = false;
    
    // نمایش پیشنهاد نصب بعد از ۱۵ ثانیه
    setTimeout(() => {
        if (deferredPrompt && !isPWAInstalled) {
            showInstallPrompt();
        }
    }, 15000);
});

window.addEventListener('appinstalled', () => {
    isPWAInstalled = true;
    deferredPrompt = null;
    showNotification('برنامه با موفقیت نصب شد! 🎉', 3000);
});

function showInstallPrompt() {
    if (!deferredPrompt) return;
    
    ModalHelper.showCustomModal(
        '📱 نصب برنامه',
        `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 15px;">📱</div>
            <h3 style="color: #4CAF50; margin-bottom: 10px;">نصب English with Fred</h3>
            <p style="color: #666; margin-bottom: 20px; line-height: 1.5;">
                برای تجربه بهتر و دسترسی سریع‌تر، برنامه را روی دستگاه خود نصب کنید!
            </p>
            <p style="font-size: 12px; color: #888; margin-bottom: 25px;">
                ✓ بدون نیاز به اینترنت<br>
                ✓ سرعت بیشتر<br>
                ✓ نوتیفیکیشن یادآوری
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="installConfirmBtn" class="btn" style="background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: bold;">
                    نصب برنامه
                </button>
                <button id="installCancelBtn" class="btn" style="background: #f5f5f5; color: #333; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer;">
                    بعداً
                </button>
            </div>
        </div>
        `
    );
    
    // تنظیم event handlers
    setTimeout(() => {
        const confirmBtn = document.getElementById('installConfirmBtn');
        const cancelBtn = document.getElementById('installCancelBtn');
        const modal = document.querySelector('.custom-modal.active');
        
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('✅ کاربر نصب را پذیرفت');
                        isPWAInstalled = true;
                    }
                    deferredPrompt = null;
                    if (modal) {
                        ModalHelper.closeModal(modal.id);
                    }
                });
            };
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                deferredPrompt = null;
                if (modal) {
                    ModalHelper.closeModal(modal.id);
                }
                showNotification('می‌توانید بعداً از منو نصب کنید', 2000);
            };
        }
    }, 100);
}

/* ========== رویدادها ========== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 English with Fred در حال راه‌اندازی...');
    
    // مقداردهی اولیه
    initTheme();
    initMute();
    updateScoreDisplay();
    
    // تنظیم event listeners
    DOM.themeBtn.addEventListener('click', toggleTheme);
    DOM.muteBtn.addEventListener('click', toggleMute);
    
    // دکمه‌های صفحه اصلی
    DOM.modeCards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            startQuiz(mode);
        });
    });
    
    DOM.reviewMistakesBtn.addEventListener('click', () => {
        if (typeof ProgressTracker !== 'undefined' && ProgressTracker.reviewMistakes) {
            ProgressTracker.reviewMistakes();
        } else {
            ModalHelper.showInfoModal(
                'اشتباهاتی یافت نشد',
                'هنوز اشتباهی ثبت نکرده‌اید. ابتدا چند آزمون بدهید.',
                '📝'
            );
        }
    });
    
    DOM.progressReportBtn.addEventListener('click', () => {
        switchView('progressReport');
    });
    
    DOM.whatsappBtn.addEventListener('click', () => {
        const phone = "+989123456789";
        const message = "سلام! می‌خواهم در برنامه English With Fred ثبت‌نام کنم.";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        showNotification('در حال باز کردن واتساپ...', 1500);
    });
    
    DOM.exitBtn.addEventListener('click', () => {
        ModalHelper.showConfirmModal(
            'خروج از برنامه',
            'آیا مطمئن هستید که می‌خواهید از برنامه خارج شوید؟',
            () => {
                if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
                    window.close();
                } else {
                    window.location.href = 'about:blank';
                }
            },
            () => {
                showNotification('خروج لغو شد', 1500);
            }
        );
    });
    
    // دکمه‌های آزمون
    DOM.submitAnswer.addEventListener('click', checkAnswer);
    DOM.backHome.addEventListener('click', () => switchView('home'));
    DOM.backFromReport.addEventListener('click', () => switchView('home'));
    
    // کلید Enter در input
    DOM.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Focus روی input هنگام کلیک
    DOM.answerInput.addEventListener('click', function() {
        this.focus();
    });
    
    // جلوگیری از اسکرول با چرخ موس روی input
    DOM.answerInput.addEventListener('wheel', (e) => {
        e.preventDefault();
    });
    
    // مدیریت حالت fullscreen PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 برنامه در حالت PWA اجرا می‌شود');
        document.body.classList.add('pwa-mode');
    }
    
    // رویداد visibility change برای بازیابی focus
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && App.quiz.isActive) {
            setTimeout(() => DOM.answerInput.focus(), 300);
        }
    });
    
    // نمایش خوش‌آمدگویی
    setTimeout(() => {
        if (!localStorage.getItem('welcomeShown')) {
            ModalHelper.showInfoModal(
                '🌟 خوش آمدید!',
                `به English with Fred خوش آمدید!
                
                📚 این برنامه به شما کمک می‌کند:
                • لغات انگلیسی را یاد بگیرید
                • تلفظ صحیح را تمرین کنید
                • اشتباهات خود را مرور کنید
                • پیشرفت خود را دنبال کنید
                
                شروع کنید و لذت ببرید!`,
                '🎓'
            );
            localStorage.setItem('welcomeShown', 'true');
        }
    }, 1000);
    
    console.log('✅ برنامه با موفقیت راه‌اندازی شد');
});

// جلوگیری از بازگشت مرورگر
window.addEventListener('popstate', function(e) {
    if (App.view !== 'home') {
        switchView('home');
        history.pushState(null, null, window.location.href);
    }
});

// ثبت state اولیه
history.pushState(null, null, window.location.href);

// صادر کردن توابع برای استفاده در console
window.App = App;
window.startQuiz = startQuiz;
window.switchView = switchView;
window.showNotification = showNotification;
