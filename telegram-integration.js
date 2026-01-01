// =======================
// TELEGRAM INTEGRATION
// =======================

// ارسال پیام به تلگرام
async function sendToTelegram(message, silent = true) {
    const cfg = window.TelegramConfig;
    if (!cfg || !cfg.BOT_TOKEN) return false;

    try {
        const res = await fetch(`${cfg.API_URL}${cfg.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: cfg.CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await res.json();
        if (!data.ok) throw new Error(data.description);
        if (!silent) showNotification('✅ گزارش به تلگرام ارسال شد', 'success');
        return true;
    } catch {
        if (!silent) showNotification('❌ خطا در ارسال تلگرام', 'error');
        return false;
    }
}

// گزارش خودکار بعد از آزمون
function sendTelegramReportAuto(score, mode, duration) {
    const u = window.appState?.currentUser;
    if (!u) return;

    const now = new Date();
    let msg = `<b>📊 گزارش آزمون</b>\n\n`;
    msg += `👤 ${u.username}\n`;
    msg += `🆔 ${u.id}\n`;
    msg += `📅 ${now.toLocaleDateString('fa-IR')}\n`;
    msg += `⏰ ${now.toLocaleTimeString('fa-IR')}\n\n`;
    msg += `🎯 ${getModeName(mode)}\n`;
    msg += `✅ امتیاز: ${score}%\n`;
    msg += `⏱️ زمان: ${duration} ثانیه\n`;

    sendToTelegram(msg, true);
}

// گزارش خروج
function sendExitTelegramReport() {
    const u = window.appState?.currentUser;
    if (!u) return;

    const best = localStorage.getItem(`bestScore_${u.id}`) || 0;
    let msg = `<b>📤 گزارش خروج</b>\n\n`;
    msg += `👤 ${u.username}\n`;
    msg += `🏆 بهترین امتیاز: ${best}%`;

    sendToTelegram(msg, true);
}

window.sendTelegramReportAuto = sendTelegramReportAuto;
window.sendExitTelegramReport = sendExitTelegramReport;
