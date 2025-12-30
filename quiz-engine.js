// =======================
// QUIZ ENGINE - نسخه کامل با پخش خودکار صوت
// =======================

// وضعیت آزمون
let currentQuiz = {
    mode: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 10,
    isActive: false,
    startTime: null,
    soundPlayed: {} // برای پیگیری اینکه کدام سوال‌ها صوت پخش شده
};

// سیستم سطح‌بندی لغات از آسان به سخت
function getWordDifficulty(word) {
    const english = word.english || '';
    const persian = word.persian || '';
    
    // محاسبه امتیاز سختی
    let difficultyScore = 0;
    
    // بر اساس طول کلمه انگلیسی
    if (english.length <= 4) difficultyScore += 1;    // آسان
    else if (english.length <= 6) difficultyScore += 2; // متوسط
    else difficultyScore += 3;                         // سخت
    
    // بر اساس تعداد کلمات در تعریف
    const definition = word.definition || '';
    const definitionWords = definition.split(' ').length;
    if (definitionWords > 5) difficultyScore += 1;
    
    // بر اساس طول ترجمه فارسی
    if (persian.length > 15) difficultyScore += 1;
    
    // بر اساس وجود کاراکترهای خاص
    if (english.includes(' ') || english.includes('-')) difficultyScore += 1;
    
    return difficultyScore;
}

// مرتب‌سازی لغات از آسان به سخت
function sortWordsByDifficulty(words) {
    return [...words].sort((a, b) => {
        return getWordDifficulty(a) - getWordDifficulty(b);
    });
}

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
        soundPlayed: {}, // ریست کردن وضعیت صوت
        wordSource: availableWords,
        userId: window.appState?.currentUser?.id || 'anonymous'
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

// تولید سوالات با سطح‌بندی
function generateQuestions(mode, wordList) {
    console.log(`🎯 تولید سوالات برای حالت: ${mode}`);
    currentQuiz.questions = [];
    
    // اطمینان از داشتن لغات کافی
    if (!wordList || wordList.length < 4) {
        console.error("❌ لغات کافی نیست:", wordList ? wordList.length : 0);
        return;
    }
    
    // مرتب‌سازی لغات از آسان به سخت
    const sortedWords = sortWordsByDifficulty(wordList);
    
    // تقسیم لغات به سه سطح: آسان، متوسط، سخت
    const easyWords = sortedWords.slice(0, Math.floor(sortedWords.length / 3));
    const mediumWords = sortedWords.slice(
        Math.floor(sortedWords.length / 3), 
        Math.floor(2 * sortedWords.length / 3)
    );
    const hardWords = sortedWords.slice(Math.floor(2 * sortedWords.length / 3));
    
    // توزیع سوالات: 4 آسان، 3 متوسط، 3 سخت
    const questions = [];
    
    // سوالات آسان
    const selectedEasy = [...easyWords].sort(() => Math.random() - 0.5)
        .slice(0, Math.min(4, easyWords.length));
    
    // سوالات متوسط
    const selectedMedium = [...mediumWords].sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, mediumWords.length));
    
    // سوالات سخت
    const selectedHard = [...hardWords].sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, hardWords.length));
    
    // ترکیب همه سوالات با حفظ ترتیب
    const allSelectedWords = [...selectedEasy, ...selectedMedium, ...selectedHard];
    
    console.log(`📊 توزیع سوالات: ${selectedEasy.length} آسان, ${selectedMedium.length} متوسط, ${selectedHard.length} سخت`);
    
    // ایجاد سوالات
    allSelectedWords.forEach((word, index) => {
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
                        word: word,
                        difficulty: index < 4 ? 'آسان' : index < 7 ? 'متوسط' : 'سخت'
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
                        word: word,
                        difficulty: index < 4 ? 'آسان' : index < 7 ? 'متوسط' : 'سخت'
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
                        word: word,
                        difficulty: index < 4 ? 'آسان' : index < 7 ? 'متوسط' : 'سخت'
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
                        word: word,
                        difficulty: index < 4 ? 'آسان' : index < 7 ? 'متوسط' : 'سخت'
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
            }
        } catch (error) {
            console.error(`❌ خطا در ایجاد سوال:`, error);
        }
    });
    
    console.log(`✅ ${currentQuiz.questions.length} سوال تولید شد (از آسان به سخت)`);
}

// تولید گزینه‌ها (رفع مشکل گزینه خالی)
function generateOptions(correctAnswer, allAnswers) {
    if (!correctAnswer) correctAnswer = "پاسخ صحیح";
    
    const options = [correctAnswer];
    
    // فیلتر گزینه‌های معتبر
    const validAnswers = allAnswers
        .filter(answer => answer && answer.toString().trim() !== '' && answer !== correctAnswer)
        .filter((value, index, self) => self.indexOf(value) === index);
    
    // اگر کافی نبود، از لغات دیگر استفاده کن
    if (validAnswers.length < 3) {
        const wordList = currentQuiz.wordSource || window.words || [];
        const randomWords = [...wordList]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10)
            .map(w => {
                if (currentQuiz.mode === 'english-persian' || currentQuiz.mode === 'word-definition') {
                    return w.english;
                } else {
                    return w.persian;
                }
            })
            .filter(word => word && word.toString().trim() !== '' && word !== correctAnswer);
        
        const uniqueRandomWords = [...new Set(randomWords)];
        validAnswers.push(...uniqueRandomWords);
    }
    
    // انتخاب ۳ گزینه تصادفی
    const shuffled = [...validAnswers].sort(() => Math.random() - 0.5);
    const selectedOptions = shuffled.slice(0, 3);
    
    options.push(...selectedOptions);
    
    // حذف تکراری‌ها و خالی‌ها
    const finalOptions = [...new Set(options)]
        .filter(opt => opt && opt.toString().trim() !== '')
        .slice(0, 4);
    
    // اگر هنوز ۴ گزینه نداریم، گزینه عمومی اضافه کن
    while (finalOptions.length < 4) {
        finalOptions.push(`گزینه ${finalOptions.length + 1}`);
    }
    
    return finalOptions.sort(() => Math.random() - 0.5);
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
    
    // پخش خودکار صوت فقط در دور اول هر سوال
    setTimeout(() => {
        if (window.appState?.soundEnabled && window.speakText && !currentQuiz.soundPlayed[currentQuiz.currentQuestionIndex]) {
            window.speakText(question.text, 0.5);
            currentQuiz.soundPlayed[currentQuiz.currentQuestionIndex] = true;
            console.log(`🔊 پخش خودکار صوت سوال ${currentQuiz.currentQuestionIndex + 1}`);
        }
    }, 800); // تأخیر 800 میلی‌ثانیه برای پخش خودکار
}

