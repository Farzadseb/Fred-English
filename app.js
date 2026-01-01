// =======================
// GLOBAL STATE
// =======================

const appState = {
    currentUser: null,
    soundEnabled: true
};

window.appState = appState;

// =======================
// USER LOGIN
// =======================

function saveUserInfo() {
    const username = document.getElementById('usernameInput').value.trim();
    const studentCode = document.getElementById('studentCodeInput').value.trim();

    if (!username) {
        showNotification('نام را وارد کنید', 'error');
        return;
    }

    const user = {
        id: Date.now(),
        username,
        studentCode
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    appState.currentUser = user;

    initUser();
}

function initUser() {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return;

    appState.currentUser = JSON.parse(saved);
    document.getElementById('currentUsername').textContent = appState.currentUser.username;
    switchView('home');
    updateBestScore();
    checkAdmin();
}

// =======================
// ADMIN CACHE CONTROL
// =======================

const ADMIN_CHAT_ID = '96991859';

function checkAdmin() {
    const btn = document.getElementById('adminClearCacheBtn');
    const user = appState.currentUser;

    if (btn && user && user.studentCode === ADMIN_CHAT_ID) {
        btn.style.display = 'block';
    }
}

function adminClearCache() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'FORCE_UPDATE' });
        showNotification('کش همه کاربران پاک شد', 'success');
    } else {
        showNotification('Service Worker فعال نیست', 'error');
    }
}

// =======================
// VIEW SWITCH
// =======================

function switchView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// =======================
// NOTIFICATION
// =======================

function showNotification(text, type = 'info') {
    const n = document.getElementById('notification');
    n.textContent = text;
    n.className = `notification ${type}`;
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 3000);
}

// =======================
// SCORE & STATS
// =======================

function updateBestScore() {
    if (!appState.currentUser) return;
    const key = `bestScore_${appState.currentUser.id}`;
    document.getElementById('bestScore').textContent =
        (localStorage.getItem(key) || '0') + '%';
}

// =======================
// EXIT
// =======================

function showExitOptions() {
    if (confirm('خروج از حساب؟')) {
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// =======================
// INIT
// =======================

document.addEventListener('DOMContentLoaded', initUser);

// =======================
// EXPORTS
// =======================

window.saveUserInfo = saveUserInfo;
window.switchView = switchView;
window.showNotification = showNotification;
window.adminClearCache = adminClearCache;
