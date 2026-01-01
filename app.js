const App = {
    adminClickCount: 0,
    adminTimer: null,

    init() {
        this.hideLoader();
        const logo = document.getElementById('admin-trigger');
        if (logo) logo.addEventListener('click', () => this.handleAdminTrigger());
        this.syncAdminInputs();
    },

    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('app-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    if (window.QuizEngine) window.QuizEngine.nextQuestion();
                }, 500);
            }
        }, 1500);
    },

    handleAdminTrigger() {
        this.adminClickCount++;
        clearTimeout(this.adminTimer);
        if (this.adminClickCount >= 3) {
            document.getElementById('adminModal').style.display = 'flex';
            this.adminClickCount = 0;
        } else {
            this.adminTimer = setTimeout(() => { this.adminClickCount = 0; }, 600);
        }
    },

    syncAdminInputs() {
        const config = ConfigManager.getTelegramConfig();
        if (document.getElementById('adminToken')) document.getElementById('adminToken').value = config.token;
        if (document.getElementById('adminChatId')) document.getElementById('adminChatId').value = config.chatId;
    }
};

window.showNotification = function(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const note = document.createElement('div');
    note.className = `notification ${type}`;
    note.innerHTML = `<span>${message}</span>`;
    container.appendChild(note);
    setTimeout(() => note.remove(), 3000);
};

document.addEventListener('DOMContentLoaded', () => App.init());
