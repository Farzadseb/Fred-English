<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Quiz - English with Fred</title>
    <style>
        :root { --bg: #0b1426; --title: #ffffff; --glass: rgba(255, 255, 255, 0.1); --blue: #5856d6; }
        body.light-mode { --bg: #f2f2f7; --title: #000000; --glass: rgba(255, 255, 255, 0.5); }
        body { font-family: Tahoma, sans-serif; background: var(--bg); margin: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 20px; color: var(--title); transition: 0.3s; }
        
        /* اصلاح برعکس بودن شماره سوال */
        .quiz-header { width: 100%; max-width: 500px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        #q-counter { direction: ltr !important; font-weight: bold; font-family: Arial, sans-serif; }

        .back-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--glass); display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
        
        .question-card { width: 100%; max-width: 500px; background: var(--glass); border-radius: 30px; padding: 35px 20px; text-align: center; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 15px 35px rgba(0,0,0,0.2); margin-bottom: 20px; }
        #question-text { font-size: 22px; font-weight: 800; color: #5856d6; line-height: 1.5; min-height: 33px; }
        
        /* استایل چپ‌چین برای متن‌های انگلیسی */
        .ltr-mode { direction: ltr !important; text-align: center !important; }

        #q-subtext { font-size: 14px; opacity: 0.7; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }
        .options-grid { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 10px; }
        .option-btn { width: 100%; padding: 18px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: var(--glass); color: var(--title); font-size: 17px; font-weight: 600; cursor: pointer; transition: 0.2s; text-align: center; }
        
        .correct { background: #34c759 !important; color: white !important; }
        .wrong { background: #ff3b30 !important; color: white !important; }
        #progress-fill { width: 0%; height: 6px; background: var(--blue); position: fixed; top: 0; left: 0; transition: 0.3s; z-index: 1000; }
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
        <h2 id="question-text">در حال بارگذاری...</h2>
        <p id="q-subtext">لطفاً صبر کنید</p>
    </div>

    <div class="options-grid" id="options-container"></div>

    <script src="a1-words.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        let currentQ = 0, score = 0, quizWords = [];
        const mode = localStorage.getItem('quizMode') || 'fa-en';

        function init() {
            // اصلاح نام متغیر دیتابیس (بررسی هر دو نام ممکن)
            const data = window.wordsA1 || window.words; 
            
            if (!data || data.length === 0) {
                document.getElementById('question-text').innerText = "خطا در بارگذاری لغات!";
                return;
            }

            quizWords = [...data].sort(() => 0.5 - Math.random()).slice(0, 10);
            render();
        }

        function render() {
            if (currentQ >= 10) return end();
            
            const q = quizWords[currentQ];
            const data = window.wordsA1 || window.words;

            // اصلاح نمایش شماره سوال (1 / 10)
            document.getElementById('q-counter').innerText = `${currentQ + 1} / 10`;
            document.getElementById('progress-fill').style.width = (currentQ + 1) * 10 + "%";

            const qText = document.getElementById('question-text');
            const subText = document.getElementById('q-subtext');
            let question, answer, optionKey, isEn = false;

            // تعیین محتوای سوال بر اساس مود
            if (mode === 'fa-en') {
                question = q.translation; answer = q.word; 
                subText.innerText = "معادل انگلیسی کلمه بالا چیست؟"; 
                optionKey = 'word'; isEn = false;
            } else if (mode === 'en-fa') {
                question = q.word; answer = q.translation; 
                subText.innerText = "معادل فارسی کلمه بالا چیست؟"; 
                optionKey = 'translation'; isEn = true;
            } else {
                question = q.definition || q.ex_en || "No Definition"; 
                answer = q.word; 
                subText.innerText = "این تعریف مربوط به کدام لغت است؟"; 
                optionKey = 'word'; isEn = true;
            }

            qText.innerText = question;
            // اگر متن انگلیسی است، چپ‌چین شود
            if(isEn) qText.classList.add('ltr-mode'); else qText.classList.remove('ltr-mode');

            // ساخت گزینه‌ها
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
                // اگر جواب انگلیسی است (مثل مود fa-en یا definition)، گزینه‌ها چپ‌چین شوند
                if(optionKey === 'word') btn.classList.add('ltr-mode');
                btn.innerText = c;
                btn.onclick = () => {
                    document.querySelectorAll('.option-btn').forEach(b => b.style.pointerEvents = 'none');
                    if (c === answer) { btn.classList.add('correct'); score++; }
                    else { 
                        btn.classList.add('wrong'); 
                        document.querySelectorAll('.option-btn').forEach(b => { 
                            if(b.innerText === answer) b.classList.add('correct'); 
                        });
                    }
                    setTimeout(() => { currentQ++; render(); }, 1000);
                };
                container.appendChild(btn);
            });
        }

        function end() {
            let p = (score / 10) * 100;
            localStorage.setItem('fredBest', p);
            alert(`آزمون تمام شد!\nامتیاز شما: ${p}%`);
            window.location.replace('index.html');
        }

        if (localStorage.getItem('fredTheme') === 'dark') document.body.classList.remove('light-mode');
        
        // اطمینان از اینکه لغات حتماً بارگذاری شده‌اند
        window.addEventListener('load', init);
    </script>
</body>
</html>
