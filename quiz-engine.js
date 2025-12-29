// =======================
// QUIZ ENGINE - نسخه کامل و اصلاح شده
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

// اشتباهات کاربر
const MistakeStorage = {
    getAll: function() {
        return JSON.parse(localStorage.getItem('fredMistakes') || '[]');
    },
    
    addMistake: function(mistake) {
        const mistakes = this.getAll();
        // جلوگیری از ذخیره تکراری
        const exists = mistakes.some(m => 
            m.question === mistake.question && 
            m.correctAnswer === mistake.correctAnswer
        );
        
        if (!exists) {
            mistakes.push(mistake);
            localStorage.setItem('fredMistakes', JSON.stringify(mistakes));
            this.updateMistakesCount();
        }
    },
    
    clearAll: function() {
        localStorage.removeItem('fredMistakes');
        this.updateMistakesCount();
        return true;
    },
    
    updateMistakesCount: function() {
        const count = this.getAll().length;
        const countElement = document.getElementById('mistakesCount');
        if (countElement) {
            countElement.textContent = count;
        }
        return count;
    }
};

// شروع آزمون
function startQuiz(mode) {
    console.log("🚀 شروع آزمون با حالت:", mode);
    
    // راه‌های مختلف برای دسترسی به لغات
    let availableWords = [];
    
    // روش ۱: بررسی EnglishWords (ساختار جدید)
    if (window.EnglishWords && EnglishWords.words && EnglishWords.words.length > 0) {
        console.log("✅ لغات از EnglishWords بارگیری شد");
        availableWords = EnglishWords.words;
    }
    // روش ۲: بررسی words (ساختار قدیمی)
    else if (window.words && Array.isArray(words) && words.length > 0) {
        console.log("✅ لغات از words بارگیری شد");
        availableWords = words;
    }
    // روش ۳: بررسی localStorage
    else {
        const storedWords = localStorage.getItem('fredWords');
        if (storedWords) {
            try {
                availableWords = JSON.parse(storedWords);
                console.log("✅ لغات از localStorage بارگیری شد");
            } catch (e) {
                console.error("❌ خطا در خواندن لغات از localStorage:", e);
            }
        }
    }
    
    // اگر لغات پیدا نشد
    if (availableWords.length === 0) {
        showNotification('⚠️ لغات بارگذاری نشده‌اند. لطفاً دوباره تلاش کنید.', 'error');
        
        // ذخیره نمونه لغات برای تست
        const sampleWords = [
            { english: 'hello', persian: 'سلام', definition: 'سلام کردن' },
            { english: 'goodbye', persian: 'خداحافظ', definition: 'خداحافظی' },
            { english: 'thank you', persian: 'ممنون', definition: 'تشکر' },
            { english: 'please', persian: 'لطفاً', definition: 'درخواست مؤدبانه' }
        ];
        
        localStorage.setItem('fredWords', JSON.stringify(sampleWords));
        console.log("📝 لغات نمونه ذخیره شدند");
        return;
    }
    
    console.log(`📊 تعداد لغات موجود: ${availableWords.length}`);
    
    // تنظیم آزمون جدید
    currentQuiz = {
        mode: mode,
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 10,
        isActive: true,
        startTime: Date.now(),
        wordSource: availableWords
    };
    
    // تولید سوالات
    generateQuestions(mode, availableWords);
    
    // اگر سوالی تولید نشد
    if (currentQuiz.questions.length === 0) {
        showNotification('⚠️ سوالی برای نمایش وجود ندارد', 'error');
        return;
    }
    
    // نمایش صفحه آزمون
    switchView('quiz');
    
    // نمایش اولین سوال
    displayCurrentQuestion();
    
    showNotification(`🎯 آزمون ${getModeName(mode)} شروع شد!`, 'success');
}

