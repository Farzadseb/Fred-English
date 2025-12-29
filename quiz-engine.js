// =======================
// QUIZ ENGINE - نسخه نهایی
// =======================

// وضعیت آزمون
let currentQuiz = {
    mode: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 10,
    isActive: false,
    startTime: null
};

// شروع آزمون
function startQuiz(mode) {
    if (!window.words || words.length === 0) {
        showNotification('⚠️ لغات بارگذاری نشده‌اند', 'error');
        return;
    }
    
    currentQuiz = {
        mode: mode,
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 10,
        isActive: true,
        startTime: Date.now()
    };
    
    // تولید سوالات
    generateQuestions(mode);
    
    // نمایش صفحه آزمون
    switchView('quiz');
    
    // نمایش اولین سوال
    displayCurrentQuestion();
    
    // به‌روزرسانی اطلاعات
    updateQuizInfo();
    
    showNotification(`🎯 آزمون ${getModeName(mode)} شروع شد!`, 'success');
}

// تولید سوالات
function generateQuestions(mode) {
    currentQuiz.questions = [];
    
    // انتخاب تصادفی لغات
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, currentQuiz.totalQuestions);
    
    selectedWords.forEach(word => {
        let question = {};
        
        switch(mode) {
            case 'english-persian':
                question = {
                    text: word.english,
                    correctAnswer: word.persian,
                    options: generateOptions(word.persian, words.map(w => w.persian)),
                    mode: mode
                };
                break;
                
            case 'persian-english':
                question = {
                    text: word.persian,
                    correctAnswer: word.english,
                    options: generateOptions(word.english, words.map(w => w.english)),
                    mode: mode
                };
                break;
                
            case 'word-definition':
                question = {
                    text: word.english,
                    correctAnswer: word.definition || word.persian,
                    options: generateOptions(word.definition || word.persian, 
                                          words.map(w => w.definition || w.persian)),
                    mode: mode
                };
                break;
                
            case 'definition-word':
                question = {
                    text: word.definition || word.persian,
                    correctAnswer: word.english,
                    options: generateOptions(word.english, words.map(w => w.english)),
                    mode: mode
                };
                break;
                
            case 'practice-mode':
                // حالت تمرین اشتباهات
                const mistakes = MistakeStorage.getAll();
                if (mistakes.length > 0) {
                    const randomMistakes = [...mistakes]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, Math.min(10, mistakes.length));
                    
                    currentQuiz.questions = randomMistakes.map(mistake => ({
                        text: mistake.question,
                        correctAnswer: mistake.correctAnswer,
                        options: generateOptions(mistake.correctAnswer, 
                                              [mistake.correctAnswer, mistake.userAnswer, 
                                               getRandomOption(), getRandomOption()]),
                        mode: mistake.mode
                    }));
                    return;
                }
                break;
        }
        
        currentQuiz.questions.push(question);
    });
}

// تولید گزینه‌ها
function generateOptions(correctAnswer, allAnswers) {
    const options = [correctAnswer];
    
    // حذف پاسخ صحیح از لیست
    const otherAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    
    // انتخاب 3 گزینه تصادفی
    const shuffled = [...otherAnswers].sort(() => Math.random() - 0.5);
    const randomOptions = shuffled.slice(0, 3);
    
    options.push(...randomOptions);
    
    // مخلوط کردن گزینه‌ها
    return options.sort(() => Math.random() - 0.5);
}

// گزینه تصادفی
function getRandomOption() {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return randomWord.english;
}

