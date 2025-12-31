// =======================
// LEARNING ENGINE - کاملاً جدید
// =======================

// وضعیت یادگیری
let learningState = {
    currentWordIndex: 0,
    totalWords: 0,
    markedWords: [],
    showExample: true,
    soundEnabled: true,
    learningProgress: [],
    lastWordSpoken: null
};

// تنظیمات صدا
const speechSettings = {
    rate: 0.5, // سرعت 0.5
    pitch: 1.0,
    volume: 1.0,
    voice: null
};

// پیدا کردن صدای زن آمریکایی
async function setupSpeechVoice() {
    if (!('speechSynthesis' in window)) {
        console.warn('⚠️ Text-to-Speech پشتیبانی نمی‌شود');
        return;
    }
    
    // منتظر بارگذاری صداها بمان
    return new Promise((resolve) => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            findFemaleVoice(voices);
            resolve();
        } else {
            speechSynthesis.onvoiceschanged = () => {
                const voices = speechSynthesis.getVoices();
                findFemaleVoice(voices);
                resolve();
            };
        }
    });
}

// پیدا کردن صدای زن آمریکایی
function findFemaleVoice(voices) {
    // اولویت‌بندی: زن آمریکایی
    const preferredVoices = [
        'Microsoft Zira Desktop - English (United States)',
        'Google US English',
        'English (United States)',
        'en-US',
        'English'
    ];
    
    for (const voiceName of preferredVoices) {
        const voice = voices.find(v => 
            v.name.includes(voiceName) && 
            v.lang.includes('en-US')
        );
        
        if (voice) {
            speechSettings.voice = voice;
            console.log('✅ صدای انتخاب شده:', voice.name);
            return;
        }
    }
    
    // اگر پیدا نشد، اولین صدای انگلیسی
    const englishVoice = voices.find(v => v.lang.includes('en'));
    if (englishVoice) {
        speechSettings.voice = englishVoice;
        console.log('✅ صدای انگلیسی انتخاب شد:', englishVoice.name);
    }
}

// تلفظ متن با تنظیمات ویژه
function speakText(text, rate = 0.5) {
    if (!window.appState?.soundEnabled) {
        showNotification('🎧 Please enable sound from top-right speaker button', 'info');
        return;
    }
    
    if (!('speechSynthesis' in window)) {
        showNotification('⚠️ مرورگر شما از متن به گفتار پشتیبانی نمی‌کند', 'error');
        return;
    }
    
    // متوقف کردن تلفظ قبلی
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate; // سرعت 0.5
    utterance.pitch = speechSettings.pitch;
    utterance.volume = speechSettings.volume;
    
    // استفاده از صدای انتخاب شده
    if (speechSettings.voice) {
        utterance.voice = speechSettings.voice;
    }
    
    // ذخیره آخرین متن تلفظ شده
    learningState.lastWordSpoken = text;
    
    utterance.onstart = () => {
        console.log('🔊 شروع تلفظ:', text);
    };
    
    utterance.onend = () => {
        console.log('✅ تلفظ پایان یافت');
    };
    
    utterance.onerror = (event) => {
        console.error('❌ خطا در تلفظ:', event);
        showNotification('❌ خطا در تلفظ متن', 'error');
    };
    
    speechSynthesis.speak(utterance);
}

// شروع یادگیری لغات A1
async function startA1Learning() {
    console.log('🚀 شروع یادگیری لغات A1');
    
    // بارگذاری صدای TTS
    await setupSpeechVoice();
    
    // بررسی وجود لغات
    if (!A1Words || !A1Words.words || A1Words.words.length === 0) {
        showNotification('❌ لغات A1 بارگذاری نشده‌اند', 'error');
        return;
    }
    
    // بارگذاری وضعیت ذخیره شده
    const userKey = window.appState?.currentUser ? `learningState_${window.appState.currentUser.id}` : 'learningState';
    const savedState = localStorage.getItem(userKey);
    
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            learningState.currentWordIndex = parsed.currentWordIndex || 0;
            learningState.markedWords = parsed.markedWords || [];
            learningState.learningProgress = parsed.learningProgress || [];
            learningState.showExample = parsed.showExample !== false;
        } catch (e) {
            console.error("❌ خطا در خواندن وضعیت یادگیری:", e);
        }
    }
    
    // تنظیم اطلاعات کاربر
    const learningUsername = document.getElementById('learningUsername');
    if (learningUsername && window.appState?.currentUser) {
        learningUsername.textContent = window.appState.currentUser.username;
    }
    
    // به‌روزرسانی تعداد کل لغات
    learningState.totalWords = A1Words.words.length;
    document.getElementById('totalWords').textContent = learningState.totalWords;
    
    // نمایش صفحه یادگیری
    switchView('learning');
    
    // نمایش اولین لغت
    displayCurrentWord();
    
    showNotification('📚 شروع یادگیری لغات A1', 'success');
}