// تولید سوالات
function generateQuestions(mode, wordList) {
    console.log(`🎯 تولید سوالات برای حالت: ${mode}`);
    currentQuiz.questions = [];
    
    // اطمینان از داشتن لغات کافی
    if (!wordList || wordList.length < 4) {
        console.error("❌ لغات کافی نیست:", wordList ? wordList.length : 0);
        return;
    }
    
    // انتخاب تصادفی لغات
    const shuffledWords = [...wordList].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, Math.min(currentQuiz.totalQuestions, wordList.length));
    
    console.log(`📝 انتخاب ${selectedWords.length} لغت از ${wordList.length} لغت موجود`);
    
    selectedWords.forEach((word, index) => {
        try {
            let question = null;
            const definition = word.definition || `ترجمه: ${word.persian}`;
            
            switch(mode) {
                case 'english-persian':
                    question = {
                        text: word.english || 'بدون متن انگلیسی',
                        correctAnswer: word.persian || 'بدون ترجمه فارسی',
                        options: generateOptions(
                            word.persian || 'بدون ترجمه فارسی', 
                            wordList.map(w => w.persian || 'بدون ترجمه')
                        ),
                        mode: mode,
                        word: word
                    };
                    break;
                    
                case 'persian-english':
                    question = {
                        text: word.persian || 'بدون متن فارسی',
                        correctAnswer: word.english || 'بدون متن انگلیسی',
                        options: generateOptions(
                            word.english || 'بدون متن انگلیسی', 
                            wordList.map(w => w.english || 'بدون متن')
                        ),
                        mode: mode,
                        word: word
                    };
                    break;
                    
                case 'word-definition':
                    question = {
                        text: word.english || 'بدون متن انگلیسی',
                        correctAnswer: definition,
                        options: generateOptions(
                            definition, 
                            wordList.map(w => w.definition || `ترجمه: ${w.persian}`)
                        ),
                        mode: mode,
                        word: word
                    };
                    break;
                    
                case 'definition-word':
                    question = {
                        text: definition,
                        correctAnswer: word.english || 'بدون متن انگلیسی',
                        options: generateOptions(
                            word.english || 'بدون متن انگلیسی', 
                            wordList.map(w => w.english || 'بدون متن')
                        ),
                        mode: mode,
                        word: word
                    };
                    break;
                    
                case 'practice-mode':
                    const mistakes = MistakeStorage.getAll();
                    if (mistakes.length > 0) {
                        const randomMistakes = [...mistakes]
                            .sort(() => Math.random() - 0.5)
                            .slice(0, Math.min(10, mistakes.length));
                        
                        currentQuiz.questions = randomMistakes.map(mistake => ({
                            text: mistake.question || 'بدون سوال',
                            correctAnswer: mistake.correctAnswer || 'بدون پاسخ',
                            options: generateOptions(
                                mistake.correctAnswer || 'بدون پاسخ', 
                                [
                                    mistake.correctAnswer || 'بدون پاسخ', 
                                    mistake.userAnswer || 'بدون پاسخ کاربر', 
                                    getRandomOption(wordList), 
                                    getRandomOption(wordList)
                                ]
                            ),
                            mode: mistake.mode || 'english-persian'
                        }));
                        currentQuiz.totalQuestions = currentQuiz.questions.length;
                        return;
                    }
                    break;
            }
            
            if (question) {
                currentQuiz.questions.push(question);
                console.log(`✅ سوال ${index + 1} ایجاد شد: ${question.text.substring(0, 30)}...`);
            }
        } catch (error) {
            console.error(`❌ خطا در ایجاد سوال برای لغت ${index}:`, error);
        }
    });
    
    console.log(`✅ ${currentQuiz.questions.length} سوال تولید شد`);
}

