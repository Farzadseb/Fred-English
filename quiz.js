/**
 * Quiz System for English with Fred
 * Version 2.2 - Production Ready
 */

// Global quiz state
let currentMode = 'en-fa';
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let quizInProgress = false;
let quizStartTime = null;
let currentWord = null;
let correctAnswer = null;
let reviewedMistakeIds = new Set();

// Shuffle بهتر
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Initialize quiz
function initQuiz(mode = 'en-fa') {
    console.log(`🎯 Initializing quiz in ${mode} mode`);
    
    currentMode = mode;
    currentQuestionIndex = 0;
    correctCount = 0;
    quizInProgress = true;
    window.quizInProgress = true;
    quizStartTime = Date.now();
    currentWord = null;
    correctAnswer = null;
    reviewedMistakeIds.clear();
    
    // Load appropriate words
    loadQuestions(mode);
    
    // Show first question
    if (questions.length > 0) {
        showQuestion();
    } else {
        console.error('❌ No questions available');
        exitQuiz();
    }
}

// Load questions based on mode
function loadQuestions(mode) {
    questions = [];
    
    if (typeof window.wordsA1 === 'undefined' || !Array.isArray(window.wordsA1)) {
        console.error('❌ Words data not available');
        return;
    }
    
    const allWords = [...window.wordsA1];
    
    if (mode === 'mistake-review') {
        // For mistake review, use provided questions
        if (window.mistakeReviewWords && window.mistakeReviewWords.length > 0) {
            questions = window.mistakeReviewWords.map(word => ({
                word: word,
                mode: word.mode || 'en-fa'
            }));
        }
        return;
    }
    
    // Shuffle words
    const shuffledWords = shuffle(allWords);
    
    // Select first 10 words
    const selectedWords = shuffledWords.slice(0, 10);
    
    // Create questions
    selectedWords.forEach(word => {
        questions.push({
            word: word,
            mode: mode
        });
    });
    
    console.log(`📝 Loaded ${questions.length} questions for ${mode} mode`);
}

// Start mistake review
function startMistakeReview(mistakeWords) {
    console.log('🎯 Starting mistake review with', mistakeWords.length, 'words');
    
    window.mistakeReviewWords = mistakeWords;
    initQuiz('mistake-review');
}

// Display current question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }
    
    const questionData = questions[currentQuestionIndex];
    currentWord = questionData.word;
    const mode = questionData.mode;
    
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const progressElement = document.getElementById('progress');
    
    // Update progress
    progressElement.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Prepare options
    let correctAnswerText = '';
    let options = [];
    
    switch(mode) {
        case 'en-fa':
            questionElement.textContent = `"${currentWord.english}" به فارسی چیست؟`;
            correctAnswerText = currentWord.persian;
            options = getRandomOptions(currentWord, 'persian', 4);
            break;
            
        case 'fa-en':
            questionElement.textContent = `"${currentWord.persian}" به انگلیسی چیست؟`;
            correctAnswerText = currentWord.english;
            options = getRandomOptions(currentWord, 'english', 4);
            break;
            
        case 'word-def':
            questionElement.textContent = `معنی "${currentWord.english}" چیست؟`;
            correctAnswerText = currentWord.persian;
            options = getRandomOptions(currentWord, 'persian', 4);
            break;
            
        case 'def-word':
            questionElement.textContent = `کلمه‌ای که معنی آن "${currentWord.persian}" است چیست؟`;
            correctAnswerText = currentWord.english;
            options = getRandomOptions(currentWord, 'english', 4);
            break;
            
        case 'mistake-review':
            const reviewMode = currentWord.mode || 'en-fa';
            if (reviewMode === 'en-fa') {
                questionElement.textContent = `"${currentWord.english}" به فارسی چیست؟`;
                correctAnswerText = currentWord.persian;
                options = getRandomOptions(currentWord, 'persian', 4);
            } else {
                questionElement.textContent = `"${currentWord.persian}" به انگلیسی چیست؟`;
                correctAnswerText = currentWord.english;
                options = getRandomOptions(currentWord, 'english', 4);
            }
            break;
    }
    
    correctAnswer = correctAnswerText;
    
    // Display options
    options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'option-btn';
        optionElement.textContent = option;
        optionElement.onclick = () => checkAnswer(option);
        optionsElement.appendChild(optionElement);
    });
    
    // Auto-speak for English questions
    const displayMode = currentWord.mode || currentMode;
    if ((displayMode === 'en-fa' || displayMode === 'word-def') && !window.isMuted) {
        setTimeout(() => {
            speakWord(currentWord.english);
        }, 500);
    }
}

// Get random options including correct answer
function getRandomOptions(correctWord, field, count) {
    if (typeof window.wordsA1 === 'undefined') {
        return [correctWord[field]];
    }
    
    const allWords = window.wordsA1.filter(w => w[field] !== correctWord[field]);
    const shuffled = shuffle(allWords);
    const wrongOptions = shuffled.slice(0, count - 1).map(w => w[field]);
    
    // Combine and shuffle
    const options = [correctWord[field], ...wrongOptions];
    return shuffle(options);
}

