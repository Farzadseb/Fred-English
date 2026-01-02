// دیتابیس لغات
const words = [
    {
        word: "Achieve.", 
        trans: "دستیابی",
        collo: "Achieve success.",
        colloMean: "به موفقیت رسیدن.",
        phrasal: [
            {v: "Carry out.", m: "انجام دادن", ex: "Carry out the task."},
            {v: "Go after.", m: "دنبال کردن هدف", ex: "Go after your dreams."}
        ]
    }
];

// مدیریت صفحات
setTimeout(() => document.getElementById('welcome-screen').style.display = 'none', 3000);

function startApp() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('back-btn').style.visibility = 'visible';
    renderWord(0);
}

function goBack() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('back-btn').style.visibility = 'hidden';
}

function renderWord(i) {
    const item = words[i];
    document.getElementById('quiz-container').innerHTML = `
        <div class="welcome-card ltr-content" style="animation:none; width:90%; margin:15px auto;">
            <div class="progress-bar"><div class="fill" style="width:100%"></div></div>
            <h1 style="display:inline;">${item.word}</h1>
            <button onclick="speak('${item.word}')" style="background:none; border:none; font-size:24px; cursor:pointer;">🔊</button>
            <p style="direction:rtl; text-align:right;">معنی: ${item.trans}</p>
            <hr>
            <p><strong>Collocation:</strong> ${item.collo}</p>
            <p style="direction:rtl; text-align:right;">${item.colloMean}</p>
            <hr>
            <p><strong>Phrasal Verbs:</strong></p>
            ${item.phrasal.map(p => `<p>🔹 ${p.v} : ${p.ex}</p><p style="direction:rtl; text-align:right;">${p.m}</p>`).join('')}
        </div>
    `;
}
