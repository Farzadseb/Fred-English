/* =======================
   QUIZ ENGINE
   سازگار با:
   index.html
   app.js
   words.js
   progress.js
   speech.js
======================= */

let Quiz = {
    mode: null,
    questions: [],
    index: 0,
    score: 0,
    total: 10,
    correctAnswer: ''
};

/* =======================
   START QUIZ
======================= */
function startQuiz(mode) {
    if (!window.words || !words.length) {
        showNotification('لغات بارگذاری نشدند');
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
    showNextQuestion();
}

/* =======================
   NEXT QUESTION
======================= */
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
            speakText(w.english);
            break;

        case 'persian-english':
            question = w.persian;
            answer = w.english;
            break;

        case 'word-definition':
            question = w.english;
            answer = w.definition;
            speakText(w.english);
            break;

        case 'definition-word':
            question = w.definition;
            answer = w.english;
            break;
    }

    Quiz.correctAnswer = answer.trim().toLowerCase();

    document.getElementById('questionText').textContent = question;
    document.getElementById('answerInput').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('answerInput').focus();

    updateQuizHeader();
}

/* =======================
   CHECK ANSWER
======================= */
function checkAnswer() {
    const input = document.getElementById('answerInput');
    const user = input.value.trim().toLowerCase();

    if (!user) return;

    const ok =
        user === Quiz.correctAnswer ||
        (user.length > 3 &&
            (Quiz.correctAnswer.includes(user) ||
             user.includes(Quiz.correctAnswer)));

    const feedback = document.getElementById('feedback');

    if (ok) {
        Quiz.score++;
        feedback.textContent = '✅ درست';
        ProgressTracker.recordQuestion(Quiz.mode, true, Quiz.questions[Quiz.index]);
    } else {
        feedback.textContent = `❌ پاسخ صحیح: ${Quiz.correctAnswer}`;
        ProgressTracker.recordQuestion(Quiz.mode, false, Quiz.questions[Quiz.index]);
    }

    Quiz.index++;
    updateQuizHeader();

    setTimeout(showNextQuestion, 1200);
}

/* =======================
   FINISH QUIZ
======================= */
function finishQuiz() {
    const percent = Math.round((Quiz.score / Quiz.total) * 100);

    // best score
    if (percent > App.bestScore) {
        App.bestScore = percent;
        localStorage.setItem('bestScore', percent);
        renderScore();
        showNotification(`🎉 رکورد جدید: ${percent}%`, 3000);
    } else {
        showNotification(`امتیاز: ${percent}%`, 3000);
    }

    ProgressTracker.recordSession(Quiz.mode, percent, Quiz.total);

    setTimeout(() => {
        switchView('home');
    }, 800);
}

/* =======================
   HEADER UPDATE
======================= */
function updateQuizHeader() {
    document.getElementById('currentQuestion').textContent = Quiz.index + 1;
    document.getElementById('quizScore').textContent = Quiz.score;
}

/* =======================
   EVENTS
======================= */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitAnswer')
        ?.addEventListener('click', checkAnswer);

    document.getElementById('answerInput')
        ?.addEventListener('keydown', e => {
            if (e.key === 'Enter') checkAnswer();
        });

    document.getElementById('backHome')
        ?.addEventListener('click', () => {
            switchView('home');
        });

    console.log('✅ quiz.js loaded');
});
