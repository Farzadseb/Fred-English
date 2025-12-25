/**
 * Screen Controller - مدیریت حالت‌های صفحه
 * نسخه نهایی قابل قفل RC1 + بهینه‌سازی state change
 */

const ScreenController = (() => {
    // حالت‌های برنامه
    const STATE = {
        HOME: 'home',
        QUIZ: 'quiz'
    };
    
    // وضعیت فعلی
    let currentState = STATE.HOME;
    let quizActive = false;
    
    // عناصر DOM
    const elements = {
        app: null,
        homeScreen: null,
        quizScreen: null,
        installOverlay: null,
        installPrompt: null
    };
    
    /**
     * مقداردهی اولیه کنترلر
     */
    function init() {
        console.log('🎮 Screen Controller initialized');
        
        // پیدا کردن عناصر
        elements.app = document.getElementById('app');
        elements.homeScreen = document.getElementById('home-screen');
        elements.quizScreen = document.getElementById('quiz-screen');
        elements.installOverlay = document.getElementById('install-prompt-overlay');
        elements.installPrompt = document.getElementById('install-prompt');
        
        // تنظیم حالت اولیه
        setState(STATE.HOME);
        
        // جلوگیری از مشکلات رایج (نسخه امن)
        preventCommonIssues();
        
        // تنظیم event listeners
        setupEventListeners();
    }
    
    /**
     * تغییر حالت برنامه
     */
    function setState(newState) {
        console.log(`🔄 Attempting state change: ${currentState} → ${newState}`);
        
        // ⭐ بهینه‌سازی: جلوگیری از state change تکراری
        if (newState === currentState) {
            console.log('⏭️  State unchanged, skipping');
            return;
        }
        
        // اعتبارسنجی حالت
        if (!Object.values(STATE).includes(newState)) {
            console.error('Invalid state:', newState);
            return;
        }
        
        const previousState = currentState;
        
        // به روزرسانی حالت
        currentState = newState;
        quizActive = (newState === STATE.QUIZ);
        
        // مخفی کردن همه صفحات
        hideAllScreens();
        
        // مخفی کردن overlay ها
        hideOverlays();
        
        // نمایش صفحه مناسب
        switch(newState) {
            case STATE.HOME:
                showHomeScreen();
                break;
            case STATE.QUIZ:
                showQuizScreen();
                break;
        }
        
        // اطلاع‌رسانی به ماژول‌های دیگر
        notifyStateChange(previousState, newState);
        
        // اسکرول به بالا
        scrollToTop();
        
        console.log(`✅ State changed successfully: ${previousState} → ${newState}`);
    }
    
    /**
     * مخفی کردن همه صفحات
     */
    function hideAllScreens() {
        document.querySelectorAll('.screen.active').forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    /**
     * مخفی کردن overlay ها
     */
    function hideOverlays() {
        if (elements.installOverlay) {
            elements.installOverlay.classList.remove('active');
        }
    }
    
    /**
     * نمایش صفحه اصلی
     */
    function showHomeScreen() {
        if (elements.homeScreen) {
            elements.homeScreen.classList.add('active');
        }
    }
    
    /**
     * نمایش صفحه آزمون
     */
    function showQuizScreen() {
        if (elements.quizScreen) {
            elements.quizScreen.classList.add('active');
        }
    }
    
    /**
     * نمایش پاپ‌آپ نصب
     */
    function showInstallPrompt() {
        if (elements.installOverlay && elements.installPrompt) {
            elements.installOverlay.classList.add('active');
            console.log('📱 Install prompt shown');
        }
    }
    
    /**
     * مخفی کردن پاپ‌آپ نصب
     */
    function hideInstallPrompt() {
        if (elements.installOverlay) {
            elements.installOverlay.classList.remove('active');
            console.log('📱 Install prompt hidden');
        }
    }
    
    /**
     * اطلاع‌رسانی تغییر حالت
     */
    function notifyStateChange(oldState, newState) {
        const event = new CustomEvent('appstatechange', {
            detail: {
                oldState,
                newState,
                quizActive,
                timestamp: Date.now(),
                isDuplicate: false
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * اسکرول به بالای صفحه
     */
    function scrollToTop() {
        document.querySelectorAll('.screen.active').forEach(screen => {
            screen.scrollTop = 0;
        });
    }
    
    /**
     * جلوگیری از مشکلات رایج UI (نسخه امن)
     */
    function preventCommonIssues() {
        // جلوگیری از focus روی عناصر خارج از صفحه
        document.addEventListener('focusin', (e) => {
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen && !activeScreen.contains(e.target)) {
                e.preventDefault();
                const focusable = activeScreen.querySelector('button, [tabindex]:not([tabindex="-1"])');
                if (focusable) focusable.focus();
            }
        }, true);
    }
    
    /**
     * تنظیم event listeners
     */
    function setupEventListeners() {
        // بستن overlay با کلیک روی پس‌زمینه
        if (elements.installOverlay) {
            elements.installOverlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    hideInstallPrompt();
                }
            });
        }
        
        // جلوگیری از بستن overlay با کلیک روی محتوا
        if (elements.installPrompt) {
            elements.installPrompt.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    /**
     * API عمومی کنترلر
     */
    return {
        // توابع اصلی
        init,
        setState,
        showInstallPrompt,
        hideInstallPrompt,
        
        // getters
        getCurrentState: () => currentState,
        isQuizActive: () => quizActive,
        getElements: () => ({ ...elements }),
        
        // constants
        STATE
    };
})();

// در دسترس قرار دادن برای فایل‌های دیگر
window.ScreenController = ScreenController;

// راه‌اندازی خودکار هنگام بارگذاری
document.addEventListener('DOMContentLoaded', ScreenController.init);
