let quiz={};

const MODES={
  'en-fa':['english','persian',true],
  'fa-en':['persian','english',false],
  'word-def':['english','definition',true],
  'def-word':['definition','english',false]
};

function startQuiz(mode){
  const c=MODES[mode];
  const list=words.filter(w=>w[c[0]]&&w[c[1]]);
  quiz={mode,c,list:list.sort(()=>.5-Math.random()).slice(0,10),i:0,score:0};
  switchView('quiz');
  showQ();
}

function showQ(){
  if(quiz.i>=quiz.list.length){finishQuiz();return;}
  const w=quiz.list[quiz.i];
  quiz.correct=w[quiz.c[1]];
  document.getElementById('question').textContent=w[quiz.c[0]];
  document.getElementById('qIndex').textContent=quiz.i+1;
  document.getElementById('score').textContent=quiz.score;

  const opts=words.map(x=>x[quiz.c[1]]).filter(v=>v&&v!==quiz.correct)
    .sort(()=>.5-Math.random()).slice(0,3);
  opts.push(quiz.correct);
  opts.sort(()=>.5-Math.random());

  const box=document.getElementById('options');
  box.innerHTML='';
  opts.forEach(o=>{
    const b=document.createElement('button');
    b.className='btn option';
    b.textContent=o;
    b.onclick=()=>check(o);
    box.appendChild(b);
  });

  if(quiz.c[2]) speak(w[quiz.c[0]]);
}

function check(a){
  if(a===quiz.correct) quiz.score++;
  quiz.i++;
  showQ();
}

function finishQuiz(){
  const percent=Math.round((quiz.score/quiz.list.length)*100);
  const best=Math.max(percent, localStorage.getItem('bestScore')||0);
  localStorage.setItem('bestScore', best);
  document.getElementById('bestScore').textContent=best+'%';

  const student = localStorage.getItem('studentName') || 'نامشخص';

  sendTelegram(
`📘 Fred – گزارش تمرین
👤 زبان‌آموز: ${student}
🎯 امتیاز: ${percent}%
📊 ${quiz.score}/${quiz.list.length}`
  );

  switchView('home');
}
