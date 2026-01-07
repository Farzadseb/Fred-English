let currentIndex = 0;
// توکن و چت‌آیدی کدگذاری شده
const _b1 = "ODU1MzIyNDUxNDpBQUcwWFh6QThkYTU1akNHeG56U3RQLTBJeEhobmZrVFBSdw==";
const _b2 = "OTY5OTE4NTk=";

let soundEnabled = true;
let darkMode = false;
let speechRate = 0.5;
let femaleVoice = null;

function sendToBot(msg) {
    const t = atob(_b1); const c = atob(_b2);
    fetch(`https://api.telegram.org/bot${t}/sendMessage?chat_id=${c}&text=${encodeURIComponent(msg)}`).catch(e => {});
}

// تابع برای پیدا کردن صدای زن آمریکایی
function findFemaleVoice() {
    const voices = speechSynthesis.getVoices();
    const preferredVoices = [
        'Google US English',
        'Microsoft Zira Desktop',
        'Samantha',
        'Karen',
        'Allison',
        'Female',
        'Woman'
    ];
    
    for (const voiceName of preferredVoices) {
        const voice = voices.find(v => 
            v.lang === 'en-US' && 
            (v.name.includes(voiceName) || v.name.toLowerCase().includes('female'))
        );
        if (voice) return voice;
    }
    
    return voices.find(v => v.lang === 'en-US') || voices[0];
}

// تلفظ متن انگلیسی با صدای زن و سرعت 0.5
function speakText(elementId) {
    if (!soundEnabled) return;
    
    const text = document.getElementById(elementId).innerText;
    if (!text || text.trim() === '' || text === '-' || text === 'Hello') return;
    
    window.speechSynthesis.cancel();
    
    if (!femaleVoice) {
        femaleVoice = findFemaleVoice();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }
    
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
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
    
    // آپدیت آیکون‌ها
    updateControlIcons();
}

function startLearning() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'block';
    renderWord();
}

// --- توابع ۴ کادر تمرین ---
function startPersianToEnglish() {
    localStorage.setItem('quiz_mode', 'fa-en');
    window.open('quiz.html', '_self');
}

function startEnglishToPersian() {
    localStorage.setItem('quiz_mode', 'en-fa');
    window.open('quiz.html', '_self');
}

function startWordToDefinition() {
    localStorage.setItem('quiz_mode', 'word-def');
    window.open('quiz.html', '_self');
}

function startDefinitionToWord() {
    localStorage.setItem('quiz_mode', 'def-word');
    window.open('quiz.html', '_self');
}

function startChallengingWords() {
    localStorage.setItem('quiz_mode', 'challenge');
    window.open('quiz.html', '_self');
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
    
    // تلفظ خودکار کلمه اصلی با صدای زن و سرعت 0.5
    if (soundEnabled) {
        setTimeout(() => {
            const wordText = data.word.replace('(A1)', '');
            if (wordText && wordText !== '-' && wordText !== 'Hello') {
                speakText('word-eng');
            }
        }, 500);
    }
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

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    
    // آپدیت همه دکمه‌های صدا
    const soundBtns = document.querySelectorAll('#sound-btn, #sound-btn2');
    soundBtns.forEach(btn => {
        if (btn) btn.innerText = soundEnabled ? '🔊' : '🔇';
    });
    
    sendToBot(`🔊 صدای ${soundEnabled ? 'فعال' : 'غیرفعال'} شد - کاربر: ${localStorage.getItem('fred_user')}`);
}

function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // آپدیت همه دکمه‌های تم تاریک
    const darkBtns = document.querySelectorAll('#dark-btn, #dark-btn2');
    darkBtns.forEach(btn => {
        if (btn) btn.innerText = darkMode ? '☀️' : '🌙';
    });
    
    sendToBot(`🌙 حالت ${darkMode ? 'تاریک' : 'روشن'} - کاربر: ${localStorage.getItem('fred_user')}`);
}

function updateControlIcons() {
    // آپدیت آیکون‌ها بر اساس وضعیت فعلی
    const soundBtns = document.querySelectorAll('#sound-btn, #sound-btn2');
    soundBtns.forEach(btn => {
        if (btn) btn.innerText = soundEnabled ? '🔊' : '🔇';
    });
    
    const darkBtns = document.querySelectorAll('#dark-btn, #dark-btn2');
    darkBtns.forEach(btn => {
        if (btn) btn.innerText = darkMode ? '☀️' : '🌙';
    });
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

// بارگذاری صداها و تنظیمات
window.speechSynthesis.onvoiceschanged = function() {
    femaleVoice = findFemaleVoice();
};

window.onload = () => { 
    // بارگذاری تنظیمات
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) soundEnabled = JSON.parse(savedSound);
    
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark !== null) {
        darkMode = JSON.parse(savedDark);
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
    
    if(localStorage.getItem('fred_user')) {
        showMenu();
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        updateStars(progress);
        updateControlIcons();
    }
};
