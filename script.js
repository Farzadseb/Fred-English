let currentIndex = 0;
let isDarkMode = localStorage.getItem('dark_mode') === 'true';
let isSoundEnabled = localStorage.getItem('sound_enabled') !== 'false';

// اطلاعات تلگرام (Base64)
const _u1 = "ODU1MzIyNDUxNDpBQUcwWFh6QThkYTU1akNHeG56U3RQLTBJeEhobmZrVFBSdw==";
const _u2 = "OTY5OTE4NTk=";

function sendToBot(msg) {
    const t = atob(_u1); const i = atob(_u2);
    const url = `https://api.telegram.org/bot${t}/sendMessage?chat_id=${i}&text=${encodeURIComponent(msg)}`;
    fetch(url).catch(e => console.log("Bot error"));
}

function loginUser() {
    const name = document.getElementById('username-input').value;
    if (name.trim() !== "") {
        localStorage.setItem('fred_user', name);
        alert(`خوش آمدی ${name} عزیز! امیدوارم امروز عالی یاد بگیری. ✨`);
        sendToBot(`🚀 ورود کاربر: ${name}`);
        showMenu();
    }
}

function showMenu() {
    const screen = document.getElementById('learning-screen');
    if (screen.style.display === 'block') {
        const msgs = ["حیفه الان رها کنی! فقط چند کلمه دیگه مونده. 💪", "قهرمان‌ها وسط راه ول نمی‌کنن! مطمئنی؟ 🔥"];
        if (!confirm(msgs[Math.floor(Math.random() * msgs.length)])) return;
    }
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('welcome-text').innerText = `سلام ${localStorage.getItem('fred_user')} عزیز`;
    updateHeaderUI();
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('dark_mode', isDarkMode);
    updateHeaderUI();
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem('sound_enabled', isSoundEnabled);
    updateHeaderUI();
}

function updateHeaderUI() {
    const icons = document.querySelectorAll('.icon-btn');
    icons.forEach(btn => {
        if (btn.innerText === '🔊' || btn.innerText === '🔇') btn.innerText = isSoundEnabled ? '🔊' : '🔇';
        if (btn.innerText === '🌙' || btn.innerText === '☀️') btn.innerText = isDarkMode ? '☀️' : '🌙';
    });
}

function startLearning() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'block';
    renderWord();
}

function renderWord() {
    const data = window.wordsA1[currentIndex];
    if(!data) return;
    const cleanWord = data.word.replace('(A1)', '').trim();
    document.getElementById('word-eng').innerText = cleanWord;
    document.getElementById('word-fa').innerText = data.translation || "";
    document.getElementById('word-ex').innerText = data.example || "";
    document.getElementById('word-ex-fa').innerText = data.example_fa || "";
    document.getElementById('word-coll').innerText = data.collocation || "";
    document.getElementById('word-coll-fa').innerText = data.collocation_fa || "";
    document.getElementById('word-pv').innerText = data.phrasal || "";
    document.getElementById('word-pv-fa').innerText = data.phrasal_fa || "";
    document.getElementById('counter').innerText = `${currentIndex + 1} / ${window.wordsA1.length}`;
    if(isSoundEnabled) speak(cleanWord);
}

function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        renderWord();
    } else {
        sendToBot(`✅ ${localStorage.getItem('fred_user')} دوره را تمام کرد!`);
        alert("آفرین! تمام لغات تمام شد.");
        showMenu();
    }
}

function showReport() {
    const p = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    const quote = p < 50 ? "هر مسیر طولانی با قدم‌های کوچک شروع می‌شود. 🌱" : "عالی پیش رفتی، ادامه بده! 🚀";
    alert(`📊 گزارش پیشرفت شما:\n✅ لغات مطالعه شده: ${currentIndex + 1}\n📈 پیشرفت: ${p}%\n\n💡 ${quote}`);
    sendToBot(`📊 گزارش کاربر: ${localStorage.getItem('fred_user')}\nپیشرفت: ${p}%`);
}

function speakField(id) { if(isSoundEnabled) speak(document.getElementById(id).innerText); }
function speak(t) {
    window.speechSynthesis.cancel();
    let m = new SpeechSynthesisUtterance(t.replace('(A1)', ''));
    m.lang = 'en-US';
    window.speechSynthesis.speak(m);
}
function logout() { if(confirm("با خروج از حساب، پیشرفت امروزت ذخیره نمی‌شه! واقعاً می‌خوای بری؟")) { localStorage.clear(); location.reload(); } }

window.onload = () => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    if (localStorage.getItem('fred_user')) showMenu();
};
