function speak(t){
    if(window.isMuted()) return;
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'en-US';
    u.rate = 0.5;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}
