/* ===============================
   Progress Tracker
   مسئول: ذخیره و تحلیل پیشرفت
   بدون وابستگی به UI
================================ */

const ProgressTracker = (() => {

    /* ---------- STATE ---------- */
    let data = {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        sessions: [],
        mistakes: []
    };

    /* ---------- STORAGE ---------- */
    function load() {
        const saved = localStorage.getItem('progress');
        if (saved) {
            try {
                data = JSON.parse(saved);
            } catch {
                console.warn('⚠️ progress corrupted, resetting');
                reset();
            }
        }
    }

    function save() {
        localStorage.setItem('progress', JSON.stringify(data));
    }

    function reset() {
        data = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            sessions: [],
            mistakes: []
        };
        save();
    }

    /* ---------- RECORDING ---------- */
    function recordQuestion(mode, isCorrect, word) {
        data.totalQuestions++;

        if (isCorrect) {
            data.correctAnswers++;
        } else {
            data.wrongAnswers++;
            data.mistakes.push({
                mode,
                word,
                time: Date.now()
            });

            // فقط 50 اشتباه آخر
            if (data.mistakes.length > 50) {
                data.mistakes.shift();
            }
        }

        save();
    }

    function recordSession(mode, score, totalQuestions) {
        data.sessions.push({
            mode,
            score,
            totalQuestions,
            date: new Date().toLocaleDateString('fa-IR')
        });

        // فقط 20 جلسه آخر
        if (data.sessions.length > 20) {
            data.sessions.shift();
        }

        save();
    }

    /* ---------- REPORT ---------- */
    function getStats() {
        const accuracy = data.totalQuestions
            ? Math.round((data.correctAnswers / data.totalQuestions) * 100)
            : 0;

        return {
            totalQuestions: data.totalQuestions,
            correctAnswers: data.correctAnswers,
            wrongAnswers: data.wrongAnswers,
            accuracy,
            sessions: data.sessions.length,
            mistakes: data.mistakes.length
        };
    }

    function getProgressReport() {
        return {
            stats: getStats(),
            recentSessions: [...data.sessions].slice(-5).reverse(),
            mistakes: [...data.mistakes].slice(-10).reverse()
        };
    }

    /* ---------- REVIEW ---------- */
    function reviewMistakes() {
        if (!data.mistakes.length) {
            alert('🎉 هیچ اشتباهی برای مرور نداری');
            return;
        }

        alert(`🔁 ${data.mistakes.length} اشتباه برای مرور داری`);
        // موتور آزمون از app.js صدا زده می‌شود
    }

    /* ---------- INIT ---------- */
    function init() {
        load();
        console.log('📊 ProgressTracker ready', getStats());
    }

    /* ---------- API ---------- */
    return {
        init,
        recordQuestion,
        recordSession,
        getStats,
        getProgressReport,
        reviewMistakes,
        reset
    };

})();

/* ---------- AUTO INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    ProgressTracker.init();
});
