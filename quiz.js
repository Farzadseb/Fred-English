/* =========================
   QUIZ ENGINE
========================= */

let Quiz = {
    mode: null,
    questions: [],
    index: 0,
    score: 0,
    correctAnswer: '',
    total: 10
};

/* =========================
   START QUIZ
========================= */
function startQuiz(mode) {
    if (!window.words || !words.length) {
        alert('لغات بارگذاری نشده‌اند');
        return;
    }

    Quiz.mode = mode;
    Quiz.index = 0;
    Quiz.score = 0;

    // shuffle words
    Quiz.questions = [...words]
        .sort(() => Math.random() - 0.5)
        .slice(0, Quiz.total);

    updateQuizHeader();
    showQuestion();
}

/* =========================
   QUESTION LOGIC
========================= */
function showQuestion() {

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
    $('answerInput').value = '';
    $('feedback').textContent = '';
    $('answerInput').focus();

    updateQuizHeader();
}

/* =========================
   CHECK ANSWER
========================= */
function checkAnswer() {
    const user = normalize($('answerInput').value);
    if (!user) return;

    const correct = Quiz.correctAnswer;
    let ok = false;

    if (user === correct) ok = true;
    else if (user.length > 3 && correct.includes(user)) ok = true;

    if (ok) {
        Quiz.score++;
        $('feedback').textContent = '✅ درست';
        ProgressTracker?.recordQuestion(Quiz.mode, true, Quiz.questions[Quiz.index]);
    } else {
        $('feedback').textContent = `❌ ${Quiz.correctAnswer}`;
        ProgressTracker?.recordQuestion(Quiz.mode, false, Quiz.questions[Quiz.index]);
    }

    Quiz.index++;
    setTimeout(showQuestion, 1200);
}

/* =========================
   FINISH QUIZ
========================= */
function finishQuiz() {
    const percent = Math.round((Quiz.score / Quiz.total) * 100);

    if (percent > App.bestScore) {
        App.bestScore = percent;
        localStorage.setItem('bestScore', percent);
        renderScore();
        showNotification(`🎉 رکورد جدید: ${percent}%`, 3000);
    } else {
        showNotification(`امتیاز: ${percent}%`, 3000);
    }

    ProgressTracker?.recordSession(Quiz.mode, percent, Quiz.total);
    switchView('home');
}

/* =========================
   UI HELPERS
========================= */
function updateQuizHeader() {
    $('currentQuestion').textContent = Quiz.index + 1;
    $('quizScore').textContent = Quiz.score;
}

function normalize(text) {
    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/ي/g, 'ی')
        .replace(/ك/g, 'ک');
}

/* =========================
   SPEECH SAFE
========================= */
function speakSafe(text) {
    if (window.speakText && !window.isMuted()) {
        speakText(text);
    }
}

/* =========================
   EVENTS
========================= */
document.addEventListener('DOMContentLoaded', () => {

    $('submitAnswer')?.addEventListener('click', checkAnswer);

    $('answerInput')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') checkAnswer();
    });

    $('backHome')?.addEventListener('click', () => {
        switchView('home');
    });

    console.log('✅ quiz.js loaded cleanly');
});

/* expose */
window.startQuiz = startQuiz;
