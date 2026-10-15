// ==========================================
// photos.js — загрузчик фото + лайтбокс
// + автоподгрузка disco.js (глобальный режим)
// ==========================================

// Автоподгрузка disco.js — один раз, если ещё не подключён
(function() {
    if (!document.querySelector('script[src="disco.js"]')) {
        const s = document.createElement('script');
        s.src = 'disco.js';
        document.head.appendChild(s);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ЗАГРУЗКА ФОТО ==========
    const containers = document.querySelectorAll('.photos[data-photo-base]');
    const FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    
    containers.forEach(function(container) {
        const basePath = container.getAttribute('data-photo-base');
        const count = parseInt(container.getAttribute('data-count') || '10');
        
        tryLoadPhoto(container, basePath, null, 0);
        
        for (let i = 1; i <= count; i++) {
            tryLoadPhoto(container, basePath, i, 0);
        }
    });
    
    function tryLoadPhoto(container, basePath, index, formatIdx) {
        if (formatIdx >= FORMATS.length) return;
        
        const format = FORMATS[formatIdx];
        let src;
        
        if (index === null) {
            src = basePath + '.' + format;
        } else {
            src = basePath + ' (' + index + ').' + format;
        }
        
        const img = new Image();
        
        img.onload = function() { 
            container.appendChild(img); 
        };
        
        img.onerror = function() { 
            formatIdx++; 
            tryLoadPhoto(container, basePath, index, formatIdx); 
        };
        
        img.src = src;
    }
    
    // ========== ЛАЙТБОКС ==========
    try {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        
        if (lightbox && lightboxImg) {
            document.addEventListener('click', function(e) {
                if (e.target.matches('.photos img')) {
                    lightboxImg.src = e.target.src;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
            
            lightbox.addEventListener('click', function() {
                lightbox.classList.remove('active');
                lightboxImg.src = '';
                document.body.style.overflow = '';
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    lightbox.classList.remove('active');
                    lightboxImg.src = '';
                    document.body.style.overflow = '';
                }
            });
        }
    } catch (err) {
        alert('❌ Ошибка в лайтбоксе: ' + err.message);
    }
    
});