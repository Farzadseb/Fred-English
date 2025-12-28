// ==========================
// QUIZ ENGINE (FAIL-SAFE)
// ==========================

let quiz = {
    mode: null,
    questions: [],
    index: 0,
    score: 0,
    correct: null,
    locked: false
};

// --------------------------
// MODE MAP (UI → ENGINE)
// --------------------------
const MODE_MAP = {
    'en-fa': { q: 'english', a: 'persian', speak: true },
    'fa-en': { q: 'persian', a: 'english', speak: false },
    'word-def': { q: 'english', a: 'definition', speak: true },
    'def-word': { q: 'definition', a: 'english', speak: false }
};

// --------------------------
// VALID WORDS FOR MODE
// --------------------------
function getValidWords(modeKey) {
    const cfg = MODE_MAP[modeKey];
    if (!cfg) return [];

    return words.filter(w =>
        typeof w[cfg.q] === 'string' && w[cfg.q].trim() &&
        typeof w[cfg.a] === 'string' && w[cfg.a].trim()
    );
}

// --------------------------
// SAFE OPTIONS GENERATOR
// --------------------------
function makeOptionsSafe(correct, answerKey) {
    if (!correct || typeof correct !== 'string') return null;

    let pool = words
        .map(w => w[answerKey])
        .filter(v => typeof v === 'string' && v.trim() && v !== correct);

    // fallback مرحله‌ای
    if (pool.length < 3) {
        const extra = words
            .map(w => w.english)
            .filter(v => typeof v === 'string' && v.trim() && v !== correct && !pool.includes(v));
        pool = [...pool, ...extra];
    }

    if (pool.length < 3) return null;

    const wrong = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...wrong, correct].sort(() => 0.5 - Math.random());
}

// --------------------------
// START QUIZ
// --------------------------
function startQuiz(modeKey) {
    const validWords = getValidWords(modeKey);

    if (validWords.length < 5) {
        alert('❌ لغات کافی برای این آزمون وجود ندارد');
        return;
    }

    quiz = {
        mode: modeKey,
        questions: validWords.sort(() => 0.5 - Math.random()).slice(0, 10),
        index: 0,
        score: 0,
        correct: null,
        locked: false
    };

    switchView('quiz');
    showQuestion();
}

// --------------------------
// SHOW QUESTION (SELF-HEALING)
// --------------------------
function showQuestion() {
    quiz.locked = false;

    if (quiz.index >= quiz.questions.length) {
        finishQuiz();
        return;
    }

    const cfg = MODE_MAP[quiz.mode];
    const word = quiz.questions[quiz.index];

    const questionText = word[cfg.q];
    const correct = word[cfg.a];

    // اگر دیتا ناگهان خراب بود → skip
    if (!questionText || !correct) {
        quiz.index++;
        showQuestion();
        return;
    }

    const options = makeOptionsSafe(correct, cfg.a);
    if (!options) {
        quiz.index++;
        showQuestion();
        return;
    }

    quiz.correct = correct;

    // UI
    document.getElementById('question').textContent = questionText;
    document.getElementById('qIndex').textContent = quiz.index + 1;
    document.getElementById('score').textContent = quiz.score;

    const optionsBox = document.getElementById('options');
    optionsBox.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn option';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(btn, opt);
        optionsBox.appendChild(btn);
    });

    if (cfg.speak && window.speak) {
        speak(questionText);
    }
}

// --------------------------
// CHECK ANSWER
// --------------------------
function checkAnswer(button, selected) {
    if (quiz.locked) return;
    quiz.locked = true;

    const buttons = document.querySelectorAll('.option');

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === quiz.correct) {
            btn.classList.add('correct');
        }
    });

    if (selected === quiz.correct) {
        quiz.score++;
        button.classList.add('correct');
    } else {
        button.classList.add('wrong');
    }

    setTimeout(() => {
        quiz.index++;
        showQuestion();
    }, 1200);
}

// --------------------------
// FINISH QUIZ
// --------------------------
function finishQuiz() {
    const percent = Math.round((quiz.score / quiz.questions.length) * 100);

    const best = parseInt(localStorage.getItem('bestScore') || '0');
    if (percent > best) {
        localStorage.setItem('bestScore', percent);
    }

    document.getElementById('bestScore').textContent = percent + '%';
    switchView('home');
}

// --------------------------
// UI HOOKS
// --------------------------
document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
        startQuiz(card.dataset.mode);
    });
});

document.getElementById('backBtn').onclick = () => {
    switchView('home');
};
