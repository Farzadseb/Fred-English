/**
 * Progress Tracker - ردیابی هوشمند پیشرفت شاگرد
 * نسخه نهایی با اصلاحات منطقی
 */

const ProgressTracker = (() => {
    // کلیدهای ذخیره‌سازی
    const STORAGE_KEYS = {
        MISTAKES: 'fred_mistakes_v4',
        PROGRESS: 'fred_progress_stats_v4',
        HISTORY: 'fred_learning_history_v4',
        SESSIONS: 'fred_sessions_count_v4',
        ACHIEVEMENTS: 'fred_achievements_v4'
    };

    // توابع UI - ایمن‌سازی در برابر undefined
    const UI = {
        showModal: typeof showCustomModal !== 'undefined' ? showCustomModal : null,
        reviewMistakes: typeof reviewSmartMistakes !== 'undefined' ? reviewSmartMistakes : null,
        startQuiz: typeof startQuiz !== 'undefined' ? startQuiz : null
    };

    // آمار پیشرفت  
    let stats = {  
        totalQuestions: 0,  
        correctAnswers: 0,  
        wrongAnswers: 0,  
        accuracy: 0,  
        sessions: 0,  
        streak: 0, // streak روزانه (در انتهای روز ریست می‌شود)
        sessionStreak: 0, // streak درون جلسه فعلی
        sessionMaxStreak: 0, // بیشترین streak در این جلسه
        bestStreak: 0, // بهترین رکورد کلی
        lastSession: null,  
        lastActive: null,
        totalTimeSpent: 0, // کل زمان صرف شده (دقیقه)
        dailyGoal: 20, // هدف روزانه (تعداد سوال)
        lastResetDate: null // تاریخ آخرین ریست streak روزانه
    };  
    
    // اشتباهات هوشمند  
    let smartMistakes = [];  
    
    /**
     * مقداردهی اولیه  
     */
    function init() {  
        console.log('📊 Progress Tracker initialized v4');  
        loadStats();  
        loadSmartMistakes();  
        
        // بررسی ریست streak روزانه
        checkDailyStreakReset();
        
        // به روزرسانی زمان آخرین فعالیت  
        updateLastActive();  
        
        // نمایش badge گزارش  
        setTimeout(() => {  
            addProgressBadge();  
        }, 2000);  
        
        // تنظیم هندلرهای رویداد برای تست
        setupEventHandlers();
    }
    
    /**
     * بررسی و ریست streak روزانه در صورت نیاز
     */
    function checkDailyStreakReset() {
        const today = new Date().toDateString();
        
        // اگر اولین بار است یا تاریخ تغییر کرده
        if (!stats.lastResetDate || new Date(stats.lastResetDate).toDateString() !== today) {
            console.log('🔄 Resetting daily streak for new day');
            stats.streak = 0; // ریست streak روزانه
            stats.lastResetDate = new Date().toISOString();
            saveStats();
        }
    }
    
    /**
     * تنظیم هندلرهای رویداد
     */
    function setupEventHandlers() {
        if (typeof window !== 'undefined') {
            window.increaseMistakeReviewCount = function(mistakeId) {
                increaseReviewCount(mistakeId);
            };
        }
    }
    
    /**
     * ثبت سؤال جدید  
     */
    function recordQuestion(mode, isCorrect, word = null) {  
        // به روزرسانی آمار  
        stats.totalQuestions++;  
        
        if (isCorrect) {  
            stats.correctAnswers++;  
            stats.streak++; // streak روزانه
            stats.sessionStreak++; // streak درون جلسه
            
            // به روزرسانی بیشترین streak جلسه
            if (stats.sessionStreak > stats.sessionMaxStreak) {
                stats.sessionMaxStreak = stats.sessionStreak;
            }
            
            // به روزرسانی بهترین رکورد کلی  
            if (stats.streak > stats.bestStreak) {  
                stats.bestStreak = stats.streak;  
            }  
            
            // کاهش اولویت اشتباهات مربوطه  
            if (word) {  
                decreaseMistakePriority(word, mode);  
            }  
        } else {  
            stats.wrongAnswers++;  
            stats.streak = 0; // ریست streak روزانه
            stats.sessionStreak = 0; // ریست streak جلسه
            
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
        
        console.log(`📝 Question recorded: ${isCorrect ? '✅ Correct' : '❌ Wrong'}, Daily Streak: ${stats.streak}, Session Streak: ${stats.sessionStreak}`);  
        
        // بررسی دستاوردها در طول جلسه
        checkInSessionAchievements();
    }  
    
    /**
     * ثبت جلسه جدید  
     */
    function recordSession(mode, score, totalQuestions, timeSpent = null) {  
        // ریست کردن streak جلسه (اما ذخیره بیشترین مقدار)
        const sessionStreakRecord = stats.sessionMaxStreak;
        stats.sessionStreak = 0;
        stats.sessionMaxStreak = 0;
        
        // ریست کردن streak روزانه (همانطور که در کد قبلی بود)
        // این کار برای جلوگیری از streak مصنوعی چند روزه انجام می‌شود
        // اگر می‌خواهید streak روزانه ادامه پیدا کند، این خط را حذف کنید
        stats.streak = 0;
        
        stats.sessions++;  
        
        // افزودن زمان به کل زمان
        const estimatedTime = timeSpent || estimateTimeSpent(totalQuestions);
        stats.totalTimeSpent += estimatedTime;
        
        stats.lastSession = {  
            date: new Date().toISOString(),  
            mode: mode,  
            score: score,  
            totalQuestions: totalQuestions,  
            timeSpent: estimatedTime,
            streakInSession: sessionStreakRecord // ذخیره بیشترین streak جلسه
        };  
        
        // ذخیره در تاریخچه  
        saveToHistory(stats.lastSession);  
        
        // ذخیره آمار  
        saveStats();  
        
        console.log(`📊 Session recorded: ${mode}, Score: ${score}%, Max Streak in Session: ${sessionStreakRecord}`);  
        
        // بررسی دستاوردها  
        checkAchievements();  
        
        // نشان‌دادن خلاصه جلسه
        showSessionSummary(stats.lastSession);
    }  
    
    /**
     * نمایش خلاصه جلسه
     */
    function showSessionSummary(session) {
        if (!UI.showModal) return;
        
        const date = new Date(session.date).toLocaleDateString('fa-IR');
        const time = formatTime(session.timeSpent);
        
        let feedback = '';
        if (session.score >= 90) {
            feedback = 'عالی! 🎯 دقت فوق‌العاده‌ای داشتید.';
        } else if (session.score >= 70) {
            feedback = 'خوب! 👍 در مسیر درستی هستید.';
        } else {
            feedback = 'نیاز به تمرین بیشتر دارید. 📚';
        }
        
        const summaryHTML = `
            <div class="session-summary">
                <div class="summary-icon">📊</div>
                <h4>خلاصه جلسه تمرین</h4>
                <div class="summary-stats">
                    <div class="stat-row">
                        <span>تاریخ:</span>
                        <strong>${date}</strong>
                    </div>
                    <div class="stat-row ${session.score >= 70 ? 'good' : 'warning'}">
                        <span>امتیاز:</span>
                        <strong>${session.score}%</strong>
                    </div>
                    <div class="stat-row">
                        <span>سوالات:</span>
                        <strong>${session.totalQuestions}</strong>
                    </div>
                    <div class="stat-row">
                        <span>زمان:</span>
                        <strong>${time}</strong>
                    </div>
                    ${session.streakInSession > 0 ? `
                    <div class="stat-row highlight">
                        <span>پاسخ متوالی:</span>
                        <strong>${session.streakInSession} 🔥</strong>
                    </div>
                    ` : ''}
                </div>
                <div class="feedback">${feedback}</div>
                <div class="next-steps">
                    <p>🎯 <strong>قدم بعدی:</strong> ${getNextStepAdvice()}</p>
                </div>
            </div>
        `;
        
        // نمایش با تاخیر برای تجربه بهتر کاربر
        setTimeout(() => {
            UI.showModal('جلسه تکمیل شد', summaryHTML);
        }, 500);
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
                wrongCount: 1, // تعداد دفعات اشتباه
                correctStreak: 0, // تعداد پاسخ‌های صحیح متوالی
                priority: 1.0,  
                lastSeen: new Date().toISOString(),  
                firstSeen: new Date().toISOString(),  
                mastered: false,
                timesReviewed: 0 // تعداد دفعات مرور - فقط در مرور افزایش می‌یابد
            };  
            smartMistakes.push(mistake);  
        } else {  
            mistake.wrongCount++;  
            mistake.correctStreak = 0; // ریست کردن streak صحیح
            mistake.priority = calculatePriority(mistake);  
            mistake.lastSeen = new Date().toISOString();  
            // timesReviewed اینجا افزایش نمی‌یابد - فقط در مرور افزایش می‌یابد
        }  
        
        saveSmartMistakes();  
    }  
    
    /**
     * افزایش تعداد مرور برای اشتباه خاص
     */
    function increaseReviewCount(mistakeId) {
        const mistake = smartMistakes.find(m => m.id === mistakeId);
        if (mistake) {
            mistake.timesReviewed = (mistake.timesReviewed || 0) + 1;
            mistake.lastSeen = new Date().toISOString();
            saveSmartMistakes();
            console.log(`📖 Increased review count for mistake: ${mistakeId}, total reviews: ${mistake.timesReviewed}`);
        }
    }
    
    /**
     * کاهش اولویت اشتباه  
     */
    function decreaseMistakePriority(word, mode) {  
        const mistakeId = generateMistakeId(word, mode);  
        const mistake = smartMistakes.find(m => m.id === mistakeId);  
        
        if (mistake) {  
            mistake.correctStreak = (mistake.correctStreak || 0) + 1;  
            
            // اگر ۳ بار متوالی درست جواب داده شد، mastered شود  
            if (mistake.correctStreak >= 3 && !mistake.mastered) {  
                mistake.mastered = true;  
                mistake.priority = 0.1;  
                console.log(`🎓 Mastered: ${word.english} in ${mode} mode`);
                
                // نمایش اعلان تسلط
                showMasteryNotification(word, mode);
            } else if (mistake.priority > 0.1) {  
                mistake.priority *= 0.7; // کاهش 30% اولویت  
            }  
            
            mistake.lastSeen = new Date().toISOString();  
            saveSmartMistakes();  
        }  
    }
    
    /**
     * نمایش اعلان تسلط
     */
    function showMasteryNotification(word, mode) {
        if (!UI.showModal) return;
        
        const modeName = mode === 'en-fa' ? 'انگلیسی به فارسی' : 'فارسی به انگلیسی';
        const notificationHTML = `
            <div class="mastery-notification">
                <div class="mastery-icon">🎓</div>
                <h4>تبریک! تسلط یافتید</h4>
                <p>شما بر واژه <strong>"${word.english}"</strong> به معنی <strong>"${word.persian}"</strong></p>
                <p>در حالت <strong>${modeName}</strong> تسلط پیدا کردید.</p>
                <small>۳ بار متوالی پاسخ صحیح دادید! 👏</small>
            </div>
        `;
        
        // نمایش اعلان با تاخیر کوتاه
        setTimeout(() => {
            UI.showModal('🎓 تسلط جدید', notificationHTML);
        }, 1000);
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
        
        // فاکتور تکرار اشتباهات  
        const wrongFactor = Math.min((mistake.wrongCount || 1) * 0.8, 4);  
        
        // کاهش اولویت برای پاسخ‌های صحیح متوالی  
        const streakReduction = mistake.correctStreak > 0 ?   
            Math.max(0.3, 1 - (mistake.correctStreak * 0.2)) : 1;  
        
        // فاکتور تعداد مرورها - اگر مرور شده، اولویت کمتر
        const reviewFactor = mistake.timesReviewed > 0 ? 
            Math.max(0.5, 1 - (mistake.timesReviewed * 0.1)) : 1;
        
        // اولویت نهایی  
        const priority = (wrongFactor * timeFactor * streakReduction * reviewFactor);  
        
        return Math.min(Math.max(priority, 0.1), 10); // اولویت بین 0.1 تا 10  
    }  
    
    /**
     * دریافت اشتباهات برای مرور  
     */
    function getMistakesForReview(limit = 10) {  
        // فیلتر اشتباهات غیر mastered  
        const activeMistakes = smartMistakes.filter(m => !m.mastered);  
        
        // محاسبه اولویت برای همه
        activeMistakes.forEach(m => {
            m.priority = calculatePriority(m);
        });
        
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
        
        // محاسبه پیشرفت روزانه
        const dailyProgress = calculateDailyProgress();
        
        return {  
            overall: {  
                accuracy: stats.accuracy,  
                totalQuestions: stats.totalQuestions,  
                sessions: stats.sessions,  
                learningDays: calculateLearningDays(),
                totalTimeSpent: stats.totalTimeSpent
            },  
            streaks: {  
                daily: stats.streak,  // streak امروز
                session: stats.sessionStreak, // streak جلسه فعلی
                sessionMax: stats.sessionMaxStreak, // بیشترین streak این جلسه
                best: stats.bestStreak  // بهترین رکورد کلی
            },  
            mistakes: {  
                total: smartMistakes.length,  
                active: activeMistakes.length,  
                mastered: smartMistakes.filter(m => m.mastered).length,  
                highPriority: highPriorityMistakes.length,  
                recent: recentMistakes.length  
            },  
            daily: dailyProgress,
            lastSession: stats.lastSession,  
            activity: {  
                lastActive: stats.lastActive,  
                isActiveToday: isActiveToday(),
                dailyGoal: stats.dailyGoal,
                goalProgress: Math.min(Math.round((dailyProgress.questionsToday / stats.dailyGoal) * 100), 100)
            }  
        };  
    }  
    
    /**
     * محاسبه پیشرفت روزانه
     */
    function calculateDailyProgress() {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
            const today = new Date().toISOString().split('T')[0];
            
            let questionsToday = 0;
            let timeToday = 0;
            
            history.forEach(session => {
                const sessionDate = new Date(session.date).toISOString().split('T')[0];
                if (sessionDate === today) {
                    questionsToday += session.totalQuestions || 0;
                    timeToday += session.timeSpent || 0;
                }
            });
            
            return {
                questionsToday,
                timeToday,
                sessionsToday: history.filter(s => 
                    new Date(s.date).toISOString().split('T')[0] === today
                ).length
            };
        } catch (e) {
            return { questionsToday: 0, timeToday: 0, sessionsToday: 0 };
        }
    }
    
    /**
     * نمایش گزارش پیشرفت  
     */
    function showProgressReport() {  
        const report = getProgressReport();  
        
        let reportHTML = `  
            <div class="progress-report">  
                <h3>📈 گزارش پیشرفت هوشمند</h3>  
                
                <!-- بخش پیشرفت روزانه -->
                <div class="daily-progress">
                    <h4>🎯 هدف روزانه</h4>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${report.activity.goalProgress}%"></div>
                    </div>
                    <div class="progress-text">
                        ${report.daily.questionsToday} از ${report.activity.dailyGoal} سوال
                        <span class="progress-percent">(${report.activity.goalProgress}%)</span>
                    </div>
                    ${report.activity.goalProgress >= 100 ? 
                        '<div class="goal-achieved">✅ هدف امروز محقق شد!</div>' : 
                        `<div class="goal-remaining">📝 ${report.activity.dailyGoal - report.daily.questionsToday} سوال دیگر تا رسیدن به هدف</div>`
                    }
                </div>
                
                <div class="insight-card">  
                    <h4>🧠 بینش یادگیری</h4>  
                    
                    <div class="insight-item ${report.overall.accuracy > 70 ? 'good' : 'needs-work'}">  
                        <span class="insight-icon">${report.overall.accuracy > 70 ? '✅' : '📝'}</span>  
                        <div class="insight-text">  
                            <strong>دقت کلی: ${report.overall.accuracy}%</strong>  
                            <small>${report.overall.accuracy > 70 ? 'عالی! در مسیر درستی هستید.' : 'نیاز به تمرین بیشتر دارید.'}</small>  
                        </div>  
                    </div>  
                    
                    <div class="insight-item ${report.streaks.session > 3 ? 'good' : ''}">  
                        <span class="insight-icon">🔥</span>  
                        <div class="insight-text">  
                            <strong>پاسخ صحیح متوالی امروز: ${report.streaks.daily}</strong>  
                            <small>رکورد کلی شما: ${report.streaks.best} پاسخ متوالی</small>  
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
                        <div class="stat-item">  
                            <span class="stat-label">کل زمان</span>  
                            <span class="stat-value">${formatTime(report.overall.totalTimeSpent)}</span>  
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
                        <div class="stat-item">  
                            <span class="stat-label">اولویت بالا</span>  
                            <span class="stat-value">${report.mistakes.highPriority}</span>  
                        </div>  
                    </div>  
                </div>  
        `;  
        
        if (report.lastSession) {  
            const date = new Date(report.lastSession.date).toLocaleDateString('fa-IR');  
            const time = formatTime(report.lastSession.timeSpent);
            const streakInfo = report.lastSession.streakInSession > 0 ? 
                `<p>🔥 پاسخ متوالی: ${report.lastSession.streakInSession}</p>` : '';
            
            reportHTML += `  
                <div class="report-section">  
                    <h4>🕐 آخرین جلسه</h4>  
                    <div class="last-session">  
                        <p>📅 ${date}</p>  
                        <p>🎯 امتیاز: ${report.lastSession.score}%</p>  
                        <p>⏱️ زمان: ${time}</p>  
                        <p>📝 سوالات: ${report.lastSession.totalQuestions}</p>  
                        ${streakInfo}
                    </div>  
                </div>  
            `;  
        }  
        
        reportHTML += `  
                <div class="action-buttons">  
                    <button class="btn btn-primary" onclick="ProgressTracker.reviewMistakesHandler()">  
                        <span>🎯</span> مرور اشتباهات هوشمند  
                    </button>  
                    <button class="btn btn-secondary" onclick="ProgressTracker.startQuizHandler('en-fa')">  
                        <span>📖</span> شروع تمرین جدید  
                    </button>  
                    <button class="btn btn-outline" onclick="ProgressTracker.updateDailyGoal()">  
                        <span>🎯</span> تنظیم هدف روزانه  
                    </button>  
                </div>  
            </div>  
        `;  
        
        if (UI.showModal) {
            UI.showModal('گزارش پیشرفت', reportHTML);
        } else {
            console.error('Cannot show progress report: showCustomModal not available');
        }
    }
    
    /**
     * تنظیم هدف روزانه
     */
    function updateDailyGoal() {
        if (!UI.showModal) return;
        
        const goalHTML = `
            <div class="goal-setting">
                <h4>🎯 تنظیم هدف روزانه</h4>
                <p>تعداد سوالاتی که می‌خواهید روزانه تمرین کنید را وارد کنید:</p>
                <input type="number" id="dailyGoalInput" min="5" max="100" value="${stats.dailyGoal}" class="goal-input">
                <div class="goal-suggestions">
                    <small>پیشنهادات:</small>
                    <button class="btn-small" onclick="document.getElementById('dailyGoalInput').value = 10">۱۰ سوال</button>
                    <button class="btn-small" onclick="document.getElementById('dailyGoalInput').value = 20">۲۰ سوال</button>
                    <button class="btn-small" onclick="document.getElementById('dailyGoalInput').value = 30">۳۰ سوال</button>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="ProgressTracker.saveDailyGoal()">
                        ذخیره هدف
                    </button>
                </div>
            </div>
        `;
        
        UI.showModal('تنظیم هدف روزانه', goalHTML);
    }
    
    /**
     * ذخیره هدف روزانه
     */
    function saveDailyGoal() {
        const input = document.getElementById('dailyGoalInput');
        if (input) {
            const newGoal = parseInt(input.value);
            if (newGoal >= 5 && newGoal <= 100) {
                stats.dailyGoal = newGoal;
                saveStats();
                if (UI.showModal) {
                    UI.showModal('✅ هدف ذخیره شد', `
                        <div class="goal-saved">
                            <p>هدف روزانه شما به <strong>${newGoal} سوال</strong> تنظیم شد.</p>
                            <small>هر روز به این هدف برسید تا پیشرفت قابل توجهی داشته باشید!</small>
                        </div>
                    `);
                }
                showProgressReport(); // بازگشت به گزارش
            }
        }
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
        
        // دستاورد رکورد متوالی روزانه
        if (report.streaks.daily >= 10) {  
            showAchievement('آتشنشان روزانه! 🔥', '۱۰ پاسخ صحیح متوالی امروز!');  
        }  
        
        // دستاورد رکورد کلی
        if (report.streaks.best >= 15) {  
            showAchievement('رکوردشکن! 🏆', '۱۵ پاسخ صحیح متوالی (رکورد کلی)');  
        }
        
        // دستاورد تمرین مداوم  
        if (report.overall.learningDays >= 7) {  
            showAchievement('یادگیرنده مستمر! 📅', '۷ روز متوالی تمرین کرده‌اید!');  
        }
        
        // دستاورد تسلط بر اشتباهات
        if (report.mistakes.mastered >= 5) {
            showAchievement('متخصص رفع اشتباه! 🎓', `بر ${report.mistakes.mastered} اشتباه تسلط یافته‌اید!`);
        }
        
        // دستاورد زمان تمرین
        if (report.overall.totalTimeSpent >= 60) { // 1 ساعت
            showAchievement('ساعت‌طلا! ⏰', 'یک ساعت کامل تمرین کرده‌اید!');
        }
        
        // دستاورد هدف روزانه
        const dailyProgress = calculateDailyProgress();
        if (dailyProgress.questionsToday >= stats.dailyGoal) {
            showAchievement('قهرمان روز! 🏆', 'به هدف روزانه خود رسیدید!');
        }
    }
    
    /**
     * بررسی دستاوردهای درون جلسه
     */
    function checkInSessionAchievements() {
        // دستاورد streak درون جلسه
        if (stats.sessionStreak === 5) {
            showAchievement('نیم‌دهک! ✋', '۵ پاسخ صحیح متوالی در این جلسه!');
        }
        if (stats.sessionStreak === 10) {
            showAchievement('دهک طلایی! 🔟', '۱۰ پاسخ صحیح متوالی در این جلسه!');
        }
        
        // دستاورد streak روزانه
        if (stats.streak === 15) {
            showAchievement('طلایه‌دار روز! 🌟', '۱۵ پاسخ صحیح متوالی امروز!');
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
                    <button class="btn btn-primary" onclick="ProgressTracker.closeModal()">  
                        عالی! ادامه می‌دهم  
                    </button>  
                </div>  
            `;  
            
            if (UI.showModal) {
                UI.showModal('دستاورد جدید!', modalContent);
            }
            localStorage.setItem(achievementKey, 'shown');  
        }  
    }
    
    /**
     * بستن modal
     */
    function closeModal() {
        // این تابع برای استفاده از onclick در دستاوردها
        if (typeof closeCustomModal !== 'undefined') {
            closeCustomModal();
        }
    }
    
    /**
     * توابع کمکی  
     */
    function generateMistakeId(word, mode) {  
        return `${mode}_${word.english}_${word.persian}`.replace(/\s+/g, '_');  
    }  
    
    function estimateTimeSpent(questions) {  
        // تخمین زمان: ۱۵-۲۵ ثانیه برای هر سؤال  
        const avgTimePerQuestion = 20; // ثانیه
        return Math.round(questions * avgTimePerQuestion / 60);  
    }  
    
    function formatTime(minutes) {
        if (minutes < 60) {
            return `${minutes} دقیقه`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours} ساعت و ${mins} دقیقه`;
        }
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
     * پیشنهاد قدم بعدی
     */
    function getNextStepAdvice() {
        const report = getProgressReport();
        
        if (report.mistakes.highPriority > 0) {
            return 'اشتباهات با اولویت بالا را مرور کنید.';
        } else if (report.daily.questionsToday < stats.dailyGoal) {
            const remaining = stats.dailyGoal - report.daily.questionsToday;
            return `${remaining} سوال دیگر تمرین کنید تا به هدف روزانه برسید.`;
        } else if (report.overall.accuracy < 70) {
            return 'تمرین بیشتری در حالت‌های مختلف داشته باشید.';
        } else {
            return 'یک جلسه تمرین جدید با کلمات چالش‌برانگیز شروع کنید.';
        }
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
                
                // تنظیم مقادیر پیش‌فرض برای فیلدهای جدید
                if (!stats.sessionStreak) stats.sessionStreak = 0;
                if (!stats.sessionMaxStreak) stats.sessionMaxStreak = 0;
                if (!stats.totalTimeSpent) stats.totalTimeSpent = 0;
                if (!stats.dailyGoal) stats.dailyGoal = 20;
                if (!stats.lastResetDate) stats.lastResetDate = new Date().toISOString();
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
            
            // نگه داشتن فقط ۱۰۰ جلسه آخر  
            if (history.length > 100) {  
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
        const currentPage = window.location.pathname;
        const isHomePage = currentPage.endsWith('index.html') || currentPage.endsWith('/') || currentPage === '';
        
        if (!isHomePage) {  
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
                <span class="badge-notification" id="mistake-count"></span>  
            </div>  
        `;  
        
        document.body.insertAdjacentHTML('beforeend', badgeHTML);
        
        // به روزرسانی تعداد اشتباهات
        updateBadgeNotification();
    }
    
    /**
     * به روزرسانی نوتیفیکیشن badge
     */
    function updateBadgeNotification() {
        const badge = document.getElementById('mistake-count');
        if (badge) {
            const report = getProgressReport();
            if (report.mistakes.highPriority > 0) {
                badge.textContent = report.mistakes.highPriority;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    /**
     * ریست کردن آمار (برای توسعه)
     */
    function resetStats(confirm = false) {
        if (!confirm) {
            console.warn('برای ریست کردن آمار، true را به تابع پاس دهید');
            return;
        }
        
        stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            accuracy: 0,
            sessions: 0,
            streak: 0,
            sessionStreak: 0,
            sessionMaxStreak: 0,
            bestStreak: 0,
            lastSession: null,
            lastActive: null,
            totalTimeSpent: 0,
            dailyGoal: 20,
            lastResetDate: new Date().toISOString()
        };
        
        smartMistakes = [];
        
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.MISTAKES);
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
        
        console.log('✅ All stats reset successfully');
        
        // بارگذاری مجدد
        loadStats();
        loadSmartMistakes();
    }
    
    /**
     * خروجی گرفتن از داده‌ها (برای پشتیبان‌گیری)
     */
    function exportData() {
        const data = {
            stats,
            smartMistakes,
            history: JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]'),
            version: '4.0',
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `fred-progress-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
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
        addProgressBadge,
        updateBadgeNotification,
        increaseReviewCount,
        // هندلرهای UI
        reviewMistakesHandler: () => {
            if (UI.reviewMistakes) {
                UI.reviewMistakes();
            } else {
                console.warn('reviewSmartMistakes function not available');
            }
        },
        startQuizHandler: (mode) => {
            if (UI.startQuiz) {
                UI.startQuiz(mode);
            } else {
                console.warn('startQuiz function not available');
            }
        },
        closeModal,
        updateDailyGoal,
        saveDailyGoal,
        // توابع کمکی
        resetStats,
        exportData,
        // تنظیم توابع UI
        setUIHandlers: (handlers) => {
            if (handlers.showModal) UI.showModal = handlers.showModal;
            if (handlers.reviewMistakes) UI.reviewMistakes = handlers.reviewMistakes;
            if (handlers.startQuiz) UI.startQuiz = handlers.startQuiz;
        }
    };
})();

// ✅ تنها خط خروجی
window.ProgressTracker = ProgressTracker;

// ✅ اضافه کردن استایل‌های CSS
const progressTrackerStyles = `
    .progress-badge {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    }
    
    .progress-badge:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    .progress-badge .badge-notification {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff4757;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: none;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
        100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
    }
    
    .progress-report {
        max-width: 500px;
        margin: 0 auto;
    }
    
    .insight-card {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 15px;
        margin: 20px 0;
        border-right: 4px solid #667eea;
    }
    
    .insight-item {
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 10px;
        border-radius: 8px;
        background: white;
    }
    
    .insight-item.good {
        border-right: 3px solid #4cd964;
    }
    
    .insight-item.warning {
        border-right: 3px solid #ff9500;
    }
    
    .insight-item.needs-work {
        border-right: 3px solid #ff3b30;
    }
    
    .insight-icon {
        font-size: 24px;
        margin-left: 10px;
    }
    
    .insight-text {
        flex: 1;
    }
    
    .insight-text strong {
        display: block;
        margin-bottom: 5px;
    }
    
    .insight-text small {
        color: #666;
        font-size: 12px;
    }
    
    .report-section {
        margin: 25px 0;
        padding: 15px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-top: 15px;
    }
    
    @media (min-width: 480px) {
        .stats-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }
    
    .stat-item {
        text-align: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .stat-label {
        display: block;
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
    }
    
    .stat-value {
        display: block;
        font-size: 20px;
        font-weight: bold;
        color: #333;
    }
    
    .last-session {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    
    .last-session p {
        margin: 0;
        padding: 8px;
        background: #f8f9fa;
        border-radius: 6px;
        font-size: 14px;
    }
    
    .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        flex-wrap: wrap;
    }
    
    .btn {
        flex: 1;
        min-width: 150px;
        padding: 12px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    .btn-secondary {
        background: #34c759;
        color: white;
    }
    
    .btn-outline {
        background: white;
        color: #667eea;
        border: 2px solid #667eea;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .achievement-modal {
        text-align: center;
        padding: 20px;
    }
    
    .achievement-icon {
        font-size: 60px;
        margin-bottom: 20px;
        animation: bounce 1s infinite alternate;
    }
    
    @keyframes bounce {
        from { transform: translateY(0); }
        to { transform: translateY(-10px); }
    }
    
    .daily-progress {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
    }
    
    .progress-bar-container {
        background: rgba(255,255,255,0.3);
        height: 10px;
        border-radius: 5px;
        margin: 15px 0;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background: white;
        border-radius: 5px;
        transition: width 0.5s ease;
    }
    
    .progress-text {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        margin-bottom: 10px;
    }
    
    .progress-percent {
        background: rgba(255,255,255,0.2);
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: bold;
    }
    
    .goal-achieved {
        background: rgba(255,255,255,0.2);
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        margin-top: 10px;
        animation: glow 1.5s infinite alternate;
    }
    
    .goal-remaining {
        background: rgba(255,255,255,0.1);
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        margin-top: 10px;
    }
    
    @keyframes glow {
        from { box-shadow: 0 0 5px rgba(255,255,255,0.5); }
        to { box-shadow: 0 0 20px rgba(255,255,255,0.8); }
    }
    
    .session-summary {
        text-align: center;
        padding: 20px;
    }
    
    .summary-icon {
        font-size: 50px;
        margin-bottom: 15px;
    }
    
    .summary-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin: 20px 0;
    }
    
    .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .stat-row.good {
        background: #e8f5e9;
        border-right: 3px solid #4cd964;
    }
    
    .stat-row.warning {
        background: #fff3cd;
        border-right: 3px solid #ffc107;
    }
    
    .stat-row.highlight {
        background: #fff0f6;
        border-right: 3px solid #eb2f96;
        font-weight: bold;
    }
    
    .feedback {
        background: #e3f2fd;
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        font-size: 16px;
    }
    
    .next-steps {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        font-size: 14px;
        text-align: right;
    }
    
    .mastery-notification {
        text-align: center;
        padding: 20px;
    }
    
    .mastery-icon {
        font-size: 60px;
        margin-bottom: 20px;
        color: #4cd964;
    }
    
    .goal-setting {
        text-align: center;
    }
    
    .goal-input {
        width: 100%;
        padding: 12px;
        margin: 15px 0;
        border: 2px solid #667eea;
        border-radius: 8px;
        font-size: 16px;
        text-align: center;
    }
    
    .goal-suggestions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 15px 0;
        flex-wrap: wrap;
    }
    
    .btn-small {
        padding: 8px 15px;
        background: #e3f2fd;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .goal-saved {
        text-align: center;
        padding: 20px;
    }
    
    .goal-saved p {
        font-size: 18px;
        margin-bottom: 10px;
    }
`;

// اضافه کردن استایل‌ها به صفحه
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = progressTrackerStyles;
    document.head.appendChild(styleElement);
}

console.log('✅ Progress Tracker v4.0 loaded successfully');
