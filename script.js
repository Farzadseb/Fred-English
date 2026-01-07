let currentIndex = 0;

// توکن تلگرام شما با Base64
const TELEGRAM_TOKEN_BASE64 = "ODU1MzIyNDUxNDpBQUcwWFh6QThkYTU1akNHeG56U3RQLTBJeEhobmZrVFBSdw==";
const TELEGRAM_CHAT_ID_BASE64 = "OTY5OTE4NTk=";

// رمزگشایی Base64
const TELEGRAM_TOKEN = atob(TELEGRAM_TOKEN_BASE64);
const TELEGRAM_CHAT_ID = atob(TELEGRAM_CHAT_ID_BASE64);

// تنظیمات
let soundEnabled = true;
let darkMode = false;
const speechRate = 0.5;
let femaleVoice = null;
let isSpeaking = false;

// پیام‌های انگیزشی
const motivationalMessages = [
    "💪 عالی داری پیش میری! ادامه بده!",
    "🌟 هر کلمه جدید یه قدم به هدفت نزدیک‌تری!",
    "🚀 تمرین امروز، موفقیت فردا!",
    "🧠 ذهنت داره قوی‌تر میشه!",
    "🎯 داری عالی پیش میری!",
    "📚 یادگیری یه مسیره، لذت ببر!",
    "💫 استعداد داری، ادامه بده!",
    "🔥 چالش‌ها باعث پیشرفتت میشن!",
    "🌈 نزدیک‌تری، ادامه بده!",
    "⚡ انرژی مثبتت رو حفظ کن!"
];

// ============ 1. واتس‌اپ با پیام پیش‌فرض ============
function openWhatsApp() {
    const user = localStorage.getItem('fred_user') || 'کاربر';
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    
    const message = `سلام! من ${user} از برنامه English with Fred هستم.\n\n` +
                   `📊 وضعیت پیشرفت: ${progress}%\n` +
                   `📚 کلمات یادگرفته: ${currentIndex + 1} از ${window.wordsA1.length}\n` +
                   `🎯 هدف: تسلط بر انگلیسی\n\n` +
                   `✨ نیاز به راهنمایی دارم.`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "989017708544";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // گزارش به تلگرام
    sendToTelegram(`📱 ${user} روی واتس‌اپ کلیک کرد\n📞 شماره: ${phoneNumber}`);
}

