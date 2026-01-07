let currentIndex = 0;
// توکن و چت‌آیدی کدگذاری شده
const TELEGRAM_TOKEN = "8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw";
const TELEGRAM_CHAT_ID = "96991859";

// تنظیمات صدا
let soundEnabled = true;
let darkMode = false;
const speechRate = 0.5;
let femaleVoice = null;
let isSpeaking = false;

// پیام‌های انگیزشی
const motivationalMessages = [
    "💪 هر روز یک قدم کوچک، یک سال بعد یک گام بزرگ!",
    "🌟 استمرار کلید موفقیت است، ادامه بده!",
    "🚀 امروز بهتر از دیروز، فردا بهتر از امروز!",
    "🧠 ذهن تو مانند عضله است، هر روز آن را تمرین بده!",
    "🎯 تمرکز امروز، موفقیت فردا!",
    "📚 هر کلمه جدید، دریچه‌ای به دنیای جدید!",
    "💫 تو قادر به یادگیری هر چیزی هستی، فقط ادامه بده!",
    "🔥 چالش‌ها تو را قوی‌تر می‌کنند، تسلیم نشو!",
    "🌈 پس از هر تلاش سخت، موفقیت شیرین‌تر است!",
    "⚡ انرژی مثبت، نتایج مثبت!"
];

// تابع ارسال به تلگرام
function sendToBot(msg) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(msg)}`;
    fetch(url).catch(e => console.error('خطا در ارسال به تلگرام:', e));
}

// تابع باز کردن واتس‌اپ با پیام پیش‌فرض
function openWhatsApp() {
    const user = localStorage.getItem('fred_user') || 'کاربر گرامی';
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    
    const message = `سلام! من ${user} هستم از برنامه English with Fred.\n
📊 وضعیت پیشرفت من: ${progress}%
📚 کلمات یادگرفته: ${currentIndex + 1} از ${window.wordsA1.length}
🎯 هدف: تسلط کامل بر زبان انگلیسی
✨ درخواست: نیاز به راهنمایی دارم`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "989017708544";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// تابع پیام انگیزشی تصادفی
function getMotivationalMessage() {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
}

// تاییدیه خروج هنگام ترک تمرین
function confirmExit(message) {
    if (currentIndex > 0 && currentIndex < window.wordsA1.length / 2) {
        const user = localStorage.getItem('fred_user');
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        
        const exitMessage = `⏸️ ${user} در میانه تمرینات قصد خروج دارد!\n
