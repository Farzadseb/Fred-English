let isMuted = true; // پیش‌فرض خاموش

function toggleMute() {
    isMuted = !isMuted;
    document.getElementById('mute-btn').innerText = isMuted ? "🔇" : "🔊";
}

function speak(text) {
    if (isMuted) {
        alert("لطفاً ابتدا صدا را فعال کنید 🔊");
        return;
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    
    // انتخاب صدای زن آمریکایی
    utterance.voice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || voices[0];
    utterance.rate = 0.5; // سرعت کند
    synth.speak(utterance);
}
