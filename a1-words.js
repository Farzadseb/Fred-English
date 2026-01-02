<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>English with Fred</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --bg: #0b1426; --card: #1e293b; --blue: #00a8ff; --green: #00b894; --purple: #8e44ad; --orange: #e67e22; --red: #d63031; --text: #ffffff; --gray: #94a3b8; }
        .light-mode { --bg: #f1f5f9; --card: #ffffff; --text: #1e293b; --gray: #64748b; }

        body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); margin: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 15px; transition: 0.3s; }
        
        /* هدر دکمه‌های کنترلی */
        .top-bar { width: 100%; max-width: 450px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .control-btn { background: var(--card); border: none; color: var(--blue); width: 45px; height: 45px; border-radius: 12px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

        .header-box { width: 100%; max-width: 400px; text-align: center; background: var(--card); padding: 20px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        input { width: 85%; padding: 12px; border-radius: 10px; border: 1px solid var(--gray); background: var(--bg); color: var(--text); text-align: center; margin-top: 10px; outline: none; }
        
        .stars { color: #475569; font-size: 22px; margin-bottom: 5px; }
        .star-active { color: #f1c40f; text-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }

        .menu-container { width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
        .menu-item { display: flex; align-items: center; padding: 18px 20px; border-radius: 15px; border: none; color: white; font-weight: bold; font-size: 16px; cursor: pointer; transition: 0.2s; }
        .menu-item i { width: 30px; font-size: 18px; text-align: center; margin-left: 10px; }
        .menu-item span { flex-grow: 1; text-align: center; }

        .hidden { display: none; }
    </style>
</head>
<body>

    <div class="top-bar">
        <button class="control-btn" onclick="UI.toggleTheme()" title="تغییر تم">
            <i id="themeIcon" class="fas fa-moon"></i>
        </button>
        <button class="control-btn" onclick="UI.toggleMute()" title="صدا">
            <i id="muteIcon" class="fas fa-volume-up"></i>
        </button>
    </div>

    <div id="setup-screen" style="width:100%; display:flex; flex-direction:column; align-items:center;">
        <h1>English with Fred</h1>
        <div class="header-box">
            <div class="stars" id="mainStars">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
            <input type="text" id="userName" placeholder="نام خود را وارد کنید">
            <button id="loginBtn" onclick="Engine.login()" style="width: 90%; padding: 12px; margin-top: 15px; border-radius: 10px; border: none; background: var(--blue); color: white; font-weight: bold; cursor: pointer;">تأیید و ورود به پنل</button>
        </div>

        <div id="menuOptions" class="menu-container hidden">
            <button class="menu-item" style="background: var(--purple);" onclick="Engine.start('study')"><i class="fas fa-graduation-cap"></i><span>آموزش لغات (Study Mode)</span></button>
            <button class="menu-item" style="background: var(--blue);" onclick="Engine.start('fa-en')"><i class="fas fa-exchange-alt"></i><span>Persian → English</span></button>
            <button class="menu-item" style="background: var(--green);" onclick="Engine.start('word-def')"><i class="fas fa-book"></i><span>Word → Definition</span></button>
            <button class="menu-item" style="background: var(--orange);" onclick="Engine.start('review')"><i class="fas fa-sync-alt"></i><span>مرور اشتباهات</span></button>
            <button class="menu-item" style="background: var(--red);" onclick="location.reload()"><i class="fas fa-sign-out-alt"></i><span>خروج</span></button>
        </div>
    </div>

    <div id="quiz-screen" class="hidden" style="width:100%; max-width:400px;">
        </div>

    <script>
        // سیستم کنترل تم و صدا
        let isMuted = false;
        const UI = {
            toggleTheme() {
                document.body.classList.toggle('light-mode');
                const icon = document.getElementById('themeIcon');
                icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
            },
            toggleMute() {
                isMuted = !isMuted;
                const icon = document.getElementById('muteIcon');
                icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                icon.style.color = isMuted ? 'var(--red)' : 'var(--blue)';
            }
        };

        // بقیه کدهای Engine و Login همانند قبل...
        const Engine = {
            login() {
                const name = document.getElementById('userName').value.trim();
                if(!name) return alert("لطفاً نام را وارد کنید.");
                document.getElementById('loginBtn').classList.add('hidden');
                document.getElementById('userName').disabled = true;
                document.getElementById('menuOptions').classList.remove('hidden');
            }
            // ... (توابع start, render و غیره در اینجا قرار می‌گیرند)
        };
    </script>
</body>
</html>
