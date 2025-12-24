function exitQuiz() {
    if (currentQuestionIndex < currentSession.length && currentSession.length > 0) {
        const confirmExit = confirm('آیا مطمئنید می‌خواهید آزمون را رها کنید؟\n\nپیشرفت ذخیره نخواهد شد.');
        if (!confirmExit) {
            return;
        }
    }
    
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'flex';
    showToast('آزمون متوقف شد', '⏸️');
}
