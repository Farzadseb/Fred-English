const App = {
    view: 'home',
    mode: null,
    bestScore: Number(localStorage.getItem('bestScore') || 0),
    muted: localStorage.getItem('muted') === 'true',
    theme: localStorage.getItem('theme') || 'light'
};

const $ = id => document.getElementById(id);

/* ---------- VIEW ---------- */
function switchView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    $(id).classList.add('active');
    App.view = id;
}

/* ---------- NOTIFICATION ---------- */
function showNotification(text, time = 2000) {
    const n = $('notification');
    n.textContent = text;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), time);
}

/* ---------- THEME ---------- */
function applyTheme() {
    document.body.classList.toggle('dark', App.theme === 'dark');
    $('themeBtn').textContent = App.theme === 'dark' ? '☀️' : '🌙';
}
$('themeBtn').onclick = () => {
    App.theme = App.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', App.theme);
    applyTheme();
};

/* ---------- MUTE ---------- */
function applyMute() {
    $('muteBtn').textContent = App.muted ? '🔇' : '🔊';
}
$('muteBtn').onclick = () => {
    App.muted = !App.muted;
    localStorage.setItem('muted', App.muted);
    applyMute();
    showNotification(App.muted ? 'صدا خاموش شد' : 'صدا روشن شد');
};
window.isMuted = () => App.muted;

/* ---------- SCORE ---------- */
function renderScore() {
    $('scoreValue').textContent = App.bestScore + '%';
    document.querySelectorAll('.star')
        .forEach((s, i) => s.classList.toggle('filled', i < Math.floor(App.bestScore / 20)));
}

/* ---------- QUIZ ENGINE ---------- */
let quiz = {};

function startQuiz(mode) {
    quiz = {
        mode,
        index: 0,
        score: 0,
        questions: [...words].sort(() => 0.5 - Math.random()).slice(0, 10)
    };
    switchView('quiz');
    showNextQuestion();
}

function showNextQuestion() {
    if (quiz.index >= quiz.questions.length) return finishQuiz();
    const w = quiz.questions[quiz.index];

    let q = '', a = '';
    if (quiz.mode === 'english-persian') { q = w.english; a = w.persian; speakText(w.english); }
    if (quiz.mode === 'persian-english') { q = w.persian; a = w.english; }
    if (quiz.mode === 'word-definition') { q = w.english; a = w.definition; speakText(w.english); }
    if (quiz.mode === 'definition-word') { q = w.definition; a = w.english; }

    quiz.answer = a.toLowerCase().trim();
    $('questionText').textContent = q;
    $('currentQuestion').textContent = quiz.index + 1;
    $('quizScore').textContent = quiz.score;
    $('answerInput').value = '';
    $('feedback').textContent = '';
}

function checkAnswer() {
    const user = $('answerInput').value.toLowerCase().trim();
    const ok = user === quiz.answer || (user.length > 3 && quiz.answer.includes(user));

    if (ok) {
        quiz.score++;
        $('feedback').textContent = '✅ درست';
        ProgressTracker.recordQuestion(quiz.mode, true, quiz.questions[quiz.index]);
    } else {
        $('feedback').textContent = `❌ ${quiz.answer}`;
        ProgressTracker.recordQuestion(quiz.mode, false, quiz.questions[quiz.index]);
    }
    quiz.index++;
    setTimeout(showNextQuestion, 1200);
}

function finishQuiz() {
    const percent = Math.round((quiz.score / quiz.questions.length) * 100);
    if (percent > App.bestScore) {
        App.bestScore = percent;
        localStorage.setItem('bestScore', percent);
        renderScore();
    }
    ProgressTracker.recordSession(quiz.mode, percent, quiz.questions.length);
    switchView('home');
    showNotification(`امتیاز: ${percent}%`);
}

/* ---------- EVENTS ---------- */
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(); applyMute(); renderScore();
    ProgressTracker.init();

    document.querySelectorAll('.mode-card')
        .forEach(c => c.onclick = () => startQuiz(c.dataset.mode));

    $('submitAnswer').onclick = checkAnswer;
    $('answerInput').onkeydown = e => e.key === 'Enter' && checkAnswer();
    $('backHome').onclick = () => switchView('home');
    $('reviewMistakesBtn').onclick = () => ProgressTracker.reviewMistakes();
});
