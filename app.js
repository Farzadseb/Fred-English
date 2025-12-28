const App = {
    theme: localStorage.getItem('theme') || 'light',
    muted: localStorage.getItem('muted') === 'true',
    bestScore: Number(localStorage.getItem('bestScore') || 0)
};

const $ = id => document.getElementById(id);

function switchView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    $(id).classList.add('active');
}

function showNotification(t) {
    const n = $('notification');
    n.textContent = t;
    n.classList.add('show');
    setTimeout(()=>n.classList.remove('show'),2000);
}

function applyTheme(){
    document.body.classList.toggle('dark',App.theme==='dark');
    $('themeBtn').textContent = App.theme==='dark'?'☀️':'🌙';
}

$('themeBtn').onclick=()=>{
    App.theme=App.theme==='dark'?'light':'dark';
    localStorage.setItem('theme',App.theme);
    applyTheme();
};

$('muteBtn').onclick=()=>{
    App.muted=!App.muted;
    localStorage.setItem('muted',App.muted);
    $('muteBtn').textContent=App.muted?'🔇':'🔊';
};

window.isMuted=()=>App.muted;

$('registerBtn').onclick=()=>{
    const phone='989017708544';
    const msg='سلام، می‌خواهم در کلاس English with Fred ثبت‌نام کنم.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
};

$('backHome').onclick=()=>switchView('home');
$('exitBtn').onclick=()=>location.href='about:blank';

document.addEventListener('DOMContentLoaded',()=>{
    applyTheme();
    $('scoreValue').textContent=App.bestScore+'%';
});