// تولید گزینه‌ها
function generateOptions(correctAnswer, allAnswers) {
    if (!correctAnswer || !allAnswers || allAnswers.length < 4) {
        return ['گزینه ۱', 'گزینه ۲', 'گزینه ۳', 'گزینه ۴'];
    }
    
    const options = [correctAnswer];
    
    // حذف پاسخ صحیح و انتخاب تصادفی
    const otherAnswers = allAnswers
        .filter(answer => answer && answer !== correctAnswer)
        .filter((value, index, self) => self.indexOf(value) === index); // حذف تکراری‌ها
    
    const shuffled = [...otherAnswers].sort(() => Math.random() - 0.5);
    const randomOptions = shuffled.slice(0, 3);
    
    options.push(...randomOptions);
    
    // اگر گزینه‌ها کافی نبودند، اضافه کردن گزینه‌های عمومی
    while (options.length < 4) {
        options.push(`گزینه ${options.length + 1}`);
    }
    
    return options.sort(() => Math.random() - 0.5);
}

// گزینه تصادفی
function getRandomOption(wordList) {
    if (!wordList || wordList.length === 0) {
        return 'گزینه تصادفی';
    }
    
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    return randomWord.english || 'بدون متن';
}

// نمایش سوال فعلی
function displayCurrentQuestion() {
    if (!currentQuiz.isActive || currentQuiz.currentQuestionIndex >= currentQuiz.questions.length) {
        console.error("❌ آزمون فعال نیست یا سوالی وجود ندارد");
        return;
    }
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('quizOptions');
    
    if (!questionText || !optionsContainer) {
        console.error("❌ المان‌های DOM پیدا نشدند");
        return;
    }
    
    // نمایش سوال
    questionText.textContent = question.text || 'سوالی موجود نیست';
    console.log(`📝 نمایش سوال ${currentQuiz.currentQuestionIndex + 1}: ${question.text}`);
    
    // به‌روزرسانی اطلاعات
    updateQuizInfo();
    updateProgress();
    
    // پاک کردن گزینه‌های قبلی
    optionsContainer.innerHTML = '';
    
    // نمایش گزینه‌ها
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option || 'بدون متن';
        optionBtn.onclick = () => checkAnswer(index);
        
        optionsContainer.appendChild(optionBtn);
    });
    
    console.log(`✅ ${question.options.length} گزینه نمایش داده شد`);
}

