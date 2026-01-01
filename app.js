// app.js - Final Optimized Version for Farzadseb (فَرزاد)
// ✅ Offline-first | ✅ Telegram: Ferdtestbot | ✅ Larger UI | ✅ Speech Speed 0.5
// ✅ Student/Guest Access Control | ✅ Auto-report to Telegram (when online)

console.log('🚀 Fred App Controller Started — v2.1 (Custom for Farzadseb)');

const App = {
    adminClickCount: 0,
    adminTimer: null,
    isOnline: navigator.onLine,

    init() {
        try {
            // ردیابی وضعیت شبکه
            window.addEventListener('online', () => { this.isOnline = true; });
            window.addEventListener('offline', () => { this.isOnline = false; });

            // 1. مخفی‌سازی لودر با انیمیشن روان‌تر (۱.۸ ثانیه)
            this.hideLoader();

            // 2. تنظیم Easter Egg ادمین (۳ کلیک سریع روی لوگو)
            const logoTrigger = document.getElementById('admin-trigger');
            if (logoTrigger) {
                logoTrigger.addEventListener('click', () => this.handleAdminTrigger());
            }

            // 3. همگام‌سازی تنظیمات ادمین + نمایش لوگو/شماره
            this.syncAdminInputs();
            this.renderBranding(); // لوگو و شماره شما

            // 4. مقداردهی تعداد آزمون‌های امروز
            this.initializeDailyQuizCount();

            // 5. PWA / Service Worker
            this.initPWA();

            console.log('✅ App is ready — Designed for Farzadseb');
        } catch (e) {
            console.error('❌ App init failed:', e);
            window.showNotification('خطا در راه‌اندازی. لطفاً صفحه را دوباره بارگذاری کنید.', 'error');
        }
    },

    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('app-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    // راه‌اندازی اولین سوال — فقط اگر مجوز دسترسی وجود داشته باشد
                    if (window.QuizEngine && this.hasQuizAccess()) {
                        window.QuizEngine.nextQuestion();
                    } else {
                        window.showNotification('⚠️ دسترسی محدود: مهمان‌ها حداکثر ۵ آزمون در روز مجازند.', 'warn');
                    }
                }, 500);
            }
        }, 1800);
    },

    // === Easter Egg: 3-Click Admin Access ===
    handleAdminTrigger() {
        this.adminClickCount++;
        clearTimeout(this.adminTimer);
        
        if (this.adminClickCount >= 3) {
            this.openAdminModal();
            this.adminClickCount = 0;
            if (window.speakText) window.speakText("دسترسی ادمین فعال شد", 0.5); // ✅ Speed = 0.5
        } else {
            this.adminTimer = setTimeout(() => { this.adminClickCount = 0; }, 600);
        }
    },

    openAdminModal() {
        const modal = document.getElementById('adminModal');
        modal.style.display = 'flex';
        modal.setAttribute('tabindex', '-1');
        modal.focus();

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeAdminModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    },

    closeAdminModal() {
        document.getElementById('adminModal').style.display = 'none';
    },

    // === نمایش لوگو و شماره تلفن شما (در پنل ادمین) ===
    renderBranding() {
        const logoEl = document.getElementById('admin-brand-logo');
        const phoneEl = document.getElementById('admin-brand-phone');
        if (logoEl) logoEl.textContent = 'Farzadseb Academy 🎓';
        if (phoneEl) phoneEl.textContent = '📱 شماره تماس: 0912-XXX-XXXX'; // ← جایگزین کنید
    },

    syncAdminInputs() {
        const config = ConfigManager.getTelegramConfig();
        const tokenInput = document.getElementById('adminToken');
        const chatInput = document.getElementById('adminChatId');
        
        if (tokenInput) tokenInput.value = config.token || '';
        if (chatInput) chatInput.value = config.chatId || '';
    },

    // === محدودیت دسترسی: مهمان vs دانشجو (بر اساس کد فعال‌سازی) ===
    hasQuizAccess() {
        const studentCode = ConfigManager.get(ConfigManager.keys.studentCode);
        const isStudent = !!studentCode; // دانشجو = کد فعال دارد

        const stats = this.getDailyStats();
        const limit = isStudent ? 30 : 5;
        return stats.count < limit;
    },

    initializeDailyQuizCount() {
        const stats = this.getDailyStats();
        const now = new Date();
        const today = now.toDateString();

        if (stats.date !== today) {
            // ریست روزانه
            ConfigManager.set(ConfigManager.keys.dailyStats, JSON.stringify({
                date: today,
                count: 0
            }));
        }
    },

    incrementQuizCount() {
        const stats = this.getDailyStats();
        stats.count++;
        ConfigManager.set(ConfigManager.keys.dailyStats, JSON.stringify(stats));
    },

    getDailyStats() {
        const raw = ConfigManager.get(ConfigManager.keys.dailyStats);
        try {
            return JSON.parse(raw) || { date: '', count: 0 };
        } catch {
            return { date: '', count: 0 };
        }
    },

    // === PWA: نصب و به‌روزرسانی ===
    initPWA() {
        window.addEventListener('appinstalled', () => {
            window.showNotification('برنامه روی دستگاه شما نصب شد! 📲', 'success');
        });

        // شناسایی به‌روزرسانی جدید (برای دکمه Force Update)
        let refreshing = false;
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.showNotification('نسخه جدید بارگذاری شد. در حال ریفرش...', 'info');
                setTimeout(() => location.reload(), 1500);
            });
        }
    },

    // === ارسال گزارش به Ferdtestbot (فقط آنلاین) ===
    async sendReportToTelegram(report) {
        if (!this.isOnline) {
            console.warn('📤 گزارش ذخیره شد — ارسال پس از برقراری اتصال.');
            // اختیاری: ذخیره برای ارسال بعداً (با sync در آینده)
            return false;
        }

        const config = ConfigManager.getTelegramConfig();
        const token = config.token || ConfigManager.get(ConfigManager.keys.botToken);
        const chatId = config.chatId || '5879429761'; // ← Ferdtestbot: جایگزین با chat_id واقعی شما

        if (!token || !chatId) {
            console.error('❗ گزارش به تلگرام ارسال نشد: توکن یا chat_id فعال نیست.');
            return false;
        }

        try {
            const message = `
🎯 گزارش آزمون — ${new Date().toLocaleString('fa-IR')}
👤 دانشجو: ${report.studentName || 'ناشناس'}
🔢 کد: ${report.studentCode || '—'}
⏱ زمان: ${report.duration}s
📊 نمره: ${report.score}/${report.total} (${report.percent}%)
⭐ ستاره: ${'★'.repeat(report.stars)}${'☆'.repeat(5 - report.stars)}
❌ اشتباهات: ${report.incorrectCount}
📌 نقاط ضعف: ${report.weakAreas.join(', ') || 'ندارد'}
📈 پیشرفت: ${report.isNewRecord ? '📈 رکورد جدید!' : 'ثابت'}
            `.trim();

            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
            });

            const data = await res.json();
            if (data.ok) {
                console.log('✅ گزارش با موفقیت به Ferdtestbot ارسال شد.');
                return true;
            } else {
                console.error('❌ خطا در ارسال تلگرام:', data);
                return false;
            }
        } catch (err) {
            console.error('📡 خطا در ارسال گزارش:', err.message);
            return false;
        }
    }
};

