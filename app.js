// =======================
// app.js (FULL) - APP CORE
// =======================

const appState = {
  soundEnabled: JSON.parse(localStorage.getItem('soundEnabled') ?? 'true'),
  theme: localStorage.getItem('theme') || 'dark',
  notifications: true,
  autoSpeak: true,
  currentUser: null
};

document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('fredUser');
  if (savedUser) {
    try {
      appState.currentUser = JSON.parse(savedUser);
      initializeApp();
      switchView('home');
      updateUserDisplay();
      setTimeout(showWelcomeMessage, 900);
    } catch {
      switchView('login');
    }
  } else {
    switchView('login');
  }

  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  }
});

function saveUserInfo() {
  const usernameInput = document.getElementById('usernameInput');
  const studentCodeInput = document.getElementById('studentCodeInput');

  const username = (usernameInput?.value || '').trim();
  const studentCode = (studentCodeInput?.value || '').trim();

  if (!username) {
    showNotification('⚠️ لطفاً نام خود را وارد کنید', 'error');
    usernameInput?.focus();
    return;
  }

  appState.currentUser = {
    id: 'user_' + Date.now() + Math.random().toString(36).slice(2, 7),
    username,
    studentCode: studentCode || null,
    joinedAt: new Date().toISOString()
  };

  localStorage.setItem('fredUser', JSON.stringify(appState.currentUser));
  initializeApp();
  switchView('home');
  updateUserDisplay();
  showNotification(`👋 سلام ${username}! خوش آمدید`, 'success', 3500);
  setTimeout(showWelcomeMessage, 1200);
}

function initializeApp() {
  setTheme(appState.theme);
  updateBestScore();
  updateStars();
  updateStreakAndBadges();
  setupEventListeners();

  // A2 lock
  setTimeout(updateA2Lock, 300);

  // iOS hint check (optional)
  try {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
      // فقط اگر کاربر بخواد، با دکمه "نصب دستی" می‌بیند
    }
  } catch {}
}

function setupEventListeners() {
  document.getElementById('globalMuteBtn')?.addEventListener('click', toggleGlobalMute);
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

  document.querySelectorAll('.mute-btn').forEach(btn => {
    if (btn.id !== 'globalMuteBtn') btn.addEventListener('click', toggleGlobalMute);
  });
  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.id !== 'themeToggle') btn.addEventListener('click', toggleTheme);
  });
}

function updateUserDisplay() {
  const name = appState.currentUser?.username || '';
  document.querySelectorAll(
    '#currentUsername, #quizUsername, #resultsUsername, #mistakesUsername, #learningUsername'
  ).forEach(el => el.textContent = name);
}

function showWelcomeMessage() {
  if (!appState.currentUser) return;
  const msgs = [
    `🌟 ${appState.currentUser.username} عزیز، خوش آمدید!`,
    `🎯 آماده‌ای برای پیشرفت؟`,
    `🚀 بزن بریم سراغ لغات!`
  ];
  showNotification(msgs[Math.floor(Math.random() * msgs.length)], 'success', 2600);
}

/* ---------- Theme & Sound ---------- */
function toggleGlobalMute() {
  appState.soundEnabled = !appState.soundEnabled;
  localStorage.setItem('soundEnabled', String(appState.soundEnabled));
  const icon = document.querySelector('#globalMuteBtn i');
  if (icon) icon.className = appState.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
  showNotification(appState.soundEnabled ? '🔊 صدا فعال شد' : '🔇 صدا قطع شد', 'info');
}

function toggleTheme() {
  setTheme(appState.theme === 'dark' ? 'light' : 'dark');
}

function setTheme(theme) {
  appState.theme = theme;
  document.body.className = theme + '-theme';
  localStorage.setItem('theme', theme);

  document.querySelectorAll('.theme-btn i').forEach(icon => {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  });
}

/* ---------- UI helpers ---------- */
function showNotification(message, type = 'info', duration = 3000) {
  const n = document.getElementById('notification');
  if (!n) return;
  n.textContent = message;
  n.className = `notification ${type} show`;
  setTimeout(() => n.classList.remove('show'), duration);
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId)?.classList.add('active');
}

function openQuizMenu() { switchView('quizMenu'); }
function openMistakes() { renderMistakesList(); switchView('mistakes'); }

