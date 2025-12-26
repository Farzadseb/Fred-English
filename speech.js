// speech.js - مدیریت تلفظ پیشرفته با صدای زن آمریکایی

let speechSettings = {
    rate: 0.5,          // سرعت ۰.۵
    pitch: 1.1,         // زیرتر برای صدای زن
    volume: 1,
    lang: 'en-US',
    voice: null
};

// پیدا کردن صدای زن آمریکایی
function initSpeechSettings() {
    if (!window.speechSynthesis) {
        console.warn('⚠️ مرورگر از speech synthesis پشتیبانی نمی‌کند');
        return;
    }
    
    // صبر کن تا صداها لود شوند
    setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length === 0) {
            console.log('🔄 در حال انتظار برای لود شدن صداها...');
            setTimeout(initSpeechSettings, 500);
            return;
        }
        
        console.log(`🔊 ${voices.length} صدا پیدا شد`);
        
        // اولویت‌های صدا:
        // 1. صدای زن آمریکایی با نام مشخص
        // 2. هر صدای زن انگلیسی
        // 3. اولین صدای انگلیسی
        // 4. اولین صدا
        
        let preferredVoice = null;
        
        // نام‌های رایج برای صدای زن آمریکایی
        const femaleVoiceNames = [
            'Samantha',         // مک
            'Google US English', // کروم
            'Microsoft Zira',   // ویندوز
            'Female', 'Woman',
            'Karen', 'Allison',
            'Tessa', 'Serena'
        ];
        
        // جستجوی صدای زن آمریکایی
        for (const voiceName of femaleVoiceNames) {
            const voice = voices.find(v => 
                v.lang.includes('en-US') && 
                v.name.toLowerCase().includes(voiceName.toLowerCase())
            );
            
            if (voice) {
                preferredVoice = voice;
                console.log(`✅ صدای زن آمریکایی پیدا شد: ${voice.name}`);
                break;
            }
        }
        
        // اگر صدای زن آمریکایی پیدا نشد، به دنبال صدای زن انگلیسی بگرد
        if (!preferredVoice) {
            const femaleEnglishVoice = voices.find(v => 
                v.lang.includes('en') && 
                (v.name.toLowerCase().includes('female') || 
                 v.name.toLowerCase().includes('woman'))
            );
            
            if (femaleEnglishVoice) {
                preferredVoice = femaleEnglishVoice;
                console.log(`✅ صدای زن انگلیسی پیدا شد: ${femaleEnglishVoice.name}`);
            }
        }
        
        // اگر هنوز صدا پیدا نشد، اولین صدای انگلیسی را انتخاب کن
        if (!preferredVoice) {
            const englishVoice = voices.find(v => v.lang.includes('en'));
            if (englishVoice) {
                preferredVoice = englishVoice;
                console.log(`✅ صدای انگلیسی پیدا شد: ${englishVoice.name}`);
            }
        }
        
        // اگر هیچ صدای انگلیسی پیدا نشد، اولین صدا را انتخاب کن
        if (!preferredVoice && voices.length > 0) {
            preferredVoice = voices[0];
            console.log(`✅ اولین صدای موجود انتخاب شد: ${preferredVoice.name}`);
        }
        
        speechSettings.voice = preferredVoice;
        
        if (preferredVoice) {
            console.log(`🎯 تنظیمات تلفظ: سرعت=${speechSettings.rate}, صدا=${preferredVoice.name}`);
        }
    }, 500);
}

// تلفظ متن با تنظیمات پیش‌فرض
function speakText(text, options = {}) {
    if (!window.speechSynthesis || !text) {
        console.warn('🔇 امکان تلفظ وجود ندارد');
        return null;
    }
    
    // اگر Mute فعال است، تلفظ نکن
    if (typeof window.isMuted === 'function' && window.isMuted()) {
        console.log('🔇 حالت Mute فعال است - تلفظ انجام نمی‌شود');
        return null;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // تنظیمات پیش‌فرض
    utterance.rate = speechSettings.rate;
    utterance.pitch = speechSettings.pitch;
    utterance.volume = speechSettings.volume;
    utterance.lang = speechSettings.lang;
    
    // تنظیمات اختیاری
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.volume) utterance.volume = options.volume;
    if (options.lang) utterance.lang = options.lang;
    
    // انتخاب صدا
    if (speechSettings.voice) {
        utterance.voice = speechSettings.voice;
    } else if (options.voice) {
        utterance.voice = options.voice;
    }
    
    // متوقف کردن تلفظ قبلی
    window.speechSynthesis.cancel();
    
    // شروع تلفظ
    window.speechSynthesis.speak(utterance);
    
    console.log(`🗣️ تلفظ: "${text}" (سرعت: ${utterance.rate})`);
    
    return utterance;
}

// تلفظ کلمه انگلیسی (برای حالت‌های مختلف آزمون)
function speakEnglishWord(word, mode = 'en-fa') {
    if (!word) return null;
    
    let textToSpeak = '';
    
    switch(mode) {
        case 'en-fa':
        case 'word-def':
        case 'def-word':
            textToSpeak = word.english || word;
            break;
        case 'fa-en':
            textToSpeak = word.persian || word;
            break;
        default:
            textToSpeak = word.english || word;
    }
    
    return speakText(textToSpeak);
}

// تلفظ جمله کامل
function speakSentence(sentence) {
    return speakText(sentence);
}

// توقف تلفظ جاری
function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('⏹️ تلفظ متوقف شد');
    }
}

// بررسی وضعیت تلفظ
function isSpeaking() {
    return window.speechSynthesis ? window.speechSynthesis.speaking : false;
}

// لیست صداهای موجود
function listAvailableVoices() {
    if (!window.speechSynthesis) return [];
    
    const voices = window.speechSynthesis.getVoices();
    console.log('🔊 صداهای موجود:', voices.map(v => `${v.name} (${v.lang})`));
    return voices;
}

// تغییر تنظیمات تلفظ
function setSpeechSettings(newSettings) {
    Object.assign(speechSettings, newSettings);
    console.log('⚙️ تنظیمات تلفظ آپدیت شد:', speechSettings);
}

// مقداردهی اولیه
if ('speechSynthesis' in window) {
    console.log('✅ پشتیبانی از speech synthesis فعال است');
    
    // وقتی صداها لود شدند، تنظیمات را مقداردهی کن
    window.speechSynthesis.onvoiceschanged = initSpeechSettings;
    
    // همچنین بلافاصله هم صداها را چک کن
    initSpeechSettings();
    
    // تست تلفظ بعد از لود شدن
    setTimeout(() => {
        if (speechSettings.voice) {
            console.log('🔊 سیستم تلفظ آماده است');
        }
    }, 1000);
} else {
    console.warn('⚠️ مرورگر از speech synthesis پشتیبانی نمی‌کند');
}

// صادر کردن توابع
window.speakText = speakText;
window.speakEnglishWord = speakEnglishWord;
window.speakSentence = speakSentence;
window.stopSpeaking = stopSpeaking;
window.isSpeaking = isSpeaking;
window.listAvailableVoices = listAvailableVoices;
window.setSpeechSettings = setSpeechSettings;
window.initSpeechSettings = initSpeechSettings;
