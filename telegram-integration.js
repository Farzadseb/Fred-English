// =======================
// TELEGRAM INTEGRATION - نسخه بهبود یافته
// =======================

// 🔐 تنظیمات تلگرام
const telegramConfig = {
    botUsername: 'EnglishWithFredBot',
    botToken: '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw',
    chatId: '96991859',
    apiUrl: 'https://api.telegram.org/bot',
    
    teacherInfo: {
        name: 'English with Fred',
        phone: '09017708544',
        whatsapp: 'https://wa.me/989017708544'
    }
};

// تشخیص محیط تلگرام
let isTelegramWebApp = false;
let telegramUser = null;

// 🔍 تشخیص و راه‌اندازی اولیه تلگرام
function initializeTelegram() {
    console.log('🔍 در حال بررسی محیط تلگرام...');
    
    // بررسی وجود Telegram WebApp SDK
    if (window.Telegram && Telegram.WebApp) {
        console.log('✅ Telegram WebApp SDK یافت شد');
        isTelegramWebApp = true;
        
        const tg = Telegram.WebApp;
        
        // راه‌اندازی WebApp
        tg.expand();
        tg.enableClosingConfirmation();
        
        // دریافت اطلاعات کاربر
        telegramUser = tg.initDataUnsafe?.user;
        
        if (telegramUser) {
            console.log('✅ کاربر تلگرام شناسایی شد:', telegramUser);
            
            // ذخیره اطلاعات کاربر
            localStorage.setItem('telegram_user_id', telegramUser.id);
            if (telegramUser.username) {
                localStorage.setItem('telegram_username', telegramUser.username);
            }
            if (telegramUser.first_name) {
                localStorage.setItem('telegram_first_name', telegramUser.first_name);
            }
            
            // نمایش اطلاعات کاربر در UI
            displayTelegramUserInfo(telegramUser);
            
            return telegramUser;
        } else {
            console.log('⚠️ کاربر تلگرام پیدا نشد. ممکن است کاربر لاگین نکرده باشد.');
            telegramUser = createFallbackUser('telegram_no_user');
            return telegramUser;
        }
    } else {
        console.log('ℹ️ محیط تلگرام شناسایی نشد. اجرا در مرورگر.');
        telegramUser = createFallbackUser('browser_user');
        return telegramUser;
    }
}

// ایجاد کاربر جایگزین
function createFallbackUser(type) {
    const userId = type + '_' + Math.random().toString(36).substr(2, 8);
    return {
        id: userId,
        username: userId,
        first_name: 'کاربر مهمان',
        isFallback: true
    };
}

// نمایش اطلاعات کاربر تلگرام
function displayTelegramUserInfo(user) {
    const userInfoElement = document.getElementById('userInfo');
    
    if (!userInfoElement) {
        // اگر المنت وجود ندارد، ایجاد کن
        const header = document.querySelector('.app-header');
        if (header) {
            const infoDiv = document.createElement('div');
            infoDiv.id = 'userInfo';
            infoDiv.className = 'telegram-user-info';
            infoDiv.innerHTML = `
                <div class="user-info-content">
                    <i class="fab fa-telegram"></i>
                    <span>${user.first_name || 'کاربر'} ${user.last_name || ''}</span>
                    ${user.username ? `<small>@${user.username}</small>` : ''}
                </div>
            `;
            header.appendChild(infoDiv);
        }
    } else {
        userInfoElement.innerHTML = `
            <div class="user-info-content">
                <i class="fab fa-telegram"></i>
                <span>${user.first_name || 'کاربر'} ${user.last_name || ''}</span>
                ${user.username ? `<small>@${user.username}</small>` : ''}
            </div>
        `;
    }
}

// تولید گزارش پیشرفت - نسخه بهبود یافته
function generateProgressReport() {
    const user = telegramUser || {};
    const userId = user.id || localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 6);
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
    
    // شناسه کاربر تلگرام
    const telegramId = user.id ? `\n🆔 شناسه تلگرام: ${user.id}` : '';
    const usernameInfo = user.username ? `\n📱 نام کاربری: @${user.username}` : '';
    const fullName = user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'کاربر مهمان';
    
    return {
        userId: userId,
        date: today,
        time: time,
        bestScore: `${bestScore}%`,
        averageScore: `${avgScore}%`,
        totalTests: totalTests,
        teacherName: telegramConfig.teacherInfo.name,
        teacherPhone: telegramConfig.teacherInfo.phone,
        telegramUser: user,
        
        // متن گزارش بهبود یافته
        message: `
📊 **گزارش پیشرفت English with Fred**
👤 **نام کاربر:** ${fullName}
${telegramId}${usernameInfo}
📅 **تاریخ:** ${today} - ${time}
⭐ **بهترین امتیاز:** ${bestScore}%
📈 **میانگین امتیاز:** ${avgScore}%
📊 **تعداد آزمون‌ها:** ${totalTests}

👨‍🏫 **مدرس:** ${telegramConfig.teacherInfo.name}
📱 **تماس:** ${telegramConfig.teacherInfo.phone}
📲 **واتساپ:** ${telegramConfig.teacherInfo.whatsapp}

📌 این گزارش به صورت خودکار ارسال شده است.
        `.trim()
    };
}

// ارسال گزارش به تلگرام - نسخه بهبود یافته
async function sendTelegramReport() {
    // ابتدا تلگرام را راه‌اندازی کن
    if (!telegramUser) {
        initializeTelegram();
    }
    
    // ایجاد گزارش
    const report = generateProgressReport();
    
    // نشان دادن وضعیت ارسال
    showNotification('📤 در حال ارسال گزارش به تلگرام...', 'info');
    
    // اگر در محیط WebApp تلگرام هستیم
    if (isTelegramWebApp && window.Telegram?.WebApp) {
        return await sendViaTelegramWebApp(report);
    } 
    // اگر توکن ربات را داریم
    else if (telegramConfig.botToken && telegramConfig.botToken.length > 20) {
        return await sendViaTelegramAPI(report);
    } 
    // در غیر این صورت از لینک استفاده کن
    else {
        return sendViaTelegramLink(report);
    }
}

