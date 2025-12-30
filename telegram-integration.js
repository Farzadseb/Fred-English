// =======================
// INTEGRATION WITH TELEGRAM - کاملاً بروز شده
// =======================

// تنظیمات تلگرام - با اطلاعات شما
const TELEGRAM_BOT_TOKEN = '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw';
const TELEGRAM_CHAT_ID = '96991859';

// ارسال گزارش به تلگرام
function sendToTelegram(message) {
    // بررسی اتصال اینترنت
    if (!navigator.onLine) {
        console.log('📴 آفلاین هستیم. گزارش ذخیره شد');
        saveOfflineMessage(message);
        return false;
    }
    
    // ساخت URL درخواست
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // داده‌های درخواست
    const data = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_notification: false
    };
    
    // ارسال درخواست با timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 ثانیه
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
    })
    .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.ok) {
            console.log('✅ گزارش با موفقیت به تلگرام ارسال شد');
            showNotification('✅ گزارش به تلگرام ارسال شد', 'success');
            
            // حذف پیام‌های آفلاین ذخیره شده
            clearOfflineMessages();
        } else {
            console.error('❌ خطا از سمت تلگرام:', data.description);
            showNotification('❌ تلگرام خطا داد: ' + data.description, 'error');
            saveOfflineMessage(message); // ذخیره برای ارسال بعدی
        }
    })
    .catch(error => {
        clearTimeout(timeoutId);
        console.error('❌ خطای شبکه در ارسال به تلگرام:', error);
        showNotification('❌ خطای شبکه. گزارش ذخیره شد', 'warning');
        saveOfflineMessage(message); // ذخیره برای ارسال بعدی
    });
    
    return true;
}