// نمایش سوال فعلی
function displayCurrentQuestion() {
    if (!currentQuiz.isActive || currentQuiz.currentQuestionIndex >= currentQuiz.questions.length) {
        return;
    }
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('quizOptions');
    
    if (!questionText || !optionsContainer) return;
    
    // نمایش سوال
    questionText.textContent = question.text;
    
    // فعال کردن کلیک برای خواندن
    questionText.onclick = () => speakCurrentQuestion();
    
    // پاک کردن گزینه‌های قبلی
    optionsContainer.innerHTML = '';
    
    // نمایش گزینه‌ها بدون شماره
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option; // فقط متن گزینه
        optionBtn.onclick = () => checkAnswer(index);
        
        optionsContainer.appendChild(optionBtn);
    });
    
    // به‌روزرسانی پیشرفت
    updateProgress();
}

// بررسی پاسخ
function checkAnswer(selectedIndex) {
    if (!currentQuiz.isActive) return;
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const selectedOption = question.options[selectedIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // غیرفعال کردن کلیک روی گزینه‌ها
    optionButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // نمایش پاسخ صحیح/غلط
    optionButtons.forEach((btn, index) => {
        if (question.options[index] === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
            
            // ذخیره اشتباه
            const mistake = {
                question: question.text,
                correctAnswer: question.correctAnswer,
                userAnswer: selectedOption,
                mode: currentQuiz.mode,
                explanation: ''
            };
            MistakeStorage.addMistake(mistake);
        }
    });
    
    // به‌روزرسانی امتیاز
    if (isCorrect) {
        currentQuiz.score++;
        showNotification('✅ پاسخ صحیح!', 'success');
    } else {
        showNotification('❌ پاسخ اشتباه', 'error');
    }
    
    // به‌روزرسانی امتیاز نمایشی
    document.getElementById('quizScore').textContent = currentQuiz.score;
    
    // رفتن به سوال بعدی بعد از تاخیر
    setTimeout(() => {
        currentQuiz.currentQuestionIndex++;
        
        if (currentQuiz.currentQuestionIndex < currentQuiz.questions.length) {
            displayCurrentQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
}

// به‌روزرسانی اطلاعات آزمون
function updateQuizInfo() {
    document.getElementById('currentQuestion').textContent = currentQuiz.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = currentQuiz.totalQuestions;
    document.getElementById('quizScore').textContent = currentQuiz.score;
}

// به‌روزرسانی نوار پیشرفت
function updateProgress() {
    const progress = ((currentQuiz.currentQuestionIndex) / currentQuiz.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// پایان آزمون
function finishQuiz() {
    currentQuiz.isActive = false;
    
    const finalScore = Math.round((currentQuiz.score / currentQuiz.totalQuestions) * 100);
    const duration = Math.round((Date.now() - currentQuiz.startTime) / 1000);
    
    // ذخیره تاریخچه آزمون
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    testHistory.push({
        mode: currentQuiz.mode,
        score: finalScore,
        correct: currentQuiz.score,
        total: currentQuiz.totalQuestions,
        duration: duration,
        date: new Date().toISOString()
    });
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    
    // به‌روزرسانی بهترین امتیاز
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    if (finalScore > bestScore) {
        localStorage.setItem('bestScore', finalScore.toString());
        showNotification(`🎉 رکورد جدید! ${finalScore}%`, 'success');
    }
    
    // نمایش نتایج
    displayResults(finalScore, currentQuiz.score, currentQuiz.totalQuestions, bestScore);
    
    // به‌روزرسانی ستاره‌ها
    updateStars();
    
    // رفتن به صفحه نتایج
    switchView('results');
}

// نمایش نتایج
function displayResults(score, correct, total, bestScore) {
    document.getElementById('finalScore').textContent = `${score}%`;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('bestResult').textContent = `${bestScore}%`;
}

// نام حالت آزمون
function getModeName(mode) {
    const modes = {
        'english-persian': 'انگلیسی → فارسی',
        'persian-english': 'فارسی → انگلیسی',
        'word-definition': 'کلمه → تعریف',
        'definition-word': 'تعریف → کلمه',
        'practice-mode': 'تمرین اشتباهات'
    };
    return modes[mode] || mode;
}

// =======================
// توابع عمومی
// =======================
window.startQuiz = startQuiz;
