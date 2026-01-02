// speech.js
window.speak = (text) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // توقف تلفظ قبلی
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        console.error("Browser does not support Speech Synthesis");
    }
};
