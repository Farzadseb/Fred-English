/**
 * Speech System - سیستم متن به گفتار پیشرفته
 * پشتیبانی از زبان انگلیسی با تنظیمات مختلف
 */

const SpeechSystem = (() => {
    // وضعیت سیستم
    const state = {
        isSpeaking: false,
        currentUtterance: null,
        voices: [],
        isInitialized: false,
        defaultVoice: null,
        settings: {
            rate: 0.8,
            pitch: 1.0,
            volume: 1.0,
            language: 'en-US'
        }
    };

    /**
     * مقداردهی اولیه سیستم
     */
    function init() {
        if (state.isInitialized) return true;
        
        // بررسی پشتیبانی مرورگر
        if (!('speechSynthesis' in window)) {
            console.warn('⚠️ سیستم متن به گفتار در این مرورگر پشتیبانی نمی‌شود');
            return false;
        }
        
        // بارگذاری صداها
        loadVoices();
        
        // تنظیم event listeners
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
        
        state.isInitialized = true;
        console.log('🔊 Speech System initialized');
        return true;
    }

    /**
     * بارگذاری صداهای موجود
     */
    function loadVoices() {
        state.voices = speechSynthesis.getVoices();
        
        // انتخاب صدای انگلیسی به صورت پیش‌فرض
        const englishVoices = state.voices.filter(voice => 
            voice.lang.startsWith('en')
        );
        
        if (englishVoices.length > 0) {
            // ترجیح دادن صدای طبیعی‌تر
            state.defaultVoice = englishVoices.find(voice => 
                voice.name.includes('Natural') || 
                voice.name.includes('Premium')
            ) || englishVoices[0];
            
            console.log(`✅ ${state.voices.length} voice loaded`);
            console.log(`🎤 Default voice: ${state.defaultVoice?.name}`);
        } else {
            console.warn('⚠️ No English voices found');
        }
    }

    /**
     * صحبت کردن متن
     */
    function speak(text, options = {}) {
        // اگر سیستم خاموش است
        if (typeof window.isMuted === 'function' && window.isMuted()) {
            console.log('🔇 Speech is muted');
            return false;
        }
        
        // اگر در حال حاضر در حال صحبت است، متوقف کن
        if (state.isSpeaking) {
            stop();
        }
        
        // اعتبارسنجی متن
        if (!text || typeof text !== 'string') {
            console.error('❌ Invalid text for speech');
            return false;
        }
        
        // ایجاد utterance جدید
        const utterance = new SpeechSynthesisUtterance(text);
        
        // تنظیمات
        const settings = { ...state.settings, ...options };
        
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;
        utterance.lang = settings.language;
        
        // انتخاب صدا
        if (settings.voice) {
            utterance.voice = settings.voice;
        } else if (state.defaultVoice) {
            utterance.voice = state.defaultVoice;
        }
        
        // رویدادها
        utterance.onstart = () => {
            state.isSpeaking = true;
            state.currentUtterance = utterance;
            
            if (options.onStart) {
                options.onStart();
            }
            
            console.log('🎤 Speaking:', text.substring(0, 50) + '...');
        };
        
        utterance.onend = () => {
            state.isSpeaking = false;
            state.currentUtterance = null;
            
            if (options.onEnd) {
                options.onEnd();
            }
        };
        
        utterance.onerror = (event) => {
            console.error('❌ Speech error:', event.error);
            state.isSpeaking = false;
            state.currentUtterance = null;
            
            if (options.onError) {
                options.onError(event);
            }
        };
        
        // شروع صحبت
        try {
            speechSynthesis.speak(utterance);
            return true;
        } catch (error) {
            console.error('❌ Failed to speak:', error);
            return false;
        }
    }

    /**
     * توقف صحبت
     */
    function stop() {
        if (state.isSpeaking) {
            speechSynthesis.cancel();
            state.isSpeaking = false;
            state.currentUtterance = null;
            console.log('⏹️ Speech stopped');
            return true;
        }
        return false;
    }

    /**
     * مکث/ادامه
     */
    function togglePause() {
        if (speechSynthesis.speaking) {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
                console.log('▶️ Speech resumed');
                return 'resumed';
            } else {
                speechSynthesis.pause();
                console.log('⏸️ Speech paused');
                return 'paused';
            }
        }
        return 'not_speaking';
    }

    /**
     * صحبت کردن با تنظیمات خاص
     */
    function speakWithSettings(text, customSettings = {}) {
        return speak(text, {
            ...state.settings,
            ...customSettings
        });
    }

    /**
     * صحبت کردن آهسته (برای یادگیری)
     */
    function speakSlowly(text) {
        return speak(text, {
            rate: 0.6,
            pitch: 1.0,
            volume: 1.0
        });
    }

    /**
     * صحبت کردن واضح (برای تمرین تلفظ)
     */
    function speakClearly(text) {
        return speak(text, {
            rate: 0.7,
            pitch: 1.1,
            volume: 1.0
        });
    }

    /**
     * صحبت کردن طبیعی (سرعت عادی)
     */
    function speakNaturally(text) {
        return speak(text, {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0
        });
    }

    /**
     * دریافت وضعیت فعلی
     */
    function getStatus() {
        return {
            isSpeaking: state.isSpeaking,
            isPaused: speechSynthesis.paused,
            voices: state.voices.length,
            defaultVoice: state.defaultVoice?.name,
            settings: { ...state.settings }
        };
    }

    /**
     * تغییر تنظیمات
     */
    function updateSettings(newSettings) {
        state.settings = { ...state.settings, ...newSettings };
        console.log('⚙️ Speech settings updated:', state.settings);
        return state.settings;
    }

    /**
     * دریافت لیست صداها
     */
    function getAvailableVoices(language = 'en') {
        return state.voices.filter(voice => 
            voice.lang.startsWith(language)
        );
    }

    /**
     * تغییر صدای پیش‌فرض
     */
    function setDefaultVoice(voiceName) {
        const voice = state.voices.find(v => v.name === voiceName);
        if (voice) {
            state.defaultVoice = voice;
            console.log(`🎤 Default voice set to: ${voice.name}`);
            return true;
        }
        return false;
    }

    /**
     * تست سیستم
     */
    function test() {
        const testText = "Hello, this is a test of the speech system.";
        return speak(testText, {
            onEnd: () => {
                console.log('✅ Speech test completed');
            },
            onError: (error) => {
                console.error('❌ Speech test failed:', error);
            }
        });
    }

    // API عمومی
    return {
        init,
        speak,
        stop,
        togglePause,
        speakWithSettings,
        speakSlowly,
        speakClearly,
        speakNaturally,
        getStatus,
        updateSettings,
        getAvailableVoices,
        setDefaultVoice,
        test,
        
        // برای backward compatibility
        speakText: speak
    };
})();

// مقداردهی اولیه خودکار
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SpeechSystem.init();
        
        // تست سیستم (فقط در توسعه)
        if (window.location.hostname === 'localhost') {
            setTimeout(() => SpeechSystem.test(), 2000);
        }
    }, 1000);
});

// توابع global برای backward compatibility
window.speakText = (text) => {
    if (typeof window.isMuted === 'function' && window.isMuted()) {
        return false;
    }
    return SpeechSystem.speak(text);
};

window.stopSpeaking = SpeechSystem.stop;

// در دسترس قرار دادن در window
window.SpeechSystem = SpeechSystem;
