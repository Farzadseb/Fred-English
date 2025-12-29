// =======================
// APP CORE FUNCTIONS
// =======================

const TeacherInfo = {
    name: 'English with Fred',
    phone: '09017708544',
    whatsapp: '989017708544',
    telegramBot: 'EnglishWithFredBot'
};

const appState = {
    soundEnabled: true,
    currentTheme: 'dark',
    userId: null,
    isPWA: false
};

// =======================
// مدیریت صفحات
// =======================
function switchView(viewName) {
    if (document.getElementById('quiz').classList.contains('active') && 
        viewName !== 'quiz' && 
        window.currentQuiz && 
        window.currentQuiz.isActive) {
        
        showMotivationalMessage(() => {
            performViewSwitch(viewName);
        });
        return;
    }
    
    performViewSwitch(viewName);
}

function performViewSwitch(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewName);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    if (viewName === 'home') {
        updateBestScore();
        updateStars();
    }
}

// =======================
// پیام انگیزشی برای خروج
// =======================
function showMotivationalMessage(callback) {
    const messages = [
        "عزیزم، تو تا اینجا خیلی عالی پیش اومدی! 💪\nفقط چند سوال دیگه مونده... مطمئنی می‌خوای الان آزمون رو رها کنی؟",
        "همین جا که رسیدی، یعنی می‌تونی ادامه بدی! ✨\nپیشنهاد می‌کنم آزمون رو کامل کنی.",
        "آفرین به پشتکارت! 🏆\nاین چند سوال آخر می‌تونه تفاوت بزرگی ایجاد کنه."
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (confirm(randomMessage + "\n\n'بله' = خروج\n'خیر' = ادامه آزمون")) {
        if (callback) callback();
    } else {
        showNotification('آفرین! ادامه می‌دم... 💪', 'success');
    }
}

// =======================
// مدیریت تم
// =======================
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeToggle');
    const resultsThemeBtn = document.getElementById('resultsThemeToggle');
    
    if (appState.currentTheme === 'light') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        appState.currentTheme = 'dark';
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        if (resultsThemeBtn) resultsThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
        showNotification('🌙 تم تاریک فعال شد', 'success');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        appState.currentTheme = 'light';
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        if (resultsThemeBtn) resultsThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
        showNotification('☀️ تم روشن فعال شد', 'success');
    }
}

// =======================
// مدیریت صدا
// =======================
function toggleGlobalMute() {
    const muteBtn = document.querySelector('.mute-btn');
    const resultsMuteBtn = document.getElementById('resultsMuteBtn');
    
    appState.soundEnabled = !appState.soundEnabled;
    
    if (appState.soundEnabled) {
        if (muteBtn) {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBtn.classList.remove('active');
        }
        if (resultsMuteBtn) {
            resultsMuteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            resultsMuteBtn.classList.remove('active');
        }
        showNotification('🔊 صدا روشن شد', 'success');
    } else {
        if (muteBtn) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBtn.classList.add('active');
        }
        if (resultsMuteBtn) {
            resultsMuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            resultsMuteBtn.classList.add('active');
        }
        showNotification('🔇 صدا خاموش شد', 'warning');
    }
    
    localStorage.setItem('soundEnabled', appState.soundEnabled);
}

// =======================
// ستاره‌های پویا
// =======================
function updateStars() {
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    const starsContainer = document.getElementById('starsContainer');
    
    if (!starsContainer) return;
    
    const starCount = Math.floor(bestScore / 20);
    
    starsContainer.querySelectorAll('.fa-star').forEach((star, index) => {
        star.className = index < starCount ? 'fas fa-star' : 'far fa-star';
        star.style.color = index < starCount ? '#FFD700' : 'var(--text-secondary)';
    });
}

function updateBestScore() {
    const bestScore = localStorage.getItem('bestScore') || '0';
    const bestScoreElement = document.getElementById('bestScore');
    if (bestScoreElement) {
        bestScoreElement.textContent = bestScore + '%';
    }
}

