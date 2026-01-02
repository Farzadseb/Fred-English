const App = {
    init() {
        this.setupAdminTrigger();
        this.loadSavedConfig();
        setTimeout(() => {
            const loader = document.getElementById('app-loader');
            if (loader) loader.style.display = 'none';
            if (window.QuizEngine) window.QuizEngine.nextQuestion();
        }, 2000);
    },

    setupAdminTrigger() {
        const trigger = document.getElementById('admin-trigger');
        let clicks = 0;
        trigger.addEventListener('click', () => {
            clicks++;
            if (clicks >= 3) { window.openAdminModal(); clicks = 0; }
            setTimeout(() => clicks = 0, 1000);
        });
    },

    loadSavedConfig() {
        const token = localStorage.getItem('telegramBotToken');
        const chatId = localStorage.getItem('telegramChatId');
        if (token) document.getElementById('adminToken').value = token;
        if (chatId) document.getElementById('adminChatId').value = chatId;
    }
};

window.openAdminModal = () => document.getElementById('adminModal').style.display = 'flex';
window.closeAdminModal = () => document.getElementById('adminModal').style.display = 'none';

window.saveAdminData = () => {
    const token = document.getElementById('adminToken').value.trim();
    const chatId = document.getElementById('adminChatId').value.trim();
    if (token && chatId) {
        localStorage.setItem('telegramBotToken', token);
        localStorage.setItem('telegramChatId', chatId);
        window.showNotification('✅ تنظیمات ذخیره شد', 'success');
        setTimeout(() => location.reload(), 1000);
    } else {
        alert('فیلدها را پر کنید');
    }
};

window.showNotification = (msg, type) => {
    const container = document.getElementById('notification-container');
    const note = document.createElement('div');
    note.className = `notification ${type}`;
    note.textContent = msg;
    container.appendChild(note);
    setTimeout(() => note.remove(), 3000);
};

document.addEventListener('DOMContentLoaded', () => App.init());
