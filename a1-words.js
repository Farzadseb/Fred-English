<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Quiz - English with Fred</title>
    <style>
        :root { --bg: #0b1426; --title: #ffffff; --glass: rgba(255, 255, 255, 0.1); }
        body.light-mode { --bg: #f2f2f7; --title: #000000; --glass: rgba(255, 255, 255, 0.5); }
        body { font-family: Tahoma, sans-serif; background: var(--bg); margin: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 20px; color: var(--title); transition: 0.3s; overflow-x: hidden; }
        
        .quiz-header { width: 100%; max-width: 500px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .back-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--glass); display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
        
        .question-card { width: 100%; max-width: 500px; background: var(--glass); border-radius: 30px; padding: 35px 20px; text-align: center; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 15px 35px rgba(0,0,0,0.2); margin-bottom: 20px; }
        #question-text { font-size: 22px; font-weight: 800; color: #5856d6; line-height: 1.5; }
        
        /* کلاس کمکی برای چپ‌چین کردن انگلیسی */
        .ltr-text { direction: ltr !important; text-align: center !important; }

        #q-subtext { font-size: 14px; opacity: 0.7; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }
        .options-grid { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 10px; }
        .option-btn { width: 100%; padding: 18px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: var(--glass); color: var(--title); font-size: 17px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        
        .correct { background: #34c759 !important; color: white !important; border: none; }
        .wrong { background: #ff3b30 !important; color: white !important; border: none; }
        #progress-fill { width: 0%; height: 6px; background: #5856d6; position: fixed; top: 0; left: 0; transition: 0.3s; z-index: 1000; }
    </style>
</head>
<body class="light-mode">
    <div id="progress-fill"></div>
    <div class="quiz-header">
        <div class="back-btn" onclick="window.location.replace('index.html')"><i class="fas fa-times"></i></div>
        <div id="q-counter">1 / 10</div>
        <div style="width:40px"></div>
    </div>

    <div class="question-card">
        <h2 id="question-text">...</h2>
        <p id="q-subtext">لطفاً صبر کنید</p>
    </div>

    <div class="options-grid" id="options-container"></div>

    <script src="a1-words.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        let currentQ = 0, score = 0, quizWords = [];
        const mode = localStorage.getItem('quizMode') || 'fa-en';

        // بهینه سازی لود اولیه
        function init() {
            const data = window.words || window.wordsA1;
            if (!data) { 
                setTimeout(init, 100); 
                return; 
            }
            quizWords = [...data].sort(() => 0.5 - Math.random()).slice(0, 10);
            render();
        }

        function render() {
            if (currentQ >= 10) return end();
            const q = quizWords[currentQ];
            const data = window.words || window.wordsA1;

            document.getElementById('progress-fill').style.width = (currentQ + 1) * 10 + "%";
            document.getElementById('q-counter').innerText = `${currentQ + 1} / 10`;

            const qElement = document.getElementById('question-text');
            let question, answer, subTitle, optionKey, isQuestionEn = false, isOptionEn = false;

            // تنظیم محتوا و تشخیص زبان برای چپ‌چین کردن
            if (mode === 'fa-en') {
                question = q.translation; answer = q.word; 
                subTitle = "معادل انگلیسی کلمه بالا چیست؟"; optionKey = 'word';
                isQuestionEn = false; isOptionEn = true;
            } else if (mode === 'en-fa') {
                question = q.word; answer = q.translation; 
                subTitle = "معادل فارسی کلمه بالا چیست؟"; optionKey = 'translation';
                isQuestionEn = true; isOptionEn = false;
            } else {
                question = q.definition || q.ex_en; answer = q.word; 
                subTitle = "این تعریف مربوط به کدام لغت است؟"; optionKey = 'word';
                isQuestionEn = true; isOptionEn = true;
            }

            qElement.innerText = question;
            // اعمال کلاس چپ‌چین اگر سوال انگلیسی است
            if(isQuestionEn) qElement.classList.add('ltr-text'); 
            else qElement.classList.remove('ltr-text');

            document.getElementById('q-subtext').innerText = subTitle;

            let choices = [answer];
            while (choices.length < 4) {
                let rand = data[Math.floor(Math.random() * data.length)];
                let val = rand[optionKey];
                if (!choices.includes(val) && val) choices.push(val);
            }
            choices.sort(() => 0.5 - Math.random());

            const container = document.getElementById('options-container');
            container.innerHTML = '';
            choices.forEach(c => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                if(isOptionEn) btn.classList.add('ltr-text'); // چپ‌چین کردن گزینه‌های انگلیسی
                btn.innerText = c;
                btn.onclick = () => {
                    document.querySelectorAll('.option-btn').forEach(b => b.style.pointerEvents = 'none');
                    if (c === answer) { btn.classList.add('correct'); score++; }
                    else { 
                        btn.classList.add('wrong'); 
                        document.querySelectorAll('.option-btn').forEach(b => { if(b.innerText === answer) b.classList.add('correct'); });
                    }
                    setTimeout(() => { currentQ++; render(); }, 1000);
                };
                container.appendChild(btn);
            });
        }

        function end() {
            let p = (score / 10) * 100;
            localStorage.setItem('fredBest', p);
            let sCount = Math.floor(p / 20);
            let stars = "⭐".repeat(sCount) + "☆".repeat(5 - sCount);
            alert(`آزمون تمام شد!\nامتیاز شما: ${p}%\nرتبه: ${stars}`);
            window.location.replace('index.html');
        }

        // لود سریع تم
        if (localStorage.getItem('fredTheme') === 'dark') document.body.classList.remove('light-mode');
        
        // شروع بلافاصله پس از آماده شدن ساختار
        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