/* ---------- Speech ---------- */
function speakText(text, rate = 0.5) {
  if (!appState.soundEnabled || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  speechSynthesis.speak(u);
}

/* ---------- Best score & stars ---------- */
function updateBestScore() {
  const key = appState.currentUser ? `bestScore_${appState.currentUser.id}` : 'bestScore';
  const best = localStorage.getItem(key) || '0';
  const el = document.getElementById('bestScore');
  if (el) el.textContent = `${best}%`;
}

function updateStars() {
  const score = parseInt((document.getElementById('bestScore')?.textContent || '0').replace('%',''), 10) || 0;
  const stars = document.querySelectorAll('.stars i');
  const starCount = Math.floor(score / 20);
  stars.forEach((s, i) => {
    s.className = i < starCount ? 'fas fa-star' : 'far fa-star';
    s.style.color = i < starCount ? '#FFD700' : '#cbd5e1';
  });
}

/* ---------- Progress report (tests) ---------- */
function getModeName(mode) {
  const modes = {
    'english-persian': 'انگلیسی → فارسی',
    'persian-english': 'فارسی → انگلیسی',
    'word-definition': 'کلمه → تعریف',
    'definition-word': 'تعریف → کلمه',
    'mistakes': 'تمرین اشتباهات',
    'leitner-review': 'مرور لایتنر'
  };
  return modes[mode] || mode;
}

function showProgressReport() {
  const key = appState.currentUser ? `testHistory_${appState.currentUser.id}` : 'testHistory';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  if (history.length === 0) {
    showNotification('📊 هنوز آزمونی انجام نشده است', 'info');
    return;
  }

  const bestKey = appState.currentUser ? `bestScore_${appState.currentUser.id}` : 'bestScore';
  const bestScore = localStorage.getItem(bestKey) || '0';

  const totalScore = history.reduce((sum, t) => sum + (t.score || 0), 0);
  const averageScore = Math.round(totalScore / history.length);
  const last = history[history.length - 1];

  const now = new Date();
  const html = `
    <div style="text-align:center">
      <h3 style="margin:0 0 10px 0;color:var(--primary)">📊 گزارش آزمون‌ها</h3>
      <div class="muted" style="margin-bottom:10px">
        کاربر: <b>${appState.currentUser?.username || '—'}</b>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:10px">
        <div class="result-box"><div class="rb-title">تعداد آزمون‌ها</div><div class="rb-value">${history.length}</div></div>
        <div class="result-box"><div class="rb-title">میانگین</div><div class="rb-value">${averageScore}%</div></div>
        <div class="result-box"><div class="rb-title">بهترین</div><div class="rb-value">${bestScore}%</div></div>
        <div class="result-box"><div class="rb-title">آخرین حالت</div><div class="rb-value" style="font-size:16px">${getModeName(last.mode)}</div></div>
      </div>

      <div class="muted" style="text-align:right;line-height:2">
        <b>آخرین آزمون:</b><br/>
        امتیاز: ${last.score}%<br/>
        زمان: ${last.duration || '—'} ثانیه<br/>
        تاریخ: ${new Date(last.date || now).toLocaleDateString('fa-IR')}
      </div>

      <div style="margin-top:12px;display:flex;gap:10px">
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">بستن</button>
      </div>
    </div>
  `;
  showModal(html);
}

/* ---------- WhatsApp ---------- */
function joinWhatsApp() {
  const phoneNumber = '09017708544';
  const username = appState.currentUser ? appState.currentUser.username : 'کاربر جدید';
  const message = `سلام! من ${username} هستم. می‌خواهم در English with Fred ثبت نام کنم.`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  showNotification('📱 در حال انتقال به واتس‌اپ...', 'info');
}

/* ---------- Exit ---------- */
function showExitOptions() {
  if (!appState.currentUser) { switchView('login'); return; }
  if (confirm('آیا می‌خواهید از حساب کاربری خارج شوید؟')) {
    // گزارش خروج
    if (window.sendExitTelegramReport) window.sendExitTelegramReport();
    localStorage.removeItem('fredUser');
    appState.currentUser = null;
    switchView('login');
    showNotification('👋 خارج شدید', 'info');
  }
}

function confirmExitQuiz() {
  if (confirm('آیا مطمئنید می‌خواهید آزمون را رها کنید؟')) {
    switchView('home');
    showNotification('🏠 بازگشت به خانه', 'info');
  }
}

/* ---------- Modal ---------- */
function showModal(innerHTML) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
      ${innerHTML}
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

/* ---------- Streak + Badges ---------- */
function getTodayKey() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}

function updateStreakAndBadges() {
  const u = appState.currentUser;
  const streakKey = u ? `streak_${u.id}` : 'streak';
  const lastKey = u ? `lastActive_${u.id}` : 'lastActive';

  const today = getTodayKey();
  const last = localStorage.getItem(lastKey);

  let streak = parseInt(localStorage.getItem(streakKey) || '0', 10);

  if (!last) {
    // nothing
  } else {
    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diffDays = Math.round((todayDate - lastDate) / 86400000);
    if (diffDays > 1) streak = 0; // قطع شده
  }

  // نمایش
  document.getElementById('streakCount') && (document.getElementById('streakCount').textContent = String(streak));

  // badges
  const badges = [];
  if (streak >= 3) badges.push({ icon:'fa-fire', text:`Streak ${streak} روز` });
  const best = parseInt((document.getElementById('bestScore')?.textContent || '0').replace('%',''),10) || 0;
  if (best >= 90) badges.push({ icon:'fa-trophy', text:'نابغه 90%+' });
  if (best >= 70 && best < 90) badges.push({ icon:'fa-thumbs-up', text:'خوب 70%+' });

  const row = document.getElementById('badgeRow');
  if (row) {
    row.innerHTML = badges.map(b => `<div class="badge"><i class="fa-solid ${b.icon}"></i><span>${b.text}</span></div>`).join('');
  }
}

