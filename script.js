let currentIndex = 0;

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

function startLearning() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'block';
    renderWord();
}

function renderWord() {
    const data = window.wordsA1[currentIndex];
    document.getElementById('word-eng').innerText = data.word.replace('(A1)', '');
    document.getElementById('word-fa').innerText = data.translation;
    document.getElementById('word-ex').innerText = data.example;
    document.getElementById('counter').innerText = `${currentIndex + 1} / ${window.wordsA1.length}`;
    speak(data.word);
}

function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        renderWord();
    }
}

function speakCurrent() {
    speak(window.wordsA1[currentIndex].example);
}

function speak(text) {
    window.speechSynthesis.cancel();
    let msg = new SpeechSynthesisUtterance(text.replace('(A1)', ''));
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

function logout() {
    localStorage.clear();
    location.reload();
}

window.onload = () => { if (localStorage.getItem('fred_user')) showMenu(); };
