const BOT_TOKEN = '8553224514:AAG0XXzA8da55jCGXnzStP-0IxHhnfkTPRw';
const CHAT_ID = '96991859';

function sendTelegram(text) {
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  }).catch(() => {});
}