// نمایش لغت فعلی
function displayCurrentWord() {
    if (!A1Words || learningState.currentWordIndex >= A1Words.words.length) {
        console.error("❌ لغتی برای نمایش وجود ندارد");
        return;
    }
    
    const word = A1Words.words[learningState.currentWordIndex];
    const wordCard = document.getElementById('wordCard');
    
    if (!wordCard) return;
    
    // بررسی آیا لغت نشان شده است
    const isMarked = learningState.markedWords.includes(word.id);
    
    // ساختار کامل کلمه
    wordCard.innerHTML = `
        <div class="word-header">
            <div class="word-main">
                <div class="word-english">${word.english}</div>
                <div class="word-persian">${word.persian}</div>
                <div class="word-pronunciation">
                    <span>${word.pronunciation}</span>
                    <button class="speak-word-btn" onclick="speakCurrentWord()" title="تلفظ کلمه">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="repeat-all-btn" onclick="repeatAllPronunciation()" title="تکرار همه">
                        <i class="fas fa-redo"></i> تکرار
                    </button>
                </div>
            </div>
            <div class="word-difficulty">
                <span class="difficulty-badge ${word.difficulty || 'medium'}">
                    ${word.difficulty === 'easy' ? 'آسان' : word.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                </span>
            </div>
        </div>
        
        <!-- مثال -->
        <div class="word-section">
            <div class="section-title">
                <i class="fas fa-comment-alt"></i>
                <span>مثال</span>
                <button class="small-speaker-btn" onclick="speakText('${escapeText(word.example)}')">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="example-content">
                <div class="english-sentence">
                    <button class="sentence-speaker-btn" onclick="speakText('${escapeText(word.example)}')" title="تلفظ جمله">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <span class="english-text">${word.example || 'No example available'}</span>
                </div>
                <div class="example-persian">${word.examplePersian || 'ترجمه فارسی'}</div>
            </div>
        </div>
        
        <!-- Collocation با مثال و معنی -->
        ${word.collocation ? `
        <div class="word-section">
            <div class="section-title">
                <i class="fas fa-link"></i>
                <span>Collocation</span>
                <button class="small-speaker-btn" onclick="speakCollocation()">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="collocation-content">
                <div class="collocation-english">${word.collocation.text || word.collocation}</div>
                ${word.collocation.example ? `
                <div class="collocation-example">
                    <em>Example:</em> ${word.collocation.example}
                    <button class="tiny-speaker-btn" onclick="speakText('${escapeText(word.collocation.example)}')">
                        <i class="fas fa-volume-up fa-xs"></i>
                    </button>
                </div>` : ''}
                ${word.collocation.meaning ? `
                <div class="collocation-meaning">
                    <em>Meaning:</em> ${word.collocation.meaning}
                </div>` : ''}
            </div>
        </div>
        ` : ''}
        
        <!-- Phrasal Verbs با مثال و معنی -->
        ${word.phrasalVerbs && word.phrasalVerbs.length > 0 ? `
        <div class="word-section">
            <div class="section-title">
                <i class="fas fa-bolt"></i>
                <span>Phrasal Verbs</span>
                <button class="small-speaker-btn" onclick="speakPhrasalVerbs()">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="phrasal-verbs-list">
                ${word.phrasalVerbs.map((pv, index) => `
                <div class="phrasal-verb-item">
                    <div class="phrasal-verb">${pv.verb || pv.english}</div>
                    <div class="phrasal-meaning">${pv.meaning || pv.persian}</div>
                    ${pv.example ? `
                    <div class="phrasal-example">
                        <em>Example:</em> ${pv.example}
                        <button class="tiny-speaker-btn" onclick="speakText('${escapeText(pv.example)}')">
                            <i class="fas fa-volume-up fa-xs"></i>
                        </button>
                    </div>` : ''}
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        <!-- تعریف انگلیسی سطح A1 -->
        <div class="word-section">
            <div class="section-title">
                <i class="fas fa-book"></i>
                <span>تعریف انگلیسی (A1)</span>
                <button class="small-speaker-btn" onclick="speakText('${escapeText(word.definitionA1 || word.definition)}')">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="definition-content">
                ${word.definitionA1 || word.definition || 'Definition'}
            </div>
        </div>
    `;
    
    // اضافه کردن کلاس marked اگر لغت نشان شده باشد
    if (isMarked) {
        wordCard.classList.add('marked-word');
        // اضافه کردن آیکون نشان
        const wordEnglish = wordCard.querySelector('.word-english');
        if (wordEnglish) {
            wordEnglish.innerHTML = `📌 ${word.english}`;
        }
    } else {
        wordCard.classList.remove('marked-word');
    }
    
    // به‌روزرسانی اطلاعات صفحه
    updateLearningInfo();
    
    // تلفظ خودکار لغت اصلی (همیشه)
    setTimeout(() => {
        if (window.appState?.soundEnabled) {
            speakText(word.english, 0.5);
        }
    }, 500);
}

// تابع escape برای متن
function escapeText(text) {
    if (!text) return '';
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// تلفظ لغت فعلی
function speakCurrentWord() {
    if (!A1Words || learningState.currentWordIndex >= A1Words.words.length) {
        return;
    }
    
    const word = A1Words.words[learningState.currentWordIndex];
    speakText(word.english, 0.5);
}

// تلفظ جمله
function speakSentence(text) {
    if (!text || text === 'No example available') {
        showNotification('⚠️ جمله‌ای برای تلفظ وجود ندارد', 'warning');
        return;
    }
    
    speakText(text, 0.5);
}

// تابع تکرار همه
function repeatAllPronunciation() {
    const word = A1Words.words[learningState.currentWordIndex];
    
    // 1. تلفظ کلمه اصلی
    speakText(word.english, 0.5);
    
    // 2. تلفظ مثال (با تاخیر)
    if (word.example && word.example !== 'No example available') {
        setTimeout(() => {
            speakText(word.example, 0.5);
        }, 1500);
    }
    
    // 3. تلفظ Collocation (با تاخیر)
    if (word.collocation) {
        setTimeout(() => {
            const collocText = word.collocation.text || word.collocation;
            speakText(collocText, 0.5);
            
            // اگر مثال دارد
            if (word.collocation.example) {
                setTimeout(() => {
                    speakText(word.collocation.example, 0.5);
                }, 1500);
            }
        }, 3000);
    }
    
    // 4. تلفظ Phrasal Verbs (با تاخیر)
    if (word.phrasalVerbs && word.phrasalVerbs.length > 0) {
        word.phrasalVerbs.forEach((pv, index) => {
            setTimeout(() => {
                speakText(pv.verb || pv.english, 0.5);
                
                // اگر مثال دارد
                if (pv.example) {
                    setTimeout(() => {
                        speakText(pv.example, 0.5);
                    }, 1500);
                }
            }, 4500 + (index * 2500));
        });
    }
}

// تلفظ Collocation
function speakCollocation() {
    const word = A1Words.words[learningState.currentWordIndex];
    if (word.collocation) {
        const text = word.collocation.text || word.collocation;
        speakText(text, 0.5);
    }
}

// تلفظ Phrasal Verbs
function speakPhrasalVerbs() {
    const word = A1Words.words[learningState.currentWordIndex];
    if (word.phrasalVerbs && word.phrasalVerbs.length > 0) {
        word.phrasalVerbs.forEach((pv, index) => {
            setTimeout(() => {
                speakText(pv.verb || pv.english, 0.5);
            }, index * 1500);
        });
    }
}

// نمایش/مخفی کردن مثال
function toggleExample() {
    learningState.showExample = !learningState.showExample;
    const exampleContent = document.getElementById('exampleContent');
    
    if (exampleContent) {
        exampleContent.style.display = learningState.showExample ? 'block' : 'none';
    }
    
    showNotification(
        learningState.showExample ? '📝 مثال نمایش داده می‌شود' : '📝 مثال مخفی شد',
        'info'
    );
    
    // ذخیره وضعیت
    saveLearningState();
}

// علامت‌گذاری لغت
function toggleMarkWord() {
    if (!A1Words || learningState.currentWordIndex >= A1Words.words.length) {
        return;
    }
    
    const word = A1Words.words[learningState.currentWordIndex];
    const wordCard = document.getElementById('wordCard');
    const markIndex = learningState.markedWords.indexOf(word.id);
    
    if (markIndex === -1) {
        // علامت‌گذاری لغت
        learningState.markedWords.push(word.id);
        wordCard.classList.add('marked-word');
        
        // اضافه کردن آیکون نشان
        const wordEnglish = wordCard.querySelector('.word-english');
        if (wordEnglish) {
            wordEnglish.innerHTML = `📌 ${word.english}`;
        }
        
        showNotification('📌 لغت علامت‌گذاری شد', 'success');
    } else {
        // حذف علامت
        learningState.markedWords.splice(markIndex, 1);
        wordCard.classList.remove('marked-word');
        
        // حذف آیکون نشان
        const wordEnglish = wordCard.querySelector('.word-english');
        if (wordEnglish) {
            wordEnglish.innerHTML = word.english;
        }
        
        showNotification('📌 علامت لغت برداشته شد', 'info');
    }
    
    // ذخیره وضعیت
    saveLearningState();
}

// لغت بعدی
function nextWord() {
    if (learningState.currentWordIndex < A1Words.words.length - 1) {
        learningState.currentWordIndex++;
        displayCurrentWord();
        
        // ذخیره پیشرفت
        saveLearningProgress();
        saveLearningState();
    } else {
        showNotification('🏁 شما به آخر لغات رسیده‌اید!', 'info');
    }
}

// لغت قبلی
function prevWord() {
    if (learningState.currentWordIndex > 0) {
        learningState.currentWordIndex--;
        displayCurrentWord();
        
        // ذخیره وضعیت
        saveLearningState();
    } else {
        showNotification('📖 شما در اولین لغت هستید', 'info');
    }
}

// به‌روزرسانی اطلاعات صفحه
function updateLearningInfo() {
    // به‌روزرسانی شماره لغت فعلی
    document.getElementById('currentWordIndex').textContent = learningState.currentWordIndex + 1;
    
    // به‌روزرسانی نوار پیشرفت
    const progressPercent = ((learningState.currentWordIndex + 1) / learningState.totalWords) * 100;
    const progressFill = document.getElementById('learningProgressFill');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    
    // فعال/غیرفعال کردن دکمه‌ها
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = learningState.currentWordIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = learningState.currentWordIndex === learningState.totalWords - 1;
    }
}

// ذخیره وضعیت یادگیری
function saveLearningState() {
    const userKey = window.appState?.currentUser ? `learningState_${window.appState.currentUser.id}` : 'learningState';
    
    const stateToSave = {
        currentWordIndex: learningState.currentWordIndex,
        markedWords: learningState.markedWords,
        showExample: learningState.showExample,
        learningProgress: learningState.learningProgress,
        lastAccessed: new Date().toISOString()
    };
    
    localStorage.setItem(userKey, JSON.stringify(stateToSave));
}

// ذخیره پیشرفت یادگیری
function saveLearningProgress() {
    const word = A1Words.words[learningState.currentWordIndex];
    const userKey = window.appState?.currentUser ? `learningProgress_${window.appState.currentUser.id}` : 'learningProgress';
    
    let progress = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    // بررسی آیا قبلاً ذخیره شده
    const existingIndex = progress.findIndex(item => item.wordId === word.id);
    
    if (existingIndex === -1) {
        // اضافه کردن به پیشرفت
        progress.push({
            wordId: word.id,
            english: word.english,
            persian: word.persian,
            firstSeen: new Date().toISOString(),
            lastReviewed: new Date().toISOString(),
            reviewCount: 1,
            marked: learningState.markedWords.includes(word.id)
        });
    } else {
        // به‌روزرسانی
        progress[existingIndex].lastReviewed = new Date().toISOString();
        progress[existingIndex].reviewCount = (progress[existingIndex].reviewCount || 0) + 1;
        progress[existingIndex].marked = learningState.markedWords.includes(word.id);
    }
    
    localStorage.setItem(userKey, JSON.stringify(progress));
    learningState.learningProgress = progress;
    
    // به‌روزرسانی نمودار پیشرفت
    if (window.updateProgressStats) {
        window.updateProgressStats();
    }
}

// تمرین این لغت
function startPractice() {
    if (!A1Words || learningState.currentWordIndex >= A1Words.words.length) {
        return;
    }
    
    const word = A1Words.words[learningState.currentWordIndex];
    
    // نمایش پیام
    showNotification(`🎯 تمرین لغت: ${word.english}`, 'info');
    
    // ایجاد تمرین سریع
    createQuickPractice(word);
}

// ایجاد تمرین سریع برای لغت
function createQuickPractice(word) {
    // اینجا می‌توانید منطق تمرین خاص را پیاده‌سازی کنید
    // فعلاً یک اعلان ساده نمایش می‌دهیم
    
    const practiceModal = document.createElement('div');
    practiceModal.className = 'practice-modal';
    practiceModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    practiceModal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 20px; max-width: 400px; width: 90%; text-align: center;">
            <h3 style="color: #3b82f6; margin-bottom: 1rem;">🎯 تمرین لغت</h3>
            <p style="font-size: 1.2rem; margin-bottom: 1.5rem;"><strong>${word.english}</strong> - ${word.persian}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="this.closest('.practice-modal').remove(); speakText('${escapeText(word.english)}', 0.5)" 
                        style="padding: 0.8rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    <i class="fas fa-volume-up"></i> تلفظ
                </button>
                <button onclick="this.closest('.practice-modal').remove()" 
                        style="padding: 0.8rem 1.5rem; background: #ef4444; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    بستن
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(practiceModal);
}

// اتمام یادگیری و رفتن به آزمون
function finishLearning() {
    // ذخیره نهایی وضعیت
    saveLearningState();
    saveLearningProgress();
    
    // نمایش گزارش مختصر
    const learnedCount = learningState.learningProgress.length;
    const markedCount = learningState.markedWords.length;
    
    const reportMessage = `📊 شما ${learnedCount} لغت از ${learningState.totalWords} لغت را یاد گرفته‌اید.\n`;
    const markedMessage = markedCount > 0 ? `📌 ${markedCount} لغت علامت‌گذاری کرده‌اید.` : '';
    
    // نمایش اعلان و رفتن به صفحه آزمون
    if (confirm(`${reportMessage}${markedMessage}\n\nآیا می‌خواهید آزمون دهید؟`)) {
        // رفتن به صفحه آزمون
        if (window.startQuiz) {
            window.startQuiz('english-persian');
        }
    }
}

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Learning Engine بارگذاری شد');
    
    // تنظیم صدای پیش‌فرض
    setupSpeechVoice().then(() => {
        console.log('✅ صدای TTS آماده است');
    });
});

// اکسپورت توابع
window.startA1Learning = startA1Learning;
window.speakCurrentWord = speakCurrentWord;
window.speakSentence = speakSentence;
window.toggleExample = toggleExample;
window.toggleMarkWord = toggleMarkWord;
window.nextWord = nextWord;
window.prevWord = prevWord;
window.startPractice = startPractice;
window.finishLearning = finishLearning;
window.speakText = speakText;
window.repeatAllPronunciation = repeatAllPronunciation;
window.speakCollocation = speakCollocation;
window.speakPhrasalVerbs = speakPhrasalVerbs;

console.log('✅ Learning Engine آماده است');
