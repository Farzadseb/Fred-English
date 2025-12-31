// =======================
// TELEGRAM INTEGRATION - کاملاً جدید
// =======================

// تنظیمات تلگرام شما
const TELEGRAM_CONFIG = {
    botToken: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw',
    chatId: '96991859',
    enabled: true
};

// وضعیت ارسال
let telegramStatus = {
    isConnected: false,
    lastSent: null,
    pendingMessages: [],
    errorCount: 0
};

// بررسی اتصال تلگرام
async function checkTelegramConnection() {
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('📴 تلگرام غیرفعال است');
        return false;
    }
    
    if (!navigator.onLine) {
        console.log('📴 آفلاین هستیم - تلگرام بررسی نشد');
        telegramStatus.isConnected = false;
        return false;
    }
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getMe`, {
            timeout: 5000
        });
        
        if (response.ok) {
            const data = await response.json();
            telegramStatus.isConnected = data.ok;
            
            if (data.ok) {
                console.log('✅ اتصال تلگرام برقرار است');
                console.log('🤖 ربات:', data.result.username);
                return true;
            } else {
                console.error('❌ ربات تلگرام خطا داد:', data.description);
                telegramStatus.isConnected = false;
                return false;
            }
        } else {
            console.error('❌ خطای HTTP در بررسی تلگرام:', response.status);
            telegramStatus.isConnected = false;
            return false;
        }
    } catch (error) {
        console.error('❌ خطای شبکه در بررسی تلگرام:', error);
        telegramStatus.isConnected = false;
        return false;
    }
}

// ارسال پیام به تلگرام
async function sendToTelegram(message, options = {}) {
    // اگر تلگرام غیرفعال است
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('📴 تلگرام غیرفعال است - پیام ارسال نشد');
        return { success: false, reason: 'disabled' };
    }
    
    // اگر آفلاین هستیم
    if (!navigator.onLine) {
        console.log('📴 آفلاین هستیم - ذخیره پیام برای ارسال بعدی');
        savePendingMessage(message, options);
        return { success: false, reason: 'offline' };
    }
    
    // بررسی محدودیت نرخ ارسال
    if (isRateLimited()) {
        console.log('⏳ محدودیت نرخ ارسال - ذخیره پیام');
        savePendingMessage(message, options);
        return { success: false, reason: 'rate_limited' };
    }
    
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    const payload = {
        chat_id: TELEGRAM_CONFIG.chatId,
        text: message,
        parse_mode: 'HTML',
        disable_notification: options.silent || false,
        disable_web_page_preview: true
    };
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ پیام به تلگرام ارسال شد');
            telegramStatus.lastSent = new Date();
            telegramStatus.errorCount = 0;
            
            // نمایش نوتیفیکیشن
            if (!options.silent) {
                showNotification('✅ گزارش به تلگرام ارسال شد', 'success');
            }
            
            return { success: true, data };
        } else {
            console.error('❌ تلگرام خطا داد:', data.description);
            telegramStatus.errorCount++;
            
            // اگر خطا از تلگرام است، پیام را ذخیره نکن
            if (!data.description.includes('Too Many Requests')) {
                savePendingMessage(message, options);
            }
            
            return { success: false, reason: 'telegram_error', error: data.description };
        }
    } catch (error) {
        console.error('❌ خطای شبکه در ارسال به تلگرام:', error);
        telegramStatus.errorCount++;
        
        // ذخیره پیام برای ارسال بعدی
        savePendingMessage(message, options);
        
        // نمایش نوتیفیکیشن
        if (!options.silent) {
            showNotification('📝 گزارش ذخیره شد (آفلاین)', 'info');
        }
        
        return { success: false, reason: 'network_error', error: error.message };
    }
}

// بررسی محدودیت نرخ ارسال
function isRateLimited() {
    if (!telegramStatus.lastSent) return false;
    
    const now = new Date();
    const lastSent = new Date(telegramStatus.lastSent);
    const diffMs = now - lastSent;
    const diffSeconds = diffMs / 1000;
    
    // محدودیت: 1 پیام در هر 2 ثانیه
    return diffSeconds < 2;
}

// ذخیره پیام در انتظار
function savePendingMessage(message, options = {}) {
    const pendingMessages = JSON.parse(localStorage.getItem('telegram_pending_messages') || '[]');
    
    pendingMessages.push({
        message,
        options,
        timestamp: new Date().toISOString(),
        attempts: 0
    });
    
    // محدود کردن تعداد پیام‌های ذخیره شده
    if (pendingMessages.length > 50) {
        pendingMessages.splice(0, pendingMessages.length - 50);
    }
    
    localStorage.setItem('telegram_pending_messages', JSON.stringify(pendingMessages));
    telegramStatus.pendingMessages = pendingMessages;
    
    console.log(`📝 پیام ذخیره شد (${pendingMessages.length} پیام در انتظار)`);
}

// ارسال پیام‌های در انتظار
async function sendPendingMessages() {
    if (!navigator.onLine) {
        console.log('📴 آفلاین هستیم - پیام‌ها ارسال نمی‌شوند');
        return;
    }
    
    const pendingMessages = JSON.parse(localStorage.getItem('telegram_pending_messages') || '[]');
    if (pendingMessages.length === 0) return;
    
    console.log(`📤 تلاش برای ارسال ${pendingMessages.length} پیام در انتظار...`);
    
    const successful = [];
    const failed = [];
    
    for (let i = 0; i < pendingMessages.length; i++) {
        const item = pendingMessages[i];
        
        // محدودیت تلاش‌ها
        if (item.attempts >= 3) {
            console.log(`⚠️ پیام ${i + 1} پس از 3 تلاش شکست خورد`);
            failed.push(item);
            continue;
        }
        
        // تاخیر بین ارسال‌ها
        if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        try {
            const result = await sendToTelegram(item.message, { ...item.options, silent: true });
            
            if (result.success) {
                successful.push(item);
                console.log(`✅ پیام ${i + 1} ارسال شد`);
            } else {
                item.attempts++;
                failed.push(item);
                console.log(`⚠️ تلاش ${item.attempts} برای پیام ${i + 1} شکست خورد`);
            }
        } catch (error) {
            item.attempts++;
            failed.push(item);
            console.error(`❌ خطا در ارسال پیام ${i + 1}:`, error);
        }
    }
    
    // ذخیره پیام‌های ناموفق
    localStorage.setItem('telegram_pending_messages', JSON.stringify(failed));
    telegramStatus.pendingMessages = failed;
    
    if (successful.length > 0) {
        showNotification(`✅ ${successful.length} گزارش ارسال شد`, 'success');
    }
    
    if (failed.length > 0) {
        console.log(`📝 ${failed.length} پیام در انتظار ماند`);
    }
}

// ارسال گزارش آزمون
function sendQuizReport(results) {
    const username = window.appState?.currentUser?.username || 'کاربر ناشناس';
    const date = new Date().toLocaleDateString('fa-IR');
    const time = new Date().toLocaleTimeString('fa-IR');
    
    const message = `🎯 گزارش آزمون زبان‌آموز
    
