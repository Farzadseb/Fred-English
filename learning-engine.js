// =======================
// learning-engine.js (FULL)
// =======================

let learningState = {
  currentWordIndex: 0,
  totalWords: 0,
  markedWords: [],
  showExample: true,
  learningProgress: [] // [{wordId, firstSeen, lastReviewed, reviewCount, marked, nextReview, box?}]
};

function startA1Learning() {
  if (!A1Words?.words?.length) {
    showNotification('❌ لغات A1 بارگذاری نشده‌اند', 'error');
    return;
  }

  const userKey = window.appState?.currentUser ? `learningState_${window.appState.currentUser.id}` : 'learningState';
  const saved = localStorage.getItem(userKey);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      learningState.currentWordIndex = parsed.currentWordIndex || 0;
      learningState.markedWords = parsed.markedWords || [];
      learningState.showExample = parsed.showExample ?? true;
      learningState.learningProgress = parsed.learningProgress || [];
    } catch {}
  }

  learningState.totalWords = A1Words.words.length;
  document.getElementById('totalWords').textContent = learningState.totalWords;

  const lu = document.getElementById('learningUsername');
  if (lu && window.appState?.currentUser) lu.textContent = window.appState.currentUser.username;

  switchView('learning');
  displayCurrentWord();
  showNotification('📚 شروع یادگیری A1', 'success');
}

function displayCurrentWord() {
  if (!A1Words?.words?.length) return;
  if (learningState.currentWordIndex >= A1Words.words.length) return;

  const word = A1Words.words[learningState.currentWordIndex];
  const wordCard = document.getElementById('wordCard');
  if (!wordCard) return;

  const isMarked = learningState.markedWords.includes(word.id);

  wordCard.innerHTML = `
    <div class="word-header">
      <div class="word-main">
        <div class="word-english">${escapeHtml(word.english)}</div>
        <div class="word-persian">${escapeHtml(word.persian)}</div>
        <div class="word-pronunciation">
          <span>${escapeHtml(word.pronunciation || '')}</span>
          <button class="speak-word-btn" onclick="speakWord('${jsStr(word.english)}')">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
      </div>
      <div class="word-difficulty">
        <span class="difficulty-badge ${word.difficulty || 'easy'}">
          ${word.difficulty === 'medium' ? 'متوسط' : word.difficulty === 'hard' ? 'سخت' : 'آسان'}
        </span>
      </div>
    </div>

    <div class="word-section">
      <div class="section-title"><i class="fas fa-comment-alt"></i><span>مثال</span></div>
      <div class="example-content" id="exampleContent" style="display:${learningState.showExample ? 'block' : 'none'}">
        <div class="example-english">${escapeHtml(word.example || '')}</div>
        <div class="example-persian">${escapeHtml(word.examplePersian || '')}</div>
      </div>
    </div>

    <div class="word-section">
      <div class="section-title"><i class="fas fa-book"></i><span>تعریف</span></div>
      <div class="definition-content">${escapeHtml(word.definition || '—')}</div>
    </div>

    <div class="word-section">
      <div class="section-title"><i class="fas fa-link"></i><span>ترکیبات رایج</span></div>
      <div class="collocation-content">${escapeHtml(word.collocation || '—')}</div>
    </div>
  `;

  if (word.phrasalVerbs?.length) {
    const html = word.phrasalVerbs.map(pv => `
      <div class="phrasal-verb-item">
        <div class="phrasal-verb">${escapeHtml(pv.verb || '')}</div>
        <div class="phrasal-meaning">${escapeHtml(pv.meaning || '')}</div>
      </div>
    `).join('');

    wordCard.innerHTML += `
      <div class="word-section">
        <div class="section-title"><i class="fas fa-bolt"></i><span>افعال عبارتی</span></div>
        <div class="phrasal-verbs-list">${html}</div>
      </div>
    `;
  }

  if (isMarked) wordCard.classList.add('marked-word');
  else wordCard.classList.remove('marked-word');

  updateLearningInfo();

  setTimeout(() => {
    if (window.appState?.soundEnabled && window.speakText) window.speakText(word.english, 0.5);
  }, 450);
}

