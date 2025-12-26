// quiz.js - English With Fred
let currentMode = '';
let currentWord = null;
let currentQuestion = null;
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let totalQuestions = 0;
let isQuizActive = false;

// متغیرهای DOM
let questionTextElement = null;
let optionsContainerElement = null;
let speakBtnElement = null;
let hintBtnElement = null;
let nextBtnElement = null;
let endQuizBtnElement = null;
let quizContainerElement = null;

// مقداردهی اولیه DOM
function initQuizElements() {
    questionTextElement = document.getElementById('questionText');
    optionsContainerElement = document.getElementById('optionsContainer');
    speakBtnElement = document.getElementById('speakBtn');
    hintBtnElement = document.getElementById('hintBtn');
    nextBtnElement = document.getElementById('nextBtn');
    endQuizBtnElement = document.getElementById('endQuizBtn');
    quizContainerElement = document.getElementById('quizContainer');
}

// شروع آزمون
function startQuiz(mode) {
    console.log(`🚀 شروع آزمون: ${mode}`);
    
    // مقداردهی اولیه عناصر DOM
    initQuizElements();
    
    currentMode = mode;
    currentQuestionIndex = 0;
    correctCount = 0;
    isQuizActive = true;
    
    // مخفی کردن حالت‌ها و نمایش کوییز
    document.querySelector('.quiz-modes').style.display = 'none';
    
    if (quizContainerElement) {
        quizContainerElement.style.display = 'block';
    }
    
    // پنهان کردن گزارش پیشرفت اگر باز است
    const progressReport = document.getElementById('progressReport');
    if (progressReport) {
        progressReport.style.display = 'none';
    }
    
    // تولید سوالات
    generateQuestions(mode);
    
    // نمایش اولین سوال
    loadQuestion();
    
    // آپدیت دکمه‌ها
    if (nextBtnElement) nextBtnElement.style.display = 'none';
    if (endQuizBtnElement) endQuizBtnElement.style.display = 'block';
    if (speakBtnElement) speakBtnElement.style.display = 'inline-flex';
    if (hintBtnElement) hintBtnElement.style.display = 'inline-flex';
    
    console.log(`✅ ${questions.length} سوال تولید شد`);
}

// تولید سوالات
function generateQuestions(mode) {
    questions = [];
    
    // اطمینان از وجود لغات
    if (!words || words.length === 0) {
        console.error('❌ لغات یافت نشد!');
        showToast('خطا: فایل لغات بارگذاری نشده!', 'error');
        returnToMainMenu();
        return;
    }
    
    // انتخاب 10 لغت تصادفی
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, Math.min(10, words.length));
    
    // تولید سوال برای هر لغت
    selectedWords.forEach(word => {
        let question = null;
        let correctAnswer = '';
        let options = [];
        
        switch(mode) {
            case 'en-fa':
                question = `معنی "${word.english}" چیست؟`;
                correctAnswer = word.persian;
                options = generateOptions(word, 'persian');
                break;
                
            case 'fa-en':
                question = `معنی "${word.persian}" چیست؟`;
                correctAnswer = word.english;
                options = generateOptions(word, 'english');
                break;
                
            case 'word-def':
                question = `تعریف "${word.english}" چیست؟`;
                correctAnswer = word.definition;
                options = generateOptions(word, 'definition');
                break;
                
            case 'def-word':
                question = `کدام کلمه این تعریف را دارد؟\n"${word.definition}"`;
                correctAnswer = word.english;
                options = generateOptions(word, 'word-from-def');
                break;
        }
        
        if (question && correctAnswer && options.length === 4) {
            questions.push({
                word: word,
                question: question,
                correctAnswer: correctAnswer,
                options: options,
                mode: mode
            });
        }
    });
    
    totalQuestions = questions.length;
}