/* call when a quiz finished successfully */
function markActiveToday() {
  const u = appState.currentUser;
  if (!u) return;
  const streakKey = `streak_${u.id}`;
  const lastKey = `lastActive_${u.id}`;

  const today = getTodayKey();
  const last = localStorage.getItem(lastKey);

  let streak = parseInt(localStorage.getItem(streakKey) || '0', 10);

  if (!last) {
    streak = 1;
  } else {
    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diffDays = Math.round((todayDate - lastDate) / 86400000);

    if (diffDays === 0) {
      // already counted today
    } else if (diffDays === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  localStorage.setItem(lastKey, today);
  localStorage.setItem(streakKey, String(streak));
  updateStreakAndBadges();
}

/* ---------- A2 lock (A1 mastery >=80) ---------- */
function getA1MasteryPercent() {
  const u = appState.currentUser;
  const key = u ? `learningProgress_${u.id}` : 'learningProgress';
  const progress = JSON.parse(localStorage.getItem(key) || '[]');
  if (!A1Words?.words?.length) return 0;
  const seenIds = new Set(progress.map(p => p.wordId));
  return Math.round((seenIds.size / A1Words.words.length) * 100);
}

function updateA2Lock() {
  const btn = document.getElementById('a2Btn');
  const lockText = document.getElementById('a2LockText');
  if (!btn) return;

  const p = getA1MasteryPercent();
  const unlocked = p >= 80;

  if (unlocked) {
    btn.classList.remove('disabled');
    if (lockText) lockText.textContent = 'باز شد ✅';
  } else {
    btn.classList.add('disabled');
    if (lockText) lockText.textContent = `قفل (A1 ${p}% / 80%)`;
  }

  const a1El = document.getElementById('a1MasteryPercent');
  if (a1El) a1El.textContent = `${p}%`;
}

function startA2Learning() {
  // فقط نمونه: فعلاً پیام
  const p = getA1MasteryPercent();
  if (p < 80) {
    showNotification('🔒 برای شروع A2 باید A1 حداقل ۸۰٪ باشد', 'warning');
    return;
  }
  showNotification('✅ A2 آماده است (لیست A2 را اضافه کنید)', 'success');
}

/* ---------- Mistakes UI ---------- */
function renderMistakesList() {
  const list = document.getElementById('mistakesList');
  if (!list) return;
  const items = MistakeStorage.getAll();
  if (!items.length) {
    list.innerHTML = `<div class="muted">فعلاً اشتباهی ذخیره نشده.</div>`;
    return;
  }
  list.innerHTML = items.slice(0, 20).map(m => `
    <div class="mistake-item">
      <div>
        <div class="m1">${m.word?.english || '—'}</div>
        <div class="m2">${m.word?.persian || ''} • ${getModeName(m.mode || '—')}</div>
      </div>
      <div class="muted">${m.count || 1}×</div>
    </div>
  `).join('');
}

function startMistakesQuiz() {
  const words = MistakeStorage.getTopWords(10);
  if (!words.length) {
    showNotification('فعلاً اشتباهی برای تمرین نیست', 'info');
    return;
  }
  startQuiz('mistakes', Math.min(10, words.length), words);
}

/* ---------- Install manual ---------- */
function showIOSHint() {
  const el = document.getElementById('iosInstallHint');
  if (el) el.style.display = 'grid';
}
function hideIOSHint() {
  const el = document.getElementById('iosInstallHint');
  if (el) el.style.display = 'none';
}
function tryManualInstall() {
  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isAndroid) {
    showNotification('اگر بنر نیامد، از منوی مرورگر: Add to Home screen', 'info', 3500);
  } else if (isIOS) {
    showIOSHint();
  } else {
    showNotification('از منوی مرورگر گزینه Install/Add to Home Screen', 'info', 3500);
  }
}

/* ---------- exports ---------- */
window.appState = appState;
window.saveUserInfo = saveUserInfo;
window.switchView = switchView;
window.showNotification = showNotification;
window.toggleTheme = toggleTheme;
window.toggleGlobalMute = toggleGlobalMute;
window.showProgressReport = showProgressReport;
window.joinWhatsApp = joinWhatsApp;
window.showExitOptions = showExitOptions;
window.confirmExitQuiz = confirmExitQuiz;
window.speakText = speakText;
window.getModeName = getModeName;
window.openQuizMenu = openQuizMenu;
window.openMistakes = openMistakes;
window.startMistakesQuiz = startMistakesQuiz;
window.markActiveToday = markActiveToday;
window.updateBestScore = updateBestScore;
window.updateStars = updateStars;
window.updateA2Lock = updateA2Lock;
window.showIOSHint = showIOSHint;
window.hideIOSHint = hideIOSHint;
window.tryManualInstall = tryManualInstall;
