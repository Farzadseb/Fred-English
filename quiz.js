function makeOptions(correct, key) {
    let pool = words
        .map(w => w[key])
        .filter(v => typeof v === 'string' && v.trim() && v !== correct);

    // اگر دیتا کم بود، از کل لغات انگلیسی کمک بگیر
    if (pool.length < 3) {
        pool = words
            .map(w => w.english)
            .filter(v => v && v !== correct);
    }

    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 3);

    const finalOptions = [...shuffled, correct];

    // اگر هنوز کمتر از 2 گزینه داریم → آزمون را رد کن
    if (finalOptions.length < 2) {
        return [correct];
    }

    return finalOptions.sort(() => 0.5 - Math.random());
}
