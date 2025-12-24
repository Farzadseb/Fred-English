// ===== Exit Functions =====
function exitApp() {
    if (confirm('برای خروج کامل، برنامه را از multitasking ببندید.\n\nبه صفحه اصلی برگردیم؟')) {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('home-screen').style.display = 'flex';
        showToast('در صفحه اصلی هستید ✓', '🏠');
    }
}

// ===== UI Functions =====
function updateStars() {
    const bestScore = parseInt(localStorage.getItem('fred_best_score') || '0');
    const starsContainer = document.getElementById('stars-container');
    const bestScoreElement = document.getElementById('best-score');
    
    bestScoreElement.textContent = bestScore;
    
    starsContainer.innerHTML = '';
    
    // 🎯 ستاره‌های صفر = کاملاً خنثی
    if (bestScore === 0) {
        for (let i = 0; i < 4; i++) {
            const star = document.createElement('span');
            star.className = 'star-zero';
            star.textContent = '☆';
            starsContainer.appendChild(star);
        }
        return;
    }
    
    const starCount = Math.floor(bestScore / 25);
    
    for (let i = 0; i < 4; i++) {
        const star = document.createElement('span');
        if (i < starCount) {
            star.className = 'star';
            star.textContent = '★';
        } else {
            star.className = 'star empty';
            star.textContent = '☆';
        }
        starsContainer.appendChild(star);
    }
}
