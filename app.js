// =======================
// app.js – English with Fred
// نسخه تمیز و هماهنگ
// =======================

/* ---------- STATE ---------- */
let bestScore = 0;
let isMuted = false;

/* ---------- DOM ---------- */
const muteBtn = document.getElementById('muteBtn');
const themeBtn = document.getElementById('themeBtn');
const scoreEl = document.getElementById('scoreValue');
const stars = document.querySelectorAll('#starsContainer .star');
const notification = document.getElementById('notification');

/* ---------- NOTIFICATION ---------- */
function showNotification(text, duration = 2000) {
    if (!notification) return;

    notification.textContent = text;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

/* ---------- THEME ---------- */
function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark');
    }
    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
    showNotification(isDark ? 'تم شب فعال شد 🌙' : 'تم روز فعال شد ☀️');
}

function updateThemeIcon() {
    if (!themeBtn) return;
    themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

/* ---------- MUTE ---------- */
function loadMute() {
    isMuted = localStorage.getItem('muted') === 'true';
    updateMuteIcon();
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('muted', isMuted);
    updateMuteIcon();
    showNotification(isMuted ? 'صدا خاموش شد 🔇' : 'صدا روشن شد 🔊');

    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function updateMuteIcon() {
    if (!muteBtn) return;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
}

/* ---------- SCORE ---------- */
function loadBestScore() {
    const saved = localStorage.getItem('bestScore');
    bestScore = saved ? parseInt(saved, 10) : 0;
    updateScoreUI();
}

function setBestScore(score) {
    if (score <= bestScore) return;

    bestScore = Math.min(100, score);
    localStorage.setItem('bestScore', bestScore);
    updateScoreUI();
    showNotification('🎉 رکورد جدید!');
}

function updateScoreUI() {
    if (scoreEl) scoreEl.textContent = bestScore + '%';

    const filled = Math.floor(bestScore / 20);
    stars.forEach((star, i) => {
        star.classList.toggle('filled', i < filled);
    });
}

/* ---------- MODES ---------- */
function initModeCards() {
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            handleModeClick(mode);
        });
    });
}

function handleModeClick(mode) {
    const modeNames = {
        'english-persian': 'English → Persian',
        'persian-english': 'Persian → English',
        'word-definition': 'Word → Definition',
        'definition-word': 'Definition → Word'
    };

    showNotification(`شروع آزمون: ${modeNames[mode] || mode}`);

    // اگر quiz.js وجود داشت
    if (typeof window.startQuiz === 'function') {
        startQuiz(mode);
    } else {
        // حالت دمو
        const fakeScore = bestScore + Math.floor(Math.random() * 10) + 5;
        setTimeout(() => setBestScore(fakeScore), 600);
    }
}

/* ---------- ACTION BUTTONS ---------- */
function initActionButtons() {
    const reviewBtn = document.getElementById('reviewMistakesBtn');
    const progressBtn = document.getElementById('progressReportBtn');
    const exitBtn = document.getElementById('exitBtn');

    if (reviewBtn) {
        reviewBtn.onclick = () => {
            showNotification('مرور اشتباهات (دمو)');
            setBestScore(bestScore + 3);
        };
    }

    if (progressBtn) {
        progressBtn.onclick = () => {
            showNotification(`پیشرفت فعلی: ${bestScore}%`);
        };
    }

    if (exitBtn) {
        exitBtn.onclick = () => {
            if (confirm('می‌خواهی خارج شوی؟')) {
                showNotification('خروج از برنامه');
            }
        };
    }
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadMute();
    loadBestScore();

    initModeCards();
    initActionButtons();

    if (themeBtn) themeBtn.onclick = toggleTheme;
    if (muteBtn) muteBtn.onclick = toggleMute;

    console.log('✅ app.js loaded successfully');
});

/* ---------- EXPORTS ---------- */
window.toggleTheme = toggleTheme;
window.toggleMute = toggleMute;
window.isMuted = () => isMuted;
