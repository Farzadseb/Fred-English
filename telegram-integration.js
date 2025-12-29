<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تست تلگرام - English with Fred</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Vazirmatn', Tahoma, sans-serif;
        }
        
        body {
            background: #0F172A;
            color: #F1F5F9;
            min-height: 100vh;
            padding: 20px;
            text-align: center;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: #1E293B;
            border: 2px solid #10B981;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        h1 {
            color: #10B981;
            margin-bottom: 20px;
            font-size: 2rem;
        }
        
        h2 {
            color: #818CF8;
            margin: 20px 0;
        }
        
        .test-section {
            background: #1E293B;
            border: 2px solid #334155;
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
            text-align: right;
        }
        
        button {
            background: #10B981;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 12px 24px;
            margin: 10px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        
        button:hover {
            background: #0DA673;
            transform: translateY(-2px);
        }
        
        .btn-telegram {
            background: #0088CC;
        }
        
        .btn-whatsapp {
            background: #25D366;
        }
        
        .btn-copy {
            background: #8B5CF6;
        }
        
        .result-box {
            background: #1E293B;
            border: 2px solid;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: right;
            white-space: pre-wrap;
            font-family: monospace;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .success { border-color: #10B981; color: #10B981; }
        .error { border-color: #EF4444; color: #EF4444; }
        .warning { border-color: #F59E0B; color: #F59E0B; }
        .info { border-color: #818CF8; color: #818CF8; }
        
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 8px;
            font-weight: bold;
        }
        
        .status.good { background: rgba(16, 185, 129, 0.2); }
        .status.bad { background: rgba(239, 68, 68, 0.2); }
        .status.info { background: rgba(129, 140, 248, 0.2); }
        
        code {
            background: #334155;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
        
        pre {
            background: #334155;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            text-align: left;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-bug"></i> تست سیستم تلگرام - English with Fred</h1>
            <p>این صفحه برای عیب‌یابی سیستم گزارش‌دهی تلگرام طراحی شده است</p>
        </header>
        
        <!-- بخش تست اتصال -->
        <div class="test-section">
            <h2><i class="fas fa-wifi"></i> تست اتصال اینترنت و API</h2>
            <button onclick="testInternet()">
                <i class="fas fa-globe"></i> تست اتصال اینترنت
            </button>
            <button onclick="testTelegramAPI()">
                <i class="fab fa-telegram"></i> تست API تلگرام
            </button>
            
            <div id="internetResult" class="result-box"></div>
        </div>
        
        <!-- بخش تست گزارش‌دهی -->
        <div class="test-section">
            <h2><i class="fas fa-paper-plane"></i> تست ارسال گزارش</h2>
            <button class="btn-telegram" onclick="testTelegramReport()">
                <i class="fab fa-telegram"></i> تست ارسال به تلگرام
            </button>
            <button class="btn-whatsapp" onclick="testWhatsApp()">
                <i class="fab fa-whatsapp"></i> تست ارسال به واتساپ
            </button>
            <button class="btn-copy" onclick="testCopyToClipboard()">
                <i class="fas fa-copy"></i> تست کپی به کلیپ‌بورد
            </button>
            
            <div id="reportResult" class="result-box"></div>
        </div>
        
        <!-- بخش اطلاعات سیستم -->
        <div class="test-section">
            <h2><i class="fas fa-info-circle"></i> اطلاعات سیستم</h2>
            <button onclick="showSystemInfo()">
                <i class="fas fa-laptop"></i> نمایش اطلاعات مرورگر
            </button>
            <button onclick="showLocalStorage()">
                <i class="fas fa-database"></i> نمایش LocalStorage
            </button>
            
            <div id="systemInfo" class="result-box"></div>
        </div>
        
        <!-- بخش کد تست -->
        <div class="test-section">
            <h2><i class="fas fa-code"></i> تست کد JavaScript</h2>
            <p>این کد را در کنسول مرورگر (F12) اجرا کنید:</p>
            <pre><code>// تست تابع اصلی
testTelegramSystem();

// یا مستقیماً این کد را اجرا کنید:
const report = createProgressReport();
console.log('📊 گزارش:', report.fullReport);
console.log('🔗 لینک تلگرام:', `https://t.me/EnglishWithFredBot?text=${encodeURIComponent(report.shortReport)}`);</code></pre>
        </div>
        
        <!-- راهنمای رفع مشکل -->
        <div class="test-section">
            <h2><i class="fas fa-question-circle"></i> راهنمای رفع مشکل</h2>
            <div class="status info">
                <p>✅ اگر تست‌ها موفق بودند: سیستم شما سالم است</p>
                <p>❌ اگر خطا داشتید:</p>
                <ul style="text-align: right; padding-right: 20px; margin-top: 10px;">
                    <li>اینترنت خود را بررسی کنید</li>
                    <li>از مرورگر Chrome یا Firefox استفاده کنید</li>
                    <li>پاپ‌آپ‌بلاکر را غیرفعال کنید</li>
                    <li>تلگرام را روی دستگاه خود نصب داشته باشید</li>
                </ul>
            </div>
        </div>
    </div>
    
    <script>
    // آیکون‌های FontAwesome
    const faScript = document.createElement('script');
    faScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    document.head.appendChild(faScript);
    
    // توابع تست
    
    function testInternet() {
        const resultBox = document.getElementById('internetResult');
        resultBox.innerHTML = '🔄 در حال تست اتصال اینترنت...';
        resultBox.className = 'result-box info';
        
        fetch('https://api.telegram.org/')
            .then(response => {
                resultBox.innerHTML = '✅ اتصال اینترنت سالم است';
                resultBox.className = 'result-box success';
            })
            .catch(error => {
                resultBox.innerHTML = `❌ مشکل اتصال اینترنت:\n${error.message}`;
                resultBox.className = 'result-box error';
            });
    }
    
    function testTelegramAPI() {
        const resultBox = document.getElementById('internetResult');
        resultBox.innerHTML = '🔄 در حال تست API تلگرام...';
        resultBox.className = 'result-box info';
        
        fetch('https://api.telegram.org/bot8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw/getMe')
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    resultBox.innerHTML = `✅ API تلگرام فعال است\n\nربات: ${data.result.first_name}\nیوزرنیم: @${data.result.username}\nID: ${data.result.id}`;
                    resultBox.className = 'result-box success';
                } else {
                    resultBox.innerHTML = `❌ مشکل در API تلگرام:\n${data.description}`;
                    resultBox.className = 'result-box error';
                }
            })
            .catch(error => {
                resultBox.innerHTML = `❌ خطا در ارتباط با API:\n${error.message}`;
                resultBox.className = 'result-box error';
            });
    }
    
    function createProgressReport() {
        const userId = localStorage.getItem('userId') || 'user_' + Date.now();
        const bestScore = localStorage.getItem('bestScore') || '0';
        const totalTests = JSON.parse(localStorage.getItem('testHistory') || '[]').length;
        
        return {
            fullReport: `
📊 گزارش تست - English with Fred

👤 کاربر تستی: ${userId}
⭐ بهترین امتیاز: ${bestScore}%
📊 تعداد آزمون‌ها: ${totalTests}
📅 تاریخ تست: ${new Date().toLocaleDateString('fa-IR')}
⏰ زمان تست: ${new Date().toLocaleTimeString('fa-IR')}

👨‍🏫 مدرس: English with Fred
📱 تماس: 09017708544

این یک گزارش تستی است.
            `.trim(),
            shortReport: `تست سیستم - English with Fred - بهترین امتیاز: ${bestScore}%`
        };
    }
    
    function testTelegramReport() {
        const resultBox = document.getElementById('reportResult');
        resultBox.innerHTML = '🔄 در حال تست ارسال به تلگرام...';
        resultBox.className = 'result-box info';
        
        const report = createProgressReport();
        const encodedMessage = encodeURIComponent(report.shortReport);
        const telegramLink = `https://t.me/EnglishWithFredBot?text=${encodedMessage}`;
        
        // باز کردن تلگرام
        const newWindow = window.open(telegramLink, '_blank');
        
        if (newWindow) {
            resultBox.innerHTML = '✅ پنجره تلگرام باز شد\n\nلطفاً:\n1. دکمه SEND را بزنید\n2. به پنجره اصلی برگردید\n3. تست بعدی را انجام دهید';
            resultBox.className = 'result-box success';
        } else {
            resultBox.innerHTML = '⚠️ پنجره باز نشد. ممکن است popup-blocker فعال باشد.\n\nراه حل:\n1. popup-blocker را غیرفعال کنید\n2. دوباره تست کنید\n3. یا از دکمه "تست کپی" استفاده کنید';
            resultBox.className = 'result-box warning';
        }
    }
    
    function testWhatsApp() {
        const resultBox = document.getElementById('reportResult');
        const report = createProgressReport();
        const encodedMessage = encodeURIComponent(report.shortReport);
        const whatsappLink = `https://wa.me/989017708544?text=${encodedMessage}`;
        
        window.open(whatsappLink, '_blank');
        resultBox.innerHTML = '✅ واتساپ باز شد\n\nلطفاً دکمه SEND را بزنید';
        resultBox.className = 'result-box success';
    }
    
    function testCopyToClipboard() {
        const resultBox = document.getElementById('reportResult');
        const report = createProgressReport();
        
        navigator.clipboard.writeText(report.fullReport)
            .then(() => {
                resultBox.innerHTML = '✅ گزارش در حافظه کپی شد!\n\nحالا می‌توانید:\n1. در تلگرام Paste کنید (Ctrl+V)\n2. در واتساپ Paste کنید\n3. در هر برنامه دیگری Paste کنید';
                resultBox.className = 'result-box success';
            })
            .catch(err => {
                resultBox.innerHTML = `❌ خطا در کپی:\n${err.message}\n\nمتن گزارش:\n${report.fullReport}`;
                resultBox.className = 'result-box error';
            });
    }
    
    function showSystemInfo() {
        const resultBox = document.getElementById('systemInfo');
        resultBox.innerHTML = `
🌐 اطلاعات مرورگر:
- نام: ${navigator.userAgent.split(') ')[0].split('(')[1]}
- زبان: ${navigator.language}
- آنلاین: ${navigator.onLine ? '✅ بله' : '❌ خیر'}
- پلتفرم: ${navigator.platform}
- کوکی‌ها: ${navigator.cookieEnabled ? '✅ فعال' : '❌ غیرفعال'}

📱 صفحه‌نمایش:
- عرض: ${window.innerWidth}px
- ارتفاع: ${window.innerHeight}px
- نسبت پیکسل: ${window.devicePixelRatio}

⚡ حافظه:
- کل: ${navigator.deviceMemory || 'نامشخص'} GB
- هسته: ${navigator.hardwareConcurrency || 'نامشخص'}
        `.trim();
        resultBox.className = 'result-box info';
    }
    
    function showLocalStorage() {
        const resultBox = document.getElementById('systemInfo');
        let content = '🗃️ LocalStorage:\n\n';
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            content += `${key}: ${value}\n`;
        }
        
        if (localStorage.length === 0) {
            content += 'خالی است';
        }
        
        resultBox.innerHTML = content;
        resultBox.className = 'result-box info';
    }
    
    // تابع اصلی تست سیستم
    window.testTelegramSystem = function() {
        console.log('🚀 شروع تست سیستم تلگرام...');
        
        // تست 1: اینترنت
        console.log('1. 🔍 تست اتصال اینترنت...');
        fetch('https://api.telegram.org/')
            .then(() => console.log('   ✅ اینترنت متصل است'))
            .catch(() => console.log('   ❌ مشکل اینترنت'));
        
        // تست 2: LocalStorage
        console.log('2. 💾 تست LocalStorage...');
        console.log('   - حجم:', localStorage.length, 'آیتم');
        console.log('   - بهترین امتیاز:', localStorage.getItem('bestScore') || 'ندارد');
        console.log('   - شناسه کاربر:', localStorage.getItem('userId') || 'ندارد');
        
        // تست 3: ایجاد گزارش
        console.log('3. 📊 تست ایجاد گزارش...');
        const report = createProgressReport();
        console.log('   ✅ گزارش ایجاد شد');
        console.log('   متن کوتاه:', report.shortReport);
        
        // تست 4: کلیپ‌بورد
        console.log('4. 📋 تست کلیپ‌بورد...');
        if (navigator.clipboard) {
            console.log('   ✅ کلیپ‌بورد پشتیبانی می‌شود');
        } else {
            console.log('   ⚠️ کلیپ‌بورد پشتیبانی نمی‌شود');
        }
        
        console.log('🎉 تست کامل شد!');
        
        alert('✅ تست کامل شد! نتیجه در کنسول مرورگر نمایش داده شد (F12 را بزنید)');
    };
    
    // راه‌اندازی اولیه
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔧 صفحه تست تلگرام آماده است');
        console.log('برای اجرای تست کامل، تایپ کنید: testTelegramSystem()');
        
        // نمایش وضعیت اولیه
        showSystemInfo();
    });
    </script>
</body>
</html>