// ارسال از طریق Telegram WebApp
async function sendViaTelegramWebApp(report) {
    try {
        const tg = Telegram.WebApp;
        
        // می‌توانیم از sendData استفاده کنیم یا مستقیماً با API کار کنیم
        // در اینجا از API استفاده می‌کنیم چون توکن داریم
        if (telegramConfig.botToken) {
            return await sendViaTelegramAPI(report);
        } else {
            // اگر توکن نداریم، از لینک استفاده می‌کنیم
            return sendViaTelegramLink(report);
        }
        
    } catch (error) {
        console.error('❌ خطا در WebApp:', error);
        showNotification('❌ خطا در ارسال از طریق WebApp', 'error');
        return sendViaTelegramLink(report);
    }
}

// ارسال از طریق API تلگرام (بدون تغییر)
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
            
            // اگر در WebApp هستیم، دکمه بسته شدن را فعال کنیم
            if (isTelegramWebApp) {
                setTimeout(() => {
                    showNotification('👨‍🏫 مدرس به زودی با شما تماس خواهد گرفت', 'info');
                }, 1500);
            }
            
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

// ارسال از طریق لینک تلگرام (بدون تغییر)
function sendViaTelegramLink(report) {
    // کوتاه کردن پیام برای لینک
    const shortMessage = `
📊 گزارش English with Fred
👤 ${report.telegramUser?.first_name || report.userId}
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

// 🔧 تابع برای نمایش وضعیت تلگرام در کنسول
function debugTelegramStatus() {
    console.log('🔧 وضعیت تلگرام:');
    console.log('- isTelegramWebApp:', isTelegramWebApp);
    console.log('- telegramUser:', telegramUser);
    console.log('- WebApp available:', !!window.Telegram?.WebApp);
    console.log('- Bot token configured:', telegramConfig.botToken && telegramConfig.botToken.length > 20);
    console.log('- LocalStorage userId:', localStorage.getItem('userId'));
    console.log('- LocalStorage telegram_user_id:', localStorage.getItem('telegram_user_id'));
}

// 🎯 تابع برای تست اتصال تلگرام
async function testTelegramConnection() {
    debugTelegramStatus();
    
    if (isTelegramWebApp) {
        showNotification('✅ در محیط تلگرام اجرا می‌شوید', 'success');
        
        if (telegramUser) {
            showNotification(`👤 کاربر: ${telegramUser.first_name} ${telegramUser.last_name || ''}`, 'success');
        } else {
            showNotification('⚠️ کاربر تلگرام پیدا نشد. ممکن است نیاز به لاگین داشته باشید.', 'warning');
        }
    } else {
        showNotification('🌐 در مرورگر عادی اجرا می‌شوید', 'info');
    }
    
    // تست API ربات
    if (telegramConfig.botToken && telegramConfig.botToken.length > 20) {
        try {
            const response = await fetch(
                `${telegramConfig.apiUrl}${telegramConfig.botToken}/getMe`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.ok) {
                    showNotification(`🤖 ربات متصل: @${data.result.username}`, 'success');
                }
            }
        } catch (error) {
            console.error('❌ خطای تست API:', error);
        }
    }
}

// 🚀 راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 سیستم تلگرام در حال راه‌اندازی...');
    
    // راه‌اندازی تلگرام
    const user = initializeTelegram();
    
    console.log('✅ سیستم تلگرام راه‌اندازی شد');
    console.log('👤 کاربر:', user);
    console.log('📱 مدرس:', telegramConfig.teacherInfo.name);
    
    // اضافه کردن دکمه تست (کلیک راست روی دکمه تلگرام)
    const telegramBtn = document.querySelector('.gradient-telegram');
    if (telegramBtn) {
        telegramBtn.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            testTelegramConnection();
        });
        
        telegramBtn.title = 'کلیک راست: تست اتصال تلگرام';
    }
    
    // نمایش پیام راهنما اگر کاربر تلگرام پیدا نشد
    if (!user || user.isFallback) {
        setTimeout(() => {
            if (!document.querySelector('.telegram-help-message')) {
                const helpMsg = document.createElement('div');
                helpMsg.className = 'telegram-help-message';
                helpMsg.innerHTML = `
                    <div class="help-content">
                        <i class="fab fa-telegram"></i>
                        <span>برای دسترسی کامل، از طریق ربات تلگرام وارد شوید</span>
                        <button onclick="window.open('https://t.me/${telegramConfig.botUsername}', '_blank')">
                            <i class="fab fa-telegram"></i> باز کردن تلگرام
                        </button>
                    </div>
                `;
                document.body.appendChild(helpMsg);
                
                setTimeout(() => {
                    helpMsg.classList.add('show');
                }, 1000);
            }
        }, 3000);
    }
});

// 📊 تابع برای گرفتن وضعیت تلگرام
function getTelegramStatus() {
    return {
        isTelegramWebApp: isTelegramWebApp,
        telegramUser: telegramUser,
        botConfigured: telegramConfig.botToken && telegramConfig.botToken.length > 20,
        chatIdConfigured: telegramConfig.chatId && telegramConfig.chatId.length > 0,
        autoReport: localStorage.getItem('autoTelegramReport') === 'true',
        teacher: telegramConfig.teacherInfo
    };
        }