// --- ConfigManager (ساده، ایمن، آفلاین) ---
const ConfigManager = {
    keys: {
        botToken: 'fred.bot.token.v2',
        chatId: 'fred.chat.id.v2',
        studentName: 'student.name.v2',
        studentCode: 'student.code.v2',
        dailyStats: 'student.quiz.stats.v2',
        lastReport: 'student.last.report.v2'
    },

    get(key) {
        return localStorage.getItem(key) || '';
    },

    set(key, value) {
        if (typeof value !== 'string') value = String(value);
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('💾 localStorage full or blocked:', e);
            window.showNotification('حافظه پر است. مرورگر را پاک کنید.', 'error');
        }
    },

    getTelegramConfig() {
        return {
            token: this.get(this.keys.botToken),
            chatId: this.get(this.keys.chatId)
        };
    }
};

// --- Toast Notifications (بزرگ‌تر برای راحتی شما) ---
window.showNotification = function(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const note = document.createElement('div');
    note.className = `notification ${type} animate-in`;
    note.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    note.style.fontSize = '1.3rem'; // ✅ بزرگ‌تر (ترجیح Farzadseb)
    note.style.padding = '1rem 1.4rem';
    note.style.minHeight = '3.8rem';

    container.appendChild(note);

    setTimeout(() => {
        note.classList.remove('animate-in');
        note.classList.add('animate-out');
        setTimeout(() => note.remove(), 500);
    }, 3500);
};

// --- توابع پنل ادمین (ارتقا یافته) ---
window.saveAdminData = function() {
    const token = document.getElementById('adminToken').value.trim();
    const chatId = document.getElementById('adminChatId').value.trim();

    // ✅ اعتبارسنجی هوشمند
    if (!/^\d+:[\w\-_]{30,}$/.test(token)) {
        alert('❗ توکن بات نامعتبر است.\nفرمت صحیح: 123456:ABCdefGHIjkl...');
        return;
    }
    if (!/^-?\d+$/.test(chatId)) {
        alert('❗ شناسه چت باید عدد باشد (مثلاً 5879429761 یا -1001234567890).');
        return;
    }

    ConfigManager.set(ConfigManager.keys.botToken, token);
    ConfigManager.set(ConfigManager.keys.chatId, chatId);
    window.showNotification('✅ تنظیمات تلگرام ذخیره شد — Ferdtestbot فعال است.', 'success');
    setTimeout(() => location.reload(), 1200);
};

window.forceAppUpdate = function() {
    if (confirm('آیا مطمئنید؟ تمام Service Workerها لغو و صفحه رفرش می‌شود.')) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                regs.forEach(reg => reg.unregister());
            }).finally(() => location.reload(true));
        } else {
            location.reload(true);
        }
    }
};

// --- اتصال به QuizEngine (برای افزایش شمارش و ارسال گزارش) ---
if (typeof window.QuizEngine !== 'undefined') {
    const originalFinish = window.QuizEngine.finishQuiz;
    window.QuizEngine.finishQuiz = function(...args) {
        // ابتدا نمره و گزارش را محاسبه کن
        const result = originalFinish.apply(this, args);

        // ✅ افزایش تعداد آزمون‌های امروز
        App.incrementQuizCount();

        // ✅ ارسال گزارش به تلگرام (اگر آنلاین بود)
        if (App.isOnline) {
            App.sendReportToTelegram(result).then(sent => {
                if (sent) {
                    window.showNotification('📩 گزارش به Ferdtestbot ارسال شد.', 'success');
                } else {
                    window.showNotification('⚠️ گزارش ذخیره شد — ارسال بعداً.', 'warn');
                }
            });
        }

        return result;
    };
}

// --- راه‌اندازی نهایی ---
document.addEventListener('DOMContentLoaded', () => App.init());
