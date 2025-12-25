/**
 * English with Fred - A1 (Student Edition)
 * فایل اصلی اپلیکیشن - نسخه RC1
 */

// متغیرهای عمومی
let currentMode = 'en-fa';
let currentQuestionIndex = 0;
let correctAnswers = 0;
let currentSession = [];
let isMuted = false;

// در ابتدای DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 English with Fred - A1 (Student Edition)');
    
    // راه‌اندازی ماژول‌ها
    // ⭐ اصلاح ۱: فقط ProgressTracker.init() - ScreenController خودش init می‌کند
    ProgressTracker.init();
    
    // ⭐ اصلاح ۲: حذف showHomeScreen() - ScreenController خودش تنظیم می‌کند
    
    // تنظیم دکمه‌ها
    setupButtons();
});

// تابع showCustomModal
function showCustomModal(title, content) {
    ModalHelper.showCustomModal(title, content);
}

// تابع closeCustomModal
function closeCustomModal() {
    ModalHelper.closeAllModals();
}

// تابع addProgressBadge
function addProgressBadge() {
    // حذف badge قبلی
    const existingBadge = document.getElementById('progress-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // فقط در صفحه اصلی نشان بده
    if (ScreenController.getCurrentState() !== ScreenController.STATE.HOME) {
        return;
    }
    
    const badgeHTML = `
        <div id="progress-badge" class="progress-badge" onclick="ProgressTracker.showProgressReport()" title="گزارش پیشرفت">
            📊
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', badgeHTML);
}

// تابع checkAnswer اصلاح شده
function checkAnswer(selected, correct, questionData) {
    const isCorrect = selected === correct;
    
    // ثبت در ProgressTracker
    ProgressTracker.recordQuestion(currentMode, isCorrect, questionData);
    
    // بقیه کد checkAnswer...
    // (کد موجود شما بدون تغییر)
}

// تابع finishQuiz اصلاح شده
function finishQuiz() {
    const scorePercentage = currentSession.length > 0 ? 
        Math.round((correctAnswers / currentSession.length) * 100) : 0;
    
    // ثبت جلسه در ProgressTracker
    ProgressTracker.recordSession(currentMode, scorePercentage, currentSession.length);
    
    // بقیه کد finishQuiz...
    // (کد موجود شما بدون تغییر)
}

// ⭐ اصلاح ۳: تابع reviewSmartMistakes واقعاً smart
function reviewSmartMistakes() {
    const mistakes = ProgressTracker.getMistakesForReview(10);
    
    if (mistakes.length === 0) {
        showToast('🎉 هیچ اشتباهی برای مرور ندارید!', '🎯');
        
        // پیشنهاد تمرین معمولی
        setTimeout(() => {
            if (confirm('می‌خواهید یک تمرین معمولی شروع کنید؟')) {
                startQuiz('en-fa');
            }
        }, 500);
        
        return;
    }
    
    currentMode = 'smart-review';
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    // ⭐ اصلاح: واقعاً از اشتباهات هوشمند استفاده کن
    // ۱. اولویت‌بندی اشتباهات
    const prioritizedMistakes = mistakes.sort((a, b) => b.priority - a.priority);
    
    // ۲. تبدیل اشتباهات به سوالات
    currentSession = prioritizedMistakes.map(mistake => {
        // پیدا کردن کلمه مربوطه در دیتابیس
        const word = words.find(w => 
            w.english === mistake.word.english && 
            w.persian === mistake.word.persian
        );
        
        return word || mistake.word; // اگر پیدا نشد، خود اشتباه را برگردان
    });
    
    // ۳. محدود کردن به ۱۰ سوال
    currentSession = currentSession.slice(0, Math.min(10, currentSession.length));
    
    showToast(`🎯 ${mistakes.length} اشتباه اولویت‌دار برای مرور`, '🧠');
    
    ScreenController.setState(ScreenController.STATE.QUIZ);
    
    setTimeout(() => {
        loadQuestion();
    }, 100);
}

// تابع showAchievement
function showAchievement(title, message) {
    ProgressTracker.showAchievement(title, message);
}

// ⭐ اصلاح: حذف global function overload غیرلازم
// فقط ModalHelper کافی است

// توابع موجود دیگر بدون تغییر باقی می‌مانند
// -----------------------------------------------------
// این بخش‌ها از فایل قبلی شما (بدون تغییر):
// -----------------------------------------------------

function setupButtons() {
    // دکمه‌های تمرین
    document.querySelectorAll('.quiz-start-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            startQuiz(mode);
        });
    });
    
    // دکمه گزارش پیشرفت
    const reportBtn = document.getElementById('progress-report-btn');
    if (reportBtn) {
        reportBtn.addEventListener('click', function() {
            ProgressTracker.showProgressReport();
        });
    }
    
    // دکمه تنظیمات
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', toggleSettings);
    }
    
    // دکمه dark mode
    const darkModeBtn = document.getElementById('dark-mode-btn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
    
    // دکمه‌های خروج
    const exitQuizBtn = document.getElementById('exit-quiz-btn');
    const exitAppBtn = document.getElementById('exit-app-btn');
    
    if (exitQuizBtn) {
        exitQuizBtn.addEventListener('click', exitQuiz);
    }
    
    if (exitAppBtn) {
        exitAppBtn.addEventListener('click', exitApp);
    }
    
    // دکمه‌های نصب PWA
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', showInstallPrompt);
    }
    
    const cancelInstallBtn = document.getElementById('cancel-install-btn');
    if (cancelInstallBtn) {
        cancelInstallBtn.addEventListener('click', hideInstallPrompt);
    }
    
    console.log('✅ All buttons initialized');
}

function startQuiz(mode) {
    currentMode = mode;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    // آماده‌سازی سوالات
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    currentSession = shuffledWords.slice(0, 10);
    
    // مخفی کردن badge هنگام شروع آزمون
    const badge = document.getElementById('progress-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    // تغییر به صفحه آزمون
    ScreenController.setState(ScreenController.STATE.QUIZ);
    
    // بارگذاری اولین سوال
    setTimeout(() => {
        loadQuestion();
    }, 100);
}

function loadQuestion() {
    // کد موجود loadQuestion شما
}

function showToast(message, icon = '📢') {
    // کد موجود showToast شما
}

function toggleDarkMode() {
    // کد موجود toggleDarkMode شما
}

function toggleSettings() {
    // کد موجود toggleSettings شما
}

function showInstallPrompt() {
    // کد موجود showInstallPrompt شما
}

function hideInstallPrompt() {
    // کد موجود hideInstallPrompt شما
}

function exitQuiz() {
    // کد موجود exitQuiz شما
    
    // نمایش مجدد badge
    setTimeout(() => {
        ProgressTracker.addProgressBadge();
    }, 300);
}

function exitApp() {
    // کد موجود exitApp شما
    
    // نمایش مجدد badge
    setTimeout(() => {
        ProgressTracker.addProgressBadge();
    }, 300);
}

// -----------------------------------------------------
// Global functions - فقط ضروری‌ها
// -----------------------------------------------------

// ⭐ اصلاح: فقط ModalHelper - API واحد
window.ModalHelper = ModalHelper;
window.ScreenController = ScreenController;
window.ProgressTracker = ProgressTracker;

// توابع ضروری برای event handlers در HTML
window.reviewSmartMistakes = reviewSmartMistakes;
window.showAchievement = showAchievement;
