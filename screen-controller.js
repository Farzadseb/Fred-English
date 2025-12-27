/**
 * screen-controller.js
 * مسئولیت: فقط مدیریت صفحه‌ها (views)
 * home / quiz
 */

const ScreenController = (() => {

    const STATE = {
        HOME: 'home',
        QUIZ: 'quiz'
    };

    let currentState = STATE.HOME;

    function hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
    }

    function showView(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('active');
        } else {
            console.warn(`View not found: ${id}`);
        }
    }

    function setState(newState) {
        if (newState === currentState) return;

        hideAllViews();

        switch (newState) {
            case STATE.HOME:
                showView('home');
                break;

            case STATE.QUIZ:
                showView('quiz');
                break;

            default:
                console.error('Invalid state:', newState);
                return;
        }

        currentState = newState;

        // اسکرول به بالا
        window.scrollTo(0, 0);
    }

    function getState() {
        return currentState;
    }

    function init() {
        // وضعیت اولیه
        hideAllViews();
        showView('home');
        currentState = STATE.HOME;
    }

    return {
        init,
        setState,
        getState,
        STATE
    };

})();

// راه‌اندازی خودکار
document.addEventListener('DOMContentLoaded', ScreenController.init);

// در دسترس بقیه فایل‌ها
window.ScreenController = ScreenController;