// =======================
// نمایش اعلان
// =======================
function showNotification(message, type = 'info', duration = 3000) {
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    let icon = 'info-circle';
    switch(type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'exclamation-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
        default: icon = 'info-circle';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    notification.className = 'notification';
    notification.classList.add(type);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// =======================
// سیستم صدا و تلفظ
// =======================
function speak(text) {
    if (!appState.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.5; // سرعت 0.5
        utterance.pitch = 1;
        utterance.volume = 1;
        
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            const femaleVoice = voices.find(voice => 
                voice.lang.includes('en') && 
                voice.name.toLowerCase().includes('female')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            } else {
                const englishVoice = voices.find(voice => voice.lang.includes('en'));
                if (englishVoice) utterance.voice = englishVoice;
            }
        }
        
        speechSynthesis.speak(utterance);
    }
}

function speakCurrentQuestion() {
    if (!appState.soundEnabled) {
        showNotification('🔇 صدا خاموش است', 'warning');
        return;
    }
    
    const questionText = document.getElementById('questionText');
    if (questionText) {
        const text = questionText.textContent || questionText.innerText;
        if (text && text.trim().length > 0) {
            speak(text);
        }
    }
}

// =======================
// توابع دیگر
// =======================
function joinWhatsApp() {
    const message = "سلام! می‌خواهم در دوره English with Fred ثبت نام کنم.";
    const url = `https://wa.me/${TeacherInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function reviewMistakesPage() {
    switchView('mistakes');
    loadMistakes();
}

function showProgressReport() {
    const bestScore = localStorage.getItem('bestScore') || '0';
    const totalTests = JSON.parse(localStorage.getItem('testHistory') || '[]').length;
    
    const report = `
📊 گزارش پیشرفت English with Fred

⭐ بهترین امتیاز: ${bestScore}%
📊 تعداد آزمون‌ها: ${totalTests}
📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}

👨‍🏫 مدرس: ${TeacherInfo.name}
📱 تماس: ${TeacherInfo.phone}
    `.trim();
    
    alert(report);
}

function exitApp() {
    if (confirm('آیا مطمئن هستید که می‌خواهید از برنامه خارج شوید؟')) {
        showNotification('👋 از همراهی شما متشکریم! دوباره برگردید.', 'info');
        if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
            window.close();
        }
    }
}

// =======================
// راه‌اندازی اولیه
// =======================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 English with Fred در حال راه‌اندازی...');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedSound = localStorage.getItem('soundEnabled') !== 'false';
    
    const body = document.body;
    const themeBtn = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        appState.currentTheme = 'dark';
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        appState.currentTheme = 'light';
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    appState.soundEnabled = savedSound;
    const muteBtn = document.querySelector('.mute-btn');
    
    if (muteBtn) {
        muteBtn.innerHTML = appState.soundEnabled 
            ? '<i class="fas fa-volume-up"></i>' 
            : '<i class="fas fa-volume-mute"></i>';
        if (!appState.soundEnabled) muteBtn.classList.add('active');
    }
    
    if (!localStorage.getItem('userId')) {
        const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        localStorage.setItem('userId', userId);
    }
    appState.userId = localStorage.getItem('userId');
    
    updateBestScore();
    updateStars();
    
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    if (document.getElementById('globalMuteBtn')) {
        document.getElementById('globalMuteBtn').addEventListener('click', toggleGlobalMute);
    }
    
    if (document.getElementById('resultsMuteBtn')) {
        document.getElementById('resultsMuteBtn').addEventListener('click', toggleGlobalMute);
    }
    
    if (document.getElementById('quizSpeakerBtn')) {
        document.getElementById('quizSpeakerBtn').addEventListener('click', speakCurrentQuestion);
    }
    
    if (document.getElementById('questionSpeakBtn')) {
        document.getElementById('questionSpeakBtn').addEventListener('click', speakCurrentQuestion);
    }
    
    if (document.getElementById('questionText')) {
        document.getElementById('questionText').addEventListener('click', speakCurrentQuestion);
    }
    
    setTimeout(() => {
        showNotification('🎉 به English with Fred خوش آمدید!', 'success', 2000);
    }, 1000);
});

// =======================
// توابع عمومی
// =======================
window.appState = appState;
window.switchView = switchView;
window.showNotification = showNotification;
window.speakCurrentQuestion = speakCurrentQuestion;
window.toggleGlobalMute = toggleGlobalMute;
window.sendTelegramReport = sendTelegramReport;
window.reviewMistakesPage = reviewMistakesPage;
window.showMotivationalMessage = showMotivationalMessage;
window.TeacherInfo = TeacherInfo;
