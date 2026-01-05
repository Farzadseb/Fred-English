let currentIndex = 0;
let isDarkMode = localStorage.getItem('dark_mode') === 'true';
let isSoundEnabled = localStorage.getItem('sound_enabled') !== 'false';

function loginUser() {
    const name = document.getElementById('username-input').value;
    if (name.trim() !== "") {
        localStorage.setItem('fred_user', name);
        showMenu();
    }
}

function showMenu() {
    const user = localStorage.getItem('fred_user');
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('learning-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        document.getElementById('welcome-text').innerText = `سلام ${user} عزیز`;
    }
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('dark_mode', isDarkMode);
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem('sound_enabled', isSoundEnabled);
    const soundBtns = document.querySelectorAll('.icon-btn');
    soundBtns.forEach(btn => { if(btn.innerText === '🔊' || btn.innerText === '🔇') btn.innerText = isSoundEnabled ? '🔊' : '🔇'; });
}

function startLearning() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'block';
    renderWord();
}

function renderWord() {
    const data = window.wordsA1[currentIndex];
    document.getElementById('word-eng').innerText = data.word;
    document.getElementById('word-fa').innerText = data.translation;
    document.getElementById('word-ex').innerText = data.example;
    document.getElementById('word-ex-fa').innerText = data.example_fa;
    document.getElementById('word-coll').innerText = data.collocation;
    document.getElementById('word-coll-fa').innerText = data.collocation_fa;
    document.getElementById('word-pv').innerText = data.phrasal;
    document.getElementById('word-pv-fa').innerText = data.phrasal_fa;
    document.getElementById('counter').innerText = `${currentIndex + 1} / ${window.wordsA1.length}`;
    if(isSoundEnabled) speak(data.word);
}

function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        renderWord();
    }
}

function speakField(id) {
    if(!isSoundEnabled) return;
    speak(document.getElementById(id).innerText);
}

function speak(text) {
    window.speechSynthesis.cancel();
    let msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

function logout() {
    localStorage.clear();
    location.reload();
}

window.onload = () => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    if (localStorage.getItem('fred_user')) showMenu();
};
