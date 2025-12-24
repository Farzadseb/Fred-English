// speech.js - مدیریت صدا و صداگذاری

// ===== Speech Functions =====
function speakQuestion() {
    if (isMuted) return;
    
    const questionElement = document.getElementById('question');
    if (!questionElement) return;
    
    const text = questionElement.textContent;
    if (!text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on content
    if (currentMode === 'en-fa' || currentMode === 'word-def') {
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
    } else if (currentMode === 'fa-en') {
        utterance.lang = 'fa-IR';
        utterance.rate = 0.9;
    } else {
        // Try to detect language
        const hasPersian = /[\u0600-\u06FF]/.test(text);
        utterance.lang = hasPersian ? 'fa-IR' : 'en-US';
        utterance.rate = hasPersian ? 0.9 : 0.8;
    }
    
    utterance.volume = 1;
    utterance.pitch = 1;
    
    // Speak
    window.speechSynthesis.speak(utterance);
}

function playSound(type) {
    // Simple sound feedback using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'incorrect') {
            oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
            oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.1); // F4
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
        }
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}
