/**
 * Progress Tracker - ردیابی هوشمند پیشرفت شاگرد
 * نسخه ساده و عملی v1.0
 */

(function() {
    // کلیدهای ذخیره‌سازی
    const STORAGE_KEYS = {
        MISTAKES: 'fred_mistakes',
        PROGRESS: 'fred_progress_stats',
        HISTORY: 'fred_learning_history'
    };

    // آمار پیشرفت
    let stats = {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0,
        sessions: 0,
        dailyStreak: 0,
        sessionStreak: 0,
        bestStreak: 0,
        lastSession: null,
        lastActive: null,
        dailyGoal: 20
    };

    // اشتباهات
    let mistakes = [];

    /**
     * مقداردهی اولیه
     */
    function init() {
        console.log('📊 Progress Tracker initialized');
        loadStats();
        loadMistakes();
        setTimeout(addProgressBadge, 1000);
    }

    /**
     * ثبت سؤال جدید
     */
    function recordQuestion(mode, isCorrect, word = null) {
        stats.totalQuestions++;
        
        if (isCorrect) {
            stats.correctAnswers++;
            stats.sessionStreak++;
            stats.dailyStreak++;
            
            if (stats.dailyStreak > stats.bestStreak) {
                stats.bestStreak = stats.dailyStreak;
            }
            
            // حذف از اشتباهات اگر درست جواب داد
            if (word) {
                removeMistake(word, mode);
            }
        } else {
            stats.wrongAnswers++;
            stats.sessionStreak = 0;
            stats.dailyStreak = 0;
            
            // اضافه به اشتباهات
            if (word) {
                addMistake(word, mode);
            }
        }
        
        stats.accuracy = stats.totalQuestions > 0 ?
            Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
        
        stats.lastActive = new Date().toISOString();
        saveStats();
        
        console.log(`📝 Question: ${isCorrect ? '✅' : '❌'}, Streak: ${stats.sessionStreak}`);
        
        // بررسی دستاورد
        checkAchievements();
    }

    /**
     * ثبت جلسه جدید
     */
    function recordSession(mode, score, totalQuestions) {
        const sessionStreak = stats.sessionStreak;
        stats.sessionStreak = 0;
        stats.sessions++;
        
        stats.lastSession = {
            date: new Date().toISOString(),
            mode: mode,
            score: score,
            totalQuestions: totalQuestions,
            streakInSession: sessionStreak
        };
        
        saveToHistory(stats.lastSession);
        saveStats();
        
        console.log(`📊 Session: ${mode}, Score: ${score}%`);
        
        // نمایش خلاصه
        setTimeout(() => showSessionSummary(stats.lastSession), 300);
    }

    /**
     * نمایش خلاصه جلسه
     */
    function showSessionSummary(session) {
        if (typeof showCustomModal === 'undefined') {
            console.log('showCustomModal not available');
            return;
        }
        
        const date = new Date(session.date).toLocaleDateString('fa-IR');
        const html = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 50px; margin-bottom: 15px;">📊</div>
                <h3 style="margin-bottom: 20px;">جلسه تکمیل شد</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <p><strong>تاریخ:</strong> ${date}</p>
                    <p><strong>امتیاز:</strong> ${session.score}%</p>
                    <p><strong>سوالات:</strong> ${session.totalQuestions}</p>
                    ${session.streakInSession > 0 ? 
                        `<p><strong>پاسخ متوالی:</strong> ${session.streakInSession} 🔥</p>` : ''}
                </div>
                <p style="color: ${session.score >= 80 ? '#4cd964' : '#ff9500'}; font-weight: bold;">
                    ${session.score >= 80 ? '🎉 عالی! پیشرفت خوبی داشتید.' : '💡 می‌توانید بهتر عمل کنید.'}
                </p>
                <button onclick="closeCustomModal()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    margin-top: 15px;
                    cursor: pointer;">
                    ادامه
                </button>
            </div>
        `;
        
        showCustomModal('نتایج آزمون', html);
    }

    /**
     * اضافه کردن اشتباه
     */
    function addMistake(word, mode) {
        const mistakeId = `${mode}_${word.english}`;
        const existing = mistakes.find(m => m.id === mistakeId);
        
        if (!existing) {
            mistakes.push({
                id: mistakeId,
                word: word,
                mode: mode,
                count: 1,
                lastSeen: new Date().toISOString()
            });
        } else {
            existing.count++;
            existing.lastSeen = new Date().toISOString();
        }
        
        saveMistakes();
        updateBadge();
    }

    /**
     * حذف اشتباه
     */
    function removeMistake(word, mode) {
        const mistakeId = `${mode}_${word.english}`;
        const index = mistakes.findIndex(m => m.id === mistakeId);
        
        if (index !== -1) {
            mistakes.splice(index, 1);
            saveMistakes();
            updateBadge();
        }
    }

    /**
     * دریافت اشتباهات برای مرور
     */
    function getMistakesForReview(limit = 10) {
        return [...mistakes]
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
            .map(m => m.word);
    }

    /**
     * بررسی دستاوردها
     */
    function checkAchievements() {
        if (stats.sessionStreak === 5 && !localStorage.getItem('achievement_5_streak')) {
            showAchievement('نیم‌دهک! ✋', '۵ پاسخ صحیح متوالی در این جلسه!');
            localStorage.setItem('achievement_5_streak', 'true');
        }
        
        if (stats.sessionStreak === 10 && !localStorage.getItem('achievement_10_streak')) {
            showAchievement('دهک طلایی! 🔟', '۱۰ پاسخ صحیح متوالی در این جلسه!');
            localStorage.setItem('achievement_10_streak', 'true');
        }
        
        if (stats.totalQuestions >= 10 && stats.accuracy >= 90 && !localStorage.getItem('achievement_90_accuracy')) {
            showAchievement('استاد دقت! 🎯', 'دقت شما بالای ۹۰٪ است!');
            localStorage.setItem('achievement_90_accuracy', 'true');
        }
    }

    /**
     * نمایش دستاورد
     */
    function showAchievement(title, message) {
        if (typeof showCustomModal === 'undefined') return;
        
        const html = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 60px; margin-bottom: 15px;">🏆</div>
                <h3 style="color: #ff9500;">${title}</h3>
                <p style="font-size: 16px; margin: 15px 0;">${message}</p>
                <button onclick="closeCustomModal()" style="
                    background: #4cd964;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;">
                    عالی!
                </button>
            </div>
        `;
        
        showCustomModal('🎉 دستاورد جدید!', html);
    }

    /**
     * دریافت گزارش پیشرفت
     */
    function getProgressReport() {
        const today = new Date().toDateString();
        const lastActiveDate = stats.lastActive ? 
            new Date(stats.lastActive).toDateString() : null;
        
        return {
            overall: {
                accuracy: stats.accuracy,
                totalQuestions: stats.totalQuestions,
                sessions: stats.sessions
            },
            streaks: {
                daily: stats.dailyStreak,
                session: stats.sessionStreak,
                best: stats.bestStreak
            },
            mistakes: {
                total: mistakes.length
            },
            activity: {
                isActiveToday: lastActiveDate === today,
                lastActive: stats.lastActive
            },
            lastSession: stats.lastSession
        };
    }

    /**
     * نمایش گزارش پیشرفت
     */
    function showProgressReport() {
        if (typeof showCustomModal === 'undefined') {
            alert('سیستم گزارش در دسترس نیست.');
            return;
        }
        
        const report = getProgressReport();
        
        const html = `
            <div style="max-width: 400px;">
                <h3 style="text-align: center; margin-bottom: 20px;">📈 گزارش پیشرفت</h3>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0;">📊 آمار کلی</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666;">دقت</div>
                            <div style="font-size: 18px; font-weight: bold;">${report.overall.accuracy}%</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666;">سوالات</div>
                            <div style="font-size: 18px; font-weight: bold;">${report.overall.totalQuestions}</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666;">جلسات</div>
                            <div style="font-size: 18px; font-weight: bold;">${report.overall.sessions}</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0;">🔥 پاسخ متوالی</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666;">امروز</div>
                            <div style="font-size: 18px; font-weight: bold;">${report.streaks.daily}</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666;">این جلسه</div>
                            <div style="font-size: 18px; font-weight: bold;">${report.streaks.session}</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666;">رکورد</div>
                            <div style="font-size: 18px; font-weight: bold;">${report.streaks.best}</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0;">🎯 اشتباهات</h4>
                    <p>تعداد اشتباهات ذخیره شده: <strong>${report.mistakes.total}</strong></p>
                    ${report.mistakes.total > 0 ? 
                        '<p style="color: #ff9500;">برای مرور اشتباهات، دکمه "مرور اشتباهات" را بزنید.</p>' : 
                        '<p style="color: #4cd964;">🎉 هیچ اشتباهی ندارید!</p>'}
                </div>
                
                ${report.lastSession ? `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0;">📅 آخرین جلسه</h4>
                    <p>امتیاز: <strong>${report.lastSession.score}%</strong></p>
                    <p>سوالات: <strong>${report.lastSession.totalQuestions}</strong></p>
                </div>
                ` : ''}
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button onclick="reviewSmartMistakes()" style="
                        flex: 1;
                        background: #667eea;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;">
                        🎯 مرور اشتباهات
                    </button>
                    <button onclick="closeCustomModal()" style="
                        flex: 1;
                        background: #ccc;
                        color: #333;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;">
                        بستن
                    </button>
                </div>
            </div>
        `;
        
        showCustomModal('گزارش پیشرفت', html);
    }

    /**
     * اضافه کردن badge گزارش
     */
    function addProgressBadge() {
        // فقط در صفحه اصلی اضافه شود
        if (!document.getElementById('home-screen')) return;
        
        // حذف badge قبلی
        const existingBadge = document.getElementById('progress-badge');
        if (existingBadge) existingBadge.remove();
        
        // ایجاد badge جدید
        const badgeHTML = `
            <div id="progress-badge" 
                 style="
                    position: fixed;
                    bottom: 80px;
                    left: 20px;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(
