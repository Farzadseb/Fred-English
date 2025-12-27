/* ================= STATE ================= */
let isDark = false;
let isMuted = false;
let quizActive = false;
let currentMode = null;

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadMute();
    bindModeButtons();
    bindTopButtons();
});

/* ================= MODE HANDLING ================= */
function bindModeButtons() {
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            if (quizActive) return;

            const mode = card.dataset.mode;
            startQuiz(mode);
        });
    });
}

function startQuiz(mode) {
    quizActive = true;
    currentMode = mode;

    const names = {
        'english-persian': 'English → Persian',
        'persian-english': 'Persian → English',
        'word-definition': 'Word → Definition',
        'definition-word': 'Definition → Word'
    };

    showNotification(`آزمون «${names[mode]}» شروع شد`);

    // شبیه‌سازی آزمون (۳ ثانیه)
    setTimeout(() => {
        finishQuiz();
    }, 3000);
}

function finishQuiz() {
    showNotification('آزمون تمام شد ✅');
    quizActive = false;
    currentMode = null;
}

/* ================= THEME ================= */
function bindTopButtons() {
    const themeBtn = document.getElementById('themeBtn');
    const muteBtn = document.getElementById('muteBtn');

    themeBtn.addEventListener('click', toggleTheme);
    muteBtn.addEventListener('click', toggleMute);
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark');
        isDark = true;
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('themeBtn');
    btn.textContent = isDark ? '☀️' : '🌙';
}

/* ================= MUTE ================= */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('muted', isMuted);
    updateMuteIcon();
    showNotification(isMuted ? 'صدا خاموش شد' : 'صدا روشن شد');
}

function loadMute() {
    isMuted = localStorage.getItem('muted') === 'true';
    updateMuteIcon();
}

function updateMuteIcon() {
    const btn = document.getElementById('muteBtn');
    btn.textContent = isMuted ? '🔇' : '🔊';
}

/* ================= NOTIFICATION ================= */
function showNotification(text, duration = 2000) {
    const box = document.getElementById('notification');
    box.textContent = text;
    box.classList.add('show');

    setTimeout(() => {
        box.classList.remove('show');
    }, duration);
}
