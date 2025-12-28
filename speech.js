let soundEnabled = localStorage.getItem('sound') !== 'off';

function speak(text) {
  if (!soundEnabled) return;
  if (!('speechSynthesis' in window)) return;

  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  speechSynthesis.speak(u);
}
