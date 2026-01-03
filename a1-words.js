<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Quiz - English with Fred</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --bg: #0b1426; --blue: #00a8ff; --green: #28cd41; --red: #ff3b30; --text: #1e293b; --card: #ffffff; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: white; margin: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 10px; overflow-x: hidden; }

        .top-bar { width: 100%; max-width: 400px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .control-btn { background: rgba(30, 41, 59, 0.7); border: none; color: var(--blue); width: 42px; height: 42px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .progress-bar { width: 95%; max-width: 380px; height: 6px; background: #334155; border-radius: 10px; margin-bottom: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--blue); width: 0%; transition: 0.4s; }

        /* کادر سفید ۲۰ درصد کوچکتر */
        .q-card { 
            background: var(--card); 
            color: var(--text); 
            padding: 20px; 
            border-radius: 28px; 
            width: 75%; 
            max-width: 280px; 
            text-align: center; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); 
            margin: 10px auto; 
        }

        .audio-btn { background: linear-gradient(145deg, #00bfff, #00a8ff); color: white; border: none; width: 46px; height: 46px; border-radius: 50%; font-size: 18px; cursor: pointer; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(0, 168, 255, 0.3); }
        .question-text { font-size: 20px; font-weight: 600; margin-bottom: 18px; color: #1c1c1e; min-height: 40px; display: flex; align-items: center; justify-content: center; }

        .options-grid { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        
        /* دکمه‌های براق آیفونی */
        .opt-btn { 
            width: 100%;
            height: 48px; 
            padding: 0 15px;
            font-size: 16px;
            border-radius: 24px;
            border: 1px solid rgba(0,0,0,0.05);
            background: linear-gradient(180deg, #ffffff 0%, #f2f2f7 100%);
            color: #1c1c1e;
            font-weight: 500;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .opt-btn.correct { background: linear-gradient(180deg, #34c759 0%, #28cd41 100%) !important; color: white !important; border: none; }
        .opt-btn.wrong { background: linear-gradient(180deg, #ff453a 0%, #ff3b30 100%) !important; color: white !important; border: none; }
    </style>
</head>
<body>
    <div class="top-bar">
        <button class="control-btn" onclick="window.location.href='index.html'"><i class="fas fa-home"></i></button>
        <div id="score-display" style="font-weight: bold; color: var(--blue);">امتیاز: 0</div>
    </div>
    <div class="progress-bar"><div id="fill" class="progress-fill"></div></div>
    <div id="quiz-content" style="width:100%; display:flex; justify-content:center;"></div>

    <script src="a1-words.js"></script>
    <script>
        const words = window.wordsA1 || [];
        let session = { mode: localStorage.getItem('quizMode') || 'fa-en', questions: [], index: 0, score: 0, answered: false };

        function render() {
            if (session.index >= 10) { finish(); return; }
            const q = session.questions[session.index];
            session.answered = false;
            document.getElementById('fill').style.width = ((session.index + 1) / 10 * 100) + "%";
            document.getElementById('score-display').innerText = `امتیاز: ${session.score}`;

            let qTxt = "", aCor = "";
            // تطبیق با ساختار فایل لغات شما
            if (session.mode === 'fa-en') { qTxt = q.translation; aCor = q.word; }
            else if (session.mode === 'en-fa') { qTxt = q.word; aCor = q.translation; }
            else if (session.mode === 'word-def') { qTxt = q.word; aCor = q.ex_en; } // استفاده از مثال به جای تعریف
            else { qTxt = q.ex_en; aCor = q.word; }

            let opts = [aCor];
            while(opts.length < 4) {
                let r = words[Math.floor(Math.random() * words.length)];
                let o = (session.mode === 'fa-en' || session.mode === 'def-word') ? r.word : (session.mode === 'en-fa' ? r.translation : r.ex_en);
                if(o && !opts.includes(o)) opts.push(o);
            }
            opts.sort(() => Math.random() - 0.5);

            document.getElementById('quiz-content').innerHTML = `
                <div class="q-card">
                    <button class="audio-btn" onclick="speak(\`${q.word}\`)"><i class="fas fa-volume-up"></i></button>
                    <div class="question-text">${qTxt}</div>
                    <div class="options-grid">${opts.map(o => `<button class="opt-btn" onclick="check(this,'${o}','${aCor}')">${o}</button>`).join('')}</div>
                </div>`;

            setTimeout(() => { speak(q.word); }, 500);
        }

        function check(btn, sel, cor) {
            if(session.answered) return; session.answered = true;
            if(sel === cor) { btn.classList.add('correct'); session.score++; }
            else { 
                btn.classList.add('wrong');
                document.querySelectorAll('.opt-btn').forEach(b => { if(b.innerText === cor) b.classList.add('correct'); });
            }
            setTimeout(() => { session.index++; render(); }, 1200);
        }

        function finish() {
            const p = (session.score / 10) * 100;
            localStorage.setItem('fredBest', Math.max(p, localStorage.getItem('fredBest')||0));
            alert(`نمره شما: ${p}%`); window.location.href = 'index.html';
        }

        function speak(t) { 
            if(localStorage.getItem('fredMute')!=='true' && t) { 
                speechSynthesis.cancel(); 
                let m = new SpeechSynthesisUtterance(t); 
                m.lang='en-US'; m.rate = 0.5; speechSynthesis.speak(m); 
            } 
        }

        window.onload = () => { 
            if(words.length > 0) {
                session.questions = [...words].sort(()=>0.5-Math.random()).slice(0,10); 
                render(); 
            }
        };
    </script>
</body>
</html>
