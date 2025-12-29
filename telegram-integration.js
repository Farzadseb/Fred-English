// =======================
// TELEGRAM INTEGRATION - کامل با اطلاعات شما
// =======================

// 🔐 تنظیمات تلگرام شما
const telegramConfig = {
    botUsername: 'EnglishWithFredBot',
    botToken: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw', // توکن شما
    chatId: '96991859', // Chat ID شما
    apiUrl: 'https://api.telegram.org/bot',
    
    // اطلاعات مدرس
    teacherInfo: {
        name: 'English with Fred',
        phone: '09017708544',
        whatsapp: 'https://wa.me/989017708544'
    }
};

// ارسال گزارش به تلگرام
function sendTelegramReport() {
    // ایجاد گزارش کامل
    const report = generateProgressReport();
    
    // نشان دادن وضعیت ارسال
    showNotification('📤 در حال ارسال گزارش به تلگرام...', 'info');
    
    // اگر ربات واقعی داریم، از API استفاده می‌کنیم
    if (telegramConfig.botToken && telegramConfig.botToken.length > 20) {
        sendViaTelegramAPI(report);
    } else {
        // در غیر این صورت از لینک تلگرام استفاده می‌کنیم
        sendViaTelegramLink(report);
    }
}

// تولید گزارش پیشرفت
function generateProgressReport() {
    const userId = localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 6);
    const bestScore = localStorage.getItem('bestScore') || '0';
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    const totalTests = testHistory.length;
    
    // محاسبه آمار
    let avgScore = 0;
    if (totalTests > 0) {
        const total = testHistory.reduce((sum, test) => sum + test.score, 0);
        avgScore = Math.round(total / totalTests);
    }
    
    const today = new Date().toLocaleDateString('fa-IR');
    const time = new Date().toLocaleTimeString('fa-IR');
    
    return {
        userId: userId,
        date: today,
        time: time,
        bestScore: `${bestScore}%`,
        averageScore: `${avgScore}%`,
        totalTests: totalTests,
        teacherName: telegramConfig.teacherInfo.name,
        teacherPhone: telegramConfig.teacherInfo.phone,
        
        // متن گزارش
        message: `
📊 **گزارش پیشرفت English with Fred**
👤 دانش‌آموز: ${userId}
📅 تاریخ: ${today} - ${time}
⭐ بهترین امتیاز: ${bestScore}%
📈 میانگین امتیاز: ${avgScore}%
📊 تعداد آزمون‌ها: ${totalTests}

👨‍🏫 مدرس: ${telegramConfig.teacherInfo.name}
📱 تماس: ${telegramConfig.teacherInfo.phone}
📲 واتساپ: ${telegramConfig.teacherInfo.whatsapp}

این گزارش به صورت خودکار ارسال شده است.
        `.trim()
    };
}

