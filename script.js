let currentIndex = 0;
// توکن و چت‌آیدی کدگذاری شده
const _b1 = "ODU1MzIyNDUxNDpBQUcwWFh6QThkYTU1akNHeG56U3RQLTBJeEhobmZrVFBSdw==";
const _b2 = "OTY5OTE4NTk=";

let soundEnabled = true;
let darkMode = false;

function sendToBot(msg) {
    const t = atob(_b1); const c = atob(_b2);
    fetch(`https://api.telegram.org/bot${t}/sendMessage?chat_id=${c}&text=${encodeURIComponent(msg)}`).catch(e => {});
}

function loginUser() {
    const name = document.getElementById('username-input').value.trim();
    if (name) {
        localStorage.setItem('fred_user', name);
        sendToBot(`🚀 ورود کاربر: ${name}\n✨ پیام: به امید موفقیت امروز!`);
        showMenu();
    } else { alert("لطفاً نام خود را وارد کنید."); }
}

function showMenu() {
    const user = localStorage.getItem('fred_user');
    if (!user) return;
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('welcome-text').innerText = `سلام ${user} عزیز`;
    
    // محاسبه پیشرفت و نمایش ستاره‌ها
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    updateStars(progress);
}

function startLearning() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'block';
    renderWord();
}

function renderWord() {
    const data = window.wordsA1[currentIndex];
    if(!data) return;
    document.getElementById('word-eng').innerText = data.word.replace('(A1)','');
    document.getElementById('word-fa').innerText = data.translation;
    document.getElementById('word-def').innerText = data.definition_en;
    document.getElementById('word-coll').innerText = data.collocation;
    document.getElementById('word-coll-fa').innerText = data.collocation_fa;
    document.getElementById('word-ex').innerText = data.collocation_example;
    document.getElementById('word-ex-fa').innerText = data.collocation_example_fa;
    document.getElementById('word-pv1').innerText = data.pv1;
    document.getElementById('word-pv1-fa').innerText = data.pv1_fa;
    document.getElementById('word-pv2').innerText = data.pv2;
    document.getElementById('word-pv2-fa').innerText = data.pv2_fa;
    document.getElementById('counter').innerText = `${currentIndex + 1} / ${window.wordsA1.length}`;
}

function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        renderWord();
        window.scrollTo(0,0);
        // آپدیت ستاره‌ها پس از پیشرفت
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        updateStars(progress);
    } else {
        alert("آفرین! تمام لغات این بخش تمام شد.");
        showMenu();
    }
}

function showReport() {
    const p = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    alert(`📊 گزارش پیشرفت شما: ${p}%\nکلمات یاد گرفته شده: ${currentIndex + 1}`);
    sendToBot(`📊 گزارش پیشرفت [${localStorage.getItem('fred_user')}]: ${p}%`);
}

function logout() {
    if(confirm("خارج می‌شوید؟")) { 
        localStorage.clear(); 
        location.reload(); 
    }
}

function speakField(id) {
    window.speechSynthesis.cancel();
    let m = new SpeechSynthesisUtterance(document.getElementById(id).innerText);
    m.lang = 'en-US';
    window.speechSynthesis.speak(m);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.querySelector('.top .icon:nth-child(1)');
    btn.innerText = soundEnabled ? '🔊' : '🔇';
    sendToBot(`🔊 صدای ${soundEnabled ? 'فعال' : 'غیرفعال'} شد - کاربر: ${localStorage.getItem('fred_user')}`);
}

function toggleDarkMode() {
    darkMode = !darkMode;
    const btn = document.querySelector('.top .icon:nth-child(3)');
    btn.innerText = darkMode ? '☀️' : '🌙';
    document.body.style.background = darkMode ? '#1e1e1e' : '#f4f5f9';
    document.body.style.color = darkMode ? '#fff' : '#000';
    
    // تغییر رنگ کارتها در حالت تاریک
    const cards = document.querySelectorAll('.card-login, .card-status, .container-study');
    cards.forEach(card => {
        card.style.background = darkMode ? '#2d2d2d' : '#fff';
        card.style.color = darkMode ? '#fff' : '#000';
    });
    
    sendToBot(`🌙 حالت ${darkMode ? 'تاریک' : 'روشن'} - کاربر: ${localStorage.getItem('fred_user')}`);
}

function updateStars(progress) {
    const starsRow = document.querySelector('.stars-row');
    if (starsRow) {
        const filledStars = Math.floor(progress / 20); // هر 20% یک ستاره
        const stars = '★'.repeat(filledStars) + '☆'.repeat(5 - filledStars);
        starsRow.innerHTML = stars;
        
        // آپدیت بهترین نمره
        const highScore = localStorage.getItem('fred_highscore') || 0;
        if (progress > highScore) {
            localStorage.setItem('fred_highscore', progress);
        }
        document.getElementById('high-score-val').innerText = `${Math.max(progress, highScore)}%`;
    }
}

window.onload = () => { 
    if(localStorage.getItem('fred_user')) {
        showMenu();
        // ستاره‌ها را بر اساس پیشرفت فعلی آپدیت کن
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        updateStars(progress);
    }
};
