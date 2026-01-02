// سیستم لایتنر ساده شده برای مرور هوشمند
const LeitnerSystem = {
    updateBox: function(wordId, isCorrect) {
        let leitnerData = JSON.parse(localStorage.getItem('leitner_data')) || {};
        
        if (!leitnerData[wordId]) {
            leitnerData[wordId] = { box: 1, nextReview: Date.now() };
        }

        if (isCorrect) {
            leitnerData[wordId].box += 1; // صعود به جعبه بالاتر
            // تعیین زمان مرور بعدی (مثلاً جعبه ۲ = ۱ روز بعد)
            leitnerData[wordId].nextReview = Date.now() + (leitnerData[wordId].box * 24 * 60 * 60 * 1000);
        } else {
            leitnerData[wordId].box = 1; // برگشت به جعبه اول در صورت اشتباه
        }

        localStorage.setItem('leitner_data', JSON.stringify(leitnerData));
    }
};
