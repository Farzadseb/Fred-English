/* Reset و تنظیمات پایه */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    line-height: 1.6;
    min-height: 100vh;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) 
             env(safe-area-inset-bottom) env(safe-area-inset-left);
    transition: background 0.3s, color 0.3s;
}

body.dark {
    background: linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%);
    color: #f0f0f0;
}

/* کانتینر اصلی */
.app-container {
    max-width: 500px;
    margin: 0 auto;
    min-height: 100vh;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow-x: hidden;
}

body.dark .app-container {
    background: rgba(30, 30, 46, 0.95);
}

/* نوار بالایی */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

body.dark .top-bar {
    background: linear-gradient(90deg, #2d3748, #1a202c);
}

.top-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
}

.top-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.title {
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* صفحات */
.view {
    display: none;
    animation: fadeIn 0.3s ease;
}

.view.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* محتوای اصلی */
.main-content {
    padding: 20px;
    min-height: calc(100vh - 74px);
}

/* کارت امتیاز */
.score-card {
    background: linear-gradient(135deg, #6a89cc, #4a69bd);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 25px;
    text-align: center;
    color: white;
    box-shadow: 0 4px 20px rgba(106, 137, 204, 0.3);
    position: relative;
    overflow: hidden;
}

body.dark .score-card {
    background: linear-gradient(135deg, #4a5568, #2d3748);
}

.score-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1%, transparent 1%);
    background-size: 20px 20px;
    animation: shine 10s linear infinite;
}

@keyframes shine {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.stars-box {
    font-size: 28px;
    margin-bottom: 10px;
    letter-spacing: 5px;
}

.star {
    transition: all 0.3s;
}

.star.filled {
    color: #FFD700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.score-text {
    font-size: 14px;
    opacity: 0.9;
}

.score-value {
    display: block;
    font-size: 32px;
    font-weight: 700;
    margin-top: 5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* حالت‌های آزمون */
.modes {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 25px;
}

.mode-card {
    background: white;
    border-radius: 14px;
    padding: 20px 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

body.dark .mode-card {
    background: #2d3748;
    color: #f0f0f0;
}

.mode-card:hover {
    transform: translateY(-5px);
    border-color: #4CAF50;
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
}

.mode-icon {
    font-size: 32px;
    margin-bottom: 10px;
    display: block;
}

.mode-title {
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 16px;
}

.mode-desc {
    font-size: 12px;
    opacity: 0.7;
    color: #666;
}

body.dark .mode-desc {
    color: #aaa;
}

/* دکمه‌ها */
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 16px 20px;
    margin-bottom: 12px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
}

.btn:active::after {
    animation: ripple 0.6s ease-out;
}

@keyframes ripple {
    0% {
        transform: scale(0, 0);
        opacity: 0.5;
    }
    100% {
        transform: scale(20, 20);
        opacity: 0;
    }
}

.btn.green {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
}

.btn.blue {
    background: linear-gradient(135deg, #2196F3, #1976D2);
    color: white;
}

.btn.orange {
    background: linear-gradient(135deg, #FF9800, #F57C00);
    color: white;
}

.btn.red {
    background: linear-gradient(135deg, #F44336, #D32F2F);
    color: white;
}

.btn.large {
    padding: 18px 20px;
    font-size: 18px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn:active {
    transform: translateY(0);
}

/* هدر آزمون */
.quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    background: white;
    padding: 15px;
    border-radius: 14px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

body.dark .quiz-header {
    background: #2d3748;
}

.quiz-progress {
    flex: 1;
}

.progress-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

body.dark .progress-text {
    color: #aaa;
}

.progress-bar {
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
}

body.dark .progress-bar {
    background: #4a5568;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    width: 10%;
    transition: width 0.5s ease;
    border-radius: 4px;
}

.quiz-score {
    background: linear-gradient(135deg, #FF9800, #FF5722);
    color: white;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
}

/* کارت سوال */
.question-card {
    background: linear-gradient(135deg, #6a89cc, #4a69bd);
    color: white;
    padding: 25px 20px;
    border-radius: 16px;
    margin-bottom: 25px;
    position: relative;
    box-shadow: 0 6px 20px rgba(106, 137, 204, 0.3);
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

body.dark .question-card {
    background: linear-gradient(135deg, #4a5568, #2d3748);
}

.question-label {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 8px;
}

.question-text {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    line-height: 1.4;
    word-break: break-word;
}

.speak-btn {
    position: absolute;
    bottom: 15px;
    left: 15px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.speak-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

/* بخش جواب */
.answer-section {
    margin-bottom: 25px;
}

.answer-input {
    width: 100%;
    padding: 18px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 18px;
    font-family: inherit;
    text-align: center;
    background: white;
    color: #333;
    transition: all 0.3s;
}

body.dark .answer-input {
    background: #2d3748;
    border-color: #4a5568;
    color: #f0f0f0;
}

.answer-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

body.dark .answer-input:focus {
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.input-hint {
    font-size: 12px;
    color: #666;
    text-align: center;
    margin-top: 8px;
}

body.dark .input-hint {
    color: #aaa;
}

/* دکمه‌های آزمون */
.quiz-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
}

.quiz-buttons .btn {
    margin: 0;
    flex: 1;
}

/* بازخورد */
.feedback-box {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    font-size: 18px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ddd;
    transition: all 0.3s;
}

body.dark .feedback-box {
    background: #2d3748;
    border-color: #4a5568;
}

.feedback-box.correct {
    background: #e8f5e9;
    border-color: #4CAF50;
    color: #2e7d32;
}

.feedback-box.wrong {
    background: #ffebee;
    border-color: #F44336;
    color: #c62828;
}

/* گزارش پیشرفت */
.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e0e0e0;
}

body.dark .report-header {
    border-bottom-color: #4a5568;
}

.report-header h2 {
    color: #4CAF50;
    font-size: 24px;
}

.back-btn {
    background: #f5f5f5;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

body.dark .back-btn {
    background: #4a5568;
    color: #f0f0f0;
}

.back-btn:hover {
    background: #e0e0e0;
}

body.dark .back-btn:hover {
    background: #5a6578;
}

.report-content {
    background: white;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

body.dark .report-content {
    background: #2d3748;
}

/* نوتیفیکیشن */
.notification {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: #4CAF50;
    color: white;
    padding: 12px 24px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s;
    text-align: center;
    max-width: 90%;
    font-weight: 500;
}

.notification.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* اطلاعات نسخه */
.version-info {
    text-align: center;
    font-size: 12px;
    color: #666;
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
}

body.dark .version-info {
    color: #aaa;
    border-top-color: #4a5568;
}

/* Modal ها */
.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    backdrop-filter: blur(5px);
}

.custom-modal.active {
    opacity: 1;
    visibility: visible;
}

.custom-modal-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

body.dark .custom-modal-content {
    background: #2d3748;
    color: #f0f0f0;
}

.custom-modal.active .custom-modal-content {
    transform: scale(1);
}

.custom-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
}

body.dark .custom-modal-header {
    border-bottom-color: #4a5568;
}

.custom-modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #4CAF50;
}

.modal-close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #666;
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s;
}

body.dark .modal-close-btn {
    color: #aaa;
}

.modal-close-btn:hover {
    background: #f5f5f5;
    color: #333;
}

body.dark .modal-close-btn:hover {
    background: #4a5568;
    color: #f0f0f0;
}

.custom-modal-body {
    padding: 20px;
}

/* انیمیشن‌ها */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.pulse {
    animation: pulse 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.bounce {
    animation: bounce 1s infinite;
}

/* رسپانسیو */
@media (max-width: 480px) {
    .modes {
        grid-template-columns: 1fr;
    }
    
    .quiz-buttons {
        flex-direction: column;
        gap: 10px;
    }
    
    .question-text {
        font-size: 20px;
    }
    
    .answer-input {
        padding: 15px;
        font-size: 16px;
    }
    
    .btn {
        padding: 14px 16px;
        font-size: 15px;
    }
}

@media (max-width: 350px) {
    .top-bar {
        padding: 10px 15px;
    }
    
    .title {
        font-size: 16px;
    }
    
    .top-btn {
        width: 40px;
        height: 40px;
        font-size: 18px;
    }
    
    .main-content {
        padding: 15px;
    }
}

/* حالت landscape */
@media (orientation: landscape) and (max-height: 500px) {
    .app-container {
        max-width: 100%;
    }
    
    .main-content {
        padding: 10px 20px;
    }
    
    .modes {
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
    }
    
    .mode-card {
        padding: 15px 10px;
    }
    
    .btn {
        padding: 12px 15px;
        margin-bottom: 8px;
    }
}

/* پشتیبانی از دکمه‌های iPhone */
@media (hover: none) and (pointer: coarse) {
    .btn:active {
        opacity: 0.7;
    }
    
    .mode-card:active {
        opacity: 0.7;
    }
                              }
