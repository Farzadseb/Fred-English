const App = {
    init() {
        this.setupAdminTrigger();
        window.addEventListener('load', () => {
            const loader = document.getElementById('app-loader');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }, 500);
            }
        });
    },

    setupAdminTrigger() {
        const trigger = document.getElementById('admin-trigger');
        let clicks = 0;
        if (trigger) {
            trigger.onclick = () => {
                clicks++;
                if (clicks >= 3) {
                    document.getElementById('adminModal').style.display = 'flex';
                    clicks = 0;
                }
                setTimeout(() => clicks = 0, 1000);
            };
        }
    }
};

window.saveAdminData = () => {
    localStorage.setItem('telegramBotToken', document.getElementById('adminToken').value.trim());
    localStorage.setItem('telegramChatId', document.getElementById('adminChatId').value.trim());
    alert('تنظیمات ذخیره شد.');
    location.reload();
};

window.closeAdminModal = () => document.getElementById('adminModal').style.display = 'none';

document.addEventListener('DOMContentLoaded', () => App.init());
