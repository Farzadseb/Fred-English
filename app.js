/**
 * English with Fred - A1 (Student Edition)
 * فایل اصلی اپلیکیشن - نسخه نهایی
 */

// متغیرهای عمومی (همانطور که quiz.js نیاز دارد)
let currentMode = 'en-fa';
let currentQuestionIndex = 0;
let correctAnswers = 0;
let currentSession = [];
let isMuted = false;

// در ابتدای DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 English with Fred - A1 (Student Edition)');
    
    // فقط ProgressTracker.init() - ScreenController خودش init می‌کند
    ProgressTracker.init();
    
    // تنظیم دکمه‌ها
    setupButtons();
});

// تابع reviewSmartMistakes اصلاح شده
function reviewSmartMistakes() {
    const mistakes = ProgressTracker.getMistakesForReview(10);
    
    if (mistakes.length === 0) {
        // استفاده از ModalHelper به جای confirm ساده
        ModalHelper.showConfirmModal(
            'مرور اشتباهات',
            'هیچ اشتباهی برای مرور ندارید! می‌خواهید یک تمرین معمولی شروع کنید؟',
            () => startQuiz('en-fa')
        );
        return;
    }
    
    // واقعاً از اشتباهات استفاده کن
    currentMode = 'smart-review';
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    // تبدیل اشتباهات به سوالات
    currentSession = mistakes.map(mistake => {
        return words.find(w => 
            w.english === mistake.word.english && 
            w.persian === mistake.word.persian
        ) || mistake.word;
    }).slice(0, 10); // فقط ۱۰ تا
    
    showToast(`🎯 ${mistakes.length} اشتباه اولویت‌دار برای مرور`, '🧠');
    
    ScreenController.setState(ScreenController.STATE.QUIZ);
    
    setTimeout(() => {
        loadQuestion(); // این تابع باید در quiz.js باشد
    }, 100);
}

// تابع showAchievement
function showAchievement(title, message) {
    ProgressTracker.showAchievement(title, message);
}

// تابع setupButtons
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

// ⭐ اضافه کردن توابع ScreenController به global scope برای دکمه‌ها
window.showInstallPrompt = () => ScreenController.showInstallPrompt();
window.hideInstallPrompt = () => ScreenController.hideInstallPrompt();

// توابع ضروری global
window.reviewSmartMistakes = reviewSmartMistakes;
window.showAchievement = showAchievement;

// بقیه توابع مورد نیاز برای quiz.js
window.startQuiz = startQuiz;
window.exitQuiz = exitQuiz;
window.toggleDarkMode = toggleDarkMode;
window.toggleSettings = toggleSettings;
