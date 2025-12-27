const ProgressTracker = (() => {
    let data = JSON.parse(localStorage.getItem('progress')) || {
        total:0, correct:0, wrong:0, sessions:[], mistakes:[]
    };

    function save(){ localStorage.setItem('progress', JSON.stringify(data)); }

    function recordQuestion(mode, ok, word){
        data.total++;
        ok ? data.correct++ : data.wrong++;
        if(!ok) data.mistakes.push({mode, word});
        save();
    }

    function recordSession(mode, score, total){
        data.sessions.push({mode, score, total, date:new Date().toLocaleDateString('fa')});
        save();
    }

    function reviewMistakes(){
        alert(data.mistakes.length ? `اشتباهات: ${data.mistakes.length}` : 'اشتباهی نداری 🎉');
    }

    return { init(){}, recordQuestion, recordSession, reviewMistakes };
})();