// تولید گزینه‌ها
function generateOptions(correctWord, type) {
    let options = [];
    
    // گزینه صحیح
    let correctOption = '';
    switch(type) {
        case 'persian':
            correctOption = correctWord.persian;
            break;
        case 'english':
            correctOption = correctWord.english;
            break;
        case 'definition':
            correctOption = correctWord.definition;
            break;
        case 'word-from-def':
            correctOption = correctWord.english;
            break;
    }
    options.push(correctOption);
    
    // تولید 3 گزینه غلط
    const allWords = [...words].filter(w => w !== correctWord);
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        let wrongOption = '';
        switch(type) {
            case 'persian':
                wrongOption = shuffled[i].persian;
                break;
            case 'english':
                wrongOption = shuffled[i].english;
                break;
            case 'definition':
                wrongOption = shuffled[i].definition;
                break;
            case 'word-from-def':
                wrongOption = shuffled[i].english;
                break;
        }
        
        // جلوگیری از تکرار گزینه‌ها
        if (!options.includes(wrongOption)) {
            options.push(wrongOption);
        } else {
            // اگر تکراری بود، یکی دیگر پیدا کن
            for (let j = i + 1; j < shuffled.length; j++) {
                let altOption = '';
                switch(type) {
                    case 'persian':
                        altOption = shuffled[j].persian;
                        break;
                    case 'english':
                        altOption = shuffled[j].english;
                        break;
                    case 'definition':
                        altOption = shuffled[j].definition;
                        break;
                    case 'word-from-def':
                        altOption = shuffled[j].english;
                        break;
                }
                if (!options.includes(altOption)) {
                    options.push(altOption);
                    break;
                }
            }
        }
    }
    
    // مخلوط کردن گزینه‌ها
    return options.sort(() => Math.random() - 0.5);
}

// بارگذاری سوال
function loadQuestion() {
    if (!isQuizActive || currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }
    
    currentQuestion = questions[currentQuestionIndex];
    currentWord = currentQuestion.word;
    
    // نمایش سوال
    if (questionTextElement) {
        questionTextElement.textContent = currentQuestion.question;
    }
    
    // پاک کردن گزینه‌های قبلی
    if (optionsContainerElement) {
        optionsContainerElement.innerHTML = '';
        
        // ایجاد گزینه‌ها
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => checkAnswer(option);
            optionsContainerElement.appendChild(button);
        });
    }
    
    // آپدیت وضعیت دکمه‌ها
    if (nextBtnElement) nextBtnElement.style.display = 'none';
    
    // نمایش شماره سوال
    updateQuestionCounter();
    
    console.log(`📝 سوال ${currentQuestionIndex + 1}/${questions.length} بارگذاری شد`);
}

// بررسی پاسخ
function checkAnswer(selectedOption) {
    if (!isQuizActive) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // غیرفعال کردن همه دکمه‌ها
    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.disabled = true;
        
        // هایلایت پاسخ درست و غلط
        if (button.textContent === currentQuestion.correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === selectedOption && !isCorrect) {
            button.classList.add('wrong');
        }
    });
    
    // آپدیت شمارنده
    if (isCorrect) {
        correctCount++;
    }
    
    // گزارش به Progress Tracker
    if (typeof ProgressTracker !== 'undefined' && currentWord) {
        ProgressTracker.recordQuestion(currentMode, isCorrect, currentWord);
    }
    
    // نمایش پیغام
    showFeedback(isCorrect, selectedOption);
    
    // نمایش دکمه بعدی
    if (nextBtnElement) {
        nextBtnElement.style.display = 'block';
    }
}

