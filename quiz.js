// quiz.js — FINAL (MCQ version)

let quizState = {
    mode: null,
    index: 0,
    score: 0,
    questions: []
};

const quizOptionsContainerId = 'quizOptions';

// ساخت کانتینر گزینه‌ها اگر نبود
function ensureOptionsContainer() {
    if (!document.getElementById(quizOptionsContainerId)) {
        const box = document.createElement('div');
        box.id = quizOptionsContainerId;
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.gap = '10px';
        document.querySelector('#quiz .main-content')
            .insertBefore(box, document.getElementById('backHome'));
    }
}

function startQuiz(mode) {
    quizState = {
        mode,
        index: 0,
        score: 0,
        questions: [...words].sort(() => 0.5 - Math.random()).slice(0, 10)
    };

    ensureOptionsContainer();
    showQuestion();
}

function showQuestion() {
    const q = quizState.questions[quizState.index];
    if (!q) return finishQuiz();

    let questionText = '';
    let correct = '';
    let options = [];

    switch (quizState.mode) {
        case 'english-persian':
            questionText = q.english;
            correct = q.persian;
            options = makeOptions(q.persian, 'persian');
            speak(q.english);
            break;

        case 'persian-english':
            questionText = q.persian;
            correct = q.english;
            options = makeOptions(q.english, 'english');
            break;

        case 'word-definition':
            questionText = q.english;
            correct = q.definition;
            options = makeOptions(q.definition, 'definition');
            speak(q.english);
            break;

        case 'definition-word':
            questionText = q.definition;
            correct = q.english;
            options = makeOptions(q.english, 'english');
            break;
    }

    document.getElementById('questionText').textContent = questionText;
    document.getElementById('currentQuestion').textContent = quizState.index + 1;
    document.getElementById('quizScore').textContent = quizState.score;

    renderOptions(options, correct);
}

function makeOptions(correct, key) {
    const pool = words
        .map(w => w[key])
        .filter(v => v && v !== correct);

    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffled, correct].sort(() => 0.5 - Math.random());
}

function renderOptions(options, correct) {
    const box = document.getElementById(quizOptionsContainerId);
    box.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn green';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(opt === correct);
        box.appendChild(btn);
    });
}

function checkAnswer(isCorrect) {
    if (isCorrect) quizState.score++;

    quizState.index++;
    setTimeout(showQuestion, 300);
}

function finishQuiz() {
    const percent = Math.round((quizState.score / quizState.questions.length) * 100);
    showNotification(`پایان آزمون — امتیاز: ${percent}%`, 3000);
}
