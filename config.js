// تنظیمات اولیه برنامه
const AppConfig = {
    version: "2.0.0",
    defaultVoiceRate: 0.5, // سرعت درخواستی شما
    isMuted: true, // پیش‌فرض خاموش طبق دستور
    currentTheme: localStorage.getItem('app_theme') || 'dark',
    
    // تنظیمات هدر صفحه اصلی
    header: {
        title: "Fred English Center",
        showBackButton: false
    },

    saveTheme: function(theme) {
        this.currentTheme = theme;
        localStorage.setItem('app_theme', theme);
    }
};

// اعمال تم اولیه به Body
if (AppConfig.currentTheme === 'light') {
    document.body.classList.add('light-mode');
}
