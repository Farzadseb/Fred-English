const words=[
 {english:"be",persian:"بودن"},
 {english:"go",persian:"رفتن"},
 {english:"see",persian:"دیدن"},
 {english:"come",persian:"آمدن"}
];

let mode,correct;

function speak(t){
  const u=new SpeechSynthesisUtterance(t);
  u.rate=0.5;
  u.lang='en-US';
  speechSynthesis.speak(u);
}

function start(m){
  mode=m;
  next();
}

function next(){
  const w=words[Math.floor(Math.random()*words.length)];
  const q=mode==='en-fa'?w.english:w.persian;
  correct=mode==='en-fa'?w.persian:w.english;
  document.getElementById('q').innerText=q;
  if(mode==='en-fa') speak(q);

  const opts=[correct];
  while(opts.length<4){
    const x=mode==='en-fa'
      ?words[Math.floor(Math.random()*words.length)].persian
      :words[Math.floor(Math.random()*words.length)].english;
    if(!opts.includes(x)) opts.push(x);
  }

  document.getElementById('opts').innerHTML=
    opts.sort(()=>Math.random()-.5)
    .map(o=>`<div class="opt" onclick="check('${o}')">${o}</div>`).join('');
}

function check(a){
  alert(a===correct?'✔ درست':'✖ غلط');
  next();
}
