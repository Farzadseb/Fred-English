const App = {
    muted: false,
    theme: 'light'
};

function switchView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.mode-card').forEach(card => {
        card.onclick = () => {
            switchView('quiz');
            startQuiz(card.dataset.mode);
        };
    });

    document.getElementById('backBtn').onclick = () => switchView('home');

    document.getElementById('muteBtn').onclick = () => {
        App.muted = !App.muted;
        document.getElementById('muteBtn').textContent = App.muted ? '🔇' : '🔊';
    };

    window.isMuted = () => App.muted;

    document.getElementById('themeBtn').onclick = () => {
        document.body.classList.toggle('dark');
    };

    document.getElementById('whatsappBtn').onclick = () => {
        window.open(
            'https://wa.me/989017708544?text=' +
            encodeURIComponent('سلام، برای ثبت‌نام در English with Fred پیام می‌دم'),
            '_blank'
        );
    };

    document.getElementById('exitBtn').onclick = () => {
        if (confirm('خروج؟')) window.location.href = 'about:blank';
    };
});
