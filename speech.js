/* ===============================
   Speech Engine
   Text To Speech (Web Speech API)
   Safe + Minimal + Compatible
================================ */

let currentUtterance = null;

/* ---------- CHECK SUPPORT ---------- */
function isSpeechSupported() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/* ---------- SPEAK ---------- */
function speakText(text, options = {}) {
    if (!isSpeechSupported()) {
        console.warn('🔇 Speech not supported');
        return;
    }

    // اگر mute فعال است
    if (typeof window.isMuted === 'function' && window.isMuted()) {
        return;
    }

    // قطع صدای قبلی
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);

    // تنظیمات پیش‌فرض
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onstart = () => {
        // console.log('🔊 Speaking:', text);
    };

    utterance.onerror = (e) => {
        console.error('❌ Speech error', e);
    };

    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
}

/* ---------- STOP ---------- */
function stopSpeaking() {
    if (!isSpeechSupported()) return;

    if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
    }

    currentUtterance = null;
}

/* ---------- EXPORT ---------- */
window.speakText = speakText;
window.stopSpeaking = stopSpeaking;
