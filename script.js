// --- متغیرهای کنترلی ---
let currentIndex = 0;
let score = 0;
let isPracticeMode = false;
let originalDatabase = [];
// بازیابی لیست اشتباهات از حافظه گوشی (LocalStorage)
let mistakeList = JSON.parse(localStorage.getItem('myMistakes')) || [];

const successMessages = ["آفرین! تو فوق‌العاده‌ای 🌟", "۱۰ لغت رو عالی یاد گرفتی! 🔥", "سرعت پیشرفتت عالیه 🚀"];
const motivationalMessages = ["فقط چند لغت دیگه مونده، نرو! ⭐", "تداوم کلید موفقیت هست 💪"];

// --- تابع پخش صدا (هوشمند برای آیفون و اندروید) ---
function speak(text) {
    if (!text) return;
    // قطع صدای قبلی برای جلوگیری از همپوشانی
    window.speechSynthesis.cancel();
    
    // پاکسازی متن (حذف برچسب A1)
    let cleanText = text.replace(/\(A1\)/g, '').trim();
    let utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // سرعت ملایم برای یادگیری بهتر
    window.speechSynthesis.speak(utterance);
}

// --- نمایش کارت لغت ---
function renderCard(index) {
    const wordData = window.wordsA1[index];
    const container = document.getElementById('card-container');
    if (!wordData) return;

    container.innerHTML = `
        <div class="word-card fade-in-effect">
            <h1 class="main-word">${wordData.word.replace(/\(A1\)/g, '')}</h1>
            <p class="translation">${wordData.translation}</p>
            
            <div class="section">
                <h3>EXAMPLE</h3>
                <div class="row">
                    <p class="eng-text">${wordData.example}</p>
                    <button class="speaker-btn" onclick="speak('${wordData.example.replace(/'/g, "\\'")}')">🔊</button>
                </div>
            </div>

            ${isPracticeMode ? `<button class="learned-btn" onclick="markAsLearned()">این لغت را یاد گرفتم ✅</button>` : ''}
        </div>
    `;
}

// --- بروزرسانی هدر، ستاره‌ها و امتیاز ---
function updateHeader() {
    document.getElementById('score-value').innerText = score;
    document.getElementById('progress-text').innerText = `${currentIndex + 1} / ${window.wordsA1.length}`;
    
    // محاسبه ستاره‌ها (هر ۲۰ درصد یک ستاره)
    let progressPercent = ((currentIndex + 1) / window.wordsA1.length) * 100;
    let starsToLight = Math.floor(progressPercent / 20);
    const stars = document.querySelectorAll('.star');
    stars.forEach((s, i) => {
        s.classList.toggle('gold', i < starsToLight);
    });

    // مدیریت نمایش بخش اشتباهات
    const mistakeBanner = document.getElementById('mistake-banner');
    const mistakeCount = document.getElementById('mistake-count');
    if (mistakeList.length > 0) {
        mistakeBanner.style.display = 'block';
        mistakeCount.innerText = mistakeList.length;
    } else {
        mistakeBanner.style.display = 'none';
    }
}

// --- حرکت بین لغات و تلفظ خودکار ---
function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        score += 10;
        renderCard(currentIndex);
        updateHeader();
        // تلفظ خودکار کلمه جدید
        speak(window.wordsA1[currentIndex].word);
        
        // پیام تشویقی هر ۲۰ لغت
        if ((currentIndex + 1) % 20 === 0) {
            showPopup(successMessages[Math.floor(Math.random() * successMessages.length)], "🎉 عالی پیش رفتی!");
        }
    } else {
        showPopup("تبریک! تمام لغات این سطح را تمام کردی.", "پایان مسیر");
    }
}

// --- مدیریت لغات دشوار ---
function startMistakePractice() {
    if (mistakeList.length === 0) return;
    isPracticeMode = true;
    originalDatabase = [...window.wordsA1];
    window.wordsA1 = [...mistakeList];
    currentIndex = 0;
    renderCard(0);
    updateHeader();
    showPopup("حالا فقط لغاتی که قبلاً اشتباه کردی رو تمرین می‌کنیم.", "حالت تمرین");
}

function markAsLearned() {
    const learnedWord = window.wordsA1[currentIndex];
    mistakeList = mistakeList.filter(m => m.word !== learnedWord.word);
    localStorage.setItem('myMistakes', JSON.stringify(mistakeList));
    
    if (mistakeList.length === 0) {
        isPracticeMode = false;
        window.wordsA1 = originalDatabase;
        currentIndex = 0;
        renderCard(0);
        updateHeader();
        showPopup("آفرین! تمام لغات دشوار یاد گرفته شدند.", "موفقیت");
    } else {
        window.wordsA1 = [...mistakeList];
        if (currentIndex >= mistakeList.length) currentIndex = 0;
        renderCard(currentIndex);
        updateHeader();
    }
}

// --- جستجو ---
function searchWord() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    if (query === "") return;

    const foundIndex = window.wordsA1.findIndex(item => 
        item.word.toLowerCase().includes(query)
    );

    if (foundIndex !== -1) {
        currentIndex = foundIndex;
        renderCard(currentIndex);
        updateHeader();
        speak(window.wordsA1[currentIndex].word);
    }
}

// --- توابع پاپ‌آپ و بازگشت ---
function showPopup(text, title) {
    document.getElementById('popup-text').innerText = text;
    document.getElementById('popup-title').innerText = title;
    document.getElementById('custom-popup').classList.remove('popup-hidden');
}

function closePopup() {
    document.getElementById('custom-popup').classList.add('popup-hidden');
}

function goBack() {
    if (currentIndex > 5) {
        if (!confirm(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)] + "\nآیا واقعاً خارج می‌شوی؟")) return;
    }
    window.history.back();
}

// شروع برنامه
window.onload = () => {
    renderCard(0);
    updateHeader();
    // اولین تلفظ بعد از اولین کلیک کاربر (محدودیت آیفون)
    document.body.addEventListener('click', () => {
        if (currentIndex === 0 && window.speechSynthesis.speaking === false) {
            speak(window.wordsA1[0].word);
        }
    }, { once: true });
};
