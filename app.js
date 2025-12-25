// در ابتدای DOMContentLoaded اضافه کن:
document.addEventListener('DOMContentLoaded', function() {
    // ...
    ProgressTracker.init();
    // ...
});

// تابع showCustomModal اضافه کن:
function showCustomModal(title, content) {
    // حذف modal قبلی اگر وجود دارد
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div id="custom-modal" class="custom-modal active">
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close-btn" onclick="closeCustomModal()">×</button>
                </div>
                <div class="custom-modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // اضافه کردن progress badge
    addProgressBadge();
}

function closeCustomModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

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

// در تابع checkAnswer اصلاح کن:
function checkAnswer(selected, correct, questionData) {
    // ...
    
    // ثبت در ProgressTracker
    ProgressTracker.recordQuestion(currentMode, isCorrect);
    
    // ...
}

// در تابع finishQuiz اصلاح کن:
function finishQuiz() {
    const scorePercentage = currentSession.length > 0 ? 
        Math.round((correctAnswers / currentSession.length) * 100) : 0;
    
    // ثبت جلسه
    ProgressTracker.recordSession(currentMode, scorePercentage, currentSession.length);
    
    // ...
}

// تابع reviewMistakes هوشمند:
function reviewMistakes() {
    const mistakes = ProgressTracker.getMistakesForReview(10);
    
    if (mistakes.length === 0) {
        showToast('🎉 هیچ اشتباهی برای مرور ندارید!', '🎯');
        return;
    }
    
    // ایجاد جلسه مرور از اشتباهات هوشمند
    currentMode = 'smart-review';
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    // استفاده از اشتباهات هوشمند (در این نسخه ساده، از words استفاده می‌کنیم)
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    currentSession = shuffledWords.slice(0, Math.min(mistakes.length, 10));
    
    showToast(`🎯 ${mistakes.length} اشتباه برای مرور`, '🧠');
    
    ScreenController.setState(ScreenController.STATE.QUIZ);
    
    setTimeout(() => {
        loadQuestion();
    }, 100);
}
