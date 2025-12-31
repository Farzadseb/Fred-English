// =======================
// LEARNING ENGINE - سیستم یادگیری لغات A1
// =======================

// وضعیت یادگیری
let learningState = {
    currentWordIndex: 0,
    totalWords: 0,
    markedWords: [],
    showExample: true,
    soundEnabled: true,
    learningProgress: []
};

// شروع یادگیری لغات A1
function startA1Learning() {
    if (!A1Words || !A1Words.words || A1Words.words.length === 0) {
        showNotification('❌ لغات A1 بارگذاری نشده‌اند', 'error');
        return;
    }
    
    // بارگذاری وضعیت ذخیره شده کاربر
    const userKey = window.appState?.currentUser ? `learningState_${window.appState.currentUser.id}` : 'learningState';
    const savedState = localStorage.getItem(userKey);
    
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            learningState.currentWordIndex = parsed.currentWordIndex || 0;
            learningState.markedWords = parsed.markedWords || [];
            learningState.learningProgress = parsed.learningProgress || [];
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
    
    // ساختار کارت لغت
    wordCard.innerHTML = `
        <div class="word-header">
            <div class="word-main">
                <div class="word-english">${word.english}</div>
                <div class="word-persian">${word.persian}</div>
                <div class="word-pronunciation">
                    <span>${word.pronunciation}</span>
                    <button class="speak-word-btn" onclick="speakWord('${word.english}')">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            </div>
            <div class="word-difficulty">
                <span class="difficulty-badge ${word.difficulty}">
                    ${word.difficulty === 'easy' ? 'آسان' : word.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                </span>
            </div>
        </div>
        
        <div class="word-section">
            <div class="section-title">
                <i class="fas fa-comment-alt"></i>
                <span>مثال</span>
            </div>
            <div class="example-content" id="exampleContent" style="display: ${learningState.showExample ? 'block' : 'none'}">
                <div class="example-english">${word.example}</div>
                <div class="example-persian">${word.examplePersian}</div>
            </div>
        </div>
        
        <div class="word-section">
            <div class="section-title">
                <i class="fas fa-book"></i>
                <span>تعریف</span>
            </div>
            <div class="definition-content">${word.definition}</div>
        </div>
        
        <div class="word-section">
            <div class="section-title">
                <i class="fas fa-link"></i>
                <span>ترکیبات رایج (Collocation)</span>
            </div>
            <div class="collocation-content">${word.collocation}</div>
        </div>
    `;
    
    // اضافه کردن بخش Phrasal Verbs اگر وجود دارد
    if (word.phrasalVerbs && word.phrasalVerbs.length > 0) {
        const phrasalVerbsHTML = word.phrasalVerbs.map(pv => `
            <div class="phrasal-verb-item">
                <div class="phrasal-verb">${pv.verb}</div>
                <div class="phrasal-meaning">${pv.meaning}</div>
            </div>
        `).join('');
        
        wordCard.innerHTML += `
            <div class="word-section">
                <div class="section-title">
                    <i class="fas fa-bolt"></i>
                    <span>افعال عبارتی (Phrasal Verbs)</span>
                </div>
                <div class="phrasal-verbs-list">
                    ${phrasalVerbsHTML}
                </div>
            </div>
        `;
    }
    
    // اضافه کردن کلاس marked اگر لغت نشان شده باشد
    if (isMarked) {
        wordCard.classList.add('marked-word');
    } else {
        wordCard.classList.remove('marked-word');
    }
    
    // به‌روزرسانی اطلاعات صفحه
    updateLearningInfo();
    
    // پخش خودکار تلفظ لغت
    setTimeout(() => {
        if (window.appState?.soundEnabled && window.speakText) {
            window.speakText(word.english, 0.5);
        }
    }, 500);
}

// تلفظ کلمه
function speakWord(text) {
    if (window.appState?.soundEnabled && window.speakText) {
        window.speakText(text, 0.5);
    } else {
        showNotification('🔇 لطفاً ابتدا صدا را فعال کنید', 'warning');
    }
}

// تلفظ لغت فعلی
function speakCurrentWord() {
    if (!A1Words || learningState.currentWordIndex >= A1Words.words.length) {
        return;
    }
    
    const word = A1Words.words[learningState.currentWordIndex];
    speakWord(word.english);
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
        showNotification('📌 لغت علامت‌گذاری شد', 'success');
    } else {
        // حذف علامت
        learningState.markedWords.splice(markIndex, 1);
        wordCard.classList.remove('marked-word');
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
}

// تمرین این لغت
function startPractice() {
    if (!A1Words || learningState.currentWordIndex >= A1Words.words.length) {
        return;
    }
    
    const word = A1Words.words[learningState.currentWordIndex];
    
    // نمایش پیام
    showNotification(`🎯 تمرین لغت: ${word.english}`, 'info');
    
    // در اینجا می‌توانید منطق تمرین خاص این لغت را اضافه کنید
    // فعلاً فقط پیام نمایش می‌دهیم
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
        startQuiz('english-persian');
    }
}

// اکسپورت توابع
window.startA1Learning = startA1Learning;
window.speakCurrentWord = speakCurrentWord;
window.toggleExample = toggleExample;
window.toggleMarkWord = toggleMarkWord;
window.nextWord = nextWord;
window.prevWord = prevWord;
window.startPractice = startPractice;
window.finishLearning = finishLearning;
