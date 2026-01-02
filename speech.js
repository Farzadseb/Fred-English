let isMuted = true; // پیش‌فرض خاموش طبق دستور شما

function speak(text) {
    if (isMuted) {
        alert("لطفاً ابتدا صدا را از بالای صفحه فعال کنید 🔊");
        return;
    }
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // تلاش برای پیدا کردن صدای زن آمریکایی
    msg.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices[0];
    msg.rate = 0.5; // سرعت کند شده
    msg.lang = 'en-US';
    
    window.speechSynthesis.speak(msg);
}