// نمایش بازخورد
function showFeedback(isCorrect, selectedOption) {
    const message = isCorrect ? '✅ پاسخ درست!' : `❌ پاسخ نادرست!\nپاسخ صحیح: ${currentQuestion.correctAnswer}`;
    
    // نمایش پیغام موقت
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-message';
    feedbackDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${isCorrect ? '#34c759' : '#ff3b30'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        text-align: center;
        animation: fadeInOut 2s ease-in-out;
        max-width: 90%;
        line-height: 1.5;
    `;
    
    feedbackDiv.textContent = message;
    document.body.appendChild(feedbackDiv);
    
    // حذف خودکار بعد از 2 ثانیه
    setTimeout(() => {
        if (feedbackDiv.parentNode) {
            feedbackDiv.parentNode.removeChild(feedbackDiv);
        }
    }, 2000);
    
    // اضافه کردن استایل انیمیشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -40%); }
            20% { opacity: 1; transform: translate(-50%, -50%); }
            80% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -60%); }
        }
    `;
    document.head.appendChild(style);
}

// سوال بعدی
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

// پایان آزمون
function endQuiz() {
    isQuizActive = false;
    
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // گزارش به Progress Tracker
    if (typeof ProgressTracker !== 'undefined') {
        ProgressTracker.recordSession(currentMode, score, totalQuestions);
    }
    
    // آپدیت بهترین امتیاز
    if (typeof updateBestScore === 'function') {
        updateBestScore(score);
    }
    
    // نمایش نتیجه
    showQuizResult(score);
    
    // بازگشت به صفحه اصلی بعد از 5 ثانیه
    setTimeout(returnToMainMenu, 5000);
}

// نمایش نتیجه آزمون
function showQuizResult(score) {
    if (questionTextElement) {
        questionTextElement.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: var(--primary); margin-bottom: 16px; font-size: 20px;">🎯 آزمون پایان یافت!</h2>
                <div style="font-size: 42px; font-weight: bold; color: ${score >= 70 ? '#34c759' : score >= 50 ? '#FF9800' : '#ff3b30'}; margin: 16px 0;">
                    ${score}%
                </div>
                <p style="font-size: 16px; margin: 8px 0;">
                    ✅ پاسخ‌های درست: <strong>${correctCount}</strong>
                </p>
                <p style="font-size: 16px; margin: 8px 0;">
                    ❌ پاسخ‌های نادرست: <strong>${totalQuestions - correctCount}</strong>
                </p>
                <p style="font-size: 16px; margin: 8px 0;">
                    📊 کل سوالات: <strong>${totalQuestions}</strong>
                </p>
                <p style="margin-top: 25px; font-size: 13px; color: var(--text-light);">
                    به صورت خودکار به منوی اصلی بازمی‌گردید...
                </p>
            </div>
        `;
    }
    
    // پاک کردن گزینه‌ها
    if (optionsContainerElement) {
        optionsContainerElement.innerHTML = '';
    }
    
    // مخفی کردن دکمه‌ها
    if (nextBtnElement) nextBtnElement.style.display = 'none';
    if (endQuizBtnElement) endQuizBtnElement.style.display = 'none';
    if (speakBtnElement) speakBtnElement.style.display = 'none';
    if (hintBtnElement) hintBtnElement.style.display = 'none';
}

// بازگشت به منوی اصلی
function returnToMainMenu() {
    // مخفی کردن کوییز
    if (quizContainerElement) {
        quizContainerElement.style.display = 'none';
    }
    
    // نمایش مجدد حالت‌ها
    const quizModes = document.querySelector('.quiz-modes');
    if (quizModes) {
        quizModes.style.display = 'flex';
    }
    
    // ریست متغیرها
    currentMode = '';
    currentWord = null;
    currentQuestion = null;
    questions = [];
    currentQuestionIndex = 0;
    correctCount = 0;
    totalQuestions = 0;
    isQuizActive = false;
    
    console.log('🏠 بازگشت به منوی اصلی');
}

// شمارنده سوال
function updateQuestionCounter() {
    const counter = document.querySelector('.question-counter');
    if (!counter) {
        // ایجاد شمارنده اگر وجود ندارد
        const counterDiv = document.createElement('div');
        counterDiv.className = 'question-counter';
        counterDiv.style.cssText = `
            text-align: center;
            margin: 8px 0;
            font-size: 13px;
            color: var(--text);
            opacity: 0.7;
        `;
        
        const questionText = document.getElementById('questionText');
        if (questionText && questionText.parentNode) {
            questionText.parentNode.insertBefore(counterDiv, questionText.nextSibling);
        }
    }
    
    const counterElement = document.querySelector('.question-counter');
    if (counterElement) {
        counterElement.textContent = `سوال ${currentQuestionIndex + 1} از ${questions.length}`;
    }
}

// تلفظ کلمه جاری (با قابلیت Mute)
function speakCurrentWord() {
    // بررسی حالت Mute
    if (typeof window.isMuted === 'function' && window.isMuted()) {
        showToast('🔇 میکروفون خاموش است', 'warning');
        return;
    }
    
    if (!currentWord || !window.speechSynthesis) return;
    
    const text = currentMode === 'en-fa' || currentMode === 'word-def' || currentMode === 'def-word' 
        ? currentWord.english 
        : currentWord.persian;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // تنظیم زبان
    if (currentMode === 'fa-en') {
        utterance.lang = 'fa-IR';
        utterance.rate = 0.7;
    } else {
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
    }
    
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // متوقف کردن تلفظ قبلی
    window.speechSynthesis.cancel();
    
    // شروع تلفظ
    window.speechSynthesis.speak(utterance);
    
    // بازخورد بصری
    if (speakBtnElement) {
        speakBtnElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (speakBtnElement) {
                speakBtnElement.style.transform = 'scale(1)';
            }
        }, 200);
    }
    
    console.log(`🗣️ تلفظ: ${text}`);
}

// نمایش راهنمایی
function showHint() {
    if (!currentWord) return;
    
    let hint = '';
    
    switch(currentMode) {
        case 'en-fa':
            hint = `راهنمایی: این کلمه ${currentWord.english.length} حرف دارد`;
            break;
        case 'fa-en':
            hint = `راهنمایی: این کلمه ${currentWord.persian.length} حرف دارد`;
            break;
        case 'word-def':
            hint = `راهنمایی: این کلمه با "${currentWord.english.charAt(0)}" شروع می‌شود`;
            break;
        case 'def-word':
            hint = `راهنمایی: کلمه مورد نظر با "${currentWord.english.charAt(0)}" شروع می‌شود`;
            break;
    }
    
    // نمایش راهنمایی
    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint-message';
    hintDiv.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 15px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        text-align: center;
        animation: slideUp 0.4s ease-out;
        max-width: 85%;
    `;
    
    hintDiv.textContent = hint;
    document.body.appendChild(hintDiv);
    
    // حذف خودکار بعد از 3 ثانیه
    setTimeout(() => {
        if (hintDiv.parentNode) {
            hintDiv.parentNode.removeChild(hintDiv);
        }
    }, 3000);
    
    // اضافه کردن استایل انیمیشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // بازخورد بصری
    if (hintBtnElement) {
        hintBtnElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (hintBtnElement) {
                hintBtnElement.style.transform = 'scale(1)';
            }
        }, 200);
    }
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ quiz.js loaded');
    
    // بررسی وجود فایل words
    if (typeof words === 'undefined') {
        console.error('❌ words array not found!');
        
        // پیغام خطا در صفحه
        const quizModes = document.querySelector('.quiz-modes');
        if (quizModes) {
            quizModes.innerHTML = `
                <div style="text-align: center; padding: 25px; background: rgba(244, 67, 54, 0.1); border-radius: 12px; border: 2px solid var(--danger); margin: 10px 0;">
                    <p style="color: var(--danger); font-size: 16px; margin-bottom: 12px;">⚠️ خطا در بارگذاری لغات</p>
                    <p style="color: var(--text-light); font-size: 13px;">فایل words.js یافت نشد یا دارای مشکل است.</p>
                    <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                        🔄 تلاش مجدد
                    </button>
                </div>
            `;
        }
    }
});

// API عمومی
window.startQuiz = startQuiz;
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
window.endQuiz = endQuiz;
window.speakCurrentWord = speakCurrentWord;
window.showHint = showHint;
window.returnToMainMenu = returnToMainMenu;
