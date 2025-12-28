/* =======================
   APP STATE
======================= */
const App = {
    view: 'home',
    mode: null,
    bestScore: Number(localStorage.getItem('bestScore') || 0),
    muted: localStorage.getItem('muted') === 'true',
    theme: localStorage.getItem('theme') || 'light'
};

const $ = id => document.getElementById(id);

/* =======================
   VIEW CONTROL
======================= */
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = $(viewId);
    if (target) {
        target.classList.add('active');
        App.view = viewId;
        window.scrollTo(0, 0);
    }
}

/* =======================
   NOTIFICATION
======================= */
function showNotification(text, time = 2000) {
    const box = $('notification');
    if (!box) return;
    box.textContent = text;
    box.classList.add('show');
    setTimeout(() => box.classList.remove('show'), time);
}

/* =======================
   THEME
======================= */
function applyTheme() {
    document.body.classList.toggle('dark', App.theme === 'dark');
    const btn = $('themeBtn');
    if (btn) btn.textContent = App.theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    App.theme = App.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', App.theme);
    applyTheme();
}

/* =======================
   MUTE
======================= */
function applyMute() {
    const btn = $('muteBtn');
    if (btn) btn.textContent = App.muted ? '🔇' : '🔊';
}

function toggleMute() {
    App.muted = !App.muted;
    localStorage.setItem('muted', App.muted);
    applyMute();
    showNotification(App.muted ? 'صدا خاموش شد' : 'صدا روشن شد');
}

/* برای speech.js */
window.isMuted = () => App.muted;

/* =======================
   SCORE
======================= */
function renderScore() {
    const scoreEl = $('scoreValue');
    if (scoreEl) scoreEl.textContent = App.bestScore + '%';

    const stars = document.querySelectorAll('.star');
    const filled = Math.floor(App.bestScore / 20);
    stars.forEach((s, i) => {
        s.classList.toggle('filled', i < filled);
    });
}

/* =======================
   BUTTON BINDINGS
======================= */
function bindButtons() {

    $('themeBtn')?.addEventListener('click', toggleTheme);
    $('muteBtn')?.addEventListener('click', toggleMute);

    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            if (!mode) return;
            App.mode = mode;
            switchView('quiz');
            if (window.startQuiz) {
                window.startQuiz(mode);
            }
        });
    });

    $('backHome')?.addEventListener('click', () => {
        switchView('home');
    });

    $('exitBtn')?.addEventListener('click', () => {
        if (confirm('آیا می‌خواهید خارج شوید؟')) {
            window.location.href = 'about:blank';
        }
    });
}

/* =======================
   INIT
======================= */
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    applyMute();
    renderScore();
    bindButtons();
    switchView('home');

    console.log('✅ app.js loaded cleanly');
});
