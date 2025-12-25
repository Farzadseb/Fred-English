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
                <div style="margin-top: 20px; padding: 15px; background: var(--bg); border-radius: 12px;">
                    <h4 style="margin-bottom: 10px;">📈 آخرین آزمون‌ها</h4>
                    <div style="font-size: 14px; color: var(--text); opacity: 0.8;">
                        ${report && report.recentSessions ? 
                            report.recentSessions.map(s => 
                                `<div style="margin-bottom: 8px; padding: 8px; border-bottom: 1px solid #eee;">
                                    ${s.mode} - ${s.score}% (${s.date})
                                </div>`
                            ).join('') : 
                            '<p>هنوز آزمونی انجام نداده‌اید.</p>'
                        }
                    </div>
                </div>
            `;
        } catch (error) {
            html = `<p style="color: var(--danger);">خطا در بارگذاری گزارش: ${error.message}</p>`;
        }
    } else {
        html = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <p style="font-size: 18px; margin-bottom: 10px;">📊 سیستم گزارش‌گیری</p>
                <p style="font-size: 14px;">هنوز فعال نشده است.</p>
                <p style="font-size: 12px; margin-top: 20px;">برای فعال‌سازی، چند آزمون بدهید.</p>
            </div>
        `;
    }
    
    content.innerHTML = html;
}

// ====== توابع کمکی ======
function registerWhatsApp() {
    const phone = "+989123456789"; // شماره واتساپ
    const message = "سلام! می‌خواهم در برنامه English with Fred ثبت‌نام کنم.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function exitApp() {
    if (confirm("آیا می‌خواهید از برنامه خارج شوید؟")) {
        // اگر PWA است
        if (window.navigator.standalone) {
            window.close();
        } else {
            // برای مرورگر معمولی
            window.location.href = "about:blank";
        }
    }
}

function reviewSmartMistakes() {
    if (typeof ProgressTracker !== 'undefined' && ProgressTracker.reviewMistakes) {
        ProgressTracker.reviewMistakes();
    } else {
        alert("سیستم مرور اشتباهات هنوز فعال نیست. ابتدا چند آزمون بدهید.");
    }
}

// ====== مقداردهی اولیه ======
function initApp() {
    console.log('🚀 شروع برنامه English with Fred...');
    
    // بارگذاری تم
    loadTheme();
    
    // بررسی فایل‌های ضروری
    console.log('🔍 بررسی فایل‌ها:');
    console.log('- words.js:', typeof words !== 'undefined' ? '✅' : '❌');
    console.log('- startQuiz:', typeof startQuiz !== 'undefined' ? '✅' : '❌');
    console.log('- ProgressTracker:', typeof ProgressTracker !== 'undefined' ? '✅' : '❌');
    
    // اگر words وجود ندارد
    if (typeof words === 'undefined' || !Array.isArray(words) || words.length === 0) {
        console.error('❌ فایل لغات بارگذاری نشد!');
        const quizModes = document.querySelector('.quiz-modes');
        if (quizModes) {
            quizModes.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--danger);">
                    <p>⚠️ فایل لغات یافت نشد!</p>
                    <p style="font-size: 14px;">لطفاً فایل words.js را بررسی کنید.</p>
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
    }
    
    console.log('✅ برنامه با موفقیت راه‌اندازی شد');
}

// ====== رویدادهای صفحه ======
document.addEventListener('DOMContentLoaded', initApp);

// ریسپانسیو کردن
window.addEventListener('resize', function() {
    const container = document.querySelector('.app-container');
    if (container && window.innerWidth < 480) {
        container.style.padding = '10px';
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
            // انیمیشن برای ستاره‌ها
            const stars = document.querySelectorAll('.star');
            stars.forEach((star, index) => {
                if (index < Math.floor(score / 20)) {
                    star.classList.add('filled');
                } else {
                    star.classList.remove('filled');
                }
            });
        }
    }
};
