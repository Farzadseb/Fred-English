/**
 * screen-controller.js
 * مسئولیت: فقط مدیریت نمایش صفحه‌ها
 * home / quiz
 * بدون state اضافی، بدون تداخل
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
        if (!el) {
            console.warn(`ScreenController: view "${id}" پیدا نشد`);
            return;
        }
        el.classList.add('active');
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
                console.error('ScreenController: state نامعتبر', newState);
                return;
        }

        currentState = newState;
        window.scrollTo(0, 0);
    }

    function getState() {
        return currentState;
    }

    function init() {
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

/* راه‌اندازی خودکار */
document.addEventListener('DOMContentLoaded', () => {
    ScreenController.init();
});

/* در دسترس برای app.js و quiz.js */
window.ScreenController = ScreenController;
