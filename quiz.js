let quiz = {
    mode: null,
    index: 0,
    score: 0,
    list: []
};

function startQuiz(mode) {
    quiz.mode = mode;
    quiz.index = 0;
    quiz.score = 0;
    quiz.list = [...words].sort(() => 0.5 - Math.random()).slice(0, 10);

    document.getElementById('score').textContent = 0;
    showQuestion();
}

function showQuestion() {
    if (quiz.index >= quiz.list.length) {
        alert(`پایان آزمون\nامتیاز: ${quiz.score}`);
        switchView('home');
        return;
    }

    const w = quiz.list[quiz.index];
    let question, correct;

    if (quiz.mode === 'en-fa') {
        question = w.en;
        correct = w.fa;
        speak(w.en);
    } else if (quiz.mode === 'fa-en') {
        question = w.fa;
        correct = w.en;
    } else if (quiz.mode === 'word-def') {
        question = w.en;
        correct = w.def;
        speak(w.en);
    } else {
        question = w.def;
        correct = w.en;
    }

    document.getElementById('qIndex').textContent = quiz.index + 1;
    document.getElementById('question').textContent = question;

    const options = shuffle([
        correct,
        ...getRandomOptions(correct)
    ]);

    const box = document.getElementById('options');
    box.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn light';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(opt === correct);
        box.appendChild(btn);
    });
}

function checkAnswer(ok) {
    if (ok) quiz.score++;
    document.getElementById('score').textContent = quiz.score;
    quiz.index++;
    setTimeout(showQuestion, 300);
}

function getRandomOptions(correct) {
    return words
        .filter(w => w.en !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.fa || w.en || w.def);
}

function shuffle(a) {
    return a.sort(() => 0.5 - Math.random());
}
