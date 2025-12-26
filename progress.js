// Progress Tracker System
const ProgressTracker = (function() {
    let stats = {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0,
        sessions: [],
        mistakes: []
    };

    // بارگذاری از localStorage
    function loadFromStorage() {
        const saved = localStorage.getItem('progressTracker');
        if (saved) {
            try {
                stats = JSON.parse(saved);
                console.log('📊 Progress loaded from storage');
            } catch (e) {
                console.error('Error loading progress:', e);
            }
        }
    }

    // ذخیره در localStorage
    function saveToStorage() {
        try {
            localStorage.setItem('progressTracker', JSON.stringify(stats));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    }

    // ثبت سوال
    function recordQuestion(mode, isCorrect, word) {
        stats.totalQuestions++;
        
        if (isCorrect) {
            stats.correctAnswers++;
            console.log(`📝 Question recorded: ✅, Streak: ${stats.correctAnswers}`);
        } else {
            stats.wrongAnswers++;
            
            // ذخیره اشتباه
            const mistake = {
                mode: mode,
                word: word,
                timestamp: new Date().toISOString(),
                question: word.english || word.persian,
                correctAnswer: mode.includes('en') ? word.persian : word.english
            };
            
            stats.mistakes.push(mistake);
            // فقط ۵۰ اشتباه اخیر را نگه دار
            if (stats.mistakes.length > 50) {
                stats.mistakes = stats.mistakes.slice(-50);
            }
            
            console.log(`📝 Question recorded: ❌, Mistakes: ${stats.mistakes.length}`);
        }
        
        // محاسبه دقت
        stats.accuracy = stats.totalQuestions > 0 
            ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
            : 0;
        
        saveToStorage();
    }

    // ثبت جلسه آزمون
    function recordSession(mode, score, totalQuestions) {
        const session = {
            mode: mode,
            score: score,
            totalQuestions: totalQuestions,
            date: new Date().toLocaleDateString('fa-IR'),
            timestamp: new Date().toISOString()
        };
        
        stats.sessions.push(session);
        
        // فقط ۲۰ جلسه اخیر را نگه دار
        if (stats.sessions.length > 20) {
            stats.sessions = stats.sessions.slice(-20);
        }
        
        console.log(`📊 Session recorded: ${mode}, Score: ${score}%`);
        saveToStorage();
    }

    // دریافت آمار
    function getStats() {
        return {
            totalQuestions: stats.totalQuestions,
            correctAnswers: stats.correctAnswers,
            wrongAnswers: stats.wrongAnswers,
            accuracy: stats.accuracy,
            totalSessions: stats.sessions.length,
            recentMistakes: stats.mistakes.length
        };
    }

    // دریافت گزارش
    function getProgressReport() {
        return {
            overall: getStats(),
            recentSessions: stats.sessions.slice(-5).reverse(),
            mistakes: {
                total: stats.mistakes.length,
                active: stats.mistakes.length,
                recent: stats.mistakes.slice(-10).reverse()
            }
        };
    }

    // مرور اشتباهات
    function reviewMistakes() {
        if (stats.mistakes.length === 0) {
            alert("🎉 هیچ اشتباهی برای مرور وجود ندارد!");
            return;
        }
        
        console.log(`🔁 Reviewing ${stats.mistakes.length} mistakes...`);
        
        // اینجا می‌توانی آزمون اشتباهات را شروع کنی
        alert(`شما ${stats.mistakes.length} اشتباه برای مرور دارید.\nآزمون مرور اشتباهات شروع خواهد شد.`);
        
        // شروع آزمون با اشتباهات
        if (typeof startQuiz === 'function') {
            // می‌توانی حالت خاصی برای مرور اشتباهات تعریف کنی
            startQuiz('mistakes-review');
        }
    }

    // مقداردهی اولیه
    function init() {
        loadFromStorage();
        console.log('📊 Progress Tracker initialized');
        console.log('📈 Stats:', getStats());
    }

    // API عمومی
    return {
        init,
        recordQuestion,
        recordSession,
        getStats,
        getProgressReport,
        reviewMistakes
    };
})();

// اتوماتیک init کن
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            ProgressTracker.init();
        }, 500);
    });
}

console.log('📊 Progress Tracker loaded');