// ارسال از طریق API تلگرام
async function sendViaTelegramAPI(report) {
    try {
        const response = await fetch(
            `${telegramConfig.apiUrl}${telegramConfig.botToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: telegramConfig.chatId,
                    text: report.message,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                })
            }
        );
        
        const data = await response.json();
        
        if (data.ok) {
            showNotification('✅ گزارش با موفقیت به تلگرام ارسال شد', 'success');
            console.log('📤 گزارش تلگرام ارسال شد:', data.result.message_id);
            return true;
        } else {
            console.error('❌ خطای تلگرام:', data);
            showNotification('⚠️ خطا در ارسال. از روش لینک استفاده کنید.', 'warning');
            
            // تلاش مجدد با لینک
            setTimeout(() => sendViaTelegramLink(report), 1000);
            return false;
        }
    } catch (error) {
        console.error('❌ خطای شبکه تلگرام:', error);
        showNotification('❌ اتصال اینترنت را بررسی کنید', 'error');
        
        // تلاش مجدد با لینک
        setTimeout(() => sendViaTelegramLink(report), 1000);
        return false;
    }
}

// ارسال از طریق لینک تلگرام
function sendViaTelegramLink(report) {
    // کوتاه کردن پیام برای لینک
    const shortMessage = `
📊 گزارش English with Fred
👤 ${report.userId}
⭐ بهترین: ${report.bestScore}
📊 آزمون‌ها: ${report.totalTests}
📅 ${report.date}
    `.trim();
    
    const encodedMessage = encodeURIComponent(shortMessage);
    const telegramLink = `https://t.me/${telegramConfig.botUsername}?text=${encodedMessage}`;
    
    // باز کردن تلگرام در تب جدید
    window.open(telegramLink, '_blank');
    
    showNotification('📤 لینک تلگرام باز شد. پیام را ارسال کنید.', 'info');
    return true;
}

// ارسال خودکار بعد از هر آزمون
function sendAutoTelegramReport(quizResult) {
    // بررسی اینکه کاربر می‌خواهد گزارش خودکار داشته باشد
    const autoReport = localStorage.getItem('autoTelegramReport') === 'true';
    
    if (!autoReport) return;
    
    const report = {
        userId: localStorage.getItem('userId') || 'ناشناس',
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR'),
        mode: quizResult.mode,
        score: `${quizResult.score}%`,
        correct: quizResult.correct,
        total: quizResult.total,
        duration: quizResult.duration
    };
    
    const message = `
🎯 **آزمون تکمیل شد**
👤 دانش‌آموز: ${report.userId}
📅 تاریخ: ${report.date} - ${report.time}
🎮 حالت: ${getModeName(report.mode)}
⭐ امتیاز: ${report.score}
✅ پاسخ صحیح: ${report.correct}/${report.total}
⏱️ مدت: ${report.duration} ثانیه

این گزارش به صورت خودکار ارسال شده است.
    `.trim();
    
    // ارسال به تلگرام
    sendViaTelegramLink({ message: message });
}

// فعال‌سازی گزارش خودکار
function enableAutoTelegramReports() {
    if (confirm('آیا می‌خواهید بعد از هر آزمون، گزارش به صورت خودکار برای مدرس ارسال شود؟')) {
        localStorage.setItem('autoTelegramReport', 'true');
        showNotification('✅ گزارش خودکار تلگرام فعال شد', 'success');
        return true;
    }
    return false;
}

// غیرفعال‌سازی گزارش خودکار
function disableAutoTelegramReports() {
    localStorage.setItem('autoTelegramReport', 'false');
    showNotification('🔕 گزارش خودکار تلگرام غیرفعال شد', 'info');
}

// تست اتصال تلگرام
async function testTelegramConnection() {
    if (!telegramConfig.botToken || telegramConfig.botToken.length < 20) {
        showNotification('❌ توکن تلگرام تنظیم نشده است', 'error');
        return;
    }
    
    showNotification('🔗 در حال تست اتصال به تلگرام...', 'info');
    
    try {
        // تست دریافت اطلاعات ربات
        const response = await fetch(
            `${telegramConfig.apiUrl}${telegramConfig.botToken}/getMe`
        );
        
        if (!response.ok) {
            throw new Error('توکن نامعتبر است');
        }
        
        const data = await response.json();
        
        if (data.ok) {
            showNotification(`✅ اتصال موفق! ربات: @${data.result.username}`, 'success');
            
            // تست ارسال پیام
            const testMessage = `✅ تست اتصال موفق!\nربات: ${data.result.first_name}\nزمان: ${new Date().toLocaleString('fa-IR')}`;
            
            const sendResponse = await fetch(
                `${telegramConfig.apiUrl}${telegramConfig.botToken}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: telegramConfig.chatId,
                        text: testMessage,
                        parse_mode: 'Markdown'
                    })
                }
            );
            
            const sendData = await sendResponse.json();
            
            if (sendData.ok) {
                showNotification('✅ پیام تست با موفقیت ارسال شد', 'success');
            } else {
                showNotification('⚠️ ربات فعال است اما ارسال پیام مشکل دارد', 'warning');
            }
        }
        
    } catch (error) {
        console.error('❌ خطای اتصال تلگرام:', error);
        showNotification('❌ اتصال ناموفق. توکن یا اینترنت را بررسی کنید', 'error');
    }
}

// تابع کمکی برای نام حالت
function getModeName(mode) {
    const modes = {
        'english-persian': 'انگلیسی → فارسی',
        'persian-english': 'فارسی → انگلیسی',
        'word-definition': 'کلمه → تعریف',
        'definition-word': 'تعریف → کلمه'
    };
    return modes[mode] || mode;
}

// افزودن دکمه تست تلگرام به صفحه
function addTelegramTestButton() {
    const telegramBtn = document.querySelector('.gradient-telegram');
    if (telegramBtn) {
        telegramBtn.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            testTelegramConnection();
        });
        
        // اضافه کردن hint
        telegramBtn.title = 'کلیک راست: تست اتصال تلگرام';
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 سیستم تلگرام بارگذاری شد');
    console.log('📱 مدرس:', telegramConfig.teacherInfo.name);
    console.log('📞 تماس:', telegramConfig.teacherInfo.phone);
    
    addTelegramTestButton();
    
    // بررسی وضعیت گزارش خودکار
    const autoReport = localStorage.getItem('autoTelegramReport') === 'true';
    if (autoReport) {
        console.log('✅ گزارش خودکار تلگرام فعال است');
    }
});

// تابع برای گرفتن وضعیت تلگرام
function getTelegramStatus() {
    return {
        botConfigured: telegramConfig.botToken && telegramConfig.botToken.length > 20,
        chatIdConfigured: telegramConfig.chatId && telegramConfig.chatId.length > 0,
        autoReport: localStorage.getItem('autoTelegramReport') === 'true',
        teacher: telegramConfig.teacherInfo
    };
                                                     }