// ============ 2. پیام‌های انگیزشی ============
function showMotivationalMessage() {
    if (currentIndex > 0) {
        // هر 5 کلمه یک پیام انگیزشی
        if (currentIndex % 5 === 0) {
            const messages = [
                "🎯 آفرین! داری عالی پیش میری!",
                "🚀 ادامه بده! نزدیک‌تری!",
                "💪 تمرینت داره نتیجه میده!",
                "🌟 استمرار کلید موفقیتته!",
                "🔥 عالی! ادامه بده!"
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            
            // نمایش نوتیفیکیشن کوچک
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 1000;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                animation: slideIn 0.5s ease-out;
                max-width: 300px;
            `;
            notification.innerHTML = `<strong>🎉 پیام انگیزشی!</strong><br>${randomMsg}`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.5s ease-out';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
            
            // اضافه کردن استایل انیمیشن
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // گزارش به تلگرام
            sendToTelegram(`💬 پیام انگیزشی برای ${localStorage.getItem('fred_user')}: ${randomMsg}`);
        }
    }
}

// ============ 3. تاییدیه خروج در نیمه تمرین ============
function checkMidSessionExit(action) {
    const user = localStorage.getItem('fred_user');
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    
    // اگر کمتر از 50% پیشرفت داشته و بیش از 3 کلمه دیده
    if (currentIndex > 2 && progress < 50) {
        const messages = [
            `⏸️ ${user} قصد ${action} داره در حالی که ${progress}% پیشرفت داشته!`,
            `🚧 ${user} می‌خواد ${action} کنه در حالی که ${currentIndex + 1} کلمه رو دیده!`,
            `⚠️ ${user} داره تمرین رو نصفه کاره رها می‌کنه! پیشرفت: ${progress}%`
        ];
        
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        sendToTelegram(randomMsg);
        
        // پیام انگیزشی برای کاربر
        const userMessages = [
            `🎯 فقط ${100 - progress}% مونده! ادامه بده!`,
            `💪 نیمه راه رو رها نکن! نزدیک‌تری!`,
            `🚀 ${currentIndex + 1} کلمه رو یاد گرفتی، ادامه بده!`,
            `🌟 داره خوب پیش میری! کاملش کن!`,
            `🔥 نصفش رو رد کردی! بقیه‌ش رو هم ببین!`
        ];
        
        const userRandomMsg = userMessages[Math.floor(Math.random() * userMessages.length)];
        
        return confirm(`🚨 واقعاً می‌خوای ${action} کنی؟\n\n` +
                      `📊 پیشرفت تو: ${progress}%\n` +
                      `📚 ${currentIndex + 1} کلمه از ${window.wordsA1.length}\n\n` +
                      `${userRandomMsg}`);
    }
    return true;
}

// ============ 4. توکن تلگرام با Base64 ============
function sendToTelegram(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const params = {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        };
        
        fetch(`${url}?${new URLSearchParams(params)}`)
            .then(response => {
                if (!response.ok) {
                    console.error('خطا در ارسال به تلگرام:', response.status);
                }
            })
            .catch(error => console.error('ارتباط با تلگرام قطع شد:', error));
    } catch (error) {
        console.error('خطا در ارسال پیام:', error);
    }
}

// ============ توابع اصلی ============
function loginUser() {
    const name = document.getElementById('username-input').value.trim();
    if (name) {
        localStorage.setItem('fred_user', name);
        localStorage.setItem('soundEnabled', 'true');
        
        // ارسال به تلگرام
        sendToTelegram(`🚀 ورود کاربر جدید: ${name}\n📅 ${new Date().toLocaleString('fa-IR')}`);
        
        showMenu();
    } else { 
        alert("لطفاً نام خود را وارد کنید."); 
    }
}

function showMenu() {
    const user = localStorage.getItem('fred_user');
    if (!user) return;
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('welcome-text').innerText = `سلام ${user} عزیز`;
    
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    updateStars(progress);
}

function startLearning() {
    if (!checkMidSessionExit('شروع یادگیری جدید')) return;
    
    // گزارش شروع
    const user = localStorage.getItem('fred_user');
    sendToTelegram(`📚 ${user} شروع به یادگیری کرد\n🔤 کلمه ${currentIndex + 1} از ${window.wordsA1.length}`);
    
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('learning-screen').style.display = 'block';
    renderWord();
}

// توابع تمرین‌ها
function startPersianToEnglish() {
    if (!checkMidSessionExit('شروع تمرین فارسی به انگلیسی')) return;
    localStorage.setItem('quiz_mode', 'fa-en');
    window.open('quiz.html', '_self');
}

function startEnglishToPersian() {
    if (!checkMidSessionExit('شروع تمرین انگلیسی به فارسی')) return;
    localStorage.setItem('quiz_mode', 'en-fa');
    window.open('quiz.html', '_self');
}

function startWordToDefinition() {
    if (!checkMidSessionExit('شروع تمرین کلمه به تعریف')) return;
    localStorage.setItem('quiz_mode', 'word-def');
    window.open('quiz.html', '_self');
}

function startDefinitionToWord() {
    if (!checkMidSessionExit('شروع تمرین تعریف به کلمه')) return;
    localStorage.setItem('quiz_mode', 'def-word');
    window.open('quiz.html', '_self');
}

function startChallengingWords() {
    if (!checkMidSessionExit('شروع کلمات چالش‌برانگیز')) return;
    localStorage.setItem('quiz_mode', 'challenge');
    window.open('quiz.html', '_self');
}

function renderWord() {
    const data = window.wordsA1[currentIndex];
    if (!data) return;
    
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
    
    // تلفظ خودکار
    if (soundEnabled) {
        setTimeout(() => {
            const wordText = data.word.replace('(A1)', '');
            if (wordText && wordText !== '-' && wordText !== 'Hello') {
                speakText('word-eng', true);
            }
        }, 300);
    }
}

function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        renderWord();
        window.scrollTo(0,0);
        
        // نمایش پیام انگیزشی
        showMotivationalMessage();
        
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        updateStars(progress);
        
        // گزارش هر 10 کلمه
        if (currentIndex % 10 === 0) {
            const user = localStorage.getItem('fred_user');
            sendToTelegram(`📈 ${user} به کلمه ${currentIndex + 1} رسید\n🎯 پیشرفت: ${progress}%`);
        }
    } else {
        const user = localStorage.getItem('fred_user');
        const msg = `🏆 ${user} تمام لغات رو کامل کرد!\n🎉 ${window.wordsA1.length} کلمه با موفقیت یاد گرفت!`;
        alert(msg);
        sendToTelegram(msg);
        showMenu();
    }
}

function showReport() {
    const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
    const user = localStorage.getItem('fred_user');
    
    const reportMsg = `📊 گزارش ${user}:\n` +
                     `✅ کلمات: ${currentIndex + 1}/${window.wordsA1.length}\n` +
                     `📈 پیشرفت: ${progress}%\n` +
                     `⭐ بهترین: ${localStorage.getItem('fred_highscore') || 0}%`;
    
    alert(`📊 گزارش شما:\n\n` +
          `✅ کلمات یادگرفته: ${currentIndex + 1} از ${window.wordsA1.length}\n` +
          `📈 درصد پیشرفت: ${progress}%\n` +
          `⭐ بهترین امتیاز: ${localStorage.getItem('fred_highscore') || 0}%`);
    
    sendToTelegram(reportMsg);
}

function logout() {
    if (!checkMidSessionExit('خروج از برنامه')) return;
    
    if (confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟")) { 
        const user = localStorage.getItem('fred_user');
        if (user) {
            const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
            sendToTelegram(`🚪 ${user} از برنامه خارج شد\n📊 آخرین پیشرفت: ${progress}%`);
        }
        localStorage.clear();
        location.reload();
    }
}

// توکن صدا و تاریک
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    
    const soundBtns = document.querySelectorAll('.sound-btn, [onclick*="toggleSound"]');
    soundBtns.forEach(btn => {
        btn.innerText = soundEnabled ? '🔊' : '🔇';
    });
    
    const user = localStorage.getItem('fred_user');
    if (user) {
        sendToTelegram(`🔊 ${user} صدا رو ${soundEnabled ? 'فعال' : 'غیرفعال'} کرد`);
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    
    const darkBtns = document.querySelectorAll('.dark-btn, [onclick*="toggleDarkMode"]');
    darkBtns.forEach(btn => {
        btn.innerText = darkMode ? '☀️' : '🌙';
    });
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    const user = localStorage.getItem('fred_user');
    if (user) {
        sendToTelegram(`🌙 ${user} حالت ${darkMode ? 'تاریک' : 'روشن'} کرد`);
    }
}

function updateStars(progress) {
    const starsRow = document.querySelector('.stars-row');
    if (starsRow) {
        const filledStars = Math.floor(progress / 20);
        const stars = '★'.repeat(filledStars) + '☆'.repeat(5 - filledStars);
        starsRow.innerHTML = stars;
        
        const highScore = localStorage.getItem('fred_highscore') || 0;
        if (progress > highScore) {
            localStorage.setItem('fred_highscore', progress);
        }
        document.getElementById('high-score-val').innerText = `${Math.max(progress, highScore)}%`;
    }
}

// تلفظ
function speakText(elementId) {
    if (!soundEnabled) return;
    
    const text = document.getElementById(elementId).innerText;
    if (!text || text.trim() === '' || text === '-') return;
    
    window.speechSynthesis.cancel();
    
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
        v.lang === 'en-US' && 
        (v.name.includes('Female') || v.name.includes('Woman') || v.name.includes('Samantha'))
    );
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

// بارگذاری
window.onload = () => { 
    if (localStorage.getItem('fred_user')) {
        showMenu();
        const progress = Math.round(((currentIndex + 1) / window.wordsA1.length) * 100);
        updateStars(progress);
    }
};
