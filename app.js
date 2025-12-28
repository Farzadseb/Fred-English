function switchView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.querySelectorAll('.mode-card').forEach(b=>{
  b.onclick=()=>startQuiz(b.dataset.mode);
});

document.getElementById('backBtn').onclick=()=>switchView('home');

/* ---------- student ---------- */
const nameInput = document.getElementById('studentName');
const saveBtn = document.getElementById('saveStudentBtn');

if (localStorage.getItem('studentName')) {
  nameInput.value = localStorage.getItem('studentName');
}

saveBtn.onclick = () => {
  if (nameInput.value.trim()) {
    localStorage.setItem('studentName', nameInput.value.trim());
    alert('ذخیره شد');
  }
};

/* ---------- mute ---------- */
const muteBtn = document.getElementById('muteBtn');
muteBtn.textContent = soundEnabled ? '🔊' : '🔇';
muteBtn.onclick = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('sound', soundEnabled?'on':'off');
  muteBtn.textContent = soundEnabled?'🔊':'🔇';
};

/* ---------- theme ---------- */
const themeBtn = document.getElementById('themeBtn');
if (localStorage.getItem('theme')==='dark') {
  document.body.classList.add('dark');
  themeBtn.textContent='☀️';
}
themeBtn.onclick=()=>{
  document.body.classList.toggle('dark');
  const d=document.body.classList.contains('dark');
  localStorage.setItem('theme', d?'dark':'light');
  themeBtn.textContent=d?'☀️':'🌙';
};

/* ---------- WhatsApp ---------- */
document.getElementById('whatsappBtn').onclick = () => {
  const phone = '989XXXXXXXXX'; // شماره خودت با کد کشور
  const msg = encodeURIComponent('سلام، من از برنامه English with Fred پیام می‌دهم.');
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
};

/* ---------- install ---------- */
let installPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  installPrompt=e;
  document.getElementById('installBtn').style.display='block';
});
document.getElementById('installBtn').onclick=()=>{
  if(installPrompt) installPrompt.prompt();
};
