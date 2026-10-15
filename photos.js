document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ЗАГРУЗКА ==========
    const containers = document.querySelectorAll('.photos[data-photo-base]');
    const FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    
    containers.forEach(function(container) {
        const basePath = container.getAttribute('data-photo-base');
        const count = parseInt(container.getAttribute('data-count') || '10');
        
        // Сначала пробуем загрузить файл БЕЗ номера: "имя.jpeg"
        tryLoadPhoto(container, basePath, null, 0);
        
        // Потом пробуем с номерами: "имя (1).jpeg", "имя (2).jpeg" и т.д.
        for (let i = 1; i <= count; i++) {
            tryLoadPhoto(container, basePath, i, 0);
        }
    });
    
    // Функция загрузки одного фото
    // index = null — пробуем "имя.jpeg"
    // index = 1,2,3... — пробуем "имя (1).jpeg", "имя (2).jpeg" и т.д.
    function tryLoadPhoto(container, basePath, index, formatIdx) {
        if (formatIdx >= FORMATS.length) return;
        
        const format = FORMATS[formatIdx];
        let src;
        
        if (index === null) {
            // Без номера: "имя.jpeg"
            src = basePath + '.' + format;
        } else {
            // С номером: "имя (1).jpeg"
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