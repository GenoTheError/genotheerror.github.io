// ==========================================
// photos.js — фото + лайтбокс + иконки
// ==========================================
// Подключается в <head> с атрибутом defer.
// ==========================================

// ==========================================
// 1. ИКОНКИ
// ==========================================
(function() {
    const ИКОНКИ_ФОРМАТЫ = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
    const ИКОНКИ_ПАПКА = 'иконки/';
    const ТАЙМАУТ_МС = 1000;
    
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
            if (категория.indexOf(ключ) !== -1) {
                return ЭМОДЗИ_КАТЕГОРИЙ[ключ];
            }
        }
        return '📄';
    }
    
    function получитьИмяИзHref(href) {
        return href.replace(/\.html$/, '').replace(/^.*\//, '');
    }
    
    let загрузокОсталось = 0;
    let иконкиПоказаны = false;
    
    function проверитьГотовность() {
        if (иконкиПоказаны) return;
        if (загрузокОсталось <= 0) {
            иконкиПоказаны = true;
            показатьИконки();
        }
    }
    
    function показатьИконки() {
        // Плавно проявляем все иконки/заглушки
        document.querySelectorAll('.card-icon').forEach(function(box) {
            box.classList.add('видно');
        });
    }
    
    function попробоватьИконку(имя, box, formatIdx, эмодзи) {
        if (formatIdx >= ИКОНКИ_ФОРМАТЫ.length) {
            // Ничего не нашли — ставим эмодзи (появится при "видно")
            box.textContent = эмодзи;
            загрузокОсталось--;
            проверитьГотовность();
            return;
        }
        
        const src = ИКОНКИ_ПАПКА + имя + '.' + ИКОНКИ_ФОРМАТЫ[formatIdx];
        const img = new Image();
        
        img.onload = function() {
            box.textContent = '';
            box.appendChild(img);
            загрузокОсталось--;
            проверитьГотовность();
        };
        
        img.onerror = function() {
            попробоватьИконку(имя, box, formatIdx + 1, эмодзи);
        };
        
        img.src = src;
    }
    
    function обработатьКарточки() {
        const карточки = document.querySelectorAll('.article-card');
        
        загрузокОсталось = 0;
        
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
            box.textContent = эмодзи; // эмодзи видно сразу, но прозрачно (CSS)
            
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
            
            if (!textBox.querySelector('.cat')) {
                const catSpan = document.createElement('span');
                catSpan.className = 'cat';
                catSpan.textContent = категория;
                textBox.appendChild(catSpan);
            }
            
            карточка.appendChild(box);
            карточка.appendChild(textBox);
            
            загрузокОсталось++;
            попробоватьИконку(имя, box, 0, эмодзи);
        });
        
        // Страховка: если через 1 секунду не все загрузились — показать что есть
        setTimeout(function() {
            if (!иконкиПоказаны) {
                иконкиПоказаны = true;
                показатьИконки();
            }
        }, ТАЙМАУТ_МС);
        
        // Если карточек нет — показать сразу
        if (загрузокОсталось === 0) {
            иконкиПоказаны = true;
            показатьИконки();
        }
    }
    
    обработатьКарточки();
})();

// ==========================================
// 2. ФОТО
// ==========================================
(function() {
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
})();

// ==========================================
// 3. ЛАЙТБОКС
// ==========================================
(function() {
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
        // тихо
    }
})();