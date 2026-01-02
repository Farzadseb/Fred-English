// تابع رفتن به بخش تمرین (صفحه داخلی)
function startQuiz(type) {
    // ۱. مخفی کردن منوی اصلی و تنظیمات هدر
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('header-settings').style.display = 'none';
    
    // ۲. نمایش بخش تمرین و دکمه بازگشت
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('back-button').style.display = 'flex';
    
    // منطق شروع کوییز بر اساس نوع (type) اینجا اجرا شود
    console.log("Starting quiz: " + type);
}

// تابع بازگشت به منوی اصلی
function showMainMenu() {
    // ۱. نمایش منوی اصلی و تنظیمات هدر
    document.getElementById('main-menu').style.display = 'grid';
    document.getElementById('header-settings').style.display = 'flex';
    
    // ۲. مخفی کردن بخش تمرین و دکمه بازگشت
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('back-button').style.display = 'none';
}

// مدیریت Mute و Theme همان کدهای قبلی هستند
