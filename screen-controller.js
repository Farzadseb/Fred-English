/**
 * Screen Controller - مدیریت صفحات و ناوبری
 * نسخه 2.0 - با پشتیبانی از انیمیشن و history
 */

const ScreenController = (() => {
    // وضعیت صفحات
    const state = {
        currentScreen: 'home',
        previousScreen: null,
        screenHistory: ['home'],
        isTransitioning: false,
        screens: new Map(),
        animations: {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    };

    // رویدادها
    const events = {
        beforeShow: new Map(),
        afterShow: new Map(),
        beforeHide: new Map(),
        afterHide: new Map()
    };

    /**
     * مقداردهی اولیه
     */
    function init() {
        // ثبت همه صفحات
        registerScreens();
        
        // نمایش صفحه اول
        showScreen('home', false);
        
        // تنظیم history API
        setupHistory();
        
        console.log('🖥️ Screen Controller initialized');
        return true;
    }

    /**
     * ثبت صفحات
     */
    function registerScreens() {
        const screenElements = document.querySelectorAll('[data-screen]');
        
        screenElements.forEach(element => {
            const screenId = element.dataset.screen || element.id;
            if (screenId) {
                state.screens.set(screenId, {
                    element: element,
                    id: screenId,
                    title: element.dataset.title || screenId
                });
                
                // مخفی کردن همه صفحات
                element.style.display = 'none';
            }
        });
        
        // اگر data-screen نبود، از id استفاده کن
        if (state.screens.size === 0) {
            const elements = document.querySelectorAll('.view, .screen, [id]');
            elements.forEach(element => {
                if (element.id && !element.id.includes('-')) {
                    state.screens.set(element.id, {
                        element: element,
                        id: element.id,
                        title: element.dataset.title || element.id
                    });
                    element.style.display = 'none';
                }
            });
        }
        
        console.log(`📱 Registered ${state.screens.size} screens`);
    }

    /**
     * نمایش صفحه
     */
    function showScreen(screenId, animate = true, data = null) {
        // اعتبارسنجی
        if (state.isTransitioning) {
            console.warn('⚠️ Already transitioning, please wait');
            return false;
        }
        
        if (!state.screens.has(screenId)) {
            console.error(`❌ Screen not found: ${screenId}`);
            return false;
        }
        
        if (state.currentScreen === screenId) {
            return true;
        }
        
        state.isTransitioning = true;
        state.previousScreen = state.currentScreen;
        state.currentScreen = screenId;
        
        // اضافه کردن به history
        if (screenId !== state.screenHistory[state.screenHistory.length - 1]) {
            state.screenHistory.push(screenId);
            
            // حفظ فقط ۲۰ صفحه آخر
            if (state.screenHistory.length > 20) {
                state.screenHistory.shift();
            }
        }
        
        // اجرای رویدادهای beforeHide برای صفحه قبلی
        if (state.previousScreen) {
            const beforeHideEvents = events.beforeHide.get(state.previousScreen);
            if (beforeHideEvents) {
                beforeHideEvents.forEach(callback => callback(data));
            }
        }
        
        // اجرای رویدادهای beforeShow برای صفحه جدید
        const beforeShowEvents = events.beforeShow.get(screenId);
        if (beforeShowEvents) {
            beforeShowEvents.forEach(callback => callback(data));
        }
        
        // انجام transition
        performTransition(state.previousScreen, screenId, animate, data);
        
        // به‌روزرسانی history API
        updateHistory(screenId);
        
        return true;
    }

    /**
     * انجام transition بین صفحات
     */
    function performTransition(fromScreenId, toScreenId, animate, data) {
        const fromScreen = fromScreenId ? state.screens.get(fromScreenId)?.element : null;
        const toScreen = state.screens.get(toScreenId).element;
        
        // نمایش صفحه جدید
        toScreen.style.display = 'block';
        toScreen.style.visibility = 'hidden';
        
        // محاسبه انیمیشن‌ها
        if (animate && fromScreen) {
            // انیمیشن خروج صفحه قبلی
            fromScreen.style.transition = `opacity ${state.animations.duration}ms ${state.animations.easing}`;
            fromScreen.style.opacity = '0';
            
            // بعد از پایان انیمیشن خروج
            setTimeout(() => {
                fromScreen.style.display = 'none';
                fromScreen.style.opacity = '1';
                fromScreen.style.visibility = 'visible';
                
                // انیمیشن ورود صفحه جدید
                toScreen.style.visibility = 'visible';
                toScreen.style.transition = `opacity ${state.animations.duration}ms ${state.animations.easing}`;
                toScreen.style.opacity = '0';
                
                // Trigger reflow
                toScreen.offsetHeight;
                
                toScreen.style.opacity = '1';
                
                // پایان transition
                setTimeout(() => {
                    toScreen.style.transition = '';
                    completeTransition(fromScreenId, toScreenId, data);
                }, state.animations.duration);
                
            }, state.animations.duration);
        } else {
            // بدون انیمیشن
            if (fromScreen) {
                fromScreen.style.display = 'none';
            }
            
            toScreen.style.display = 'block';
            toScreen.style.visibility = 'visible';
            toScreen.style.opacity = '1';
            
            completeTransition(fromScreenId, toScreenId, data);
        }
    }

    /**
     * تکمیل transition
     */
    function completeTransition(fromScreenId, toScreenId, data) {
        // اجرای رویدادهای afterHide
        if (fromScreenId) {
            const afterHideEvents = events.afterHide.get(fromScreenId);
            if (afterHideEvents) {
                afterHideEvents.forEach(callback => callback(data));
            }
        }
        
        // اجرای رویدادهای afterShow
        const afterShowEvents = events.afterShow.get(toScreenId);
        if (afterShowEvents) {
            afterShowEvents.forEach(callback => callback(data));
        }
        
        // Focus روی اولین element قابل focus
        setTimeout(() => {
            const focusable = toScreen.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable) {
                focusable.focus();
            }
        }, 100);
        
        // اسکرول به بالا
        window.scrollTo(0, 0);
        
        state.isTransitioning = false;
        
        console.log(`🔄 Screen changed: ${fromScreenId || 'none'} → ${toScreenId}`);
    }

    /**
     * بازگشت به صفحه قبلی
     */
    function goBack() {
        if (state.screenHistory.length <= 1) {
            console.warn('⚠️ No previous screen');
            return false;
        }
        
        // حذف صفحه فعلی
        state.screenHistory.pop();
        
        // رفتن به صفحه قبلی
        const previousScreen = state.screenHistory[state.screenHistory.length - 1];
        return showScreen(previousScreen, true);
    }

    /**
     * تنظیم history API
     */
    function setupHistory() {
        // جلوگیری از بازگشت مرورگر
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.screen) {
                showScreen(event.state.screen, true, event.state.data);
            } else {
                goBack();
            }
        });
        
        // ثبت state اولیه
        history.replaceState({ 
            screen: 'home', 
            timestamp: Date.now() 
        }, '', window.location.pathname);
    }

    /**
     * به‌روزرسانی history
     */
    function updateHistory(screenId) {
        history.pushState({ 
            screen: screenId, 
            timestamp: Date.now(),
            previous: state.previousScreen
        }, '', `#${screenId}`);
    }

    /**
     * ثبت رویداد برای صفحه
     */
    function on(screenId, eventName, callback) {
        if (!events[eventName]) {
            console.error(`❌ Invalid event: ${eventName}`);
            return false;
        }
        
        if (!events[eventName].has(screenId)) {
            events[eventName].set(screenId, []);
        }
        
        events[eventName].get(screenId).push(callback);
        return true;
    }

    /**
     * حذف رویداد
     */
    function off(screenId, eventName, callback) {
        if (!events[eventName] || !events[eventName].has(screenId)) {
            return false;
        }
        
        const callbacks = events[eventName].get(screenId);
        const index = callbacks.indexOf(callback);
        
        if (index > -1) {
            callbacks.splice(index, 1);
            return true;
        }
        
        return false;
    }

    /**
     * دریافت وضعیت فعلی
     */
    function getState() {
        return {
            currentScreen: state.currentScreen,
            previousScreen: state.previousScreen,
            screenHistory: [...state.screenHistory],
            totalScreens: state.screens.size,
            isTransitioning: state.isTransitioning
        };
    }

    /**
     * دریافت صفحه فعلی
     */
    function getCurrentScreen() {
        return state.screens.get(state.currentScreen);
    }

    /**
     * پنهان کردن همه صفحات (به جز یک صفحه)
     */
    function hideAllScreens(exceptScreenId = null) {
        state.screens.forEach((screen, screenId) => {
            if (screenId !== exceptScreenId) {
                screen.element.style.display = 'none';
            }
        });
    }

    /**
     * نمایش صفحه با داده‌های خاص
     */
    function showScreenWithData(screenId, data) {
        return showScreen(screenId, true, data);
    }

    /**
     * تغییر عنوان صفحه
     */
    function setScreenTitle(screenId, title) {
        const screen = state.screens.get(screenId);
        if (screen) {
            screen.title = title;
            
            // به‌روزرسانی title در صورت وجود
            const titleElement = screen.element.querySelector('[data-screen-title]');
            if (titleElement) {
                titleElement.textContent = title;
            }
            
            // به‌روزرسانی document title
            if (screenId === state.currentScreen) {
                document.title = `${title} - English with Fred`;
            }
            
            return true;
        }
        return false;
    }

    /**
     * اضافه کردن کلاس به صفحه
     */
    function addScreenClass(screenId, className) {
        const screen = state.screens.get(screenId);
        if (screen) {
            screen.element.classList.add(className);
            return true;
        }
        return false;
    }

    /**
     * حذف کلاس از صفحه
     */
    function removeScreenClass(screenId, className) {
        const screen = state.screens.get(screenId);
        if (screen) {
            screen.element.classList.remove(className);
            return true;
        }
        return false;
    }

    /**
     * تابع کمکی برای تغییر سریع بین صفحات اصلی
     */
    function navigateTo(screenId) {
        const mainScreens = ['home', 'quiz', 'progressReport'];
        if (mainScreens.includes(screenId)) {
            return showScreen(screenId, true);
        }
        return false;
    }

    // API عمومی
    return {
        init,
        showScreen,
        goBack,
        on,
        off,
        getState,
        getCurrentScreen,
        hideAllScreens,
        showScreenWithData,
        setScreenTitle,
        addScreenClass,
        removeScreenClass,
        navigateTo,
        
        // برای backward compatibility
        switchView: showScreen,
        getView: () => state.currentScreen
    };
})();

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', ScreenController.init);

// در دسترس قرار دادن در window
window.ScreenController = ScreenController;
window.switchView = ScreenController.showScreen;
