// =======================
// APP CONTROLLER
// =======================

// ---------- VIEW SWITCH ----------
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = document.getElementById(viewId);
    if (el) el.classList.add('active');
}

// ---------- BEST SCORE ----------
function loadBestScore() {
    const best = localStorage.getItem('bestScore') || '0';
    const el = document.getElementById('bestScore');
    if (el) el.textContent = best + '%';
}

// ---------- INSTALL PWA ----------
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('installBtn');
    if (btn) btn.style.display = 'block';
});

document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    document.getElementById('installBtn').style.display = 'none';
});

// ---------- HOME BUTTONS ----------
document.getElementById('exitBtn')?.addEventListener('click', () => {
    window.close();
});

document.getElementById('backBtn')?.addEventListener('click', () => {
    switchView('home');
});

// ---------- MODE SELECT ----------
document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
        startQuiz(card.dataset.mode);
    });
});

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    loadBestScore();
});
