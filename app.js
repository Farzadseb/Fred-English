// app.js - English With Fred
// ====== مدیریت تم ======
let currentTheme = 'light';

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    
    currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    
    // آپدیت آیکون
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        themeBtn.title = currentTheme === 'dark' ? 'تم روشن' : 'تم تاریک';
    }
    
    console.log(`🎨 تم تغییر کرد به: ${currentTheme}`);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        currentTheme = 'dark';
    } else {
        body.classList.remove('dark');
        currentTheme = 'light';
    }
    
    // آیکون دکمه
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        themeBtn.title = currentTheme === 'dark' ? 'تم روشن' : 'تم تاریک';
    }
}

// ====== مدیریت Mute ======
let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;
    
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');
    
    if (muteBtn && muteIcon) {
        if (isMuted) {
            muteIcon.textContent = '🔇';
            muteBtn.classList.add('active');
            muteBtn.title = 'میکروفون خاموش';
            console.log('🔇 حالت Mute فعال شد');
            
            // نمایش پیغام
            showToast('میکروفون خاموش شد', 'info');
        } else {
            muteIcon.textContent = '🎤';
            muteBtn.classList.remove('active');
            muteBtn.title = 'میکروفون روشن';
            console.log('🎤 حالت Mute غیرفعال شد');
            
            showToast('میکروفون روشن شد', 'success');
        }
    }
    
    localStorage.setItem('isMuted', isMuted);
    
    // متوقف کردن صداها
    if (isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

function loadMuteState() {
    const savedMute = localStorage.getItem('isMuted');
    if (savedMute === 'true') {
        isMuted = true;
        // آپدیت آیکون بعد از لود صفحه
        setTimeout(() => {
            const muteIcon = document.getElementById('muteIcon');
            const muteBtn = document.getElementById('muteBtn');
            if (muteIcon) muteIcon.textContent = '🔇';
            if (muteBtn) muteBtn.classList.add('active');
        }, 100);
    }
}

// ====== نمایش پیغام ======
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    const colors = {
        info: '#2196F3',
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800'
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.7s;
        white-space: nowrap;
    `;
    
    document.body.appendChild(toast);
    
    // حذف بعد از 3 ثانیه
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
    
    // اضافه کردن استایل انیمیشن
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ====== گزارش پیشرفت ======
function showProgressReport() {
    const quizContainer = document.getElementById('quizContainer');
    const progressReport = document.getElementById('progressReport');
    
    // مخفی کردن کوییز
    if (quizContainer) quizContainer.style.display = 'none';
    
    // نمایش گزارش
    if (progressReport) {
        progressReport.style.display = 'block';
        loadProgressData();
    }
}

function hideProgressReport() {
    const progressReport = document.getElementById('progressReport');
    if (progressReport) {
        progressReport.style.display = 'none';
    }
}

function loadProgressData() {
    const content = document.getElementById('progressContent');
    if (!content) return;
    
    let html = '';
    
    if (typeof ProgressTracker !== 'undefined' && ProgressTracker.getStats) {
        try {
            const stats = ProgressTracker.getStats();
            const report = ProgressTracker.getProgressReport ? ProgressTracker.getProgressReport() : null;
            
            html = `
                <div class="progress-stats">
                    <div class="stat-item">
                        <h4>کل سوالات</h4>
                        <p>${stats.totalQuestions || 0}</p>
                    </div>
                    <div class="stat-item">
                        <h4>پاسخ درست</h4>
                        <p>${stats.correctAnswers || 0}</p>
                    </div>
                    <div class="stat-item">
                        <h4>پاسخ غلط</h4>
                        <p>${stats.wrongAnswers || 0}</p>
                    </div>
                    <div class="stat-item">
                        <h4>دقت کلی</h4>
                        <p>${stats.accuracy || 0}%</p>
                    </div>
                </div>
                <div style="margin-top: 20px; padding: 18px; background: var(--light-bg); border-radius: 12px;">
                    <h4 style="margin-bottom: 12px; color: var(--primary); display: flex; align-items: center; gap: 8px;">📈 آخرین فعالیت‌ها</h4>
                    <div style="font-size: 14px; color: var(--text);">
                        ${report && report.recentSessions && report.recentSessions.length > 0 ? 
                            report.recentSessions.slice(0, 5).map(s => 
                                `<div style="margin-bottom: 10px; padding: 10px; background: var(--card-bg); border-radius: 8px; border-right: 3px solid var(--accent);">
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="font-weight: bold;">${s.mode}</span>
                                        <span style="color: ${s.score >= 70 ? 'var(--secondary)' : s.score >= 50 ? 'var(--accent)' : 'var(--danger)'};">${s.score}%</span>
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-light); margin-top: 4px;">${s.date}</div>
                                </div>`
                            ).join('') : 
                            '<p style="text-align: center; padding: 15px; color: var(--text-light); font-size: 14px;">هنوز آزمونی انجام نداده‌اید.</p>'
                        }
                    </div>
                </div>
            `;
        } catch (error) {
            html = `<p style="color: var(--danger); text-align: center; padding: 20px; font-size: 14px;">خطا در بارگذاری گزارش</p>`;
        }
    } else {
        html = `
            <div style="text-align: center; padding: 30px 20px;">
                <div style="font-size: 40px; margin-bottom: 12px; color: var(--primary);">📊</div>
                <p style="font-size: 16px; margin-bottom: 8px; color: var(--primary);">سیستم گزارش‌گیری</p>
                <p style="font-size: 13px; color: var(--text-light); margin-bottom: 15px;">هنوز فعال نشده است.</p>
                <p style="font-size: 12px; color: var(--text-light);">برای فعال‌سازی، چند آزمون بدهید.</p>
            </div>
        `;
    }
    
    content.innerHTML = html;
}

// ====== توابع کمکی ======
function registerWhatsApp() {
    const phone = "+989123456789";
    const message = "سلام! می‌خواهم در برنامه English With Fred ثبت‌نام کنم.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showToast('واتساپ در حال باز شدن...', 'info');
}

function exitApp() {
    if (confirm("آیا می‌خواهید از برنامه خارج شوید؟")) {
        if (window.navigator.standalone) {
            window.close();
        } else {
            window.location.href = "about:blank";
        }
    }
}

function reviewSmartMistakes() {
    if (typeof ProgressTracker !== 'undefined' && ProgressTracker.reviewMistakes) {
        const mistakes = ProgressTracker.getProgressReport ? ProgressTracker.getProgressReport().mistakes : null;
        if (mistakes && mistakes.active > 0) {
            ProgressTracker.reviewMistakes();
        } else {
            showToast('🎉 هیچ اشتباهی برای مرور ندارید!', 'success');
        }
    } else {
        showToast('ابتدا چند آزمون بدهید', 'info');
    }
}

// ====== بررسی و ترمیم لغات ======
function checkAndFixWords() {
    if (typeof words === 'undefined' || !Array.isArray(words) || words.length === 0) {
        console.warn('⚠️ لغات بارگذاری نشدند، استفاده از لغات پیش‌فرض...');
        
        // لغات پیش‌فرض
        window.words = [
            {english: "hello", persian: "سلام", definition: "greeting word"},
            {english: "book", persian: "کتاب", definition: "something to read"},
            {english: "teacher", persian: "معلم", definition: "person who teaches"},
            {english: "student", persian: "دانش‌آموز", definition: "person who learns"},
            {english: "school", persian: "مدرسه", definition: "place of learning"},
            {english: "pen", persian: "قلم", definition: "writing tool"},
            {english: "desk", persian: "میز", definition: "study table"},
            {english: "chair", persian: "صندلی", definition: "to sit on"},
            {english: "window", persian: "پنجره", definition: "glass in wall"},
            {english: "door", persian: "در", definition: "enter/exit"}
        ];
        
        // مخفی کردن پیغام خطا
        const errorMsg = document.querySelector('.quiz-modes div[style*="danger"]');
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
        
        console.log(`✅ ${window.words.length} لغت پیش‌فرض بارگذاری شد`);
    } else {
        console.log(`✅ ${words.length} لغت بارگذاری شد`);
    }
}

// ====== ترمیم حالت‌های آزمون ======
function fixQuizModes() {
    const quizModes = document.querySelector('.quiz-modes');
    if (!quizModes) {
        console.error('❌ بخش quiz-modes پیدا نشد!');
        return;
    }
    
    // فقط اگر دکمه‌ها کمتر از 4 هستند ترمیم کن
    const modeButtons = document.querySelectorAll('.mode-button');
    if (modeButtons.length < 4) {
        const correctHTML = `
            <button class="mode-button" onclick="startQuiz('en-fa')">
                <span class="mode-icon">🇺🇸→🇮🇷</span>
                <span class="mode-text">English → Persian</span>
            </button>
            <button class="mode-button" onclick="startQuiz('fa-en')">
                <span class="mode-icon">🇮🇷→🇺🇸</span>
                <span class="mode-text">Persian → English</span>
            </button>
            <button class="mode-button" onclick="startQuiz('word-def')">
                <span class="mode-icon">📝</span>
                <span class="mode-text">Word → Definition</span>
            </button>
            <button class="mode-button" onclick="startQuiz('def-word')">
                <span class="mode-icon">💭</span>
                <span class="mode-text">Definition → Word</span>
            </button>
        `;
        
        quizModes.innerHTML = correctHTML;
        console.log('✅ حالت‌های آزمون ترمیم شدند');
    }
}

// ====== آپدیت ستاره‌ها ======
function updateStars(score) {
    const stars = document.querySelectorAll('.star');
    const scoreNum = parseInt(score) || 0;
    const filledStars = Math.min(5, Math.floor(scoreNum / 20));
    
    stars.forEach((star, index) => {
        if (index < filledStars) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

// ====== مقداردهی اولیه ======
function initApp() {
    console.log('🚀 راه‌اندازی English With Fred...');
    
    // بارگذاری تم
    loadTheme();
    
    // بارگذاری حالت Mute
    loadMuteState();
    
    // بررسی و ترمیم لغات
    checkAndFixWords();
    
    // ترمیم حالت‌های آزمون
    setTimeout(fixQuizModes, 100);
    
    // بررسی فایل‌ها
    console.log('🔍 بررسی فایل‌ها:');
    console.log('- words.js:', typeof words !== 'undefined' ? '✅' : '❌');
    console.log('- startQuiz:', typeof startQuiz !== 'undefined' ? '✅' : '❌');
    console.log('- ProgressTracker:', typeof ProgressTracker !== 'undefined' ? '✅' : '❌');
    console.log('- دکمه‌های آزمون:', document.querySelectorAll('.mode-button').length, '/ 4');
    
    // تنظیم Progress Tracker
    setTimeout(() => {
        if (typeof ProgressTracker !== 'undefined') {
            console.log('⚙️ راه‌اندازی Progress Tracker...');
            ProgressTracker.init();
            console.log('✅ Progress Tracker فعال شد');
        }
    }, 1000);
    
    // آپدیت بهترین امتیاز از localStorage
    const bestScore = localStorage.getItem('bestScore') || '0';
    const bestScoreElement = document.getElementById('bestScore');
    if (bestScoreElement) {
        bestScoreElement.textContent = bestScore;
        updateStars(bestScore);
    }
    
    console.log('✅ برنامه با موفقیت راه‌اندازی شد');
}

// ====== رویدادهای صفحه ======
document.addEventListener('DOMContentLoaded', initApp);

// ریسپانسیو کردن
window.addEventListener('resize', function() {
    const container = document.querySelector('.app-container');
    if (container && window.innerWidth < 480) {
        container.style.padding = '0 5px';
    } else if (container) {
        container.style.padding = '0';
    }
});

// رویداد برای آپدیت بهترین امتیاز
window.updateBestScore = function(score) {
    const currentBest = parseInt(localStorage.getItem('bestScore') || '0');
    if (score > currentBest) {
        localStorage.setItem('bestScore', score.toString());
        const bestScoreElement = document.getElementById('bestScore');
        if (bestScoreElement) {
            bestScoreElement.textContent = score;
            updateStars(score);
            showToast(`🎉 رکورد جدید: ${score}%`, 'success');
        }
    }
};

// صادر کردن تابع Mute برای استفاده در quiz.js
window.isMuted = function() {
    return isMuted;
};

window.toggleMute = toggleMute;
