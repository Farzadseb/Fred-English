// =======================
// QUIZ ENGINE (TEST MODE)
// =======================

let quiz = {
    mode: null,
    index: 0,
    score: 0,
    questions: [],
    current: null
};

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function startQuiz(mode) {
    if (!window.words || !words.length) {
        alert('لغات لود نشده‌اند');
        return;
    }

    quiz.mode = mode;
    quiz.index = 0;
    quiz.score = 0;

    quiz.questions = shuffle([...words]).slice(0, 10);

    renderQuestion();
}

function renderQuestion() {
    if (quiz.index >= quiz.questions.length) {
        finishQuiz();
        return;
    }

    const w = quiz.questions[quiz.index];
    quiz.current = w;

    let question = '';
    let correct = '';

    if (quiz.mode === 'english-persian') {
        question = w.english;
        correct = w.persian;
        speak(w.english);
    }

    if (quiz.mode === 'persian-english') {
        question = w.persian;
        correct = w.english;
    }

    if (quiz.mode === 'word-definition') {
        question = w.english;
        correct = w.definition;
        speak(w.english);
    }

    if (quiz.mode === 'definition-word') {
        question = w.definition;
        correct = w.english;
    }

    quiz.correctAnswer = correct;

    document.getElementById('questionText').textContent = question;
    document.getElementById('currentQuestion').textContent = quiz.index + 1;
    document.getElementById('quizScore').textContent = quiz.score;

    renderOptions(correct, w);
}

function renderOptions(correct, word) {
    const container = document.getElementById('feedback');
    container.innerHTML = '';

    let options = [];

    if (quiz.mode.includes('definition')) {
        options = shuffle(
            words.map(w => w.definition)
        ).slice(0, 3);
    } else if (quiz.mode.includes('persian')) {
        options = shuffle(
            words.map(w => w.persian)
        ).slice(0, 3);
    } else {
        options = shuffle(
            words.map(w => w.english)
        ).slice(0, 3);
    }

    options.push(correct);
    options = shuffle(options);

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn light';
        btn.textContent = opt;

        btn.onclick = () => checkAnswer(opt);

        container.appendChild(btn);
    });
}

function checkAnswer(answer) {
    if (answer === quiz.correctAnswer) {
        quiz.score++;
        showNotification('درست ✅');
    } else {
        showNotification('غلط ❌');
    }

    quiz.index++;
    setTimeout(renderQuestion, 600);
}

function finishQuiz() {
    const percent = Math.round((quiz.score / quiz.questions.length) * 100);

    const best = Number(localStorage.getItem('bestScore') || 0);
    if (percent > best) {
        localStorage.setItem('bestScore', percent);
    }

    showNotification(`پایان آزمون 🎉 امتیاز: ${percent}%`, 3000);
    switchView('home');
}