👤 <b>نام:</b> ${username}
📅 <b>تاریخ:</b> ${date}
⏰ <b>زمان:</b> ${time}
📊 <b>امتیاز:</b> ${results.score}%
✅ <b>پاسخ صحیح:</b> ${results.correct}/${results.total}
⏱️ <b>مدت زمان:</b> ${results.time}
🏆 <b>بهترین امتیاز:</b> ${results.bestScore || 0}%

#EnglishWithFred #گزارش_آزمون`;

    return sendToTelegram(message);
}

// ارسال گزارش یادگیری
function sendLearningReport() {
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
    
    const progressPercent = Math.round((learnedWords / 200) * 100);
    
    const message = `📚 گزارش یادگیری لغات
    
👤 <b>نام:</b> ${username}
📅 <b>تاریخ:</b> ${date}
📊 <b>لغات یادگرفته:</b> ${learnedWords}
⭐ <b>لغات نشان‌دار:</b> ${markedWords}
🔄 <b>تعداد مرورها:</b> ${totalReviews}
📈 <b>مرورهای امروز:</b> ${todayProgress}

🎯 <b>پیشرفت:</b> ${progressPercent}% از لغات A1

#EnglishWithFred #گزارش_یادگیری`;

    return sendToTelegram(message);
}

// ارسال گزارش خطا
function sendErrorReport(error) {
    const username = window.appState?.currentUser?.username || 'کاربر ناشناس';
    const date = new Date().toLocaleString('fa-IR');
    
    const message = `⚠️ گزارش خطا در برنامه
    
👤 <b>کاربر:</b> ${username}
📅 <b>زمان:</b> ${date}
🚨 <b>خطا:</b> ${error.message || 'خطای ناشناخته'}
🌐 <b>صفحه:</b> ${window.location.href}
📱 <b>مرورگر:</b> ${navigator.userAgent.substring(0, 100)}...

#EnglishWithFred #گزارش_خطا`;

    return sendToTelegram(message, { silent: true });
}

// تابع کمکی برای گرفتن وضعیت
function getTelegramStatus() {
    const pendingMessages = JSON.parse(localStorage.getItem('telegram_pending_messages') || '[]');
    
    return {
        isConnected: telegramStatus.isConnected,
        lastSent: telegramStatus.lastSent,
        pendingCount: pendingMessages.length,
        errorCount: telegramStatus.errorCount,
        config: {
            enabled: TELEGRAM_CONFIG.enabled,
            botToken: TELEGRAM_CONFIG.botToken ? '****' + TELEGRAM_CONFIG.botToken.slice(-4) : null,
            chatId: TELEGRAM_CONFIG.chatId
        }
    };
}

// راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🤖 Telegram Integration در حال راه‌اندازی...');
    
    // بررسی اتصال تلگرام
    setTimeout(async () => {
        await checkTelegramConnection();
    }, 3000);
    
    // ارسال پیام‌های در انتظار هنگام آنلاین شدن
    window.addEventListener('online', () => {
        console.log('🌐 آنلاین شدیم - ارسال پیام‌های در انتظار');
        setTimeout(() => {
            sendPendingMessages();
        }, 5000);
    });
    
    // ذخیره وضعیت فعلی
    const pendingMessages = JSON.parse(localStorage.getItem('telegram_pending_messages') || '[]');
    telegramStatus.pendingMessages = pendingMessages;
    
    console.log('✅ Telegram Integration آماده است');
    console.log('📊 وضعیت:', getTelegramStatus());
});

// هندل خطاهای جهانی و ارسال به تلگرام
if (TELEGRAM_CONFIG.enabled) {
    window.addEventListener('error', function(event) {
        if (event.error && event.error.message) {
            sendErrorReport(event.error);
        }
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message) {
            sendErrorReport(event.reason);
        }
    });
}

// اکسپورت توابع
window.sendToTelegram = sendToTelegram;
window.sendQuizReport = sendQuizReport;
window.sendLearningReport = sendLearningReport;
window.sendPendingMessages = sendPendingMessages;
window.getTelegramStatus = getTelegramStatus;
window.checkTelegramConnection = checkTelegramConnection;
