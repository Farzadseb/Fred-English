const MistakeManager = {
    add(word) {
        let list = JSON.parse(localStorage.getItem('fred_errors') || '[]');
        if(!list.find(x => x.id === word.id)) {
            list.push(word);
            localStorage.setItem('fred_errors', JSON.stringify(list));
        }
    },
    showReview() {
        let list = JSON.parse(localStorage.getItem('fred_errors') || '[]');
        if(list.length === 0) {
            alert("هنوز کلمه اشتباهی ندارید!");
            return;
        }
        window.words = list;
        window.QuizEngine.start('fa-en');
    }
};
window.MistakeManager = MistakeManager;
