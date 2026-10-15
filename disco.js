// ==========================================
// disco.js — глобальный режим "Диско-стайл"
// ==========================================
// Подключается автоматически через photos.js.
// Работает на любой странице сайта.
// ==========================================

(function() {
    const DISCO_KEY = 'geno_disco_mode';
    
    function applyDisco() {
        document.body.classList.add('disco-mode');
        
        if (!document.getElementById('discoStopBtn')) {
            const btn = document.createElement('button');
            btn.id = 'discoStopBtn';
            btn.className = 'no-disco';
            btn.textContent = '🛑 Остановить';
            btn.onclick = function() {
                localStorage.removeItem(DISCO_KEY);
                document.body.classList.remove('disco-mode');
                btn.remove();
            };
            document.body.appendChild(btn);
        }
    }
    
    function removeDisco() {
        document.body.classList.remove('disco-mode');
        const btn = document.getElementById('discoStopBtn');
        if (btn) btn.remove();
    }
    
    function init() {
        if (localStorage.getItem(DISCO_KEY) === 'on') {
            applyDisco();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    window.discoEnable = function() {
        localStorage.setItem(DISCO_KEY, 'on');
        applyDisco();
    };
    
    window.discoDisable = function() {
        localStorage.removeItem(DISCO_KEY);
        removeDisco();
    };
})();