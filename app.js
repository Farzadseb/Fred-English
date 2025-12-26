// app.js - مدیریت برنامه Mute

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
                <div style="margin-top: 25px; padding: 20px; background: var(--light-bg); border-radius: 14px;">
                    <h4 style="margin-bottom: 15px; color: var(--primary); display: flex; align-items: center; gap: 10px;">📈 آخرین فعالیت‌ها</h4>
                    <div style="font-size: 15px; color: var(--text);">
                        ${report && report.recentSessions && report.recentSessions.length > 0 ? 
                            report.recentSessions.slice(0, 5).map(s => 
                                `<div style="margin-bottom: 12px; padding: 12px; background: var(--card-bg); border-radius: 10px; border-right: 4px solid var(--accent);">
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="font-weight: bold;">${s.mode}</span>
                                        <span style="color: ${s.score >= 70 ? 'var(--secondary)' : s.score >= 50 ? 'var(--accent)' : 'var(--danger)'};">${s.score}%</span>
                                    </div>
                                    <div style="font-size: 13px; color: var(--text-light); margin-top: 5px;">${s.date}</div>
                                </div>`
                            ).join('') : 
                            '<p style="text-align: center; padding: 20px; color: var(--text-light);">هنوز آزمونی انجام نداده‌اید.</p>'
                        }
                    </div>
                </div>
            `;
        } catch (error) {
            html = `<p style="color: var(--danger); text-align: center; padding: 20px;">خطا در بارگذاری گزارش: ${error.message}</p>`;
        }
    } else {
        html = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
                <p style="font-size: 18px; margin-bottom: 10px; color: var(--primary);">سیستم گزارش‌گیری</p>
                <p style="font-size: 14px; color: var(--text-light); margin-bottom: 20px;">هنوز فعال نشده است.</p>
                <p style="font-size: 13px; color: var(--text-light);">برای فعال‌سازی، چند آزمون بدهید.</p>
            </div>
        `;
    }
    
    content.innerHTML = html;
}

// ====== توابع کمکی ======
function registerWhatsApp() {
    const phone = "+989123456789";
    const message = "سلام! می‌خواهم در برنامه Mute ثبت‌نام کنم.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
        const mistakes = ProgressTracker.getProgressReport().mistakes;
        if (mistakes && mistakes.active > 0) {
            ProgressTracker.reviewMistakes();
        } else {
            alert("🎉 هیچ اشتباهی برای مرور ندارید!");
        }
    } else {
        alert("سیستم مرور اشتباهات هنوز فعال نیست. ابتدا چند آزمون بدهید.");
    }
}

// ====== مقداردهی اولیه ======
function initApp() {
    console.log('🚀 راه‌اندازی برنامه Mute...');
    
    // بارگذاری تم
    loadTheme();
    
    // بررسی فایل‌های ضروری
    console.log('🔍 بررسی فایل‌ها:');
    console.log('- words.js:', typeof words !== 'undefined' ? '✅' : '❌');
    console.log('- startQuiz:', typeof startQuiz !== 'undefined' ? '✅' : '❌');
    console.log('- ProgressTracker:', typeof ProgressTracker !== 'undefined' ? '✅' : '❌');
    
    // بررسی و نمایش حالت‌های آزمون
    const modeButtons = document.querySelectorAll('.mode-button');
    console.log(`- دکمه‌های آزمون: ${modeButtons.length} / 4`);
    
    if (modeButtons.length !== 4) {
        console.warn('⚠️ تعداد دکمه‌های آزمون نادرست است!');
        // سعی در ترمیم
        fixQuizModes();
    }
    
    // اگر words وجود ندارد
    if (typeof words === 'undefined' || !Array.isArray(words) || words.length === 0) {
        console.error('❌ فایل لغات بارگذاری نشد!');
        const quizModes = document.querySelector('.quiz-modes');
        if (quizModes) {
            quizModes.innerHTML = `
                <div style="text-align: center; padding: 30px; background: rgba(244, 67, 54, 0.1); border-radius: 15px; border: 2px solid var(--danger);">
                    <div style="font-size: 48px; margin-bottom: 15px;">📚</div>
                    <p style="color: var(--danger); font-size: 18px; margin-bottom: 15px;">⚠️ فایل لغات یافت نشد</p>
                    <p style="color: var(--text-light); font-size: 14px;">لطفاً فایل words.js را بررسی کنید.</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        🔄 رفرش صفحه
                    </button>
                </div>
            `;
        }
    } else {
        console.log(`✅ ${words.length} لغت بارگذاری شد`);
    }
    
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
        
        // ستاره‌ها را بر اساس امتیاز پر کن
        updateStars(bestScore);
    }
    
    console.log('✅ برنامه با موفقیت راه‌اندازی شد');
}

// ====== ترمیم حالت‌های آزمون ======
function fixQuizModes() {
    const quizModes = document.querySelector('.quiz-modes');
    if (!quizModes) {
        console.error('❌ بخش quiz-modes پیدا نشد!');
        return;
    }
    
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
        }
    }
};