// بررسی پاسخ
function checkAnswer(selectedIndex) {
    if (!currentQuiz.isActive) return;
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    const selectedOption = question.options[selectedIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // غیرفعال کردن کلیک
    optionButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // نمایش نتیجه
    optionButtons.forEach((btn, index) => {
        if (question.options[index] === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
            
            // ذخیره اشتباه
            MistakeStorage.addMistake({
                question: question.text,
                correctAnswer: question.correctAnswer,
                userAnswer: selectedOption,
                mode: currentQuiz.mode,
                explanation: '',
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // به‌روزرسانی امتیاز
    if (isCorrect) {
        currentQuiz.score++;
        showNotification('✅ پاسخ صحیح!', 'success');
    } else {
        showNotification(`❌ پاسخ اشتباه. پاسخ صحیح: ${question.correctAnswer}`, 'error');
    }
    
    // به‌روزرسانی نمایش
    document.getElementById('quizScore').textContent = currentQuiz.score;
    
    // سوال بعدی بعد از 1.5 ثانیه
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
    const currentElement = document.getElementById('currentQuestion');
    const totalElement = document.getElementById('totalQuestions');
    const scoreElement = document.getElementById('quizScore');
    
    if (currentElement) currentElement.textContent = currentQuiz.currentQuestionIndex + 1;
    if (totalElement) totalElement.textContent = currentQuiz.totalQuestions;
    if (scoreElement) scoreElement.textContent = currentQuiz.score;
}

// به‌روزرسانی نوار پیشرفت
function updateProgress() {
    const progress = ((currentQuiz.currentQuestionIndex) / currentQuiz.totalQuestions) * 100;
    const progressFill = document.getElementById('progressFill');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
        console.log(`📊 پیشرفت: ${Math.round(progress)}%`);
    }
}

// پایان آزمون
function finishQuiz() {
    currentQuiz.isActive = false;
    
    const finalScore = Math.round((currentQuiz.score / currentQuiz.totalQuestions) * 100);
    const duration = Math.round((Date.now() - currentQuiz.startTime) / 1000);
    
    console.log(`🏁 پایان آزمون: ${finalScore}% در ${duration} ثانیه`);
    
    // ذخیره تاریخچه
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    testHistory.push({
        mode: currentQuiz.mode,
        score: finalScore,
        correct: currentQuiz.score,
        total: currentQuiz.totalQuestions,
        duration: duration,
        date: new Date().toISOString(),
        wordSource: currentQuiz.wordSource ? 'available' : 'unknown'
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
    if (window.updateStars) {
        updateStars();
    }
    
    // پیشنهاد نصب PWA پس از موفقیت
    if (finalScore > 70 && window.suggestInstallAfterSuccess) {
        setTimeout(() => {
            window.suggestInstallAfterSuccess(finalScore);
        }, 1000);
    }
    
    // رفتن به صفحه نتایج
    switchView('results');
}

// نمایش نتایج
function displayResults(score, correct, total, bestScore) {
    const finalScoreElement = document.getElementById('finalScore');
    const correctCountElement = document.getElementById('correctCount');
    const totalCountElement = document.getElementById('totalCount');
    const bestResultElement = document.getElementById('bestResult');
    
    if (finalScoreElement) finalScoreElement.textContent = `${score}%`;
    if (correctCountElement) correctCountElement.textContent = correct;
    if (totalCountElement) totalCountElement.textContent = total;
    if (bestResultElement) bestResultElement.textContent = `${Math.max(score, bestScore)}%`;
    
    console.log(`📊 نتایج: ${correct}/${total} (${score}%) - بهترین: ${bestScore}%`);
}

// توابع اضافی
function reviewMistakesPage() {
    const mistakes = MistakeStorage.getAll();
    const mistakesList = document.getElementById('mistakesList');
    
    if (mistakesList) {
        if (mistakes.length === 0) {
            mistakesList.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><p>هیچ اشتباهی ثبت نشده است!</p></div>';
        } else {
            mistakesList.innerHTML = '';
            mistakes.forEach((mistake, index) => {
                const item = document.createElement('div');
                item.className = 'mistake-item';
                item.innerHTML = `
                    <div class="mistake-header">
                        <span class="mistake-number">${index + 1}</span>
                        <span class="mistake-mode">${getModeName(mistake.mode)}</span>
                    </div>
                    <div class="mistake-question">${mistake.question}</div>
                    <div class="mistake-answers">
                        <span class="correct-answer">✅ ${mistake.correctAnswer}</span>
                        <span class="user-answer">❌ ${mistake.userAnswer}</span>
                    </div>
                `;
                mistakesList.appendChild(item);
            });
        }
    }
    
    MistakeStorage.updateMistakesCount();
    switchView('mistakes');
}

function practiceMistakes() {
    const mistakes = MistakeStorage.getAll();
    if (mistakes.length > 0) {
        startQuiz('practice-mode');
    } else {
        showNotification('⚠️ هیچ اشتباهی برای تمرین وجود ندارد', 'error');
    }
}

function clearAllMistakes() {
    if (confirm('آیا مطمئنید می‌خواهید همه اشتباهات را پاک کنید؟')) {
        MistakeStorage.clearAll();
        showNotification('✅ همه اشتباهات پاک شدند', 'success');
        reviewMistakesPage();
    }
}

// اکسپورت توابع
window.startQuiz = startQuiz;
window.currentQuiz = currentQuiz;
window.reviewMistakesPage = reviewMistakesPage;
window.practiceMistakes = practiceMistakes;
window.clearAllMistakes = clearAllMistakes;
window.MistakeStorage = MistakeStorage;
