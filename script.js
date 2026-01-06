function renderWord() {
    const data = window.wordsA1[currentIndex];
    if(!data) return;

    // کلمه اصلی و معنی
    document.getElementById('word-eng').innerText = data.word.replace('(A1)', '').trim();
    document.getElementById('word-fa').innerText = data.translation;

    // 1. Definition
    document.getElementById('word-def').innerText = data.definition_en;

    // 2. Collocation
    document.getElementById('word-coll').innerText = data.collocation;
    document.getElementById('word-coll-fa').innerText = data.collocation_fa;

    // 3. Collocation Example
    document.getElementById('word-coll-ex').innerText = data.collocation_example;
    document.getElementById('word-coll-ex-fa').innerText = data.collocation_example_fa;

    // 4. Phrasal Verb 1
    document.getElementById('word-pv1').innerText = data.pv1;
    document.getElementById('word-pv1-fa').innerText = data.pv1_fa;
    document.getElementById('word-pv1-ex').innerText = data.pv1_example;
    document.getElementById('word-pv1-ex-fa').innerText = data.pv1_example_fa;

    // 5. Phrasal Verb 2
    document.getElementById('word-pv2').innerText = data.pv2;
    document.getElementById('word-pv2-fa').innerText = data.pv2_fa;
    document.getElementById('word-pv2-ex').innerText = data.pv2_example;
    document.getElementById('word-pv2-ex-fa').innerText = data.pv2_example_fa;

    document.getElementById('counter').innerText = `${window.wordsA1.length} / ${currentIndex + 1}`;
}
