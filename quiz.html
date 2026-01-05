<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Learning Center</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --bg: #0b1426; --text: #fff; --blue: #007aff; --glass: rgba(255,255,255,0.1); --gold: #f1c40f; --green: #34c759; }
        body.light-mode { --bg: #f2f2f7; --text: #1c1c1e; --glass: rgba(0,0,0,0.05); }
        body { font-family: -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: env(safe-area-inset-top) 15px 100px; display: flex; flex-direction: column; align-items: center; transition: 0.3s; }
        .head { width: 100%; max-width: 450px; display: flex; justify-content: space-between; align-items: center; padding: 15px 0; position: sticky; top: 0; background: var(--bg); z-index: 10; }
        .study-card { width: 100%; max-width: 400px; background: var(--glass); border-radius: 25px; padding: 25px 20px; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; box-sizing: border-box; }
        .section-title { font-size: 12px; font-weight: bold; color: var(--blue); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0,122,255,0.2); padding-bottom: 4px; }
        .en-text { font-size: 19px; font-weight: 700; color: #fff; display: block; margin-bottom: 2px; }
        .fa-text { font-size: 14px; color: var(--gold); display: block; text-align: right; margin-bottom: 10px; }
        .ex-text { font-size: 13px; color: #bdc3c7; display: block; padding-left: 10px; border-left: 2px solid var(--green); margin-bottom: 2px; }
        .ex-fa { font-size: 12px; color: #95a5a6; display: block; text-align: right; margin-bottom: 12px; }
        .footer-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 80px; background: rgba(11, 20, 38, 0.9); display: flex; justify-content: center; align-items: center; padding-bottom: env(safe-area-inset-bottom); }
        .next-btn { width: 90%; max-width: 350px; padding: 16px; border-radius: 18px; background: var(--blue); color: #fff; border: none; font-size: 18px; font-weight: bold; }
        .main-word { font-size: 40px; font-weight: 800; color: var(--blue); margin: 0; text-align: center; }
        #prog { position: fixed; top: 0; left: 0; height: 4px; background: var(--blue); transition: 0.4s; z-index: 1001; }
        /* استایل آزمون */
        .opt { width: 100%; max-width: 360px; padding: 16px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); background: var(--glass); color: var(--text); margin-bottom: 10px; cursor: pointer; font-size: 16px; }
        .correct { background: #34c759 !important; border: none; }
        .wrong { background: #ff3b30 !important; border: none; }
    </style>
</head>
<body>
    <div id="prog"></div>
    <div class="head">
        <div onclick="location.replace('index.html')"><i class="fas fa-times"></i></div>
        <div id="cnt" style="direction: ltr; font-weight: bold;">1 / 10</div>
        <div onclick="spk(data[cur].word)"><i class="fas fa-volume-up"></i></div>
    </div>
    <div id="content" style="width: 100%; display: flex; flex-direction: column; align-items: center;"></div>
    <div class="footer-nav" id="f-nav" style="display:none">
        <button class="next-btn" onclick="cur++;render()">کلمه بعدی</button>
    </div>

    <script src="a1-words.js"></script>
    <script>
        let cur=0,sc=0,mis=[],data=[];
        const mode=localStorage.getItem('quizMode')||'study';
        const _sT="ODU1MzIyNDUxNDpBQUcwWFh6QThkYTU1akNHWG56U3RQLTBJeEhobmZrVFBSdw==", _sC="OTY5OTE4NTk=";

        function spk(t){if(localStorage.getItem('mute')==='true')return; const m=new SpeechSynthesisUtterance(t);m.lang='en-US';m.rate=0.55;speechSynthesis.cancel();speechSynthesis.speak(m)}

        function init(){
            if(localStorage.getItem('th')==='l')document.body.classList.add('light-mode');
            data=[...wordsA1].sort(()=>0.5-Math.random()).slice(0,10);
            render();
        }

        function render(){
            if(cur>=10) return end();
            document.getElementById('cnt').innerText=`${cur+1} / 10`;
            document.getElementById('prog').style.width=(cur+1)*10+"%";
            const w=data[cur]; const con=document.getElementById('content');
            window.scrollTo(0,0);

            if(mode==='study'){
                document.getElementById('f-nav').style.display='flex';
                con.innerHTML=`<h1 class="main-word">${w.word}</h1><div style="text-align:center;font-size:20px;margin-bottom:20px">${w.translation}</div>
                <div class="study-card">
                    <div class="section-title"><i class="fas fa-quote-left"></i> EXAMPLE</div>
                    <span class="en-text" onclick="spk('${w.example}')">${w.example}</span><span class="fa-text">${w.ex_trans}</span>
                    <div class="section-title"><i class="fas fa-link"></i> COLLOCATION</div>
                    <span class="en-text" onclick="spk('${w.collocation}')">${w.collocation}</span><span class="fa-text">${w.coll_trans}</span>
                    <span class="ex-text">${w.coll_ex}</span><span class="ex-fa">${w.coll_ex_trans}</span>
                    <div class="section-title"><i class="fas fa-bolt"></i> PHRASAL VERBS</div>
                    <span class="en-text" onclick="spk('${w.phrasal_1}')">${w.phrasal_1}</span><span class="fa-text">${w.ph1_trans}</span>
                    <span class="ex-text">${w.ph1_ex}</span><span class="ex-fa">${w.ph1_ex_trans}</span>
                    <span class="en-text" onclick="spk('${w.phrasal_2}')" style="margin-top:10px">${w.phrasal_2}</span><span class="fa-text">${w.ph2_trans}</span>
                    <span class="ex-text">${w.ph2_ex}</span><span class="ex-fa">${w.ph2_ex_trans}</span>
                </div>`;
                spk(w.word);
            } else {
                document.getElementById('f-nav').style.display='none';
                let ques=mode==='en-fa'?w.word:w.translation, ans=mode==='en-fa'?w.translation:w.word;
                con.innerHTML=`<div class="main-word" style="margin:40px 0">${ques}</div><div id="opts" style="width:100%;display:flex;flex-direction:column;align-items:center"></div>`;
                if(mode==='en-fa') spk(ques);
                let ch=[ans]; while(ch.length<4){let r=wordsA1[Math.floor(Math.random()*wordsA1.length)].word; if(!ch.includes(r))ch.push(r)}
                ch.sort(()=>0.5-Math.random()).forEach(c=>{
                    const b=document.createElement('button'); b.className='opt'; b.innerText=c;
                    b.onclick=()=>{if(c===ans){b.classList.add('correct');sc++}else{b.classList.add('wrong');mis.push({q:w.word,a:ans})} setTimeout(()=>{cur++;render()},1000)};
                    document.getElementById('opts').appendChild(b);
                });
            }
        }

        async function end(){
            const p=(sc/10)*100; const name=localStorage.getItem('fredName')||'User';
            if(mode!=='study'){
                let saved=JSON.parse(localStorage.getItem('fredM')||'[]');
                mis.forEach(m=>{if(!saved.find(s=>s.q===m.q))saved.push(m)});
                localStorage.setItem('fredM',JSON.stringify(saved.slice(-15)));
                if(p>parseInt(localStorage.getItem('fredBest')||0))localStorage.setItem('fredBest',p);
                const t=atob(_sT), c=atob(_sC);
                fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:c,text:`📊 گزارش ${name}\n🏆 امتیاز: ${p}%`})});
            }
            document.body.innerHTML=`<div style="text-align:center;padding-top:100px"><h1>${p>=70?'🥇':'📖'}</h1><h2>نتیجه: ${p}%</h2><button class="next-btn" onclick="location.replace('index.html')">بازگشت</button></div>`;
        }
        window.onload=init;
    </script>
</body>
</html>
