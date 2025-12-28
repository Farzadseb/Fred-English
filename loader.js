(() => {
  const v = Date.now();

  const files = [
    'words.js',
    'speech.js',
    'quiz.js',
    'app.js',
    'telegram.js'
  ];

  files.forEach(f => {
    const s = document.createElement('script');
    s.src = f + '?v=' + v;
    s.defer = true;
    document.body.appendChild(s);
  });

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'style.css?v=' + v;
  document.head.appendChild(css);
})();
