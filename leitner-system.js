// =======================
// LEITNER SPACED REPETITION SYSTEM
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
    
    // بارگذاری از localStorage
    load() {
        const saved = localStorage.getItem('leitnerBoxes');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.boxes = data.boxes || this.boxes;
                console.log('✅ سیستم لایتنر بارگذاری شد');
            } catch (e) {
                console.error('❌ خطا در بارگذاری لایتنر:', e);
                this.reset();
            }
        }
        return this;
    },
    
    // ذخیره در localStorage
    save() {
        localStorage.setItem('leitnerBoxes', JSON.stringify({
            boxes: this.boxes,
            lastSave: new Date().toISOString()
        }));
        return this;
    },
    
    // ریست سیستم
    reset() {
        this.boxes = this.boxes.map(box => ({ ...box, items: [] }));
        this.save();
        console.log('🔄 سیستم لایتنر ریست شد');
    },
    
    // اضافه کردن لغت به سیستم
    addWord(word, mode) {
        // فقط اگر پریمیوم هست
        if (!premiumSystem || !premiumSystem.isPremiumUser()) {
            return null;
        }
        
        const key = `${word.english}_${mode}`;
        
        // بررسی وجود لغت
        for (const box of this.boxes) {
            if (box.items.some(item => item.key === key)) {
                console.log(`ℹ️ لغت "${word.english}" از قبل در لایتنر وجود دارد`);
                return null;
            }
        }
        
        // اضافه کردن به باکس اول
        const newItem = {
            key: key,
            word: word,
            mode: mode,
            addedDate: new Date().toISOString(),
            lastReview: null,
            nextReview: this.getNextReviewDate(0),
            correctCount: 0,
            wrongCount: 0,
            streak: 0,
            totalReviews: 0
        };
        
        this.boxes[0].items.push(newItem);
        this.save();
        
        console.log(`✅ لغت "${word.english}" به لایتنر اضافه شد`);
        return newItem;
    },
    
    // محاسبه تاریخ مرور بعدی
    getNextReviewDate(boxId) {
        const date = new Date();
        date.setDate(date.getDate() + this.boxes[boxId].interval);
        return date.toISOString();
    },
    
    // بررسی لغت
    reviewItem(key, isCorrect) {
        for (let i = 0; i < this.boxes.length; i++) {
            const box = this.boxes[i];
            const itemIndex = box.items.findIndex(item => item.key === key);
            
            if (itemIndex !== -1) {
                const item = box.items[itemIndex];
                
                // آپدیت آمار
                item.totalReviews++;
                item.lastReview = new Date().toISOString();
                
                if (isCorrect) {
                    item.correctCount++;
                    item.streak++;
                    
                    // انتقال به باکس بالاتر
                    if (i < this.boxes.length - 1 && item.streak >= 2) {
                        // حذف از باکس فعلی
                        box.items.splice(itemIndex, 1);
                        
                        // اضافه به باکس بعدی
                        item.streak = 0;
                        item.nextReview = this.getNextReviewDate(i + 1);
                        this.boxes[i + 1].items.push(item);
                        
                        console.log(`📤 لغت "${item.word.english}" به باکس ${i + 1} منتقل شد`);
                    } else {
                        // در همان باکس بماند
                        item.nextReview = this.getNextReviewDate(i);
                    }
                } else {
                    // جواب غلط - بازگشت به باکس اول
                    item.wrongCount++;
                    item.streak = 0;
                    
                    // حذف از باکس فعلی
                    box.items.splice(itemIndex, 1);
                    
                    // اضافه به باکس اول
                    item.nextReview = this.getNextReviewDate(0);
                    this.boxes[0].items.push(item);
                    
                    console.log(`📥 لغت "${item.word.english}" به باکس اول بازگشت`);
                }
                
                this.save();
                return item;
            }
        }
        return null;
    },
    
    // گرفتن لغاتی که باید امروز مرور شوند
    getDueItems() {
        const today = new Date();
        const dueItems = [];
        
        for (const box of this.boxes) {
            for (const item of box.items) {
                if (!item.nextReview || new Date(item.nextReview) <= today) {
                    dueItems.push({
                        ...item,
                        boxName: box.name,
                        boxInterval: box.interval
                    });
                }
            }
        }
        
        return dueItems.sort(() => Math.random() - 0.5); // تصادفی
    },
    
    // گرفتن آمار سیستم
    getStats() {
        const stats = {
            totalItems: 0,
            dueToday: 0,
            byBox: {},
            mastery: 0
        };
        
        this.boxes.forEach((box, index) => {
            stats.byBox[index] = {
                name: box.name,
                count: box.items.length
            };
            stats.totalItems += box.items.length;
            
            // محاسبه لغات due امروز
            const today = new Date();
            const dueInBox = box.items.filter(item => 
                !item.nextReview || new Date(item.nextReview) <= today
            ).length;
            stats.dueToday += dueInBox;
        });
        
        // محاسبه درصد تسلط
        const highBoxItems = this.boxes.slice(3).reduce((sum, box) => sum + box.items.length, 0);
        stats.mastery = stats.totalItems > 0 ? Math.round((highBoxItems / stats.totalItems) * 100) : 0;
        
        return stats;
    },
    
    // حذف لغت از سیستم
    removeItem(key) {
        for (const box of this.boxes) {
            const index = box.items.findIndex(item => item.key === key);
            if (index !== -1) {
                const removed = box.items.splice(index, 1);
                this.save();
                console.log(`🗑️ لغت "${removed[0].word.english}" از لایتنر حذف شد`);
                return true;
            }
        }
        return false;
    },
    
    // شروع آزمون لایتنر
    startLeitnerQuiz() {
        // فقط برای کاربران پریمیوم
        if (!premiumSystem || !premiumSystem.isPremiumUser()) {
            showNotification('🔒 سیستم لایتنر فقط برای کاربران پریمیوم فعال است', 'warning');
            setTimeout(() => premiumSystem.showUpgradePanel(), 1000);
            return;
        }
        
        const dueItems = this.getDueItems();
        
        if (dueItems.length === 0) {
            showNotification('🎉 امروز لغتی برای مرور ندارید!', 'success');
            return;
        }
        
        // انتخاب تصادفی از لغات due (حداکثر 10 تا)
        const quizItems = dueItems.slice(0, Math.min(10, dueItems.length));
        
        // تنظیم حالت آزمون لایتنر
        quizState.mode = 'leitner-review';
        quizState.index = 0;
        quizState.score = 0;
        quizState.questions = quizItems.map(item => item.word);
        quizState.correctAnswer = '';
        quizState.options = [];
        quizState.mistakes = [];
        quizState.startTime = new Date();
        quizState.isLeitnerQuiz = true;
        quizState.leitnerItems = quizItems;
        
        switchView('quiz');
        setTimeout(showQuestion, 100);
    },
    
    // نمایش آمار لایتنر
    showLeitnerStats() {
        const stats = this.getStats();
        
        const statsHTML = `
            <div class="leitner-stats">
                <h3><i class="fas fa-boxes"></i> آمار سیستم لایتنر</h3>
                
                <div class="stats-summary">
                    <div class="stat-card">
                        <i class="fas fa-book"></i>
                        <span class="stat-title">کل لغات</span>
                        <span class="stat-number">${stats.totalItems}</span>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-calendar-day"></i>
                        <span class="stat-title">مرور امروز</span>
                        <span class="stat-number">${stats.dueToday}</span>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-trophy"></i>
                        <span class="stat-title">درصد تسلط</span>
                        <span class="stat-number">${stats.mastery}%</span>
                    </div>
                </div>
                
                <div class="boxes-status">
                    <h4><i class="fas fa-layer-group"></i> وضعیت باکس‌ها</h4>
                    ${this.boxes.map((box, index) => `
                        <div class="box-status">
                            <span class="box-name">${box.name}</span>
                            <span class="box-count">${box.items.length} لغت</span>
                            <div class="box-bar">
                                <div class="box-fill" style="width: ${stats.totalItems > 0 ? (box.items.length / stats.totalItems) * 100 : 0}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="actions">
                    <button class="btn" onclick="startLeitnerQuiz()">
                        <i class="fas fa-play"></i> شروع مرور لایتنر
                    </button>
                    <button class="btn" onclick="addAllMistakesToLeitner()">
                        <i class="fas fa-plus"></i> اضافه کردن اشتباهات
                    </button>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                ${statsHTML}
            </div>
        `;
        document.body.appendChild(modal);
    }
};

// تابع جهانی برای شروع آزمون لایتنر
function startLeitnerQuiz() {
    leitnerSystem.startLeitnerQuiz();
}

// اضافه کردن تمام اشتباهات به لایتنر
function addAllMistakesToLeitner() {
    // فقط برای کاربران پریمیوم
    if (!premiumSystem || !premiumSystem.isPremiumUser()) {
        showNotification('🔒 این قابلیت فقط برای کاربران پریمیوم است', 'warning');
        return;
    }
    
    const allMistakes = JSON.parse(localStorage.getItem('allMistakes') || '[]');
    if (allMistakes.length === 0) {
        showNotification('🎉 شما هیچ اشتباهی ندارید!', 'success');
        return;
    }
    
    let addedCount = 0;
    const seen = new Set();
    
    // اضافه کردن اشتباهات منحصر به فرد
    allMistakes.forEach(mistake => {
        const key = `${mistake.word.english}_${mistake.mode}`;
        if (!seen.has(key)) {
            seen.add(key);
            if (leitnerSystem.addWord(mistake.word, mistake.mode)) {
                addedCount++;
            }
        }
    });
    
    showNotification(`✅ ${addedCount} لغت به سیستم لایتنر اضافه شد`, 'success');
}

// استایل لایتنر
const leitnerStyles = `
    .leitner-stats {
        padding: 20px;
    }
    
    .stats-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin: 20px 0;
    }
    
    .stat-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        box-shadow: var(--shadow);
    }
    
    .stat-card i {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 10px;
        display: block;
    }
    
    .stat-title {
        display: block;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
    
    .stat-number {
        display: block;
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--text-color);
    }
    
    .boxes-status {
        margin: 25px 0;
    }
    
    .box-status {
        margin-bottom: 15px;
        padding: 10px 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .box-name {
        display: inline-block;
        width: 120px;
        color: var(--text-color);
    }
    
    .box-count {
        float: left;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .box-bar {
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        margin-top: 5px;
        overflow: hidden;
    }
    
    .box-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 4px;
        transition: width 0.5s ease;
    }
    
    .actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    @media (max-width: 768px) {
        .stats-summary {
            grid-template-columns: 1fr;
        }
        
        .actions {
            flex-direction: column;
        }
    }
`;

// اضافه کردن استایل
const leitnerStyleSheet = document.createElement('style');
leitnerStyleSheet.textContent = leitnerStyles;
document.head.appendChild(leitnerStyleSheet);

// بارگذاری سیستم لایتنر
document.addEventListener('DOMContentLoaded', function() {
    leitnerSystem.load();
    console.log('📚 سیستم لایتنر بارگذاری شد');
    
    // اضافه کردن دکمه لایتنر به منو
    setTimeout(() => {
        const menuGrid = document.querySelector('.menu-grid');
        if (menuGrid && premiumSystem && premiumSystem.isPremiumUser()) {
            const leitnerBtn = document.createElement('button');
            leitnerBtn.className = 'menu-btn gradient-leitner';
            leitnerBtn.innerHTML = `
                <i class="fas fa-brain"></i>
                <span>سیستم لایتنر</span>
            `;
            leitnerBtn.onclick = () => leitnerSystem.showLeitnerStats();
            
            menuGrid.insertBefore(leitnerBtn, menuGrid.querySelector('.gradient-telegram'));
            
            // استایل دکمه لایتنر
            const style = document.createElement('style');
            style.textContent = `
                .gradient-leitner {
                    background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
                }
            `;
            document.head.appendChild(style);
        }
    }, 1500);
});
