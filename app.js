const App = {
    init() {
        this.hideLoader();
        this.setupAdminTrigger();
        this.loadSavedConfig();
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

    setupAdminTrigger() {
        const trigger = document.getElementById('admin-trigger');
        let clicks = 0;
        if (trigger) {
            trigger.addEventListener('click', () => {
                clicks++;
                if (clicks >= 3) {
                    window.openAdminModal();
                    clicks = 0;
                }
                setTimeout(() => clicks = 0, 1000);
            });
        }
    },

    loadSavedConfig() {
        const token = localStorage.getItem('telegramBotToken');
        const chatId = localStorage.getItem('telegramChatId');
        if (token) document.getElementById('adminToken').value = token;
        if (chatId) document.getElementById('adminChatId').value = chatId;
    }
};

// توابع جهانی برای فراخوانی از HTML
window.openAdminModal = function() {
    document.getElementById('adminModal').style.display = 'flex';
};

window.closeAdminModal = function() {
    document.getElementById('adminModal').style.display = 'none';
};

window.saveAdminData = function() {
    const token = document.getElementById('adminToken').value.trim();
    const chatId = document.getElementById('adminChatId').value.trim();
    
    if (token && chatId) {
        localStorage.setItem('telegramBotToken', token);
        localStorage.setItem('telegramChatId', chatId);
        
        // همگام سازی با ConfigManager در صورت وجود
        if (window.ConfigManager) {
            ConfigManager.set(ConfigManager.keys.botToken, token);
            ConfigManager.set(ConfigManager.keys.chatId, chatId);
        }

        window.showNotification('✅ تنظیمات با موفقیت ذخیره شد.');
        
        setTimeout(() => {
            window.closeAdminModal();
            location.reload();
        }, 1200);
    } else {
        alert('لطفاً هر دو مورد را وارد کنید.');
    }
};

window.showNotification = function(message) {
    const container = document.getElementById('notification-container');
    const note = document.createElement('div');
    note.className = 'notification';
    note.innerHTML = message;
    container.appendChild(note);
    setTimeout(() => note.remove(), 3000);
};

document.addEventListener('DOMContentLoaded', () => App.init());
