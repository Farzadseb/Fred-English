// speech.js
const SpeechEngine = {
    speak: function(text) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
    }
};
window.SpeechEngine = SpeechEngine;