📊 پیشرفت: ${progress}%
📝 کلمات تکمیل شده: ${currentIndex + 1}
⚠️ عملیات: ${message}`;
        
        sendToBot(exitMessage);
        
        // پیام انگیزشی برای کاربر
        const motivationalMsg = getMotivationalMessage();
        const userMessage = `🚨 آیا مطمئن هستید می‌خواهید خارج شوید؟\n\n${motivationalMsg}\n\nشما ${progress}% پیشرفت داشته‌اید!`;
        
        return confirm(userMessage);
    }
    return true;
}

// تلفظ متن انگلیسی با صدای زن
function speakText(elementId, isAuto = false) {
    if (!soundEnabled && !isAuto) return;
    if (isSpeaking) window.speechSynthesis.cancel();
    
    const textElement = document.getElementById(elementId);
    if (!textElement) return;
    
    const text = textElement.innerText.trim();
    if (!text || text === '-' || text === 'Hello' || text.length < 2) return;
    
    window.speechSynthesis.cancel();
    
    if (!femaleVoice) {
        femaleVoice = findFemaleVoice();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => { isSpeaking = true; };
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };
    
    window.speechSynthesis.speak(utterance);
}

// تلفظ خودکار
function autoSpeakWord() {
    if (!soundEnabled) return;
    
    const wordElement = document.getElementById('word-eng');
    if (!wordElement) return;
    
    const wordText = wordElement.innerText.trim();
    if (!wordText || wordText === '-' || wordText === 'Hello') return;
    
    setTimeout(() => {
        speakText('word-eng', true);
        // ارسال پیام انگیزشی تصادفی هر 5 کلمه
        if (currentIndex % 5 === 0) {
            const msg = getMotivationalMessage();
            console.log('🎯 پیام انگیزشی:', msg);
            // می‌توانید اینجا alert یا notification کوچک نشان دهید
        }
    }, 500);
}

// ورود کاربر
function loginUser() {
    const name = document.getElementById('username-input').value.trim();
    if (name) {
        localStorage.setItem('fred_user', name);
        localStorage.setItem('soundEnabled', 'true');
        
        // پیام خوش‌آمدگویی انگیزشی
        const welcomeMsg = `🎉 ${getMotivationalMessage()}\n\nبه خانواده English with Fred خوش آمدی ${name} عزیز!`;
        alert(welcomeMsg);
        
        // ارسال به تلگرام
        const telegramMsg = `🚀 ورود جدید کاربر: ${name}\n📅 تاریخ: ${new Date().toLocaleString('fa-IR')}\n✨ ${getMotivationalMessage()}`;
        sendToBot(telegramMsg);
        
        showMenu();
    } else { 
        alert("لطفاً نام خود را وارد کنید."); 
    }
}

// نمایش منو
function showMenu() {
    const user = localStorage.getItem('fred_user');
    if (!user) return;
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    
    // پیام خوش‌آمد با اسم کاربر
    const welcomeText = `سلام ${user} عزیز! ${getMotivationalMessage()}`;
    document.getElementById('welcome-text').innerText = welcomeText;
    
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    updateStars(progress);
    updateControlIcons();
}

// شروع آموزش
function startLearning() {
    // پیام شروع تمرین
    const user = localStorage.getItem('fred_user');
    const startMsg = `🎬 ${user} شروع به یادگیری لغات کرد\n📚 ${currentIndex + 1} کلمه از ${window.wordsA1.length}`;
    sendToBot(startMsg);
    
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'block';
    renderWord();
}

// --- توابع ۴ کادر تمرین ---
function startPersianToEnglish() {
    if (!confirmExit('شروع Persian → English')) return;
    localStorage.setItem('quiz_mode', 'fa-en');
    window.open('quiz.html', '_self');
}

function startEnglishToPersian() {
    if (!confirmExit('شروع English → Persian')) return;
    localStorage.setItem('quiz_mode', 'en-fa');
    window.open('quiz.html', '_self');
}

function startWordToDefinition() {
    if (!confirmExit('شروع Word → Definition')) return;
    localStorage.setItem('quiz_mode', 'word-def');
    window.open('quiz.html', '_self');
}

function startDefinitionToWord() {
    if (!confirmExit('شروع Definition → Word')) return;
    localStorage.setItem('quiz_mode', 'def-word');
    window.open('quiz.html', '_self');
}

function startChallengingWords() {
    if (!confirmExit('شروع کلمات چالش‌برانگیز')) return;
    localStorage.setItem('quiz_mode', 'challenge');
    window.open('quiz.html', '_self');
}

// رندر کلمه
function renderWord() {
    const data = window.wordsA1[currentIndex];
    if (!data) return;
    
    // پر کردن اطلاعات
    document.getElementById('word-eng').innerText = data.word.replace('(A1)', '');
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
    
    autoSpeakWord();
}

// کلمه بعدی
function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        renderWord();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        updateStars(progress);
        
        // پیام انگیزشی هر 10 کلمه
        if (currentIndex % 10 === 0) {
            const user = localStorage.getItem('fred_user');
            const msg = `🎯 ${user} به کلمه ${currentIndex + 1} رسید!\n${getMotivationalMessage()}`;
            sendToBot(msg);
        }
    } else {
        const user = localStorage.getItem('fred_user');
        const completionMsg = `🏆 تبریک! ${user} تمام ${window.wordsA1.length} کلمه را کامل کرد!\n🎉 ${getMotivationalMessage()}`;
        alert(completionMsg);
        sendToBot(completionMsg);
        showMenu();
    }
}

// گزارش پیشرفت
function showReport() {
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    const learnedWords = currentIndex + 1;
    
    const reportMessage = `📊 گزارش پیشرفت شما:\n\n✅ کلمات یادگرفته شده: ${learnedWords} از ${window.wordsA1.length}\n📈 درصد پیشرفت: ${progress}%\n⭐ بهترین امتیاز: ${localStorage.getItem('fred_highscore') || 0}%\n\n${getMotivationalMessage()}`;
    
    alert(reportMessage);
    
    const user = localStorage.getItem('fred_user');
    if (user) {
        sendToBot(`📊 گزارش کاربر ${user}:\nپیشرفت: ${progress}%\nکلمات: ${learnedWords}/${window.wordsA1.length}`);
    }
}

// خروج با تاییدیه
function logout() {
    if (!confirmExit('خروج از برنامه')) return;
    
    if (confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟")) { 
        const user = localStorage.getItem('fred_user');
        if (user) {
            const exitMsg = `🚪 ${user} از برنامه خارج شد\n📊 آخرین پیشرفت: ${Math.round(((currentIndex + 1) / window.wordsA1.length) * 100)}%`;
            sendToBot(exitMsg);
        }
        localStorage.clear();
        location.reload();
    }
}

// کنترل صدا
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    
    const soundBtns = document.querySelectorAll('[id*="sound-btn"]');
    soundBtns.forEach(btn => {
        if (btn) {
            btn.innerHTML = soundEnabled ? '🔊' : '🔇';
        }
    });
    
    const user = localStorage.getItem('fred_user');
    if (user) {
        sendToBot(`🔊 ${user}: صدا ${soundEnabled ? 'فعال' : 'غیرفعال'} شد`);
    }
    
    if (soundEnabled && document.getElementById('learning-screen').style.display !== 'none') {
        autoSpeakWord();
    }
}

// کنترل تم تاریک
function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    const darkBtns = document.querySelectorAll('[id*="dark-btn"]');
    darkBtns.forEach(btn => {
        if (btn) {
            btn.innerHTML = darkMode ? '☀️' : '🌙';
        }
    });
    
    const user = localStorage.getItem('fred_user');
    if (user) {
        sendToBot(`🌙 ${user}: حالت ${darkMode ? 'تاریک' : 'روشن'}`);
    }
}

// آپدیت آیکون‌ها
function updateControlIcons() {
    const soundBtns = document.querySelectorAll('[id*="sound-btn"]');
    soundBtns.forEach(btn => {
        if (btn) {
            btn.innerHTML = soundEnabled ? '🔊' : '🔇';
        }
    });
    
    const darkBtns = document.querySelectorAll('[id*="dark-btn"]');
    darkBtns.forEach(btn => {
        if (btn) {
            btn.innerHTML = darkMode ? '☀️' : '🌙';
        }
    });
}

// آپدیت ستاره‌ها
function updateStars(progress) {
    const starsRow = document.querySelector('.stars-row');
    if (!starsRow) return;
    
    const filledStars = Math.min(5, Math.floor(progress / 20));
    const emptyStars = 5 - filledStars;
    starsRow.innerHTML = '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
    
    const highScore = parseInt(localStorage.getItem('fred_highscore') || '0');
    if (progress > highScore) {
        localStorage.setItem('fred_highscore', progress);
    }
    
    const highScoreElement = document.getElementById('high-score-val');
    if (highScoreElement) {
        highScoreElement.textContent = `${Math.max(progress, highScore)}%`;
    }
}

// پیدا کردن صدای زن
function findFemaleVoice() {
    const voices = speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    
    const priorityNames = ['Samantha', 'Microsoft Zira Desktop', 'Google US English Female', 'Female', 'Woman'];
    
    for (const name of priorityNames) {
        const voice = voices.find(v => 
            v.lang.startsWith('en-US') && 
            (v.name.includes(name) || v.name.toLowerCase().includes('female'))
        );
        if (voice) return voice;
    }
    
    return voices.find(v => v.lang.startsWith('en-US')) || voices[0];
}

// بارگذاری اولیه
window.addEventListener('load', () => {
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) {
        soundEnabled = savedSound === 'true';
    }
    
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark !== null) {
        darkMode = savedDark === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
    
    const savedScore = localStorage.getItem('fred_highscore');
    if (savedScore) {
        document.getElementById('high-score-val').textContent = `${savedScore}%`;
    }
    
    if (localStorage.getItem('fred_user')) {
        showMenu();
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        updateStars(progress);
        updateControlIcons();
    }
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            femaleVoice = findFemaleVoice();
        };
    }
});

// توقف تلفظ
window.addEventListener('beforeunload', () => {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
    }
});

// مدیریت خروج
document.addEventListener('click', (e) => {
    if ((e.target.classList.contains('home-btn') || 
         e.target.classList.contains('btn') && 
         !e.target.classList.contains('spk-btn') && 
         !e.target.classList.contains('spk-btn-main')) &&
         document.getElementById('learning-screen').style.display !== 'none') {
        
        if (!confirmExit('بازگشت به منو')) {
            e.preventDefault();
            return false;
        }
    }
});
