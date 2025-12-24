// quiz.js - منطق آزمون

// ===== Quiz Functions =====
function startQuiz(mode) {
    if (words.length === 0) {
        showToast('لغات بارگذاری نشده‌اند!', '⚠️');
        return;
    }
    
    currentMode = mode;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    // Create quiz session
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    currentSession = shuffledWords.slice(0, Math.min(10, shuffledWords.length));
    
    if (currentSession.length === 0) {
        showToast('هیچ لغتی برای آزمون وجود ندارد!', '⚠️');
        return;
    }
    
    // Switch to quiz screen
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'flex';
    
    // Load first question
    loadQuestion();
}

function reviewMistakes() {
    if (mistakes.length === 0) {
        showToast('🎉 هنوز اشتباهی نداشته‌اید!', '🎯');
        return;
    }
    
    currentMode = 'review';
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    // Use mistakes as session
    const shuffledMistakes = [...mistakes].sort(() => Math.random() - 0.5);
    currentSession = shuffledMistakes.slice(0, Math.min(10, shuffledMistakes.length));
    
    // Switch to quiz screen
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'flex';
    
    // Load first question
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= currentSession.length) {
        finishQuiz();
        return;
    }
    
    const questionData = currentSession[currentQuestionIndex];
    const progressElement = document.getElementById('progress');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    // Update progress
    progressElement.textContent = `${currentQuestionIndex + 1}/${currentSession.length}`;
    
    // Set question based on mode
    let question = '';
    let correctAnswer = '';
    let allAnswers = [];
    
    if (currentMode === 'en-fa') {
        question = questionData.english;
        correctAnswer = questionData.persian;
        allAnswers = words.map(w => w.persian);
    } else if (currentMode === 'fa-en') {
        question = questionData.persian;
        correctAnswer = questionData.english;
        allAnswers = words.map(w => w.english);
    } else if (currentMode === 'word-def') {
        question = questionData.english;
        correctAnswer = questionData.definition;
        allAnswers = words.map(w => w.definition);
    } else if (currentMode === 'def-word') {
        question = questionData.definition;
        correctAnswer = questionData.english;
        allAnswers = words.map(w => w.english);
    } else if (currentMode === 'review') {
        question = questionData.english;
        correctAnswer = questionData.persian;
        allAnswers = words.map(w => w.persian);
    }
    
    // Set question text
    questionElement.textContent = question;
    
    // Generate options
    const wrongAnswers = allAnswers
        .filter(ans => ans !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    const allOptions = [correctAnswer, ...wrongAnswers]
        .sort(() => Math.random() - 0.5);
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Create option elements
    allOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        
        optionElement.addEventListener('click', () => {
            checkAnswer(option, correctAnswer, questionData);
        });
        
        optionsElement.appendChild(optionElement);
    });
    
    // Speak the question
    if (!isMuted) {
        speakQuestion();
    }
}

function checkAnswer(selected, correct, questionData) {
    const options = document.querySelectorAll('.option');
    const isCorrect = selected === correct;
    
    // Disable all options
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        
        if (opt.textContent === correct) {
            opt.classList.add('correct');
        }
        
        if (opt.textContent === selected && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    // Update score
    if (isCorrect) {
        correctAnswers++;
        
        // Remove from mistakes if exists
        if (currentMode !== 'review') {
            mistakes = mistakes.filter(m => m.english !== questionData.english);
        }
        
        // Play correct sound if not muted
        if (!isMuted) {
            playSound('correct');
        }
    } else if (currentMode !== 'review') {
        // Add to mistakes if not already there
        const alreadyExists = mistakes.some(m => m.english === questionData.english);
        if (!alreadyExists) {
            mistakes.push(questionData);
        }
        
        // Play incorrect sound if not muted
        if (!isMuted) {
            playSound('incorrect');
        }
    }
    
    // Save mistakes
    localStorage.setItem('fred_mistakes', JSON.stringify(mistakes));
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function finishQuiz() {
    const scorePercentage = Math.round((correctAnswers / currentSession.length) * 100);
    
    // Update best score if needed
    const currentBest = parseInt(localStorage.getItem('fred_best_score') || '0');
    if (scorePercentage > currentBest) {
        localStorage.setItem('fred_best_score', scorePercentage);
        updateStars();
        showToast(`🏆 امتیاز جدید: ${scorePercentage}%`, '🎉');
    }
    
    // Show result
    setTimeout(() => {
        alert(`🎉 آزمون به پایان رسید!\n\nامتیاز شما: ${scorePercentage}%\nپاسخ‌های صحیح: ${correctAnswers} از ${currentSession.length}`);
        exitQuiz();
    }, 500);
}

function exitQuiz() {
    if (currentQuestionIndex < currentSession.length && currentSession.length > 0) {
        const confirmExit = confirm('آیا مطمئنید می‌خواهید آزمون را رها کنید؟');
        if (!confirmExit) {
            return;
        }
    }
    
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'flex';
}
