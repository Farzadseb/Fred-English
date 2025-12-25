/**
 * English with Fred - Application Controller
 * Version 2.2 - Production Ready
 */

// Global state
let currentTheme = 'light';
let isMuted = false;
let deferredPrompt = null;

// Screen controller
const ScreenController = {
    STATE: {
        HOME: 'home',
        QUIZ: 'quiz'
    },
    
    getCurrentState: function() {
        if (document.getElementById('home-screen').classList.contains('active')) {
            return this.STATE.HOME;
        }
        return this.STATE.QUIZ;
    },
    
    showScreen: function(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show requested screen
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    }
};

// Modal system
function showCustomModal(title, content, onClose = null) {
    const modalHTML = `
        <div id="custom-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeCustomModal()">✕</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Store callback
    if (onClose) {
        window.modalCloseCallback = onClose;
    }
}

function closeCustomModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) {
        modal.remove();
    }
    
    // Execute callback if exists
    if (window.modalCloseCallback) {
        window.modalCloseCallback();
        window.modalCloseCallback = null;
    }
}

// Quiz navigation
function startQuiz(mode) {
    console.log(`🎯 Starting quiz in ${mode} mode`);
    
    // Pass mode to quiz system
    window.currentQuizMode = mode;
    
    // Initialize quiz
    if (typeof initQuiz === 'function') {
        initQuiz(mode);
    }
    
    // Show quiz screen
    ScreenController.showScreen('quiz-screen');
}

// این تابع توسط ProgressTracker صدا زده می‌شود
function reviewSmartMistakes() {
    console.log('🎯 Starting smart mistake review');
    
    // Get smart mistakes for review
    if (typeof ProgressTracker !== 'undefined') {
        const mistakes = ProgressTracker.getMistakesForReview(10);
        
        if (mistakes.length === 0) {
            showCustomModal('🎉 هیچ اشتباهی برای مرور ندارید', 
                '<div class="no-mistakes"><p>تبریک! تمام اشتباهات خود را مرور کرده‌اید.</p></div>');
            return;
        }
        
        // Convert mistakes to quiz format
        const quizWords = mistakes.map(mistake => {
            const word = mistake.word;
            return {
                ...word,
                mode: mistake.mode,
                mistakeId: mistake.id
            };
        });
        
        // Start quiz with these words
        if (typeof startMistakeReview === 'function') {
            startMistakeReview(quizWords);
            ScreenController.showScreen('quiz-screen');
        }
    } else {
        showCustomModal('⚠️ سیستم پیشرفت فعال نیست', 
            '<p>سیستم ردیابی پیشرفت هنوز راه‌اندازی نشده است.</p>');
    }
}

// Theme management
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (currentTheme === 'light') {
        body.classList.add('dark-theme');
        currentTheme = 'dark';
        themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark-theme');
        currentTheme = 'light';
        themeIcon.textContent = '🌙';
    }
    
    localStorage.setItem('theme', currentTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-icon').textContent = '☀️';
    }
}

// Audio management
function toggleMute() {
    const muteIcon = document.getElementById('mute-icon');
    isMuted = !isMuted;
    
    if (isMuted) {
        muteIcon.textContent = '🔇';
    } else {
        muteIcon.textContent = '🔊';
    }
    
    localStorage.setItem('isMuted', isMuted);
    
    // Update speech system
    if (typeof window.setMuteState === 'function') {
        window.setMuteState(isMuted);
    }
}

function loadMuteState() {
    const savedMute = localStorage.getItem('isMuted') === 'true';
    isMuted = savedMute;
    
    document.getElementById('mute-icon').textContent = isMuted ? '🔇' : '🔊';
    
    if (typeof window.setMuteState === 'function') {
        window.setMuteState(isMuted);
    }
}

// Score management
function updateBestScore(newScore) {
    let bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    
    if (newScore > bestScore) {
        bestScore = newScore;
        localStorage.setItem('bestScore', bestScore.toString());
        document.getElementById('best-score').textContent = bestScore;
        updateStars(bestScore);
        
        // Show celebration for new record
        if (bestScore > 0) {
            setTimeout(() => {
                showCustomModal('🎉 رکورد جدید!', 
                    `<div class="celebration">
                        <div style="font-size: 48px; margin: 20px 0;">🏆</div>
                        <p>رکورد جدید شما: ${bestScore}%</p>
                        <p>عالی هستید! ادامه دهید!</p>
                    </div>`);
            }, 1000);
        }
    }
    
    return bestScore;
}

function updateStars(score) {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '';
    
    const starCount = Math.floor(score / 20);
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = i < starCount ? '★' : '☆';
        starsContainer.appendChild(star);
    }
}

function loadBestScore() {
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    document.getElementById('best-score').textContent = bestScore;
    updateStars(bestScore);
}

// PWA Install
function showInstallPrompt() {
    // فقط HTML Prompt را نشان بده
    const prompt = document.getElementById('install-prompt');
    if (prompt) {
        prompt.style.display = 'flex';
    }
}

function hideInstallPrompt() {
    const prompt = document.getElementById('install-prompt');
    if (prompt) {
        prompt.style.display = 'none';
    }
}

function installApp() {
    // از native browser prompt استفاده می‌کنیم
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
                document.getElementById('install-btn').style.display = 'none';
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            deferredPrompt = null;
            hideInstallPrompt();
        });
    } else {
        console.log('ℹ️ Native install prompt not available');
    }
}

// Exit functions
function exitQuiz() {
    if (window.quizInProgress) {
        showCustomModal('⚠️ خروج از آزمون', `
            <div class="exit-confirm">
                <p>آیا مطمئن هستید می‌خواهید از آزمون خارج شوید؟</p>
                <p>پیشرفت فعلی ذخیره نخواهد شد.</p>
                <div class="action-buttons">
                    <button class="btn btn-danger" onclick="confirmExitQuiz()">خروج</button>
                    <button class="btn btn-secondary" onclick="closeCustomModal()">انصراف</button>
                </div>
            </div>
        `);
    } else {
        confirmExitQuiz();
    }
}

function confirmExitQuiz() {
    // Reset quiz state
    if (typeof resetQuiz === 'function') {
        resetQuiz();
    }
    
    // Show home screen
    ScreenController.showScreen('home-screen');
    closeCustomModal();
}

function exitApp() {
    showCustomModal('🚪 خروج از برنامه', `
        <div class="exit-confirm">
            <p>آیا مطمئن هستید می‌خواهید از برنامه خارج شوید؟</p>
            <div class="action-buttons">
                <button class="btn btn-danger" onclick="closeApp()">خروج</button>
                <button class="btn btn-secondary" onclick="closeCustomModal()">انصراف</button>
            </div>
        </div>
    `);
}

function closeApp() {
    // For PWA, we can close the window
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        // In standalone mode, we can't close window, just go back
        window.history.back();
    } else {
        // Show exit message
        showCustomModal('👋 خدانگهدار', `
            <div class="goodbye-message">
                <p>از همراهی شما سپاسگزاریم!</p>
                <p>برای خروج کامل، برنامه را ببندید.</p>
                <button class="btn btn-primary" onclick="closeCustomModal()">
                    بازگشت به برنامه
                </button>
            </div>
        `);
    }
}

// Event Listeners for PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'block';
        
        // فقط دکمه را نشان بده، پاپ‌آپ را خودکار نشان نده
        console.log('ℹ️ Install prompt available - button shown');
    }
});

// Initialize app
function initApp() {
    console.log('🚀 English with Fred - Initializing...');
    
    // Load saved settings
    loadTheme();
    loadMuteState();
    loadBestScore();
    
    // تنها source of truth برای نمایش صفحه
    ScreenController.showScreen('home-screen');
    
    // حیاتی: Initialize Progress Tracker
    if (typeof ProgressTracker !== 'undefined') {
        console.log('📊 Initializing Progress Tracker...');
        ProgressTracker.init();
        
        // Set UI handlers for Progress Tracker
        ProgressTracker.setUIHandlers({
            showModal: showCustomModal,
            reviewMistakes: reviewSmartMistakes,
            startQuiz: startQuiz
        });
    } else {
        console.error('❌ Progress Tracker not loaded!');
    }
    
    // Hide install button initially
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
    
    // Check if already installed
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 Running in standalone mode');
        if (installBtn) installBtn.style.display = 'none';
    }
}

// Start app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Modal styles
const modalStyles = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .dark-theme .modal-content {
        background: #2d3748;
        color: white;
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .dark-theme .modal-header {
        border-bottom: 1px solid #4a5568;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #718096;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    
    .modal-close:hover {
        background: #f7fafc;
    }
    
    .dark-theme .modal-close {
        color: #a0aec0;
    }
    
    .dark-theme .modal-close:hover {
        background: #4a5568;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .no-mistakes {
        text-align: center;
        padding: 30px 20px;
    }
    
    .no-mistakes p {
        font-size: 16px;
        color: #48bb78;
        margin: 0;
    }
    
    .exit-confirm {
        text-align: center;
        padding: 20px;
    }
    
    .exit-confirm p {
        margin-bottom: 20px;
        line-height: 1.6;
    }
    
    .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    .action-buttons .btn {
        flex: 1;
    }
    
    .celebration {
        text-align: center;
        padding: 20px;
    }
    
    .goodbye-message {
        text-align: center;
        padding: 30px 20px;
    }
    
    .goodbye-message p {
        margin-bottom: 20px;
        line-height: 1.6;
    }
    
    .install-instructions {
        padding: 10px 0;
    }
    
    .install-instructions ol {
        text-align: right;
        padding-right: 20px;
        margin: 15px 0;
    }
    
    .install-instructions li {
        margin-bottom: 8px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;

// Add modal styles to document
const styleElement = document.createElement('style');
styleElement.textContent = modalStyles;
document.head.appendChild(styleElement);

console.log('✅ App.js v2.2 loaded successfully');