function speakWord(text) {
  if (window.appState?.soundEnabled && window.speakText) window.speakText(text, 0.5);
  else showNotification('🔇 لطفاً صدا را فعال کنید', 'warning');
}

function speakCurrentWord() {
  const w = A1Words?.words?.[learningState.currentWordIndex];
  if (!w) return;
  speakWord(w.english);
}

function toggleExample() {
  learningState.showExample = !learningState.showExample;
  const el = document.getElementById('exampleContent');
  if (el) el.style.display = learningState.showExample ? 'block' : 'none';
  showNotification(learningState.showExample ? '📝 مثال نمایش داده می‌شود' : '📝 مثال مخفی شد', 'info');
  saveLearningState();
}

function toggleMarkWord() {
  const w = A1Words?.words?.[learningState.currentWordIndex];
  if (!w) return;

  const idx = learningState.markedWords.indexOf(w.id);
  if (idx === -1) {
    learningState.markedWords.push(w.id);
    showNotification('📌 لغت علامت‌گذاری شد', 'success');
  } else {
    learningState.markedWords.splice(idx, 1);
    showNotification('📌 علامت لغت برداشته شد', 'info');
  }
  saveLearningProgress(); // marked sync
  saveLearningState();
  displayCurrentWord();
}

function nextWord() {
  if (learningState.currentWordIndex < A1Words.words.length - 1) {
    learningState.currentWordIndex++;
    saveLearningProgress();
    saveLearningState();
    displayCurrentWord();
  } else {
    showNotification('🏁 آخر لغات!', 'info');
  }
}

function prevWord() {
  if (learningState.currentWordIndex > 0) {
    learningState.currentWordIndex--;
    saveLearningState();
    displayCurrentWord();
  } else {
    showNotification('📖 اولین لغت هستید', 'info');
  }
}

function updateLearningInfo() {
  document.getElementById('currentWordIndex').textContent = learningState.currentWordIndex + 1;

  const progressPercent = ((learningState.currentWordIndex + 1) / learningState.totalWords) * 100;
  const fill = document.getElementById('learningProgressFill');
  if (fill) fill.style.width = `${progressPercent}%`;

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = learningState.currentWordIndex === 0;
  if (nextBtn) nextBtn.disabled = learningState.currentWordIndex === learningState.totalWords - 1;

  // A1 mastery
  if (window.updateA2Lock) window.updateA2Lock();
}

function saveLearningState() {
  const userKey = window.appState?.currentUser ? `learningState_${window.appState.currentUser.id}` : 'learningState';
  const toSave = {
    currentWordIndex: learningState.currentWordIndex,
    markedWords: learningState.markedWords,
    showExample: learningState.showExample,
    learningProgress: learningState.learningProgress,
    lastAccessed: new Date().toISOString()
  };
  localStorage.setItem(userKey, JSON.stringify(toSave));
}

function saveLearningProgress() {
  const w = A1Words?.words?.[learningState.currentWordIndex];
  if (!w) return;

  const userKey = window.appState?.currentUser ? `learningProgress_${window.appState.currentUser.id}` : 'learningProgress';
  let progress = JSON.parse(localStorage.getItem(userKey) || '[]');

  const i = progress.findIndex(p => p.wordId === w.id);
  const now = Date.now();

  // ساده: nextReview برای SRS سبک (1,3,7,14,30)
  const defaultNext = now + 24*3600*1000;

  if (i === -1) {
    progress.push({
      wordId: w.id,
      english: w.english,
      persian: w.persian,
      firstSeen: new Date().toISOString(),
      lastReviewed: new Date().toISOString(),
      reviewCount: 1,
      marked: learningState.markedWords.includes(w.id),
      nextReview: defaultNext
    });
  } else {
    progress[i].lastReviewed = new Date().toISOString();
    progress[i].reviewCount = (progress[i].reviewCount || 0) + 1;
    progress[i].marked = learningState.markedWords.includes(w.id);
  }

  localStorage.setItem(userKey, JSON.stringify(progress));
  learningState.learningProgress = progress;
}

