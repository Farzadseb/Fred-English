// app.js - منطق اصلی برنامه

// ===== Global Variables =====
let words = [];
let currentMode = '';
let currentSession = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let isMuted = false;
let mistakes = [];
let deferredPrompt = null;
let isPWAInstalled = false;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Application initialized');
    
    // Load words from words.js
    if (typeof wordsData !== 'undefined') {
        processWordsData(wordsData);
    } else {
        console.error('❌ wordsData is not defined! Check words.js');
        showToast('خطا در بارگذاری لغات. لطفا صفحه را رفرش کنید.', '⚠️');
    }
    
    // Load saved data
    loadSavedData();
    
    // Update UI
    updateStars();
    updateMuteIcon();
    
    // Initialize service worker for PWA
    initServiceWorker();
    
    // Check if PWA is already installed
    checkPWAInstallation();
    
    // Auto-show install prompt after 15 seconds (نه 5 ثانیه)
    setTimeout(() => {
        if (deferredPrompt && !isPWAInstalled) {
            setTimeout(() => {
                showInstallPrompt();
            }, 15000);
        }
    }, 1000);
});

// ===== Data Processing =====
function processWordsData(data) {
    try {
        words = data.trim().split('\n').map(line => {
            const parts = line.split(' — ');
            if (parts.length >= 3) {
                return {
                    english: parts[0].trim(),
                    persian: parts[1].trim(),
                    definition: parts[2].trim()
                };
            }
            return null;
        }).filter(word => word !== null);
        
        console.log(`✅ Loaded ${words.length} words`);
    } catch (error) {
        console.error('❌ Error processing words data:', error);
        words = [];
    }
}

function loadSavedData() {
    // Load theme
    const savedTheme = localStorage.getItem('fred_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-icon').textContent = '☀️';
    }
    
    // Load mute state
    isMuted = localStorage.getItem('fred_muted') === 'true';
    
    // Load mistakes
    try {
        const savedMistakes = localStorage.getItem('fred_mistakes');
        mistakes = savedMistakes ? JSON.parse(savedMistakes) : [];
    } catch (e) {
        mistakes = [];
        console.error('❌ Error loading mistakes:', e);
    }
}

// ===== UI Functions =====
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeIcon.textContent = '🌙';
        localStorage.setItem('fred_theme', 'light');
    } else {
        body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
        localStorage.setItem('fred_theme', 'dark');
    }
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('fred_muted', isMuted);
    updateMuteIcon();
    
    // Provide feedback
    const icon = isMuted ? '🔇' : '🔊';
    showToast(isMuted ? 'صدا خاموش شد' : 'صدا روشن شد', icon);
}

function updateMuteIcon() {
    const muteIcon = document.getElementById('mute-icon');
    const speakIcon = document.getElementById('speak-icon');
    const icon = isMuted ? '🔇' : '🔊';
    
    muteIcon.textContent = icon;
    speakIcon.textContent = icon;
}

function updateStars() {
    const bestScore = parseInt(localStorage.getItem('fred_best_score') || '0');
    const starsContainer = document.getElementById('stars-container');
    const bestScoreElement = document.getElementById('best-score');
    
    bestScoreElement.textContent = bestScore;
    
    // Clear container
    starsContainer.innerHTML = '';
    
    // 🎯 ستاره‌های صفر = کاملاً خنثی
    if (bestScore === 0) {
        for (let i = 0; i < 4; i++) {
            const star = document.createElement('span');
            star.className = 'star-zero';
            star.textContent = '☆';
            starsContainer.appendChild(star);
        }
        return;
    }
    
    // Calculate how many stars to show (0-4)
    const starCount = Math.floor(bestScore / 25);
    
    // Add stars
    for (let i = 0; i < 4; i++) {
        const star = document.createElement('span');
        if (i < starCount) {
            star.className = 'star';
            star.textContent = '★';
        } else {
            star.className = 'star empty';
            star.textContent = '☆';
        }
        starsContainer.appendChild(star);
    }
}

function showToast(message, icon = 'ℹ️') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> ${message}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--card-light);
        color: var(--text-light);
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: var(--shadow);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--border-light);
    `;
    
    if (document.body.classList.contains('dark-mode')) {
        toast.style.background = 'var(--card-dark)';
        toast.style.color = 'var(--text-dark)';
        toast.style.borderColor = 'var(--border-dark)';
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 2 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 2000);
}

// ===== Exit Functions =====
function exitApp() {
    if (confirm('برای خروج کامل، برنامه را از multitasking ببندید.\n\nبه صفحه اصلی برگردیم؟')) {
        // همیشه فقط به صفحه اصلی برمی‌گردیم
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('home-screen').style.display = 'flex';
        showToast('در صفحه اصلی هستید ✓', '🏠');
    }
}

// ===== Utility Functions =====
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Only in quiz screen
    if (document.getElementById('quiz-screen').style.display === 'flex') {
        // Number keys 1-4 for selecting options
        if (event.key >= '1' && event.key <= '4') {
            const options = document.querySelectorAll('.option');
            const index = parseInt(event.key) - 1;
            
            if (options[index] && !options[index].classList.contains('correct') && 
                !options[index].classList.contains('incorrect')) {
                options[index].click();
            }
        }
        
        // Space to speak question
        if (event.code === 'Space') {
            event.preventDefault();
            speakQuestion();
        }
        
        // Escape to exit
        if (event.code === 'Escape') {
            exitQuiz();
        }
    }
});

// Prevent zoom on mobile
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});
