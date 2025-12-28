/* =========================
   QUIZ ENGINE (TEST MODE)
   4 MODES – MULTIPLE CHOICE
========================= */

let quiz = {
    mode: null,
    questions: [],
    index: 0,
    score: 0,
    total: 10
};

const $ = id => document.getElementById(id);

/* =========================
   START QUIZ
========================= */
function startQuiz(mode) {
    quiz.mode = mode;
    quiz.index = 0;
    quiz.score = 0;

    // اطمینان از وجود لغات
    if (!window.words || !words.length) {
        window.words = [
            { english: 'hello', persian: 'سلام', definition: 'greeting' }
        ];
    }

    quiz.questions = [...words]
        .sort(() => Math.random() - 0.5)
        .slice(0, quiz.total);

    showQuestion();
}

/* =========================
   SHOW QUESTION
========================= */
function showQuestion() {
    if (quiz.index >= quiz.total) {
        finishQuiz();
        return;
    }

    const w = quiz.questions[quiz.index];

    let question = '';
    let correct = '';
    let wrongPool = [];

    switch (quiz.mode) {
        case 'english-persian':
            question = w.english;
            correct = w.persian;
            wrongPool = words.map(x => x.persian);
            speak(w.english);
            break;

        case 'persian-english':
            question = w.persian;
            correct = w.english;
            wrongPool = words.map(x => x.english);
            break;

        case 'word-definition':
            question = w.english;
            correct = w.definition;
            wrongPool = words.map(x => x.definition);
            speak(w.english);
            break;

        case 'definition-word':
            question = w.definition;
            correct = w.english;
            wrongPool = words.map(x => x.english);
            break;
    }

    // UI
    $('currentQuestion').textContent = quiz.index + 1;
    $('quizScore').textContent = quiz.score;
    $('questionText').textContent = question;

    // ساخت گزینه‌ها
    const options = buildOptions(correct, wrongPool);
    renderOptions(options, correct);
}

/* =========================
   BUILD OPTIONS
========================= */
function buildOptions(correct, pool) {
    const opts = [correct];

    while (opts.length < 4) {
        const r = pool[Math.floor(Math.random() * pool.length)];
        if (r && !opts.includes(r)) opts.push(r);
    }

    return opts.sort(() => Math.random() - 0.5);
}

/* =========================
   RENDER OPTIONS
========================= */
function renderOptions(options, correct) {
    let box = $('optionsBox');

    // اگر اولین بار است، بساز
    if (!box) {
        box = document.createElement('div');
        box.id = 'optionsBox';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.gap = '10px';
        $('feedback').before(box);
    }

    box.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn light';
        btn.textContent = opt;

        btn.onclick = () => checkAnswer(opt, correct);
        box.appendChild(btn);
    });
}

/* =========================
   CHECK ANSWER
========================= */
function checkAnswer(selected, correct) {
    const feedback = $('feedback');

    if (selected === correct) {
        quiz.score++;
        feedback.textContent = '✅ درست';
        feedback.style.color = '#16a34a';

        ProgressTracker?.recordQuestion?.(quiz.mode, true, quiz.questions[quiz.index]);
    } else {
        feedback.textContent = `❌ جواب درست: ${correct}`;
        feedback.style.color = '#dc2626';

        ProgressTracker?.recordQuestion?.(quiz.mode, false, quiz.questions[quiz.index]);
    }

    quiz.index++;
    setTimeout(showQuestion, 900);
}

/* =========================
   FINISH QUIZ
========================= */
function finishQuiz() {
    const percent = Math.round((quiz.score / quiz.total) * 100);

    if (percent > App.bestScore) {
        App.bestScore = percent;
        localStorage.setItem('bestScore', percent);
        renderScore();
    }

    ProgressTracker?.recordSession?.(quiz.mode, percent, quiz.total);

    showNotification(`پایان آزمون 🎉 امتیاز: ${percent}%`, 3500);
    switchView('home');
}

/* =========================
   EXPORT
========================= */
window.startQuiz = startQuiz;
