function speakText(text){
    if(window.isMuted()) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.6;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}
