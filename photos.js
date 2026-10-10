document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ЗАГРУЗКА ==========
    const containers = document.querySelectorAll('.photos[data-photo-base]');
    const FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    
    containers.forEach(function(container) {
        const basePath = container.getAttribute('data-photo-base');
        const count = parseInt(container.getAttribute('data-count') || '10');
        
        function loadNumber(index) {
            let formatIdx = 0;
            
            function tryNext() {
                if (formatIdx >= FORMATS.length) return;
                const src = basePath + ' (' + index + ').' + FORMATS[formatIdx];
                const img = new Image();
                
                img.onload = function() { container.appendChild(img); };
                img.onerror = function() { formatIdx++; tryNext(); };
                img.src = src;
            }
            
            tryNext();
        }
        
        for (let i = 1; i <= count; i++) {
            loadNumber(i);
        }
    });
    
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