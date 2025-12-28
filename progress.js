/**
 * Progress Tracker - سیستم ردیابی پیشرفت یادگیری
 * نسخه 2.0 - تحلیل پیشرفته و گزارش‌گیری
 */

const ProgressTracker = (() => {
    // ساختار داده‌های پیشرفت
    let data = {
        // آمار کلی
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        
        // جلسات
        sessions: [],
        
        // اشتباهات
        mistakes: [],
        
        // رکوردها
        records: {
            bestScore: 0,
            bestStreak: 0,
            fastestQuiz: null,
            mostQuestionsDay: 0
        },
        
        // استراتژی‌های یادگیری
        learningStrategy: {
            spacedRepetition: true,
            focusOnWeaknesses: true,
            dailyGoal: 50
        },
        
        // تحلیل پیشرفت
        analytics: {
            dailyProgress: {},
            weeklyProgress: {},
            monthlyProgress: {},
            modePerformance: {},
            categoryPerformance: {}
        },
        
        // متادیتا
        metadata: {
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            version: '2.0'
        }
    };

    /**
     * مقداردهی اولیه
     */
    function init() {
        loadData();
        migrateOldData();
        setupAutoSave();
        analyzeProgress();
        
        console.log('📊 Progress Tracker initialized');
        console.log(`📈 Total questions: ${data.totalQuestions}`);
        console.log(`🎯 Accuracy: ${getAccuracy()}%`);
        
        return true;
    }

    /**
     * بارگذاری داده‌ها از localStorage
     */
    function loadData() {
        try {
            const saved = localStorage.getItem('progressData');
            if (saved) {
                const parsed = JSON.parse(saved);
                
                // Merge با داده‌های پیش‌فرض
                data = {
                    ...data,
                    ...parsed,
                    metadata: {
                        ...data.metadata,
                        ...(parsed.metadata || {}),
                        lastUpdated: new Date().toISOString()
                    }
                };
                
                console.log('📂 Progress data loaded');
            }
        } catch (error) {
            console.error('Error loading progress data:', error);
            resetData();
        }
    }

    /**
     * ذخیره داده‌ها
     */
    function saveData() {
        try {
            data.metadata.lastUpdated = new Date().toISOString();
            localStorage.setItem('progressData', JSON.stringify(data));
            console.log('💾 Progress data saved');
        } catch (error) {
            console.error('Error saving progress data:', error);
        }
    }

    /**
     * تنظیم auto-save
     */
    function setupAutoSave() {
        // ذخیره خودکار هر 30 ثانیه
        setInterval(saveData, 30000);
        
        // ذخیره هنگام خروج از صفحه
        window.addEventListener('beforeunload', saveData);
    }

    /**
     * مهاجرت داده‌های قدیمی
     */
    function migrateOldData() {
        // مهاجرت از نسخه 1.0
        const oldProgress = localStorage.getItem('progress');
        if (oldProgress) {
            try {
                const oldData = JSON.parse(oldProgress);
                
                if (oldData.total) {
                    data.totalQuestions = oldData.total;
                    data.correctAnswers = oldData.correct || 0;
                    data.wrongAnswers = oldData.wrong || 0;
                    
                    // تبدیل اشتباهات قدیمی
                    if (oldData.mistakes && Array.isArray(oldData.mistakes)) {
                        data.mistakes = oldData.mistakes.map(mistake => ({
                            ...mistake,
                            reviewed: false,
                            reviewCount: 0,
                            mastered: false
                        }));
                    }
                    
                    // تبدیل جلسات قدیمی
                    if (oldData.sessions && Array.isArray(oldData.sessions)) {
                        data.sessions = oldData.sessions.map(session => ({
                            ...session,
                            timestamp: new Date().toISOString(),
                            duration: 0,
                            questions: []
                        }));
                    }
                    
                    console.log('🔄 Migrated old progress data');
                    localStorage.removeItem('progress');
                }
            } catch (error) {
                console.error('Error migrating old data:', error);
            }
        }
    }

    /**
     * ثبت سؤال
     */
    function recordQuestion(mode, isCorrect, word, timeSpent = 0) {
        // افزایش آمار
        data.totalQuestions++;
        
        if (isCorrect) {
            data.correctAnswers++;
            
            // افزایش mastery لغت
            if (word) {
                word.reviewCount = (word.reviewCount || 0) + 1;
                word.mastery = Math.min(100, (word.mastery || 0) + 10);
                
                // علامت‌گذاری به عنوان یادگرفته شده
                if (word.mastery >= 80 && !word.learnedDate) {
                    word.learnedDate = new Date().toISOString();
                }
            }
        } else {
            data.wrongAnswers++;
            
            // ثبت اشتباه
            if (word) {
                const existingMistake = data.mistakes.find(m => 
                    m.word.english === word.english && m.mode === mode
                );
                
                if (existingMistake) {
                    existingMistake.count++;
                    existingMistake.lastAttempt = new Date().toISOString();
                    existingMistake.reviewed = false;
                } else {
                    data.mistakes.push({
                        id: generateId(),
                        word: { ...word },
                        mode: mode,
                        count: 1,
                        date: new Date().toISOString(),
                        lastAttempt: new Date().toISOString(),
                        reviewed: false,
                        reviewCount: 0,
                        mastered: false
                    });
                }
                
                // کاهش mastery
                word.mastery = Math.max(0, (word.mastery || 0) - 15);
            }
        }
        
        // تحلیل عملکرد
        updateAnalytics(mode, isCorrect, timeSpent);
        
        // بررسی رکوردها
        checkRecords();
        
        return true;
    }

    /**
     * ثبت جلسه
     */
    function recordSession(mode, score, totalQuestions, duration = 0) {
        const session = {
            id: generateId(),
            mode: mode,
            score: score,
            totalQuestions: totalQuestions,
            date: new Date().toLocaleDateString('fa-IR'),
            timestamp: new Date().toISOString(),
            duration: duration,
            accuracy: Math.round((score / totalQuestions) * 100)
        };
        
        data.sessions.unshift(session);
        
        // حفظ فقط 100 جلسه آخر
        if (data.sessions.length > 100) {
            data.sessions = data.sessions.slice(0, 100);
        }
        
        // به‌روزرسانی رکورد بهترین امتیاز
        if (score > data.records.bestScore) {
            data.records.bestScore = score;
            
            // نمایش دستاورد
            if (score >= 90) {
                showAchievement('امتیاز عالی!', `به امتیاز ${score}% رسیدی! 🎯`);
            }
        }
        
        // تحلیل روزانه
        updateDailyProgress(totalQuestions, score);
        
        // تحلیل عملکرد حالت
        updateModePerformance(mode, score);
        
        return session.id;
    }

    /**
     * تحلیل پیشرفت
     */
    function analyzeProgress() {
        const today = new Date().toLocaleDateString('fa-IR');
        
        // تحلیل روزانه
        if (!data.analytics.dailyProgress[today]) {
            data.analytics.dailyProgress[today] = {
                questions: 0,
                correct: 0,
                timeSpent: 0,
                sessions: 0
            };
        }
        
        // تحلیل هفتگی
        const weekStart = getWeekStartDate();
        if (!data.analytics.weeklyProgress[weekStart]) {
            data.analytics.weeklyProgress[weekStart] = {
                questions: 0,
                correct: 0,
                daysActive: 0
            };
        }
        
        // تحلیل ماهانه
        const monthStart = getMonthStartDate();
        if (!data.analytics.monthlyProgress[monthStart]) {
            data.analytics.monthlyProgress[monthStart] = {
                questions: 0,
                correct: 0,
                weeklyAverage: 0
            };
        }
        
        // تحلیل عملکرد حالت‌ها
        const modes = ['english-persian', 'persian-english', 'word-definition', 'definition-word'];
        modes.forEach(mode => {
            if (!data.analytics.modePerformance[mode]) {
                data.analytics.modePerformance[mode] = {
                    totalQuestions: 0,
                    correctAnswers: 0,
                    averageScore: 0,
                    lastScore: 0
                };
            }
        });
        
        // تحلیل عملکرد دسته‌بندی‌ها
        const categories = ['آسان', 'متوسط', 'دشوار', 'احساسات', 'رنگ‌ها', 'صفات', 'قید', 'عمومی'];
        categories.forEach(category => {
            if (!data.analytics.categoryPerformance[category]) {
                data.analytics.categoryPerformance[category] = {
                    totalQuestions: 0,
                    correctAnswers: 0,
                    mastery: 0
                };
            }
        });
    }

    /**
     * به‌روزرسانی تحلیل‌ها
     */
    function updateAnalytics(mode, isCorrect, timeSpent) {
        const today = new Date().toLocaleDateString('fa-IR');
        
        // روزانه
        if (data.analytics.dailyProgress[today]) {
            data.analytics.dailyProgress[today].questions++;
            if (isCorrect) data.analytics.dailyProgress[today].correct++;
            data.analytics.dailyProgress[today].timeSpent += timeSpent;
        }
        
        // عملکرد حالت
        if (data.analytics.modePerformance[mode]) {
            data.analytics.modePerformance[mode].totalQuestions++;
            if (isCorrect) data.analytics.modePerformance[mode].correctAnswers++;
            
            // محاسبه میانگین
            const perf = data.analytics.modePerformance[mode];
            perf.averageScore = Math.round(
                (perf.correctAnswers / perf.totalQuestions) * 100
            );
        }
    }

    /**
     * به‌روزرسانی پیشرفت روزانه
     */
    function updateDailyProgress(questions, correct) {
        const today = new Date().toLocaleDateString('fa-IR');
        
        if (!data.analytics.dailyProgress[today]) {
            data.analytics.dailyProgress[today] = {
                questions: 0,
                correct: 0,
                timeSpent: 0,
                sessions: 0
            };
        }
        
        data.analytics.dailyProgress[today].questions += questions;
        data.analytics.dailyProgress[today].correct += correct;
        data.analytics.dailyProgress[today].sessions++;
        
        // بررسی دستیابی به هدف روزانه
        if (data.analytics.dailyProgress[today].questions >= data.learningStrategy.dailyGoal) {
            showAchievement('🎯 هدف روزانه', 'تبریک! به هدف امروزت رسیدی!');
        }
    }

    /**
     * به‌روزرسانی عملکرد حالت
     */
    function updateModePerformance(mode, score) {
        if (!data.analytics.modePerformance[mode]) {
            data.analytics.modePerformance[mode] = {
                totalQuestions: 0,
                correctAnswers: 0,
                averageScore: 0,
                lastScore: score
            };
        }
        
        const perf = data.analytics.modePerformance[mode];
        perf.lastScore = score;
        
        // محاسبه میانگین جدید
        const totalSessions = data.sessions.filter(s => s.mode === mode).length;
        const totalScore = data.sessions
            .filter(s => s.mode === mode)
            .reduce((sum, s) => sum + s.score, 0);
        
        if (totalSessions > 0) {
            perf.averageScore = Math.round(totalScore / totalSessions);
        }
    }

    /**
     * بررسی و به‌روزرسانی رکوردها
     */
    function checkRecords() {
        // بهترین streak
        const currentStreak = calculateCurrentStreak();
        if (currentStreak > data.records.bestStreak) {
            data.records.bestStreak = currentStreak;
            
            if (currentStreak >= 7) {
                showAchievement('🔥 هفته طلایی', '۷ روز متوالی تمرین کردی!');
            }
        }
        
        // روز پر سؤال
        const todayQuestions = getTodayQuestions();
        if (todayQuestions > data.records.mostQuestionsDay) {
            data.records.mostQuestionsDay = todayQuestions;
        }
    }

    /**
     * محاسبه streak فعلی
     */
    function calculateCurrentStreak() {
        const dates = Object.keys(data.analytics.dailyProgress)
            .sort((a, b) => new Date(b) - new Date(a));
        
        if (dates.length === 0) return 0;
        
        let streak = 1;
        let currentDate = new Date();
        
        for (let i = 0; i < dates.length; i++) {
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            
            const prevDateStr = prevDate.toLocaleDateString('fa-IR');
            
            if (dates.includes(prevDateStr)) {
                streak++;
                currentDate = prevDate;
            } else {
                break;
            }
        }
        
        return streak;
    }

    /**
     * دریافت سؤالات امروز
     */
    function getTodayQuestions() {
        const today = new Date().toLocaleDateString('fa-IR');
        return data.analytics.dailyProgress[today]?.questions || 0;
    }

    /**
     * مرور اشتباهات
     */
    function reviewMistakes() {
        const activeMistakes = data.mistakes.filter(m => !m.mastered);
        
        if (activeMistakes.length === 0) {
            if (typeof ModalHelper !== 'undefined') {
                ModalHelper.showSuccess(
                    '🎉 بدون اشتباه',
                    'هیچ اشتباه فعالی برای مرور ندارید!'
                );
            }
            return false;
        }
        
        // انتخاب ۱۰ اشتباه با اولویت بیشتر
        const reviewMistakes = activeMistakes
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        
        // ایجاد آرایه سؤالات برای مرور
        const reviewQuestions = reviewMistakes.map(mistake => ({
            word: mistake.word,
            mode: mistake.mode,
            isMistake: true,
            mistakeId: mistake.id
        }));
        
        // ذخیره برای استفاده در app.js
        window.currentReviewQuiz = {
            index: 0,
            score: 0,
            questions: reviewQuestions,
            isReview: true
        };
        
        // علامت‌گذاری اشتباهات به عنوان در حال مرور
        reviewMistakes.forEach(mistake => {
            mistake.reviewed = true;
            mistake.reviewCount = (mistake.reviewCount || 0) + 1;
        });
        
        // نمایش اطلاعات مرور
        if (typeof ModalHelper !== 'undefined') {
            ModalHelper.showInfo(
                'مرور اشتباهات',
                `${reviewMistakes.length} اشتباه برای مرور انتخاب شدند.`
            );
        }
        
        return true;
    }

    /**
     * علامت‌گذاری اشتباه به عنوان اصلاح شده
     */
    function markMistakeAsMastered(mistakeId) {
        const mistake = data.mistakes.find(m => m.id === mistakeId);
        if (mistake) {
            mistake.mastered = true;
            mistake.reviewed = true;
            
            // افزایش mastery لغت مربوطه
            const word = window.words?.find(w => w.english === mistake.word.english);
            if (word) {
                word.mastery = Math.min(100, (word.mastery || 0) + 30);
            }
            
            return true;
        }
        return false;
    }

    /**
     * دریافت آمار
     */
    function getStats() {
        const accuracy = getAccuracy();
        const streak = calculateCurrentStreak();
        const todayStats = getTodayStats();
        
        return {
            totalQuestions: data.totalQuestions,
            correctAnswers: data.correctAnswers,
            wrongAnswers: data.wrongAnswers,
            accuracy: accuracy,
            totalSessions: data.sessions.length,
            activeMistakes: data.mistakes.filter(m => !m.mastered).length,
            totalMistakes: data.mistakes.length,
            streak: streak,
            bestScore: data.records.bestScore,
            bestStreak: data.records.bestStreak,
            todayQuestions: todayStats.questions,
            todayCorrect: todayStats.correct,
            todayAccuracy: todayStats.accuracy,
            dailyGoal: data.learningStrategy.dailyGoal,
            goalProgress: Math.min(100, Math.round((todayStats.questions / data.learningStrategy.dailyGoal) * 100))
        };
    }

    /**
     * دریافت آمار امروز
     */
    function getTodayStats() {
        const today = new Date().toLocaleDateString('fa-IR');
        const todayData = data.analytics.dailyProgress[today] || { questions: 0, correct: 0 };
        
        return {
            questions: todayData.questions,
            correct: todayData.correct,
            accuracy: todayData.questions > 0 ? 
                Math.round((todayData.correct / todayData.questions) * 100) : 0,
            sessions: todayData.sessions || 0,
            timeSpent: todayData.timeSpent || 0
        };
    }

    /**
     * دریافت گزارش پیشرفت
     */
    function getProgressReport() {
        const stats = getStats();
        const today = new Date();
        
        // جلسات اخیر (۱۰ تای آخر)
        const recentSessions = data.sessions.slice(0, 10);
        
        // عملکرد حالت‌ها
        const modePerformance = Object.entries(data.analytics.modePerformance)
            .map(([mode, perf]) => ({
                mode: mode,
                averageScore: perf.averageScore,
                totalQuestions: perf.totalQuestions
            }))
            .sort((a, b) => b.averageScore - a.averageScore);
        
        // عملکرد دسته‌بندی‌ها
        const categoryPerformance = Object.entries(data.analytics.categoryPerformance)
            .map(([category, perf]) => ({
                category: category,
                mastery: perf.mastery,
                totalQuestions: perf.totalQuestions
            }))
            .sort((a, b) => b.mastery - a.mastery);
        
        // پیشرفت هفتگی
        const weeklyProgress = Object.entries(data.analytics.weeklyProgress)
            .slice(0, 4)
            .map(([week, data]) => ({
                week: week,
                questions: data.questions,
                accuracy: data.questions > 0 ? 
                    Math.round((data.correct / data.questions) * 100) : 0
            }));
        
        // اشتباهات رایج
        const commonMistakes = [...data.mistakes]
            .filter(m => !m.mastered)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map(m => ({
                word: m.word.english,
                persian: m.word.persian,
                count: m.count,
                mode: m.mode
            }));
        
        // پیشنهادات یادگیری
        const learningSuggestions = generateLearningSuggestions();
        
        return {
            stats: stats,
            recentSessions: recentSessions,
            modePerformance: modePerformance,
            categoryPerformance: categoryPerformance,
            weeklyProgress: weeklyProgress,
            commonMistakes: commonMistakes,
            learningSuggestions: learningSuggestions,
            generatedAt: today.toISOString()
        };
    }

    /**
     * تولید پیشنهادات یادگیری
     */
    function generateLearningSuggestions() {
        const suggestions = [];
        const stats = getStats();
        
        // پیشنهاد بر اساس دقت
        if (stats.accuracy < 50) {
            suggestions.push({
                type: 'accuracy',
                title: 'نیاز به تمرین بیشتر',
                message: 'دقت شما زیر ۵۰٪ است. پیشنهاد می‌کنیم روی لغات ساده‌تر تمرکز کنید.',
                priority: 'high'
            });
        } else if (stats.accuracy < 70) {
            suggestions.push({
                type: 'accuracy',
                title: 'در حال پیشرفت',
                message: 'دقت شما خوب است، اما می‌تواند بهتر شود.',
                priority: 'medium'
            });
        }
        
        // پیشنهاد بر اساس اشتباهات
        if (stats.activeMistakes > 10) {
            suggestions.push({
                type: 'mistakes',
                title: 'مرور اشتباهات',
                message: `شما ${stats.activeMistakes} اشتباه فعال دارید. پیشنهاد می‌کنیم آنها را مرور کنید.`,
                priority: 'high'
            });
        }
        
        // پیشنهاد بر اساس streak
        if (stats.streak === 0) {
            suggestions.push({
                type: 'consistency',
                title: 'شروع مجدد',
                message: 'امروز هنوز تمرین نکرده‌اید. حتی ۵ دقیقه هم کافی است!',
                priority: 'high'
            });
        } else if (stats.streak >= 3) {
            suggestions.push({
                type: 'consistency',
                title: 'آفرین!',
                message: `${stats.streak} روز متوالی تمرین کرده‌اید. ادامه دهید!`,
                priority: 'low'
            });
        }
        
        // پیشنهاد بر اساس هدف روزانه
        if (stats.goalProgress < 50) {
            suggestions.push({
                type: 'dailyGoal',
                title: 'هدف روزانه',
                message: `${stats.goalProgress}٪ از هدف امروز را انجام داده‌اید.`,
                priority: stats.goalProgress < 25 ? 'high' : 'medium'
            });
        }
        
        return suggestions;
    }

    /**
     * پاک‌سازی داده‌ها
     */
    function clearData() {
        if (typeof ModalHelper !== 'undefined') {
            ModalHelper.showConfirm(
                '⚠️ پاک‌سازی داده‌ها',
                'آیا مطمئن هستید؟ تمام داده‌های پیشرفت پاک می‌شوند. این عمل قابل بازگشت نیست.',
                () => {
                    resetData();
                    saveData();
                    
                    if (typeof ModalHelper !== 'undefined') {
                        ModalHelper.showSuccess(
                            '✅ پاک‌سازی انجام شد',
                            'تمام داده‌های پیشرفت پاک شدند.'
                        );
                    }
                    
                    // رفرش صفحه
                    setTimeout(() => location.reload(), 1500);
                }
            );
        } else {
            resetData();
            saveData();
        }
    }

    /**
     * بازنشانی داده‌ها
     */
    function resetData() {
        data = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            sessions: [],
            mistakes: [],
            records: {
                bestScore: 0,
                bestStreak: 0,
                fastestQuiz: null,
                mostQuestionsDay: 0
            },
            learningStrategy: {
                spacedRepetition: true,
                focusOnWeaknesses: true,
                dailyGoal: 50
            },
            analytics: {
                dailyProgress: {},
                weeklyProgress: {},
                monthlyProgress: {},
                modePerformance: {},
                categoryPerformance: {}
            },
            metadata: {
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                version: '2.0'
            }
        };
    }

    /**
     * دریافت دقت کلی
     */
    function getAccuracy() {
        if (data.totalQuestions === 0) return 0;
        return Math.round((data.correctAnswers / data.totalQuestions) * 100);
    }

    /**
     * نمایش دستاورد
     */
    function showAchievement(title, message) {
        if (typeof ModalHelper !== 'undefined') {
            ModalHelper.showAchievement(title, message);
        }
    }

    /**
     * تولید ID یکتا
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * دریافت تاریخ شروع هفته
     */
    function getWeekStartDate() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(now.setDate(diff));
        return weekStart.toLocaleDateString('fa-IR');
    }

    /**
     * دریافت تاریخ شروع ماه
     */
    function getMonthStartDate() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1)
            .toLocaleDateString('fa-IR');
    }

    // API عمومی
    return {
        init,
        recordQuestion,
        recordSession,
        reviewMistakes,
        markMistakeAsMastered,
        getStats,
        getProgressReport,
        clearData,
        getAccuracy,
        calculateCurrentStreak,
        
        // برای دسترسی مستقیم (فقط توسعه)
        _getData: () => data,
        _setData: (newData) => { data = newData; saveData(); }
    };
})();

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => ProgressTracker.init(), 1000);
});

// در دسترس قرار دادن در window
window.ProgressTracker = ProgressTracker;
