/**
 * Screen Controller - مدیریت حالت‌های صفحه
 * نسخه نهایی با انیمیشن‌های کنترل شده
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
    let animationEnabled = true;
    
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
        
        // بررسی ترجیح انیمیشن کاربر
        checkAnimationPreferences();
        
        // تنظیم حالت اولیه
        setState(STATE.HOME);
        
        // جلوگیری از مشکلات رایج
        preventCommonIssues();
        
        // تنظیم event listeners
        setupEventListeners();
    }
    
    /**
     * بررسی ترجیح کاربر برای انیمیشن
     */
    function checkAnimationPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        animationEnabled = !prefersReducedMotion;
        
        console.log(`🎬 Animation ${animationEnabled ? 'enabled' : 'disabled'} (user preference)`);
    }
    
    /**
     * تغییر حالت برنامه
     */
    function setState(newState) {
        console.log(`🔄 Changing state: ${currentState} → ${newState}`);
        
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
    }
    
    /**
     * مخفی کردن همه صفحات
     */
    function hideAllScreens() {
        if (elements.homeScreen) elements.homeScreen.classList.remove('active');
        if (elements.quizScreen) elements.quizScreen.classList.remove('active');
    }
    
    /**
     * مخفی کردن overlay ها
     */
    function hideOverlays() {
        if (elements.installOverlay) elements.installOverlay.classList.remove('active');
    }
    
    /**
     * نمایش صفحه اصلی
     */
    function showHomeScreen() {
        if (elements.homeScreen) {
            elements.homeScreen.classList.add('active');
            console.log('✅ Home screen activated');
        }
    }
    
    /**
     * نمایش صفحه آزمون
     */
    function showQuizScreen() {
        if (elements.quizScreen) {
            elements.quizScreen.classList.add('active');
            console.log('✅ Quiz screen activated');
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
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * اسکرول به بالای صفحه
     */
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (elements.app) {
            elements.app.scrollTop = 0;
        }
    }
    
    /**
     * جلوگیری از مشکلات رایج UI
     */
    function preventCommonIssues() {
        // جلوگیری از کشیدن به روزرسانی (pull-to-refresh)
        document.addEventListener('touchmove', function(e) {
            if (window.scrollY === 0) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // جلوگیری از zoom با دابل تاپ
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
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
        
        // گوش دادن به تغییر ترجیح انیمیشن کاربر
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            animationEnabled = !e.matches;
            console.log(`🎬 Animation ${animationEnabled ? 'enabled' : 'disabled'} (preference changed)`);
        });
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