// تلفظ سوال فعلی (برای دکمه بلندگو)
function speakCurrentQuestion() {
    if (!currentQuiz.isActive || currentQuiz.currentQuestionIndex >= currentQuiz.questions.length) {
        return;
    }
    
    const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
    
    if (window.appState?.soundEnabled && window.speakText) {
        window.speakText(question.text, 0.5);
        console.log(`🔊 تکرار صوت سوال ${currentQuiz.currentQuestionIndex + 1}`);
        showNotification('🔊 تکرار صوت', 'info');
    } else {
        showNotification('🔇 لطفاً ابتدا صدا را فعال کنید', 'warning');
    }
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
                difficulty: question.difficulty,
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
    const now = new Date();
    
    console.log(`🏁 پایان آزمون: ${finalScore}% در ${duration} ثانیه`);
    
    // ذخیره تاریخچه با شناسه کاربر
    const userKey = window.appState?.currentUser ? `testHistory_${window.appState.currentUser.id}` : 'testHistory';
    const testHistory = JSON.parse(localStorage.getItem(userKey) || '[]');
    testHistory.push({
        mode: currentQuiz.mode,
        score: finalScore,
        correct: currentQuiz.score,
        total: currentQuiz.totalQuestions,
        duration: duration,
        date: new Date().toISOString(),
        time: now.toLocaleTimeString('fa-IR'),
        userId: currentQuiz.userId,
        username: window.appState?.currentUser?.username || 'کاربر ناشناس'
    });
    localStorage.setItem(userKey, JSON.stringify(testHistory));
    
    // به‌روزرسانی بهترین امتیاز
    const bestScoreKey = window.appState?.currentUser ? `bestScore_${window.appState.currentUser.id}` : 'bestScore';
    const bestScore = parseInt(localStorage.getItem(bestScoreKey) || '0');
    if (finalScore > bestScore) {
        localStorage.setItem(bestScoreKey, finalScore.toString());
        showNotification(`🎉 رکورد جدید! ${finalScore}%`, 'success');
    }
    
    // نمایش نتایج
    displayResults(finalScore, currentQuiz.score, currentQuiz.totalQuestions, bestScore, now);
    
    // به‌روزرسانی ستاره‌ها
    if (window.updateStars) {
        window.updateStars();
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
function displayResults(score, correct, total, bestScore, date) {
    const finalScoreElement = document.getElementById('finalScore');
    const correctCountElement = document.getElementById('correctCount');
    const totalCountElement = document.getElementById('totalCount');
    const bestResultElement = document.getElementById('bestResult');
    const resultTimeElement = document.getElementById('resultTimeText');
    
    if (finalScoreElement) finalScoreElement.textContent = `${score}%`;
    if (correctCountElement) correctCountElement.textContent = correct;
    if (totalCountElement) totalCountElement.textContent = total;
    if (bestResultElement) bestResultElement.textContent = `${Math.max(score, bestScore)}%`;
    if (resultTimeElement && date) {
        resultTimeElement.textContent = `${date.toLocaleDateString('fa-IR')} - ${date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
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
                        <span class="mistake-difficulty">${mistake.difficulty || 'نامشخص'}</span>
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

// اشتباهات کاربر
const MistakeStorage = {
    getAll: function() {
        const userKey = window.appState?.currentUser ? `fredMistakes_${window.appState.currentUser.id}` : 'fredMistakes';
        return JSON.parse(localStorage.getItem(userKey) || '[]');
    },
    
    addMistake: function(mistake) {
        const userKey = window.appState?.currentUser ? `fredMistakes_${window.appState.currentUser.id}` : 'fredMistakes';
        const mistakes = this.getAll();
        
        // جلوگیری از ذخیره تکراری
        const exists = mistakes.some(m => 
            m.question === mistake.question && 
            m.correctAnswer === mistake.correctAnswer
        );
        
        if (!exists) {
            mistakes.push(mistake);
            localStorage.setItem(userKey, JSON.stringify(mistakes));
            this.updateMistakesCount();
        }
    },
    
    clearAll: function() {
        const userKey = window.appState?.currentUser ? `fredMistakes_${window.appState.currentUser.id}` : 'fredMistakes';
        localStorage.removeItem(userKey);
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

// اکسپورت توابع
window.startQuiz = startQuiz;
window.currentQuiz = currentQuiz;
window.reviewMistakesPage = reviewMistakesPage;
window.practiceMistakes = practiceMistakes;
window.clearAllMistakes = clearAllMistakes;
window.MistakeStorage = MistakeStorage;
window.speakCurrentQuestion = speakCurrentQuestion; // اضافه کردن تابع تلفظ
