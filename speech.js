// speech.js - سیستم تلفظ
console.log('🎵 سیستم تلفظ بارگذاری شد');

// تلفظ متن
function speak(text) {
    if (!window.appState || window.appState.soundEnabled === false) {
        console.log('🔇 صدا خاموش است');
        return;
    }
    
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            const femaleVoice = voices.find(voice => 
                voice.lang.includes('en') && 
                voice.name.toLowerCase().includes('female')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            } else {
                const englishVoice = voices.find(voice => voice.lang.includes('en'));
                if (englishVoice) utterance.voice = englishVoice;
            }
        }
        
        speechSynthesis.speak(utterance);
        
        utterance.onerror = (event) => {
            console.error('❌ خطا در تلفظ:', event.error);
        };
        
        utterance.onend = () => {
            console.log('✅ تلفظ کامل شد');
        };
    } else {
        console.warn('❌ Text-to-Speech پشتیبانی نمی‌شود');
    }
}

// تلفظ متن کلیک شده
function speakText(element) {
    const text = element.textContent || element.innerText;
    if (text && text.trim().length > 0) {
        speak(text);
    }
}

// راه‌اندازی سیستم صدا
function initializeSpeechSystem() {
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
        
        setTimeout(() => {
            const voices = speechSynthesis.getVoices();
            if (voices.length === 0) {
                console.warn('⚠️ هیچ صدایی برای TTS پیدا نشد');
            } else {
                console.log(`🎵 ${voices.length} صدای TTS پیدا شد`);
            }
        }, 500);
    }
}

// اضافه کردن به global scope
window.speak = speak;
window.speakText = speakText;
window.initializeSpeechSystem = initializeSpeechSystem;
