/**
 * Quiz Logic - منطق آزمون
 * نسخه نهایی RC1 (اصلاحات کامل مربی)
 */

// متغیرهای quiz state
let currentAnswerKey = null; // ⭐ اصلاح: ذخیره کلید جواب صحیح برای smart-review

// توابع اصلی آزمون

/**
 * شروع آزمون جدید
 */
function startQuiz(mode) {
    console.log(`🎯 Starting quiz in ${mode} mode`);
    
    currentMode = mode;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    currentAnswerKey = null; // ریست کردن
    
    // آماده‌سازی سوالات (از کل دیتابیس)
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    currentSession = shuffledWords.slice(0, 10);
    
    // مخفی کردن badge گزارش هنگام شروع آزمون
    const badge = document.getElementById('progress-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    // تغییر به صفحه آزمون
    ScreenController.setState(ScreenController.STATE.QUIZ);
    
    // بارگذاری اولین سوال
    setTimeout(() => {
        loadQuestion();
    }, 100);
}

/**
 * بارگذاری سوال جاری
 */
function loadQuestion() {
    if (currentQuestionIndex >= currentSession.length) {
        finishQuiz();
        return;
    }
    
    const currentWord = currentSession[currentQuestionIndex];
    let questionText = '';
    let options = [];
    
    // بر اساس حالت آزمون، سوال و گزینه‌ها را تنظیم کن
    switch(currentMode) {
        case 'en-fa':
            questionText = currentWord.english;
            options = generateOptions(currentWord, 'persian');
            currentAnswerKey = 'persian'; // ⭐ ذخیره کلید جواب
            break;
            
        case 'fa-en':
            questionText = currentWord.persian;
            options = generateOptions(currentWord, 'english');
            currentAnswerKey = 'english';
            break;
            
        case 'word-def':
            questionText = currentWord.english;
            options = generateOptions(currentWord, 'definition');
            currentAnswerKey = 'definition';
            break;
            
        case 'def-word':
            questionText = currentWord.definition;
            options = generateOptions(currentWord, 'english');
            currentAnswerKey = 'english';
            break;
            
        case 'smart-review':
            // ⭐ اصلاح: ذخیره دقیق کلید جواب
            const isPersianQuestion = Math.random() > 0.5;
            if (isPersianQuestion) {
                questionText = currentWord.persian;
                options = generateOptions(currentWord, 'english');
                currentAnswerKey = 'english';
            } else {
                questionText = currentWord.english;
                options = generateOptions(currentWord, 'persian');
                currentAnswerKey = 'persian';
            }
            break;
            
        default:
            questionText = currentWord.english;
            options = generateOptions(currentWord, 'persian');
            currentAnswerKey = 'persian';
    }
    
    // نمایش سوال
    const questionElement = document.getElementById('question');
    if (questionElement) {
        questionElement.textContent = questionText;
    }
    
    // نمایش گزینه‌ها
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option.text;
            optionElement.onclick = () => checkAnswer(index, option.isCorrect, currentWord);
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // به‌روزرسانی نوار پیشرفت
    updateProgressBar();
    
    // تلفظ سوال
    if (window.speechSynthesis) {
        setTimeout(speakQuestion, 300);
    }
}

/**
 * تولید گزینه‌ها برای سوال - با fail-safe
 */
function generateOptions(correctWord, type) {
    const options = [];
    
    // fail-safe برای داده‌های ناقص
    const correctText = correctWord[type] || '—';
    
    // گزینه صحیح
    const correctOption = {
        text: correctText,
        isCorrect: true
    };
    options.push(correctOption);
    
    // ۳ گزینه غلط تصادفی
    const otherWords = words.filter(word => word !== correctWord);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    
    shuffledOthers.forEach(word => {
        const wrongText = word[type] || '—';
        options.push({
            text: wrongText,
            isCorrect: false
        });
    });
    
    // مخلوط کردن گزینه‌ها
    return options.sort(() => Math.random() - 0.5);
}

/**
 * بررسی پاسخ کاربر - با جلوگیری از کلیک سریع
 */
function checkAnswer(selectedIndex, isCorrect, questionData) {
    const options = document.querySelectorAll('.option');
    
    // جلوگیری از کلیک سریع دوباره
    if (options[0].style.pointerEvents === 'none') {
        console.log('⏸️  Click prevented (already processing)');
        return;
    }
    
    // غیرفعال کردن کلیک روی گزینه‌ها
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // نمایش نتیجه
    if (isCorrect) {
        options[selectedIndex].classList.add('correct');
        playSound('correct');
        correctAnswers++;
        showToast('✅ درست بود!', '🎉');
    } else {
        options[selectedIndex].classList.add('incorrect');
        playSound('incorrect');
        showToast('❌ اشتباه بود', '📝');
        
        // ⭐ اصلاح نهایی: تشخیص دقیق جواب صحیح
        let correctKey = currentAnswerKey; // استفاده از کلید ذخیره شده
        
        // fallback برای backward compatibility
        if (!correctKey) {
            switch(currentMode) {
                case 'en-fa': correctKey = 'persian'; break;
                case 'fa-en': correctKey = 'english'; break;
                case 'word-def': correctKey = 'definition'; break;
                case 'def-word': correctKey = 'english'; break;
                case 'smart-review': 
                    // اگر currentAnswerKey نباشد، منطق قدیمی
                    const hasPersian = options[0].textContent === questionData.persian;
                    correctKey = hasPersian ? 'english' : 'persian';
                    break;
                default: correctKey = 'persian';
            }
        }
        
        const correctAnswerText = questionData[correctKey] || 
                                 questionData.english || 
                                 questionData.persian || 
                                 '—';
        
        // highlight گزینه صحیح
        options.forEach(option => {
            if (option.textContent.trim() === correctAnswerText.trim()) {
                option.classList.add('correct');
            }
        });
    }
    
    // ثبت در ProgressTracker
    ProgressTracker.recordQuestion(currentMode, isCorrect, questionData);
    
    // رفتن به سوال بعدی
    setTimeout(() => {
        currentQuestionIndex++;
        currentAnswerKey = null; // ریست برای سوال بعدی
        loadQuestion();
    }, 2000);
}

/**
 * به‌روزرسانی نوار پیشرفت
 */
function updateProgressBar() {
    const progressElement = document.getElementById('quiz-progress');
    if (progressElement) {
        const progress = currentSession.length > 0 
            ? Math.round(((currentQuestionIndex + 1) / currentSession.length) * 100)
            : 0;
        
        progressElement.textContent = `سوال ${currentQuestionIndex + 1} از ${currentSession.length}`;
        
        // می‌توانید progress bar بصری هم اضافه کنید
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
}

/**
 * پایان آزمون
 */
function finishQuiz() {
    const scorePercentage = currentSession.length > 0 
        ? Math.round((correctAnswers / currentSession.length) * 100)
        : 0;
    
    // نمایش نتیجه
    let message = '';
    if (scorePercentage >= 90) {
        message = `عالی! 🏆 امتیاز شما: ${scorePercentage}%`;
    } else if (scorePercentage >= 70) {
        message = `خوب! 👍 امتیاز شما: ${scorePercentage}%`;
    } else if (scorePercentage >= 50) {
        message = `قابل قبول 🤔 امتیاز شما: ${scorePercentage}%`;
    } else {
        message = `نیاز به تمرین بیشتر 📚 امتیاز شما: ${scorePercentage}%`;
    }
    
    showToast(message, '📊');
    
    // ثبت جلسه در ProgressTracker
    ProgressTracker.recordSession(currentMode, scorePercentage, currentSession.length);
    
    // بررسی دستاوردها
    if (scorePercentage >= 90 && currentSession.length >= 5) {
        showAchievement('استاد دقت! 🎯', 'امتیاز شما به ۹۰٪ رسیده است!');
    }
    
    if (correctAnswers === currentSession.length && currentSession.length >= 5) {
        showAchievement('کامل! 💯', 'به همه سوالات درست پاسخ دادید!');
    }
    
    // برگشت به صفحه اصلی بعد از ۳ ثانیه
    setTimeout(() => {
        ScreenController.setState(ScreenController.STATE.HOME);
        
        // نمایش مجدد badge گزارش
        setTimeout(() => {
            ProgressTracker.addProgressBadge();
        }, 300);
    }, 3000);
}

/**
 * خروج از آزمون - با لغو صدا
 */
function exitQuiz() {
    // لغو صداهای در حال پخش
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    // اگر آزمون در جریان است، تأیید بگیر
    if (currentQuestionIndex < currentSession.length && currentSession.length > 0) {
        const confirmExit = confirm('آیا مطمئنید می‌خواهید آزمون را رها کنید؟\n\nپیشرفت ذخیره نخواهد شد.');
        if (!confirmExit) {
            return;
        }
    }
    
    // استفاده از ScreenController
    ScreenController.setState(ScreenController.STATE.HOME);
    
    showToast('آزمون متوقف شد', '⏸️');
    
    // نمایش مجدد badge گزارش
    setTimeout(() => {
        ProgressTracker.addProgressBadge();
    }, 300);
    
    // ریست state
    currentAnswerKey = null;
}

/**
 * مرور اشتباهات هوشمند - واقعاً smart
 */
function reviewSmartMistakes() {
    const mistakes = ProgressTracker.getMistakesForReview(10);
    
    if (mistakes.length === 0) {
        showToast('🎉 هیچ اشتباهی برای مرور ندارید!', '🎯');
        
        // پیشنهاد تمرین معمولی
        setTimeout(() => {
            if (confirm('می‌خواهید یک تمرین معمولی شروع کنید؟')) {
                startQuiz('en-fa');
            }
        }, 500);
        
        return;
    }
    
    currentMode = 'smart-review';
    currentQuestionIndex = 0;
    correctAnswers = 0;
    currentAnswerKey = null;
    
    // واقعاً از اشتباهات هوشمند استفاده کن
    const prioritizedMistakes = [...mistakes].sort((a, b) => b.priority - a.priority);
    
    currentSession = prioritizedMistakes.map(mistake => {
        // پیدا کردن کلمه مربوطه در دیتابیس
        const word = words.find(w => 
            w.english === mistake.word.english && 
            w.persian === mistake.word.persian
        );
        
        return word || mistake.word;
    });
    
    // محدود کردن به ۱۰ سوال
    currentSession = currentSession.slice(0, Math.min(10, currentSession.length));
    
    console.log(`🎯 Smart review starting with ${currentSession.length} mistake-based questions`);
    showToast(`🎯 ${mistakes.length} اشتباه اولویت‌دار برای مرور`, '🧠');
    
    // مخفی کردن badge گزارش
    const badge = document.getElementById('progress-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    ScreenController.setState(ScreenController.STATE.QUIZ);
    
    setTimeout(() => {
        loadQuestion();
    }, 100);
}

/**
 * نمایش اعلان
 */
function showToast(message, icon = '📢') {
    // حذف toast قبلی
    const existingToast = document.getElementById('custom-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // ایجاد toast جدید
    const toastHTML = `
        <div id="custom-toast" class="custom-toast">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    // حذف خودکار بعد از ۳ ثانیه
    setTimeout(() => {
        const toast = document.getElementById('custom-toast');
        if (toast) {
            toast.remove();
        }
    }, 3000);
}

/**
 * تغییر حالت تاریک/روشن
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const icon = document.querySelector('#dark-mode-btn .icon');
    if (icon) {
        icon.textContent = isDarkMode ? '☀️' : '🌙';
    }
    
    showToast(isDarkMode ? 'حالت تاریک فعال شد' : 'حالت روشن فعال شد', isDarkMode ? '🌙' : '☀️');
}

/**
 * تنظیمات
 */
function toggleSettings() {
    ModalHelper.showInfoModal(
        'تنظیمات',
        `حالت فعلی: ${currentMode}<br>
        تعداد کلمات: ${words.length}<br>
        نسخه: ۱.۰.۰<br><br>
        <small>English with Fred - A1 Student Edition</small>`
    );
}

// Global functions برای دسترسی از HTML
window.startQuiz = startQuiz;
window.exitQuiz = exitQuiz;
window.toggleDarkMode = toggleDarkMode;
window.toggleSettings = toggleSettings;
window.reviewSmartMistakes = reviewSmartMistakes;
