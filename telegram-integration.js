// telegram-integration.js - نسخه اصلاح شده (بدون فاصله در لینک)
console.log('✅ سیستم تلگرام ساده بارگذاری شد');

const TelegramConfig = {
    botUsername: 'EnglishWithFredBot',
    teacherPhone: '09017708544',
    teacherName: 'English with Fred'
};

// تولید گزارش
function createProgressReport() {
    const userId = localStorage.getItem('userId') || 'user_' + Date.now();
    const bestScore = localStorage.getItem('bestScore') || '0';
    const totalTests = JSON.parse(localStorage.getItem('testHistory') || '[]').length;
    const now = new Date();
    
    return {
        fullReport: `
📊 گزارش English with Fred

👤 دانش‌آموز: ${userId}
📅 تاریخ: ${now.toLocaleDateString('fa-IR')}
⏰ ساعت: ${now.toLocaleTimeString('fa-IR')}

🏆 بهترین امتیاز: ${bestScore}%
📊 تعداد آزمون‌ها: ${totalTests}

👨‍🏫 مدرس: ${TelegramConfig.teacherName}
📱 تماس: ${TelegramConfig.teacherPhone}

✨ هر روز بهتر از دیروز ✨
        `.trim(),
        shortReport: `گزارش English with Fred - بهترین امتیاز: ${bestScore}%`
    };
}

// ارسال به تلگرام (نسخه اصلاح شده - بدون فاصله)
function sendToTelegram() {
    const report = createProgressReport();
    
    // 🔴 مشکل اصلی: فاصله قبل از ${encodedMessage}
    // ❌ اشتباه: `?text= ${encodedMessage}`
    // ✅ درست: `?text=${encodedMessage}`
    
    const encodedMessage = encodeURIComponent(report.shortReport);
    const telegramLink = `https://t.me/${TelegramConfig.botUsername}?text=${encodedMessage}`;
    
    console.log('🔗 لینک تلگرام (بدون فاصله):', telegramLink);
    
    // باز کردن تلگرام
    const telegramWindow = window.open(telegramLink, '_blank');
    
    // اگر پنجره باز نشد
    setTimeout(() => {
        if (!telegramWindow || telegramWindow.closed) {
            if (confirm('تلگرام باز نشد. آیا می‌خواهید گزارش در حافظه کپی شود؟')) {
                copyToClipboard(report.fullReport);
                alert('✅ گزارش کپی شد! حالا می‌توانید در تلگرام Paste کنید.');
            }
        } else {
            alert('📱 تلگرام باز شد! دکمه SEND را بزنید.');
        }
    }, 1000);
}

// کپی به کلیپ‌بورد
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => console.log('✅ متن کپی شد'))
            .catch(err => console.error('❌ خطا در کپی:', err));
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log('✅ متن کپی شد (روش قدیمی)');
    }
}

// تست لینک تلگرام
function testTelegramLink() {
    console.log('🧪 تست لینک تلگرام...');
    
    const report = createProgressReport();
    const encodedMessage = encodeURIComponent(report.shortReport);
    
    // لینک‌های مختلف برای تست
    const links = {
        correct: `https://t.me/${TelegramConfig.botUsername}?text=${encodedMessage}`,    // ✅ درست
        wrong: `https://t.me/${TelegramConfig.botUsername}?text= ${encodedMessage}`,     // ❌ اشتباه (با فاصله)
        whatsapp: `https://wa.me/989017708544?text=${encodedMessage}`,                   // واتساپ
        direct: `https://t.me/+989017708544?text=${encodedMessage}`                      // مستقیم به شماره
    };
    
    console.log('📊 لینک‌های تست:');
    console.log('1. ✅ درست:', links.correct);
    console.log('2. ❌ اشتباه (با فاصله):', links.wrong);
    console.log('3. 📱 واتساپ:', links.whatsapp);
    console.log('4. 📞 مستقیم:', links.direct);
    
    // تست لینک درست
    window.open(links.correct, '_blank');
    alert('✅ لینک اصلاح شده تست شد!');
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 سیستم تلگرام آماده است');
    console.log('برای تست لینک، در کنسول تایپ کنید: testTelegramLink()');
    
    // اضافه کردن به دکمه تلگرام
    const telegramBtn = document.querySelector('.gradient-telegram');
    if (telegramBtn) {
        telegramBtn.onclick = sendToTelegram;
    }
});

// اضافه کردن به global scope
window.sendTelegramReport = sendToTelegram;
window.testTelegramLink = testTelegramLink;
