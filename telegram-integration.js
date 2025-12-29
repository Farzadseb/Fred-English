// telegram-integration.js - با توکن جدید
console.log('🤖 سیستم تلگرام بارگذاری شد');

const TelegramConfig = {
    botToken: '8592902186:AAGdV2eHkocXaRr7kKrxLrap7jWVPm0pq-Q', // توکن جدید
    chatId: '96991859',
    botUsername: 'EnglishWithFredBot',
    teacherPhone: '09017708544',
    teacherName: 'English with Fred'
};

// تولید گزارش
function createProgressReport() {
    const userId = localStorage.getItem('userId') || 'user_' + Date.now();
    const bestScore = localStorage.getItem('bestScore') || '0';
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    const totalTests = testHistory.length;
    
    const now = new Date();
    
    return {
        fullReport: `
📊 گزارش پیشرفت English with Fred

👤 دانش‌آموز: ${userId}
📅 تاریخ: ${now.toLocaleDateString('fa-IR')}
⏰ ساعت: ${now.toLocaleTimeString('fa-IR')}

🏆 بهترین امتیاز: ${bestScore}%
📊 تعداد آزمون‌ها: ${totalTests}

👨‍🏫 مدرس: ${TelegramConfig.teacherName}
📱 تماس: ${TelegramConfig.teacherPhone}

✨ هر روز بهتر از دیروز ✨
        `.trim(),
        shortReport: `📊 گزارش English with Fred - بهترین امتیاز: ${bestScore}%`,
        markdownReport: `*📊 گزارش پیشرفت English with Fred*

*👤 دانش‌آموز:* ${userId}
*📅 تاریخ:* ${now.toLocaleDateString('fa-IR')} - ${now.toLocaleTimeString('fa-IR')}

*🏆 بهترین امتیاز:* ${bestScore}%
*📊 تعداد آزمون‌ها:* ${totalTests}

*👨‍🏫 مدرس:* ${TelegramConfig.teacherName}
*📱 تماس:* ${TelegramConfig.teacherPhone}

_✨ هر روز بهتر از دیروز ✨_`
    };
}

// ارسال از طریق API
async function sendViaTelegramAPI() {
    try {
        const report = createProgressReport();
        
        console.log('📤 ارسال از طریق API...');
        
        const response = await fetch(
            `https://api.telegram.org/bot${TelegramConfig.botToken}/sendMessage`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: TelegramConfig.chatId,
                    text: report.markdownReport,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                })
            }
        );
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ پیام ارسال شد:', data.result.message_id);
            return {
                success: true,
                message: '✅ گزارش به تلگرام ارسال شد',
                method: 'API'
            };
        } else {
            console.error('❌ خطای API:', data.description);
            throw new Error(data.description);
        }
    } catch (error) {
        console.error('❌ خطا در API:', error.message);
        return {
            success: false,
            error: error.message,
            method: 'API'
        };
    }
}

// ارسال از طریق لینک
function sendViaTelegramLink() {
    const report = createProgressReport();
    const encodedMessage = encodeURIComponent(report.shortReport);
    const telegramLink = `https://t.me/${TelegramConfig.botUsername}?text=${encodedMessage}`;
    
    const newWindow = window.open(telegramLink, '_blank');
    
    if (newWindow) {
        console.log('✅ لینک تلگرام باز شد');
        return {
            success: true,
            message: '📱 تلگرام باز شد! دکمه SEND را بزنید.',
            method: 'Link'
        };
    } else {
        console.warn('⚠️ پنجره باز نشد (popup blocker)');
        return {
            success: false,
            error: 'Popup blocked',
            method: 'Link'
        };
    }
}

// ارسال هوشمند
async function sendTelegramReport() {
    // اول سعی می‌کنیم با API ارسال کنیم
    const apiResult = await sendViaTelegramAPI();
    
    if (apiResult.success) {
        showNotification(apiResult.message, 'success');
        return true;
    }
    
    // اگر API کار نکرد، از لینک استفاده می‌کنیم
    console.log('🔄 API کار نکرد، در حال استفاده از لینک...');
    
    const linkResult = sendViaTelegramLink();
    
    if (linkResult.success) {
        showNotification(linkResult.message, 'info');
        return true;
    }
    
    // اگر لینک هم کار نکرد، کپی به کلیپ‌بورد
    console.log('🔄 لینک هم کار نکرد، در حال کپی به کلیپ‌بورد...');
    
    const report = createProgressReport();
    copyToClipboard(report.fullReport);
    
    showNotification('📋 گزارش در حافظه کپی شد!', 'success');
    
    // راهنمایی بیشتر
    setTimeout(() => {
        alert(
            '📋 گزارش در حافظه کپی شد!\n\n' +
            'حالا می‌توانید:\n' +
            '1. تلگرام را باز کنید\n' +
            '2. به @EnglishWithFredBot بروید\n' +
            '3. پیام را Paste کنید (Ctrl+V)\n' +
            '4. دکمه SEND را بزنید\n\n' +
            'مدرس به زودی با شما تماس می‌گیرد 📞'
        );
    }, 500);
    
    return true;
}

// کپی به کلیپ‌بورد
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// تست ربات
async function testBotConnection() {
    console.log('🔗 تست اتصال ربات جدید...');
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TelegramConfig.botToken}/getMe`);
        const data = await response.json();
        
        if (data.ok) {
            const result = `✅ ربات فعال است!\n\n` +
                          `🤖 نام: ${data.result.first_name}\n` +
                          `📱 یوزرنیم: @${data.result.username}\n` +
                          `🆔 شناسه: ${data.result.id}`;
            
            alert(result);
            console.log('✅ تست موفق:', result);
            return true;
        } else {
            alert(`❌ مشکل در ربات: ${data.description}`);
            return false;
        }
    } catch (error) {
        alert(`❌ خطای شبکه: ${error.message}`);
        return false;
    }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 سیستم تلگرام با توکن جدید آماده است');
    
    // تست خودکار (اختیاری)
    setTimeout(() => {
        console.log('برای تست ربات، در کنسول تایپ کنید: testBotConnection()');
    }, 2000);
});

// اضافه کردن به global scope
window.sendTelegramReport = sendTelegramReport;
window.testBotConnection = testBotConnection;
window.TelegramConfig = TelegramConfig;