// Check answer
function checkAnswer(selectedOption) {
    const isCorrect = selectedOption === correctAnswer;
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // Disable all buttons
    optionButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        }
        
        if (btn.textContent === selectedOption && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // Update score
    if (isCorrect) {
        correctCount++;
    }
    
    // ثبت سؤال در Progress Tracker
    if (typeof ProgressTracker !== 'undefined' && currentWord) {
        const trackingMode = currentWord.mode || currentMode;
        ProgressTracker.recordQuestion(trackingMode, isCorrect, currentWord);
        
        // جلوگیری از ثبت دوباره
        if (currentWord.mistakeId && isCorrect && !reviewedMistakeIds.has(currentWord.mistakeId)) {
            ProgressTracker.increaseReviewCount(currentWord.mistakeId);
            reviewedMistakeIds.add(currentWord.mistakeId);
        }
    }
    
    // Show result
    showResultFeedback(isCorrect);
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

// Show feedback for answer
function showResultFeedback(isCorrect) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.textContent = isCorrect ? '✅ درست!' : '❌ اشتباه';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        padding: 20px 40px;
        border-radius: 50px;
        z-index: 1000;
        animation: popIn 0.5s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

// Speak question
function speakQuestion() {
    if (!currentWord) return;
    
    const mode = currentWord.mode || currentMode;
    
    if (mode === 'en-fa' || mode === 'word-def') {
        speakWord(currentWord.english);
    } else if (mode === 'fa-en' || mode === 'def-word') {
        showCustomModal('🔊 تلفظ انگلیسی', `
            <div style="text-align: center; padding: 20px;">
                <p style="font-size: 24px; margin-bottom: 10px;">${currentWord.english}</p>
                <p style="color: #666; margin-bottom: 20px;">${currentWord.phonetic || ''}</p>
                <button class="btn btn-primary" onclick="speakWord('${currentWord.english}')">
                    پخش تلفظ
                </button>
            </div>
        `);
    }
}

// End quiz and show results
function endQuiz() {
    quizInProgress = false;
    window.quizInProgress = false;
    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // Calculate time spent
    const timeSpent = quizStartTime ? Math.round((Date.now() - quizStartTime) / 60000) : null;
    
    // ثبت جلسه در Progress Tracker
    if (typeof ProgressTracker !== 'undefined') {
        const sessionMode = currentMode === 'mistake-review' ? 'review' : currentMode;
        ProgressTracker.recordSession(sessionMode, score, totalQuestions, timeSpent);
    }
    
    // Update best score
    if (typeof updateBestScore === 'function') {
        updateBestScore(score);
    }
    
    // Show results
    showResults(score, totalQuestions, correctCount);
}

// Show quiz results
function showResults(score, totalQuestions, correctCount) {
    const displayMode = currentMode === 'mistake-review' ? 'review' : currentMode;
    
    const resultHTML = `
        <div class="quiz-results">
            <div class="result-header">
                <div class="result-icon">${score >= 70 ? '🎉' : '📊'}</div>
                <h3>نتایج آزمون</h3>
            </div>
            
            <div class="result-stats">
                <div class="stat-item">
                    <span class="stat-label">نمره شما</span>
                    <span class="stat-value ${score >= 70 ? 'good' : 'average'}">${score}%</span>
                </div>
                
                <div class="stat-item">
                    <span class="stat-label">پاسخ صحیح</span>
                    <span class="stat-value">${correctCount} از ${totalQuestions}</span>
                </div>
                
                <div class="stat-item">
                    <span class="stat-label">حالت آزمون</span>
                    <span class="stat-value">${getModeName(displayMode)}</span>
                </div>
            </div>
            
            <div class="result-feedback">
                ${getFeedbackMessage(score)}
            </div>
            
            <div class="result-actions">
                <button class="btn btn-primary" onclick="restartQuiz()">
                    <span>🔄</span> آزمون مجدد
                </button>
                
                <button class="btn btn-secondary" onclick="exitQuiz()">
                    <span>🏠</span> بازگشت به خانه
                </button>
                
                ${score < 70 ? `
                <button class="btn btn-warning" onclick="ProgressTracker.reviewMistakesHandler()">
                    <span>🎯</span> مرور اشتباهات
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    showCustomModal('نتایج آزمون', resultHTML);
}

// Restart quiz
function restartQuiz() {
    closeCustomModal();
    initQuiz(currentMode);
}

// Reset quiz state
function resetQuiz() {
    quizInProgress = false;
    window.quizInProgress = false;
    currentQuestionIndex = 0;
    correctCount = 0;
    quizStartTime = null;
    currentWord = null;
    correctAnswer = null;
    questions = [];
    window.mistakeReviewWords = null;
    reviewedMistakeIds.clear();
}

// Helper functions
function getModeName(mode) {
    const modes = {
        'en-fa': 'انگلیسی → فارسی',
        'fa-en': 'فارسی → انگلیسی',
        'word-def': 'کلمه → معنی',
        'def-word': 'معنی → کلمه',
        'mistake-review': 'مرور اشتباهات',
        'review': 'مرور اشتباهات'
    };
    return modes[mode] || mode;
}

function getFeedbackMessage(score) {
    if (score >= 90) {
        return 'عالی! شما تسلط بسیار خوبی دارید. 👏';
    } else if (score >= 70) {
        return 'خوب! در مسیر درستی هستید. 👍';
    } else if (score >= 50) {
        return 'قابل قبول، نیاز به تمرین بیشتر دارید. 📚';
    } else {
        return 'نیاز به تمرین جدی دارید. 💪';
    }
}

// Export for use in other files
window.quizInProgress = false;
window.initQuiz = initQuiz;
window.startMistakeReview = startMistakeReview;

console.log('✅ Quiz.js v2.2 loaded successfully');
