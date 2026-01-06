let currentIndex = 0;

function renderWord() {
    const data = window.wordsA1[currentIndex];
    if(!data) return;

    // پر کردن اطلاعات در کارت
    document.getElementById('word-eng').innerText = data.word.replace('(A1)', '').trim();
    document.getElementById('word-fa').innerText = data.translation;
    document.getElementById('word-def').innerText = data.definition_en;
    document.getElementById('word-coll').innerText = data.collocation;
    document.getElementById('word-coll-fa').innerText = data.collocation_fa;
    document.getElementById('word-coll-ex').innerText = data.collocation_example;
    document.getElementById('word-coll-ex-fa').innerText = data.collocation_example_fa;
    document.getElementById('word-pv1').innerText = data.pv1;
    document.getElementById('word-pv1-fa').innerText = data.pv1_fa;
    document.getElementById('word-pv1-ex').innerText = data.pv1_example;
    document.getElementById('word-pv1-ex-fa').innerText = data.pv1_example_fa;
    document.getElementById('word-pv2').innerText = data.pv2;
    document.getElementById('word-pv2-fa').innerText = data.pv2_fa;
    document.getElementById('word-pv2-ex').innerText = data.pv2_example;
    document.getElementById('word-pv2-ex-fa').innerText = data.pv2_example_fa;

    document.getElementById('counter').innerText = `${window.wordsA1.length} / ${currentIndex + 1}`;
}

function nextWord() {
    if (currentIndex < window.wordsA1.length - 1) {
        currentIndex++;
        renderWord();
        window.scrollTo(0,0);
    } else {
        alert("تبریک! تمام کلمات تمام شد.");
    }
}

function speakField(id) {
    const text = document.getElementById(id).innerText;
    window.speechSynthesis.cancel();
    let msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

window.onload = renderWord;
