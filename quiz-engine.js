// =======================
// QUIZ ENGINE (ساده و کارآمد)
// =======================

let quizState = {
    mode: null,
    index: 0,
    score: 0,
    questions: [],
    correctAnswer: '',
    options: []
};

// شروع آزمون
function startQuiz(mode) {
    // بررسی وجود لغات
    if (!window.words || !words.length) {
        showNotification('❌ لغات لود نشده‌اند', 'error');
        return;
    }
    
    // انتخاب 10 سوال تصادفی
    const allWords = [...words];
    const shuffledWords = allWords.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // ریست حالت آزمون
    quizState = {
        mode: mode,
        index: 0,
        score: 0,
        questions: shuffledWords,
        correctAnswer: '',
        options: []
    };
    
    // تغییر به صفحه آزمون
    switchView('quiz');
    
    // نمایش اولین سوال
    setTimeout(showQuestion, 100);
}

// نمایش سوال
function showQuestion() {
    // اگر آزمون تمام شده
    if (quizState.index >= quizState.questions.length) {
        finishQuiz();
        return;
    }
    
    const currentWord = quizState.questions[quizState.index];
    let questionText = '';
    let correctAnswer = '';
    
    // تعیین سوال و پاسخ صحیح بر اساس مود
    switch(quizState.mode) {
        case 'english-persian':
            questionText = currentWord.english;
            correctAnswer = currentWord.persian;
            break;
            
        case 'persian-english':
            questionText = currentWord.persian;
            correctAnswer = currentWord.english;
            break;
            
        case 'word-definition':
            questionText = currentWord.english;
            correctAnswer = currentWord.definition;
            break;
            
        case 'definition-word':
            questionText = currentWord.definition;
            correctAnswer = currentWord.english;
            break;
    }
    
    // ذخیره پاسخ صحیح
    quizState.correctAnswer = correctAnswer;
    
    // ساخت گزینه‌ها (3 گزینه غلط + پاسخ صحیح)
    const options = createOptions(correctAnswer, quizState.mode);
    quizState.options = options;
    
    // آپدیت UI
    document.getElementById('questionText').textContent = questionText || 'سوال نامعلوم';
    document.getElementById('currentQuestion').textContent = quizState.index + 1;
    document.getElementById('quizScore').textContent = quizState.score;
    document.getElementById('totalQuestions').textContent = quizState.questions.length;
    
    // آپدیت progress bar
    const progressPercent = ((quizState.index) / quizState.questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    
    // رندر گزینه‌ها
    renderOptions();
    
    // تلفظ خودکار اگر سوال انگلیسی باشد
    if (quizState.mode === 'english-persian' || quizState.mode === 'word-definition') {
        setTimeout(() => speak(questionText), 500);
    }
}

// ساخت گزینه‌ها
function createOptions(correct, mode) {
    let allOptions = [];
    
    // جمع‌آوری تمام گزینه‌های ممکن
    words.forEach(word => {
        switch(mode) {
            case 'english-persian':
                if (word.persian && word.persian !== correct) {
                    allOptions.push(word.persian);
                }
                break;
            case 'persian-english':
                if (word.english && word.english !== correct) {
                    allOptions.push(word.english);
                }
                break;
            case 'word-definition':
                if (word.definition && word.definition !== correct) {
                    allOptions.push(word.definition);
                }
                break;
            case 'definition-word':
                if (word.english && word.english !== correct) {
                    allOptions.push(word.english);
                }
                break;
        }
    });
    
    // انتخاب 3 گزینه تصادفی
    const wrongOptions = shuffleArray(allOptions).slice(0, 3);
    
    // ترکیب با پاسخ صحیح و shuffle نهایی
    const finalOptions = shuffleArray([...wrongOptions, correct]);
    
    return finalOptions;
}

// رندر گزینه‌ها
function renderOptions() {
    const container = document.getElementById('quizOptions');
    if (!container) return;
    
    container.innerHTML = '';
    
    quizState.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = `${option} (${index + 1})`;
        button.dataset.index = index;
        
        button.onclick = () => checkAnswer(option);
        
        container.appendChild(button);
    });
}

// بررسی پاسخ
function checkAnswer(selected) {
    const isCorrect = selected === quizState.correctAnswer;
    
    // هایلایت کردن گزینه‌ها
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent.includes(quizState.correctAnswer)) {
            btn.classList.add('correct');
        } else if (btn.textContent.includes(selected) && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // آپدیت امتیاز
    if (isCorrect) {
        quizState.score++;
        showNotification('✅ پاسخ درست!', 'success');
    } else {
        showNotification(`❌ پاسخ صحیح: ${quizState.correctAnswer}`, 'error');
    }
    
    // رفتن به سوال بعدی
    setTimeout(() => {
        quizState.index++;
        showQuestion();
    }, 1500);
}

// پایان آزمون
function finishQuiz() {
    const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
    
    // ذخیره بهترین امتیاز
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    if (percentage > bestScore) {
        localStorage.setItem('bestScore', percentage.toString());
        showNotification(`🎉 رکورد جدید! امتیاز: ${percentage}%`, 'success');
    }
    
    // ذخیره تاریخچه آزمون
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    testHistory.unshift({
        date: new Date().toISOString(),
        mode: quizState.mode,
        score: percentage,
        correct: quizState.score,
        total: quizState.questions.length
    });
    
    // فقط 20 آزمون آخر را نگه دار
    if (testHistory.length > 20) {
        testHistory.pop();
    }
    
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    
    // نمایش نتایج
    document.getElementById('finalScore').textContent = percentage + '%';
    document.getElementById('correctCount').textContent = quizState.score;
    document.getElementById('totalCount').textContent = quizState.questions.length;
    document.getElementById('bestResult').textContent = Math.max(bestScore, percentage) + '%';
    
    // رفتن به صفحه نتایج
    setTimeout(() => {
        switchView('results');
    }, 1500);
}

// تابع کمکی برای shuffle
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
