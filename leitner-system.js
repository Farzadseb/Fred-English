// =======================
// leitner.js (FULL) - ساده + بدون وابستگی به پریمیوم
// =======================

const leitnerSystem = {
  boxes: [
    { id: 0, name: 'روزانه', interval: 1, items: [] },
    { id: 1, name: 'هر ۳ روز', interval: 3, items: [] },
    { id: 2, name: 'هر هفته', interval: 7, items: [] },
    { id: 3, name: 'هر دو هفته', interval: 14, items: [] },
    { id: 4, name: 'هر ماه', interval: 30, items: [] },
    { id: 5, name: 'تسلط', interval: 60, items: [] }
  ],

  _key() {
    const u = window.appState?.currentUser;
    return u ? `leitnerBoxes_${u.id}` : 'leitnerBoxes';
  },

  load() {
    const saved = localStorage.getItem(this._key());
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data?.boxes) this.boxes = data.boxes;
      } catch {}
    }
    return this;
  },

  save() {
    localStorage.setItem(this._key(), JSON.stringify({ boxes: this.boxes, lastSave: new Date().toISOString() }));
    return this;
  },

  reset() {
    this.boxes = this.boxes.map(b => ({ ...b, items: [] }));
    this.save();
  },

  getNextReviewDate(boxId) {
    const d = new Date();
    d.setDate(d.getDate() + this.boxes[boxId].interval);
    return d.toISOString();
  },

  _makeKey(word, mode) {
    return `${word.id}_${mode}`;
  },

  addWord(word, mode = 'english-persian') {
    if (!word?.id) return null;
    const key = this._makeKey(word, mode);

    for (const box of this.boxes) {
      if (box.items.some(i => i.key === key)) return null;
    }

    const item = {
      key,
      word,
      mode,
      addedDate: new Date().toISOString(),
      lastReview: null,
      nextReview: this.getNextReviewDate(0),
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      totalReviews: 0
    };

    this.boxes[0].items.push(item);
    this.save();
    return item;
  },

  reviewItem(key, isCorrect) {
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      const idx = box.items.findIndex(it => it.key === key);
      if (idx === -1) continue;

      const item = box.items[idx];
      item.totalReviews++;
      item.lastReview = new Date().toISOString();

      if (isCorrect) {
        item.correctCount++;
        item.streak++;
        if (i < this.boxes.length - 1 && item.streak >= 2) {
          box.items.splice(idx, 1);
          item.streak = 0;
          item.nextReview = this.getNextReviewDate(i + 1);
          this.boxes[i + 1].items.push(item);
        } else {
          item.nextReview = this.getNextReviewDate(i);
        }
      } else {
        item.wrongCount++;
        item.streak = 0;
        box.items.splice(idx, 1);
        item.nextReview = this.getNextReviewDate(0);
        this.boxes[0].items.push(item);
      }

      this.save();
      return item;
    }
    return null;
  },

  reviewWordIfExists(word, mode, isCorrect) {
    if (!word?.id) return;
    const key = this._makeKey(word, mode);
    this.reviewItem(key, isCorrect);
  },

  getDueItems() {
    const now = new Date();
    const due = [];
    for (const box of this.boxes) {
      for (const item of box.items) {
        if (!item.nextReview || new Date(item.nextReview) <= now) {
          due.push({ ...item, boxName: box.name, boxInterval: box.interval });
        }
      }
    }
    // تصادفی
    return due.sort(() => Math.random() - 0.5);
  },

  getStats() {
    const stats = { totalItems: 0, dueToday: 0, byBox: {}, mastery: 0 };
    const today = new Date();
    this.boxes.forEach((box, i) => {
      stats.byBox[i] = { name: box.name, count: box.items.length };
      stats.totalItems += box.items.length;
      stats.dueToday += box.items.filter(it => !it.nextReview || new Date(it.nextReview) <= today).length;
    });
    const high = this.boxes.slice(3).reduce((s,b)=> s + b.items.length, 0);
    stats.mastery = stats.totalItems ? Math.round((high / stats.totalItems) * 100) : 0;
    return stats;
  },

  startLeitnerQuiz() {
    const due = this.getDueItems();
    if (!due.length) {
      showNotification('🎉 امروز لغتی برای مرور ندارید!', 'success');
      return;
    }
    const words = due.slice(0, 10).map(i => i.word);
    startQuiz('leitner-review', Math.min(10, words.length), words);
  },

  showLeitnerStats() {
    const stats = this.getStats();
    const html = `
      <div class="leitner-stats">
        <h3 style="margin:0 0 10px 0;color:var(--primary)"><i class="fas fa-boxes"></i> آمار لایتنر</h3>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px">
          <div class="result-box"><div class="rb-title">کل لغات</div><div class="rb-value">${stats.totalItems}</div></div>
          <div class="result-box"><div class="rb-title">مرور امروز</div><div class="rb-value">${stats.dueToday}</div></div>
          <div class="result-box"><div class="rb-title">تسلط</div><div class="rb-value">${stats.mastery}%</div></div>
        </div>

        <div style="text-align:right" class="muted">
          ${this.boxes.map((b,i)=>`
            <div style="margin:8px 0">
              <b>${b.name}</b> — ${b.items.length} لغت
              <div class="progress-bar" style="margin-top:6px">
                <div class="progress-fill" style="width:${stats.totalItems ? (b.items.length/stats.totalItems)*100 : 0}%"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;gap:10px;margin-top:10px">
          <button class="btn btn-primary" onclick="leitnerSystem.startLeitnerQuiz()">شروع مرور</button>
          <button class="btn btn-secondary" onclick="addTopMistakesToLeitner()">اضافه کردن اشتباهات</button>
        </div>
      </div>
    `;
    showModal(html);
  }
};

function addTopMistakesToLeitner() {
  const list = MistakeStorage.getAll();
  if (!list.length) {
    showNotification('🎉 اشتباهی ندارید!', 'success');
    return;
  }
  let added = 0;
  list.slice(0, 30).forEach(m => {
    if (leitnerSystem.addWord(m.word, m.mode)) added++;
  });
  showNotification(`✅ ${added} لغت به لایتنر اضافه شد`, 'success');
}

document.addEventListener('DOMContentLoaded', () => leitnerSystem.load());

window.leitnerSystem = leitnerSystem;
window.addTopMistakesToLeitner = addTopMistakesToLeitner;
