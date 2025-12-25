/**
 * Progress Tracker - ردیابی هوشمند پیشرفت شاگرد
 */

const ProgressTracker = (() => {
    // کلیدهای ذخیره‌سازی
    const STORAGE_KEYS = {
        MISTAKES: 'fred_mistakes_v2',
        PROGRESS: 'fred_progress_stats',
        HISTORY: 'fred_learning_history',
        SESSIONS: 'fred_sessions_count'
    };
    
    // آمار پیشرفت
    let stats = {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0,
        sessions: 0,
        streak: 0,
        bestStreak: 0,
        lastSession: null,
        lastActive: null
    };
    
    // اشتباهات هوشمند
    let smartMistakes = [];
    
    /**
     * مقداردهی اولیه
     */
    function init() {
        console.log('📊 Progress Tracker initialized');
        loadStats();
        loadSmartMistakes();
        
        // به روزرسانی زمان آخرین فعالیت
        updateLastActive();
        
        // نمایش badge گزارش
        setTimeout(() => {
            addProgressBadge();
        }, 2000);
    }
    
    /**
     * ثبت سؤال جدید
     */
    function recordQuestion(mode, isCorrect, word = null) {
        // به روزرسانی آمار
        stats.totalQuestions++;
        
        if (isCorrect) {
            stats.correctAnswers++;
            stats.streak++;
            
            // به روزرسانی بهترین رکورد
            if (stats.streak > stats.bestStreak) {
                stats.bestStreak = stats.streak;
            }
            
            // کاهش اولویت اشتباهات مربوطه
            if (word) {
                decreaseMistakePriority(word, mode);
            }
        } else {
            stats.wrongAnswers++;
            stats.streak = 0;
            
            // افزایش اولویت اشتباه
            if (word) {
                increaseMistakePriority(word, mode);
            }
        }
        
        // محاسبه دقت
        stats.accuracy = stats.totalQuestions > 0 ? 
            Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
        
        // ذخیره آمار
        saveStats();
        updateLastActive();
        
        console.log(`📝 Question recorded: ${isCorrect ? '✅ Correct' : '❌ Wrong'}, Accuracy: ${stats.accuracy}%`);
    }
    
    /**
     * ثبت جلسه جدید
     */
    function recordSession(mode, score, totalQuestions, timeSpent = null) {
        stats.sessions++;
        stats.lastSession = {
            date: new Date().toISOString(),
            mode: mode,
            score: score,
            totalQuestions: totalQuestions,
            timeSpent: timeSpent || estimateTimeSpent(totalQuestions)
        };
        
        // ذخیره در تاریخچه
        saveToHistory(stats.lastSession);
        
        // ذخیره آمار
        saveStats();
        
        console.log(`📊 Session recorded: ${mode}, Score: ${score}%, Questions: ${totalQuestions}`);
        
        // بررسی دستاوردها
        checkAchievements();
    }
    
    /**
     * افزایش اولویت اشتباه
     */
    function increaseMistakePriority(word, mode) {
        const mistakeId = generateMistakeId(word, mode);
        let mistake = smartMistakes.find(m => m.id === mistakeId);
        
        if (!mistake) {
            mistake = {
                id: mistakeId,
                word: word,
                mode: mode,
                count: 1,
                priority: 1.0,
                lastSeen: new Date().toISOString(),
                firstSeen: new Date().toISOString(),
                mastered: false
            };
            smartMistakes.push(mistake);
        } else {
            mistake.count++;
            mistake.priority = calculatePriority(mistake);
            mistake.lastSeen = new Date().toISOString();
            
            // اگر ۳ بار متوالی درست جواب داده شد، mastered شود
            if (mistake.count >= 3) {
                mistake.mastered = true;
                mistake.priority = 0.1;
            }
        }
        
        saveSmartMistakes();
    }
    
    /**
     * کاهش اولویت اشتباه
     */
    function decreaseMistakePriority(word, mode) {
        const mistakeId = generateMistakeId(word, mode);
        const mistake = smartMistakes.find(m => m.id === mistakeId);
        
        if (mistake && mistake.priority > 0.1) {
            mistake.priority *= 0.7; // کاهش 30% اولویت
            mistake.lastSeen = new Date().toISOString();
            saveSmartMistakes();
        }
    }
    
    /**
     * محاسبه اولویت هوشمند
     */
    function calculatePriority(mistake) {
        const now = new Date();
        const lastSeen = new Date(mistake.lastSeen);
        const hoursDiff = (now - lastSeen) / (1000 * 60 * 60);
        
        // فاکتور زمان: اشتباهات اخیر اولویت بالاتر
        let timeFactor = 1.0;
        if (hoursDiff < 1) timeFactor = 2.0;      // کمتر از 1 ساعت
        else if (hoursDiff < 24) timeFactor = 1.5; // امروز
        else if (hoursDiff < 72) timeFactor = 1.2; // 3 روز
        
        // فاکتور تکرار: اشتباهات مکرر اولویت بالاتر
        const countFactor = Math.min(mistake.count * 0.5, 3);
        
        // اولویت نهایی
        const priority = (countFactor * timeFactor);
        
        return Math.min(priority, 10); // حداکثر اولویت 10
    }
    
    /**
     * دریافت اشتباهات برای مرور
     */
    function getMistakesForReview(limit = 10) {
        // فیلتر اشتباهات غیر mastered
        const activeMistakes = smartMistakes.filter(m => !m.mastered);
        
        // اولویت‌بندی
        const sortedMistakes = activeMistakes
            .sort((a, b) => {
                // اول اولویت، سپس تاریخ
                if (b.priority !== a.priority) {
                    return b.priority - a.priority;
                }
                return new Date(b.lastSeen) - new Date(a.lastSeen);
            })
            .slice(0, limit);
        
        console.log(`🎯 Smart review: ${sortedMistakes.length} high-priority mistakes`);
        
        return sortedMistakes;
    }
    
    /**
     * دریافت گزارش پیشرفت
     */
    function getProgressReport() {
        const activeMistakes = smartMistakes.filter(m => !m.mastered);
        const highPriorityMistakes = activeMistakes.filter(m => m.priority > 5);
        
        // اشتباهات اخیر (۷ روز گذشته)
        const recentMistakes = activeMistakes.filter(m => {
            const lastSeen = new Date(m.lastSeen);
            const now = new Date();
            return (now - lastSeen) < (7 * 24 * 60 * 60 * 1000);
        });
        
        return {
            overall: {
                accuracy: stats.accuracy,
                totalQuestions: stats.totalQuestions,
                sessions: stats.sessions,
                learningDays: calculateLearningDays()
            },
            streaks: {
                current: stats.streak,
                best: stats.bestStreak
            },
            mistakes: {
                total: smartMistakes.length,
                active: activeMistakes.length,
                mastered: smartMistakes.filter(m => m.mastered).length,
                highPriority: highPriorityMistakes.length,
                recent: recentMistakes.length
            },
            lastSession: stats.lastSession,
            activity: {
                lastActive: stats.lastActive,
                isActiveToday: isActiveToday()
            }
        };
    }
    
    /**
     * نمایش گزارش پیشرفت
     */
    function showProgressReport() {
        const report = getProgressReport();
        
        let reportHTML = `
            <div class="progress-report">
                <h3>📈 گزارش پیشرفت هوشمند</h3>
                
                <div class="insight-card">
                    <h4>🧠 بینش یادگیری</h4>
                    
                    <div class="insight-item ${report.overall.accuracy > 70 ? 'good' : 'needs-work'}">
                        <span class="insight-icon">${report.overall.accuracy > 70 ? '✅' : '📝'}</span>
                        <div class="insight-text">
                            <strong>دقت کلی: ${report.overall.accuracy}%</strong>
                            <small>${report.overall.accuracy > 70 ? 'عالی! در مسیر درستی هستید.' : 'نیاز به تمرین بیشتر دارید.'}</small>
                        </div>
                    </div>
                    
                    <div class="insight-item ${report.streaks.current > 3 ? 'good' : ''}">
                        <span class="insight-icon">🔥</span>
                        <div class="insight-text">
                            <strong>پاسخ صحیح متوالی: ${report.streaks.current}</strong>
                            <small>رکورد شما: ${report.streaks.best} پاسخ متوالی</small>
                        </div>
                    </div>
                    
                    <div class="insight-item ${report.mistakes.highPriority === 0 ? 'good' : 'warning'}">
                        <span class="insight-icon">🎯</span>
                        <div class="insight-text">
                            <strong>اشتباهات نیازمند مرور: ${report.mistakes.highPriority}</strong>
                            <small>${report.mistakes.highPriority === 0 ? 'همه چیز تحت کنترل است!' : 'این‌ها را اول مرور کنید.'}</small>
                        </div>
                    </div>
                </div>
                
                <div class="report-section">
                    <h4>📊 آمار کلی</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">تعداد سوالات</span>
                            <span class="stat-value">${report.overall.totalQuestions}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">جلسات تمرین</span>
                            <span class="stat-value">${report.overall.sessions}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">روزهای فعال</span>
                            <span class="stat-value">${report.overall.learningDays}</span>
                        </div>
                    </div>
                </div>
                
                <div class="report-section">
                    <h4>🎯 اشتباهات</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">کل اشتباهات</span>
                            <span class="stat-value">${report.mistakes.total}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">تسلط یافته</span>
                            <span class="stat-value">${report.mistakes.mastered}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">نیازمند مرور</span>
                            <span class="stat-value">${report.mistakes.active}</span>
                        </div>
                    </div>
                </div>
        `;
        
        if (report.lastSession) {
            const date = new Date(report.lastSession.date).toLocaleDateString('fa-IR');
            const time = report.lastSession.timeSpent ? `${Math.floor(report.lastSession.timeSpent / 60)}:${(report.lastSession.timeSpent % 60).toString().padStart(2, '0')}` : '--:--';
            
            reportHTML += `
                <div class="report-section">
                    <h4>🕐 آخرین جلسه</h4>
                    <div class="last-session">
                        <p>📅 ${date}</p>
                        <p>🎯 امتیاز: ${report.lastSession.score}%</p>
                        <p>⏱️ زمان: ${time} دقیقه</p>
                        <p>📝 سوالات: ${report.lastSession.totalQuestions}</p>
                    </div>
                </div>
            `;
        }
        
        reportHTML += `
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="reviewSmartMistakes()">
                        <span>🎯</span> مرور اشتباهات هوشمند
                    </button>
                    <button class="btn btn-secondary" onclick="startQuiz('en-fa')">
                        <span>📖</span> شروع تمرین جدید
                    </button>
                </div>
            </div>
        `;
        
        showCustomModal('گزارش پیشرفت', reportHTML);
    }
    
    /**
     * بررسی دستاوردها
     */
    function checkAchievements() {
        const report = getProgressReport();
        
        // دستاورد دقت بالا
        if (report.overall.accuracy >= 90 && report.overall.totalQuestions >= 20) {
            showAchievement('استاد دقت! 🎯', 'دقت شما به ۹۰٪ رسیده است!');
        }
        
        // دستاورد رکورد متوالی
        if (report.streaks.best >= 10) {
            showAchievement('آتشنشان متوالی! 🔥', '۱۰ پاسخ صحیح متوالی!');
        }
        
        // دستاورد تمرین مداوم
        if (report.overall.learningDays >= 7) {
            showAchievement('یادگیرنده مستمر! 📅', '۷ روز متوالی تمرین کرده‌اید!');
        }
    }
    
    /**
     * نمایش دستاورد
     */
    function showAchievement(title, message) {
        const achievementKey = `achievement_${title.replace(/\s+/g, '_')}`;
        const shownBefore = localStorage.getItem(achievementKey);
        
        if (!shownBefore) {
            const modalContent = `
                <div class="achievement-modal">
                    <div class="achievement-icon">🏆</div>
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="closeCustomModal()">
                        عالی! ادامه می‌دهم
                    </button>
                </div>
            `;
            
            showCustomModal('دستاورد جدید!', modalContent);
            localStorage.setItem(achievementKey, 'shown');
        }
    }
    
    /**
     * توابع کمکی
     */
    function generateMistakeId(word, mode) {
        return `${mode}_${word.english}_${word.persian}`.replace(/\s+/g, '_');
    }
    
    function estimateTimeSpent(questions) {
        // تخمین زمان: ۲۰ ثانیه برای هر سؤال
        return Math.round(questions * 20 / 60);
    }
    
    function calculateLearningDays() {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
            const uniqueDates = new Set();
            
            history.forEach(session => {
                const date = new Date(session.date).toISOString().split('T')[0];
                uniqueDates.add(date);
            });
            
            return uniqueDates.size;
        } catch (e) {
            return 1;
        }
    }
    
    function isActiveToday() {
        if (!stats.lastActive) return false;
        
        const lastActive = new Date(stats.lastActive);
        const today = new Date();
        
        return lastActive.toDateString() === today.toDateString();
    }
    
    function updateLastActive() {
        stats.lastActive = new Date().toISOString();
        saveStats();
    }
    
    /**
     * ذخیره و بارگذاری داده‌ها
     */
    function loadStats() {
        try {
            const savedStats = localStorage.getItem(STORAGE_KEYS.PROGRESS);
            if (savedStats) {
                stats = JSON.parse(savedStats);
                console.log('📊 Stats loaded');
            }
        } catch (e) {
            console.error('Error loading stats:', e);
        }
    }
    
    function saveStats() {
        try {
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(stats));
        } catch (e) {
            console.error('Error saving stats:', e);
        }
    }
    
    function loadSmartMistakes() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.MISTAKES);
            if (saved) {
                smartMistakes = JSON.parse(saved);
                console.log(`🎯 Loaded ${smartMistakes.length} smart mistakes`);
            }
        } catch (e) {
            console.error('Error loading smart mistakes:', e);
        }
    }
    
    function saveSmartMistakes() {
        try {
            localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(smartMistakes));
        } catch (e) {
            console.error('Error saving smart mistakes:', e);
        }
    }
    
    function saveToHistory(sessionData) {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
            history.push(sessionData);
            
            // نگه داشتن فقط ۵۰ جلسه آخر
            if (history.length > 50) {
                history.shift();
            }
            
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        } catch (e) {
            console.error('Error saving history:', e);
        }
    }
    
    /**
     * اضافه کردن badge گزارش
     */
    function addProgressBadge() {
        // فقط در صفحه اصلی
        if (ScreenController.getCurrentState() !== ScreenController.STATE.HOME) {
            return;
        }
        
        // حذف badge قبلی
        const existingBadge = document.getElementById('progress-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // ایجاد badge جدید
        const badgeHTML = `
            <div id="progress-badge" class="progress-badge" onclick="ProgressTracker.showProgressReport()" title="گزارش پیشرفت">
                📊
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', badgeHTML);
    }
    
    /**
     * API عمومی
     */
    return {
        init,
        recordQuestion,
        recordSession,
        getMistakesForReview,
        getProgressReport,
        showProgressReport,
        showAchievement,
        getStats: () => ({ ...stats }),
        getSmartMistakes: () => ([...smartMistakes]),
        addProgressBadge
    };
})();

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', ProgressTracker.init);
window.ProgressTracker = ProgressTracker;
