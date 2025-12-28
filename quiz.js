// =======================
// QUIZ ENGINE
// =======================

let quiz = {
    mode: null,
    questions: [],
    index: 0,
    score: 0,
    correct: '',
    locked: false
};

// ---------- MODE MAP ----------
const MODE_MAP = {
    'en-fa': { q: 'english', a: 'persian', speak: true },
    'fa-en': { q: 'persian', a: 'english', speak: false },
    'word-def': { q: 'english', a: 'definition', speak: true },
    'def-word': { q: 'definition', a: 'english', speak: false }
};

// ---------- VALID WORDS ----------
function getValidWords(mode) {
    const cfg = MODE_MAP[mode];
    if (!cfg) return [];
    return words.filter(w =>
        typeof w[cfg.q] === 'string' && w[cfg.q].trim() &&
        typeof w[cfg.a] === 'string' && w[cfg.a].trim()
    );
}

// ---------- OPTIONS ----------
function makeOptions(correct, key) {
    if (!correct) return null;

    let pool = words
        .map(w => w[key])
        .filter(v => typeof v === 'string' && v.trim() && v !== correct);

    if (pool.length < 3) {
        const extra = words
            .map(w => w.english)
            .filter(v => v && v !== correct && !pool.includes(v));
        pool = [...pool, ...extra];
    }

    if (pool.length < 3) return null;

    const wrong = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...wrong, correct].sort(() => 0.5 - Math.random());
}

// ---------- PROGRESS ----------
function saveProgress(word, isCorrect) {
    const p = JSON.parse(localStorage.getItem('progress') || '{}');
    if (!p[word.english]) p[word.english] = { correct: 0, wrong: 0 };
    isCorrect ? p[word.english].correct++ : p[word.english].wrong++;
    localStorage.setItem('progress', JSON.stringify(p));
}

// ---------- START ----------
function startQuiz(mode) {
    const valid = getValidWords(mode);
    if (valid.length < 5) {
        alert('لغات کافی موجود نیست');
        return;
    }

    const progress = JSON.parse(localStorage.getItem('progress') || '{}');

    quiz = {
        mode,
        questions: valid
            .sort((a, b) =>
                (progress[b.english]?.wrong || 0) -
                (progress[a.english]?.wrong || 0)
            )
            .slice(0, 10),
        index: 0,
        score: 0,
        correct: '',
        locked: false
    };

    switchView('quiz');
    showQuestion();
}

// ---------- SHOW QUESTION ----------
function showQuestion() {
    quiz.locked = false;

    if (quiz.index >= quiz.questions.length) {
        finishQuiz();
        return;
    }

    const cfg = MODE_MAP[quiz.mode];
    const word = quiz.questions[quiz.index];

    const qText = word[cfg.q];
    const correct = word[cfg.a];

    const options = makeOptions(correct, cfg.a);
    if (!qText || !correct || !options) {
        quiz.index++;
        showQuestion();
        return;
    }

    quiz.correct = correct;

    document.getElementById('question').textContent = qText;
    document.getElementById('qIndex').textContent = quiz.index + 1;
    document.getElementById('score').textContent = quiz.score;

    const box = document.getElementById('options');
    box.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn option';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(btn, opt, word);
        box.appendChild(btn);
    });

    if (cfg.speak && window.speak) speak(qText);
}

// ---------- CHECK ----------
function checkAnswer(btn, selected, word) {
    if (quiz.locked) return;
    quiz.locked = true;

    const buttons = document.querySelectorAll('.option');
    buttons.forEach(b => {
        b.disabled = true;
        if (b.textContent === quiz.correct) b.classList.add('correct');
    });

    const correct = selected === quiz.correct;
    if (correct) {
        quiz.score++;
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
    }

    saveProgress(word, correct);

    setTimeout(() => {
        quiz.index++;
        showQuestion();
    }, 1200);
}

// ---------- FINISH ----------
function finishQuiz() {
    const percent = Math.round((quiz.score / quiz.questions.length) * 100);
    const best = parseInt(localStorage.getItem('bestScore') || '0');

    if (percent > best) {
        localStorage.setItem('bestScore', percent);
    }

    document.getElementById('bestScore').textContent = percent + '%';
    switchView('home');
}