// ذخیره پیام آفلاین
function saveOfflineMessage(message) {
    const offlineMessages = JSON.parse(localStorage.getItem('telegram_offline_messages') || '[]');
    offlineMessages.push({
        message: message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('telegram_offline_messages', JSON.stringify(offlineMessages));
    
    // نمایش تعداد پیام‌های در انتظار
    const pendingCount = offlineMessages.length;
    showNotification(`📝 ${pendingCount} گزارش آفلاین ذخیره شد`, 'info');
}

// ارسال پیام‌های آفلاین
function sendOfflineMessages() {
    if (!navigator.onLine) return;
    
    const offlineMessages = JSON.parse(localStorage.getItem('telegram_offline_messages') || '[]');
    if (offlineMessages.length === 0) return;
    
    console.log(`📤 تلاش برای ارسال ${offlineMessages.length} گزارش آفلاین...`);
    
    // ارسال تک‌تک پیام‌ها
    offlineMessages.forEach((item, index) => {
        setTimeout(() => {
            sendToTelegram(item.message + `\n\n📅 زمان اصلی: ${new Date(item.timestamp).toLocaleString('fa-IR')}`);
        }, index * 2000); // فاصله 2 ثانیه‌ای
    });
}

// پاک کردن پیام‌های آفلاین ارسال شده
function clearOfflineMessages() {
    localStorage.removeItem('telegram_offline_messages');
    console.log('🧹 پیام‌های آفلاین پاک شدند');
}

// ارسال گزارش پایان آزمون
function sendQuizResultsToTelegram(results) {
    const username = window.appState?.currentUser?.username || 'کاربر ناشناس';
    const date = new Date().toLocaleDateString('fa-IR');
    const time = new Date().toLocaleTimeString('fa-IR');
    
    const message = `🎯 گزارش آزمون زبان‌آموز
    
👤 نام: ${username}
📅 تاریخ: ${date}
⏰ زمان: ${time}
📊 امتیاز: ${results.score}%
✅ پاسخ صحیح: ${results.correct}/${results.total}
⏱️ مدت زمان: ${results.time}
🏆 بهترین امتیاز: ${results.bestScore || '0'}%
🎮 نوع آزمون: ${results.quizType || 'ناشناخته'}

#EnglishWithFred #گزارش_آزمون #${username.replace(/\s/g, '')}`;

    sendToTelegram(message);
}

// ارسال گزارش یادگیری
function sendLearningReportToTelegram() {
    const userKey = window.appState?.currentUser ? `learningProgress_${window.appState.currentUser.id}` : 'learningProgress';
    const progress = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    const username = window.appState?.currentUser?.username || 'کاربر ناشناس';
    const date = new Date().toLocaleDateString('fa-IR');
    
    // محاسبه آمار
    const learnedWords = progress.length;
    const markedWords = progress.filter(p => p.marked).length;
    const totalReviews = progress.reduce((sum, p) => sum + (p.reviewCount || 1), 0);
    const todayProgress = progress.filter(p => {
        const today = new Date().toLocaleDateString('fa-IR');
        const progressDate = new Date(p.lastReviewed).toLocaleDateString('fa-IR');
        return progressDate === today;
    }).length;
    
    const message = `📚 گزارش یادگیری لغات
    
👤 نام: ${username}
📅 تاریخ: ${date}
📊 تعداد لغات یادگرفته: ${learnedWords}
⭐ لغات علامت‌گذاری شده: ${markedWords}
🔄 تعداد کل مرورها: ${totalReviews}
📈 مرورهای امروز: ${todayProgress}

🎯 آماری از یادگیری:
• 🏆 ${Math.round((learnedWords / 200) * 100)}% از لغات A1
• ⭐ ${markedWords > 0 ? Math.round((markedWords / learnedWords) * 100) : 0}% لغات نشان‌دار
• 📊 میانگین مرور هر لغت: ${learnedWords > 0 ? (totalReviews / learnedWords).toFixed(1) : 0}

#EnglishWithFred #گزارش_یادگیری #${username.replace(/\s/g, '')}`;

    sendToTelegram(message);
}

// ارسال گزارش هفتگی
function sendWeeklyReportToTelegram() {
    const userKey = window.appState?.currentUser ? `learningProgress_${window.appState.currentUser.id}` : 'learningProgress';
    const progress = JSON.parse(localStorage.getItem(userKey) || '[]');
    
    const username = window.appState?.currentUser?.username || 'کاربر ناشناس';
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStartStr = weekStart.toLocaleDateString('fa-IR');
    const weekEndStr = new Date().toLocaleDateString('fa-IR');
    
    // لغات مرور شده در این هفته
    const thisWeekProgress = progress.filter(p => {
        const reviewDate = new Date(p.lastReviewed);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reviewDate > weekAgo;
    });
    
    // گروه‌بندی بر اساس روز
    const dailyStats = {};
    thisWeekProgress.forEach(p => {
        const date = new Date(p.lastReviewed).toLocaleDateString('fa-IR');
        dailyStats[date] = (dailyStats[date] || 0) + 1;
    });
    
    let dailyStatsText = '';
    Object.entries(dailyStats).forEach(([date, count]) => {
        dailyStatsText += `• ${date}: ${count} لغت\n`;
    });
    
    const message = `📅 گزارش هفتگی یادگیری
    
👤 نام: ${username}
📅 بازه زمانی: ${weekStartStr} تا ${weekEndStr}
📊 لغات یادگرفته این هفته: ${thisWeekProgress.length}
📈 مجموع لغات: ${progress.length}
🎯 میانگین لغات روزانه: ${Math.round(thisWeekProgress.length / 7)}

📊 آمار روزانه:
${dailyStatsText || '• فعالیتی ثبت نشده'}

💡 پیشنهاد برای هفته آینده:
${thisWeekProgress.length < 10 ? 'سعی کن حداقل 10 لغت جدید یاد بگیری!' : 
  thisWeekProgress.length < 30 ? 'عالی! می‌تونی هدف رو بالاتر بذاری!' : 
  'فوق‌العاده! همین روند رو ادامه بده!'}

#EnglishWithFred #گزارش_هفتگی #${username.replace(/\s/g, '')}`;

    sendToTelegram(message);
}

// ارسال گزارش خطا
function sendErrorReportToTelegram(error) {
    const username = window.appState?.currentUser?.username || 'کاربر ناشناس';
    const date = new Date().toLocaleString('fa-IR');
    
    const message = `⚠️ گزارش خطا در برنامه
    
👤 نام کاربر: ${username}
📅 زمان خطا: ${date}
🚨 خطا: ${error.message || 'خطای ناشناخته'}
🔗 صفحه: ${window.location.href}
📱 مرورگر: ${navigator.userAgent}

📝 اطلاعات اضافی:
${error.stack || 'اطلاعاتی موجود نیست'}

#EnglishWithFred #گزارش_خطا`;

    sendToTelegram(message);
}

// بررسی وضعیت ربات تلگرام
async function checkTelegramBotStatus() {
    if (!navigator.onLine) {
        console.log('📴 آفلاین - وضعیت ربات بررسی نشد');
        return false;
    }
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
        const data = await response.json();
        
        if (data.ok) {
            console.log('🤖 ربات تلگرام فعال:', data.result.username);
            return true;
        } else {
            console.error('❌ ربات تلگرام غیرفعال:', data.description);
            return false;
        }
    } catch (error) {
        console.error('❌ خطا در بررسی وضعیت ربات:', error);
        return false;
    }
}

// اکسپورت توابع
window.sendToTelegram = sendToTelegram;
window.sendQuizResultsToTelegram = sendQuizResultsToTelegram;
window.sendLearningReportToTelegram = sendLearningReportToTelegram;
window.sendWeeklyReportToTelegram = sendWeeklyReportToTelegram;
window.sendErrorReportToTelegram = sendErrorReportToTelegram;
window.checkTelegramBotStatus = checkTelegramBotStatus;
window.sendOfflineMessages = sendOfflineMessages;

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // بررسی وضعیت ربات
    setTimeout(() => checkTelegramBotStatus(), 3000);
    
    // ارسال پیام‌های آفلاین هنگام آنلاین شدن
    window.addEventListener('online', () => {
        setTimeout(() => {
            sendOfflineMessages();
        }, 5000);
    });
    
    // ذخیره تنظیمات در localStorage
    const telegramConfig = {
        botToken: TELEGRAM_BOT_TOKEN,
        chatId: TELEGRAM_CHAT_ID,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('telegram_config', JSON.stringify(telegramConfig));
});

// هندل خطاهای برنامه و ارسال به تلگرام
window.addEventListener('error', function(event) {
    console.error('🚨 خطای جهانی:', event.error);
    
    // فقط خطاهای مهم را ارسال کن
    if (event.error && event.error.message && !event.error.message.includes('ResizeObserver')) {
        sendErrorReportToTelegram(event.error);
    }
});

// هندل rejectهای promise
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 Promise رد شد:', event.reason);
    
    // ارسال به تلگرام
    if (event.reason && event.reason.message) {
        sendErrorReportToTelegram(event.reason);
    }
});
