let quiz = { index:0, score:0, mode:null, questions:[] };

function startQuiz(mode){
    quiz = {
        index:0,
        score:0,
        mode,
        questions:[...words].sort(()=>0.5-Math.random()).slice(0,10)
    };
    switchView('quiz');
    nextQuestion();
}

document.querySelectorAll('.mode-card').forEach(c=>{
    c.onclick=()=>startQuiz(c.dataset.mode);
});

function nextQuestion(){
    if(quiz.index>=10) return finishQuiz();
    const w = quiz.questions[quiz.index];
    let q='',correct='';
    if(quiz.mode==='en-fa'){ q=w.en; correct=w.fa; speak(w.en); }
    if(quiz.mode==='fa-en'){ q=w.fa; correct=w.en; }
    if(quiz.mode==='word-def'){ q=w.en; correct=w.def; speak(w.en); }
    if(quiz.mode==='def-word'){ q=w.def; correct=w.en; }

    $('questionText').textContent=q;
    $('qIndex').textContent=quiz.index+1;
    $('qScore').textContent=quiz.score;

    const options = shuffle([
        correct,
        ...shuffle(words).slice(0,3).map(x=>quiz.mode.includes('fa')?x.en:x.fa||x.def)
    ]);

    $('choices').innerHTML='';
    options.forEach(o=>{
        const b=document.createElement('button');
        b.className='btn light';
        b.textContent=o;
        b.onclick=()=>check(o,correct);
        $('choices').appendChild(b);
    });
}

function check(a,c){
    if(a===c){ quiz.score++; $('feedback').textContent='✅ درست'; }
    else $('feedback').textContent='❌ غلط';
    quiz.index++;
    setTimeout(nextQuestion,800);
}

function finishQuiz(){
    const p=Math.round((quiz.score/10)*100);
    if(p>App.bestScore){
        App.bestScore=p;
        localStorage.setItem('bestScore',p);
        $('scoreValue').textContent=p+'%';
    }
    switchView('home');
    showNotification(`امتیاز: ${p}%`);
}

function shuffle(a){ return a.sort(()=>0.5-Math.random()); }