function startPractice() {
  // تمرین ساده: همین لحظه کوییز از markedها یا از همین لغت
  const w = A1Words?.words?.[learningState.currentWordIndex];
  if (!w) return;
  showNotification(`🎯 تمرین لغت: ${w.english}`, 'info');
  startQuiz('english-persian', 5, [w, ...pickRandomWords(4, w.id)]);
}

function finishLearning() {
  saveLearningState();
  saveLearningProgress();

  const learned = (learningState.learningProgress || []).length;
  const marked = (learningState.markedWords || []).length;
  const msg = `📊 ${learned} لغت دیده‌اید. ${marked ? `📌 ${marked} علامت‌گذاری` : ''}`;

  if (confirm(`${msg}\n\nآزمون می‌خواهید؟`)) startQuiz('english-persian', 10);
}

/* ---------- Learning Report (Chart) ---------- */
function showLearningReport() {
  const stats = getLearningStats();
  const html = `
    <div style="text-align:center">
      <h3 style="margin:0 0 10px 0;color:var(--primary)">📈 گزارش یادگیری</h3>

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:10px">
        <div class="result-box"><div class="rb-title">کل لغات</div><div class="rb-value">${stats.total}</div></div>
        <div class="result-box"><div class="rb-title">دیده‌شده</div><div class="rb-value">${stats.seen}</div></div>
        <div class="result-box"><div class="rb-title">علامت‌دار</div><div class="rb-value">${stats.marked}</div></div>
        <div class="result-box"><div class="rb-title">تسلط</div><div class="rb-value">${stats.mastery}%</div></div>
      </div>

      <div class="card" style="padding:10px;margin-bottom:10px">
        <canvas id="learningChart" height="160"></canvas>
      </div>

      <div class="muted" style="text-align:right;line-height:2">
        <b>Due امروز (SRS سبک):</b> ${stats.dueToday}<br/>
        <b>دسته‌ها:</b> ${Object.keys(stats.byCategory).length}
      </div>

      <div style="margin-top:12px;display:flex;gap:10px">
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">بستن</button>
      </div>
    </div>
  `;

  showModal(html);

  setTimeout(() => {
    const ctx = document.getElementById('learningChart');
    if (!ctx || !window.Chart) return;

    const labels = Object.keys(stats.byCategory).slice(0, 8);
    const values = labels.map(k => stats.byCategory[k]);

    new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'تعداد لغات دیده‌شده', data: values }] },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }, 120);
}

function getLearningStats() {
  const total = A1Words?.words?.length || 0;
  const seenSet = new Set((learningState.learningProgress || []).map(p => p.wordId));
  const seen = seenSet.size;
  const marked = (learningState.markedWords || []).length;
  const mastery = total ? Math.round((seen / total) * 100) : 0;

  // byCategory (seen only)
  const byCategory = {};
  (A1Words?.words || []).forEach(w => {
    if (!seenSet.has(w.id)) return;
    const c = w.category || 'other';
    byCategory[c] = (byCategory[c] || 0) + 1;
  });

  // dueToday (simple nextReview number)
  const today0 = new Date(); today0.setHours(0,0,0,0);
  const dueToday = (learningState.learningProgress || []).filter(p => (p.nextReview || 0) <= today0.getTime()).length;

  return { total, seen, marked, mastery, byCategory, dueToday };
}

/* ---------- utils ---------- */
function pickRandomWords(n, excludeId) {
  const pool = (A1Words?.words || []).filter(w => w.id !== excludeId);
  const out = [];
  while (out.length < n && pool.length) {
    const r = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    out.push(r);
  }
  return out;
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}
function jsStr(s){ return String(s ?? '').replaceAll('\\','\\\\').replaceAll("'","\\'"); }

/* ---------- exports ---------- */
window.learningState = learningState;
window.startA1Learning = startA1Learning;
window.displayCurrentWord = displayCurrentWord;
window.speakCurrentWord = speakCurrentWord;
window.toggleExample = toggleExample;
window.toggleMarkWord = toggleMarkWord;
window.nextWord = nextWord;
window.prevWord = prevWord;
window.startPractice = startPractice;
window.finishLearning = finishLearning;
window.showLearningReport = showLearningReport;
