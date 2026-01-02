// app.js - مدیریت لودر و اعلان‌ها
document.addEventListener('DOMContentLoaded', () => {
    // حذف لودر
    const loader = document.getElementById('app-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 800);
    }

    // تنظیم دکمه مدیریت (۳ بار کلیک)
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
});

// تابع نمایش پیام
window.showNotification = (msg, type) => {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const note = document.createElement('div');
    note.className = `notification ${type}`;
    note.style.background = type === 'success' ? '#10b981' : '#ef4444';
    note.style.color = 'white';
    note.style.padding = '10px';
    note.style.margin = '5px';
    note.style.borderRadius = '5px';
    note.textContent = msg;
    container.appendChild(note);
    setTimeout(() => note.remove(), 3000);
};

window.saveAdminData = () => {
    localStorage.setItem('telegramBotToken', document.getElementById('adminToken').value.trim());
    localStorage.setItem('telegramChatId', document.getElementById('adminChatId').value.trim());
    alert('✅ تنظیمات ذخیره شد.');
    location.reload();
};

window.closeAdminModal = () => document.getElementById('adminModal').style.display = 'none';
