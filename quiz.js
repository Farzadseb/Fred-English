/**
 * quiz.js
 * موتور آزمون واقعی
 * وابسته به:
 * - words.js
 * - progress.js
 * - screen-controller.js
 * - speech.js (اختیاری)
 */

/* ================= QUIZ STATE ================= */
let Quiz = {
    mode: null,
    questions: [],
    index: 0,
    score: 0,
    total: 10,
    correctAnswer: ''
};

/* ================= START QUIZ ================= */
function startQuiz(mode) {
    if (!Array.isArray(window.words) || words.length === 0) {
        alert('❌ لیست لغات موجود نیست');
        return;
    }

    Quiz.mode = mode;
    Quiz.index = 0;
    Quiz.score = 0;

    Quiz.questions = shuffle([...words]).slice(0, Quiz.total);

    ScreenController.setState('quiz');
    showNotification(getModeName(mode) + ' شروع شد');

    showNextQuestion();
}

/* ================= QUESTION FLOW ================= */
function showNextQuestion() {
    if (Quiz.index >= Quiz.total) {
        finishQuiz();
        return;
    }

    const w = Quiz.questions[Quiz.index];
    let question = '';
    let answer = '';

    switch (Quiz.mode) {
        case 'english-persian':
            question = w.english;
            answer = w.persian;
            speakSafe(w.english);
            break;

        case 'persian-english':
            question = w.persian;
            answer = w.english;
            break;

        case 'word-definition':
            question = w.english;
            answer = w.definition;
            speakSafe(w.english);
            break;

        case 'definition-word':
            question = w.definition;
            answer = w.english;
            break;
    }

    Quiz.correctAnswer = normalize(answer);

    $('questionText').textContent = question;
    $('currentQuestion').textContent = Quiz.index + 1;
    $('quizScore').textContent = Quiz.score;
    $('answerInput').value = '';
    $('feedback').textContent = '';
    $('answerInput').focus();
}

/* ================= CHECK ANSWER ================= */
function checkAnswer() {
    const input = $('answerInput').value;
    if (!input) return;

    const user = normalize(input);
    const correct = Quiz.correctAnswer;

    let isCorrect =
        user === correct ||
        (user.length > 3 && correct.includes(user)) ||
        (correct.length > 3 && user.includes(correct));

    if (isCorrect) {
        Quiz.score++;
        $('feedback').textContent = '✅ درست';
        ProgressTracker.recordQuestion(Quiz.mode, true, Quiz.questions[Quiz.index]);
    } else {
        $('feedback').textContent = `❌ ${correct}`;
        ProgressTracker.recordQuestion(Quiz.mode, false, Quiz.questions[Quiz.index]);
    }

    Quiz.index++;
    setTimeout(showNextQuestion, 1200);
}

/* ================= FINISH QUIZ ================= */
function finishQuiz() {
    const percent = Math.round((Quiz.score / Quiz.total) * 100);

    if (percent > Number(localStorage.getItem('bestScore') || 0)) {
        localStorage.setItem('bestScore', percent);
        if (typeof renderScore === 'function') renderScore();
        showNotification(`🎉 رکورد جدید: ${percent}%`, 4000);
    }

    ProgressTracker.recordSession(Quiz.mode, percent, Quiz.total);

    ScreenController.setState('home');
    showNotification(`آزمون تمام شد — امتیاز: ${percent}%`, 4000);
}

/* ================= HELPERS ================= */
function normalize(text) {
    return text.toString().trim().toLowerCase();
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getModeName(mode) {
    const names = {
        'english-persian': 'English → Persian',
        'persian-english': 'Persian → English',
        'word-definition': 'Word → Definition',
        'definition-word': 'Definition → Word'
    };
    return names[mode] || mode;
}

function speakSafe(text) {
    if (typeof speakText === 'function') {
        speakText(text);
    }
}

/* ================= EVENTS ================= */
document.addEventListener('DOMContentLoaded', () => {

    $('submitAnswer')?.addEventListener('click', checkAnswer);

    $('answerInput')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') checkAnswer();
    });

    $('backHome')?.addEventListener('click', () => {
        ScreenController.setState('home');
    });

    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            startQuiz(card.dataset.mode);
        });
    });

});
