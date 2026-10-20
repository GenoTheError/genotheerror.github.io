// ==========================================
// photos.js — иконки + фото + лайтбокс
// ==========================================

// ==========================================
// 1. ИКОНКИ НА ГЛАВНОЙ
// ==========================================
(function() {
    const ИКОНКИ_ФОРМАТЫ = ['jpg'];
    const ИКОНКИ_ПАПКА = 'иконки/';
    
    const ЭМОДЗИ_КАТЕГОРИЙ = {
        'Вещества': '🧪',
        'Географические пейзажи': '🏔️',
        'Еда': '🍲',
        'Игры': '🎮',
        'ИИ': '🤖',
        'SCP': '🎭',
        'Закулисье': '🌊',
        'Персонажи': '👥',
        'Блогеры': '🎥',
        'Интересное': '✨'
    };
    
    function получитьЭмодзи(категория) {
        for (const ключ in ЭМОДЗИ_КАТЕГОРИЙ) {
            if (категория.indexOf(ключ) !== -1) return ЭМОДЗИ_КАТЕГОРИЙ[ключ];
        }
        return '📄';
    }
    
    function получитьИмяИзHref(href) {
        return href.replace(/\.html$/, '').replace(/^.*\//, '');
    }
    
    function попробоватьИконку(имя, box, formatIdx, эмодзи) {
        if (formatIdx >= ИКОНКИ_ФОРМАТЫ.length) {
            box.textContent = эмодзи;
            box.classList.add('видно');
            return;
        }
        
        const src = ИКОНКИ_ПАПКА + имя + '.' + ИКОНКИ_ФОРМАТЫ[formatIdx];
        const img = new Image();
        
        img.onload = function() {
            box.textContent = '';
            box.appendChild(img);
            box.classList.add('видно');
        };
        
        img.onerror = function() {
            попробоватьИконку(имя, box, formatIdx + 1, эмодзи);
        };
        
        img.src = src;
    }
    
    function обработатьКарточки() {
        const карточки = document.querySelectorAll('.article-card');
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                const карточка = entry.target;
                observer.unobserve(карточка);
                
                const box = карточка.querySelector('.card-icon');
                if (!box) return;
                const имя = получитьИмяИзHref(карточка.getAttribute('href'));
                const эмодзи = box.textContent;
                попробоватьИконку(имя, box, 0, эмодзи);
            });
        }, { rootMargin: '200px' });
        
        карточки.forEach(function(карточка) {
            if (карточка.querySelector('.card-icon')) return;
            
            const href = карточка.getAttribute('href');
            if (!href) return;
            
            const имя = получитьИмяИзHref(href);
            const grid = карточка.closest('.articles-grid');
            const категория = grid ? (grid.getAttribute('data-category') || '') : '';
            const эмодзи = получитьЭмодзи(категория);
            
            const box = document.createElement('div');
            box.className = 'card-icon';
            box.textContent = эмодзи;
            
            const textBox = document.createElement('div');
            textBox.className = 'card-text';
            
            while (карточка.firstChild) {
                textBox.appendChild(карточка.firstChild);
            }
            
            if (!textBox.querySelector('.name')) {
                const dataName = карточка.getAttribute('data-name');
                if (dataName) {
                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'name';
                    nameSpan.textContent = dataName;
                    textBox.insertBefore(nameSpan, textBox.firstChild);
                }
            }
            
            карточка.appendChild(box);
            карточка.appendChild(textBox);
            
            observer.observe(карточка);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', обработатьКарточки);
    } else {
        обработатьКарточки();
    }
})();

// ==========================================
// 2. ФОТО
// ==========================================
(function() {
    function загрузитьФото() {
        const containers = document.querySelectorAll('.photos[data-photo-base]');
        const FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        
        containers.forEach(function(container) {
            if (container.dataset.загружено === 'да') return;
            container.dataset.загружено = 'да';
            
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
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', загрузитьФото);
    } else {
        загрузитьФото();
    }
    
    window.addEventListener('load', function() {
        setTimeout(загрузитьФото, 200);
    });
})();

// ==========================================
// 3. ЛАЙТБОКС
// ==========================================
(function() {
    function запустить() {
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
        } catch (err) {}
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', запустить);
    } else {
        запустить();
    }
})();