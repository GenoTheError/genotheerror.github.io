// ==========================================
// поиск.js — умный поиск с опечатками
// ==========================================
// Ловит ошибки:
// - Опечатки (расстояние Левенштейна)
// - Соседние клавиши (ЙЦУКЕН + QWERTY)
// - Фонетические ошибки
// - Точные совпадения приоритетнее
// ==========================================

(function() {
    
    // ==========================================
    // РАСКЛАДКИ КЛАВИАТУР (координаты)
    // ==========================================
    const ЙЦУКЕН = {
        'й': [0, 0], 'ц': [1, 0], 'у': [2, 0], 'к': [3, 0], 'е': [4, 0],
        'н': [5, 0], 'г': [6, 0], 'ш': [7, 0], 'щ': [8, 0], 'з': [9, 0],
        'х': [10, 0], 'ъ': [11, 0],
        'ф': [0, 1], 'ы': [1, 1], 'в': [2, 1], 'а': [3, 1], 'п': [4, 1],
        'р': [5, 1], 'о': [6, 1], 'л': [7, 1], 'д': [8, 1], 'ж': [9, 1],
        'э': [10, 1],
        'я': [0, 2], 'ч': [1, 2], 'с': [2, 2], 'м': [3, 2], 'и': [4, 2],
        'т': [5, 2], 'ь': [6, 2], 'б': [7, 2], 'ю': [8, 2],
        'ё': [2.5, -0.5]
    };
    
    const QWERTY = {
        'q': [0, 0], 'w': [1, 0], 'e': [2, 0], 'r': [3, 0], 't': [4, 0],
        'y': [5, 0], 'u': [6, 0], 'i': [7, 0], 'o': [8, 0], 'p': [9, 0],
        'a': [0.5, 1], 's': [1.5, 1], 'd': [2.5, 1], 'f': [3.5, 1], 'g': [4.5, 1],
        'h': [5.5, 1], 'j': [6.5, 1], 'k': [7.5, 1], 'l': [8.5, 1],
        'z': [1, 2], 'x': [2, 2], 'c': [3, 2], 'v': [4, 2], 'b': [5, 2],
        'n': [6, 2], 'm': [7, 2]
    };
    
    const КЛАВИАТУРА = { ...ЙЦУКЕН, ...QWERTY };
    
    // ==========================================
    // ГЛОБАЛЬНЫЙ СПИСОК ИГР (для поиска на главной)
    // ==========================================
    // Если карточки игр нет на странице, поиск будет искать их здесь.
    const ИГРЫ = [
        { name: 'Космос — Генератор Вселенной', link: 'игры/космос.html', category: 'Игры · Исследование', tags: ['космос', 'генератор', 'вселенная', 'планеты', 'звёзды', 'галактики', 'игра'] },
        { name: 'Кликер 9.0', link: 'игры/кликер.html', category: 'Игры · Кликеры', tags: ['кликер', 'печеньки', 'мультивселенная', 'игра', 'бусты'] },
        { name: 'Прыгающий шарик', link: 'игры/прыгающий-шарик.html', category: 'Игры · Аркады', tags: ['прыгающий шарик', 'аркада', 'игра', 'шарик'] },
        { name: 'Дудл-прыжок', link: 'игры/дудл-прыжок.html', category: 'Игры · Аркады', tags: ['дудл-прыжок', 'прыжок', 'аркада', 'игра', 'платформы'] },
        { name: 'Найди пару', link: 'игры/найди-пару.html', category: 'Игры · Логика', tags: ['найди пару', 'логика', 'память', 'игра'] },
        { name: 'Пиксель-арт', link: 'игры/пиксель-арт.html', category: 'Игры · Творчество', tags: ['пиксель-арт', 'рисование', 'творчество', 'игра'] },
        { name: 'Генератор никнеймов', link: 'игры/генератор-никнеймов.html', category: 'Игры · Творчество', tags: ['генератор', 'никнеймы', 'имена', 'игра'] },
        { name: 'Саймон', link: 'игры/саймон.html', category: 'Игры · Память', tags: ['саймон', 'память', 'цвета', 'игра'] },
        { name: 'Реакция', link: 'игры/реакция.html', category: 'Игры · Память', tags: ['реакция', 'скорость', 'тест', 'игра'] },
        { name: 'Лотерея', link: 'игры/лотерея.html', category: 'Игры · Удача', tags: ['лотерея', 'удача', 'рандом', 'игра'] },
        { name: 'Колесо фортуны', link: 'игры/колесо-фортуны.html', category: 'Игры · Удача', tags: ['колесо фортуны', 'удача', 'сектора', 'игра'] }
    ];
    
    // ==========================================
    // ФУНКЦИИ РАССТОЯНИЙ
    // ==========================================
    function левенштейн(a, b) {
        if (a === b) return 0;
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const матрица = [];
        for (let i = 0; i <= b.length; i++) матрица[i] = [i];
        for (let j = 0; j <= a.length; j++) матрица[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const стоимость = a[j - 1] === b[i - 1] ? 0 : 1;
                матрица[i][j] = Math.min(
                    матрица[i - 1][j] + 1,
                    матрица[i][j - 1] + 1,
                    матрица[i - 1][j - 1] + стоимость
                );
            }
        }
        return матрица[b.length][a.length];
    }
    
    function клавиатурноеРасстояние(a, b) {
        if (a === b) return 0;
        if (!КЛАВИАТУРА[a] || !КЛАВИАТУРА[b]) return 999;
        const [x1, y1] = КЛАВИАТУРА[a];
        const [x2, y2] = КЛАВИАТУРА[b];
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
    
    function стоимостьЗамены(a, b) {
        if (a === b) return 0;
        const кл = клавиатурноеРасстояние(a, b);
        if (кл <= 1.5) return 0.3;
        if (кл <= 2.5) return 0.6;
        return 1;
    }
    
    function левенштейнКлавиатура(a, b) {
        if (a === b) return 0;
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const матрица = [];
        for (let i = 0; i <= b.length; i++) матрица[i] = [i];
        for (let j = 0; j <= a.length; j++) матрица[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const ст = стоимостьЗамены(a[j - 1], b[i - 1]);
                матрица[i][j] = Math.min(
                    матрица[i - 1][j] + 1,
                    матрица[i][j - 1] + 1,
                    матрица[i - 1][j - 1] + ст
                );
            }
        }
        return матрица[b.length][a.length];
    }
    
    function похожесть(слово1, слово2) {
        const с1 = слово1.toLowerCase();
        const с2 = слово2.toLowerCase();
        if (с1 === с2) return 1;
        if (с1.includes(с2) || с2.includes(с1)) {
            const мин = Math.min(с1.length, с2.length);
            const макс = Math.max(с1.length, с2.length);
            return 0.7 + (мин / макс) * 0.2;
        }
        const максДлина = Math.max(с1.length, с2.length);
        const расстояние = левенштейнКлавиатура(с1, с2);
        const нормализованное = расстояние / максДлина;
        if (нормализованное > 0.5) return 0;
        return 1 - нормализованное;
    }
    
    // ==========================================
    // ПОИСК
    // ==========================================
    
    function найтиСлова(запрос) {
        return запрос.toLowerCase()
            .replace(/[^\wа-яё\s-]/gi, ' ')
            .split(/\s+/)
            .filter(с => с.length >= 2);
    }
    
    function получитьИмяИзHref(href) {
        return href.replace(/\.html$/, '').replace(/^.*\//, '');
    }
    
    function искать(запрос) {
        const слова = найтиСлова(запрос);
        if (слова.length === 0) return [];
        
        const результаты = [];
        
        // 1. Ищем по карточкам на текущей странице
        const карточки = document.querySelectorAll('.article-card');
        карточки.forEach(card => {
            const name = card.getAttribute('data-name') || '';
            const link = card.getAttribute('href');
            const displayName = card.querySelector('.name')?.textContent || name;
            const categorySection = card.closest('.category-section');
            const category = categorySection ? categorySection.querySelector('.category-title').textContent : '';
            
            const имяФайла = получитьИмяИзHref(link);
            const теги = (typeof ТЕГИ !== 'undefined' && ТЕГИ && ТЕГИ[имяФайла] ? ТЕГИ[имяФайла] : []).map(т => т.toLowerCase());
            
            const всеТексты = [
                ...теги,
                name.toLowerCase(),
                displayName.toLowerCase(),
                category.toLowerCase(),
                имяФайла.toLowerCase()
            ];
            
            let общийСчёт = 0;
            let найдено = 0;
            let точное = false;
            
            слова.forEach(слово => {
                let лучший = 0;
                всеТексты.forEach(текст => {
                    if (текст.includes(слово)) {
                        const счёт = 0.9 + (слово.length / текст.length) * 0.1;
                        if (счёт > лучший) {
                            лучший = счёт;
                            if (текст === слово) точное = true;
                        }
                    }
                    if (!текст.includes(' ') && текст.length >= 3 && слово.length >= 3) {
                        const п = похожесть(текст, слово);
                        if (п > лучший) лучший = п;
                    }
                });
                if (лучший > 0.72) {
                    общийСчёт += лучший;
                    найдено++;
                }
            });
            
            if (найдено > 0) {
                результаты.push({
                    name: displayName,
                    category,
                    link,
                    счёт: общийСчёт / слова.length,
                    точное
                });
            }
        });
        
        // 2. Ищем по глобальному списку игр (если их нет на странице)
        const ссылкиНаСтранице = new Set();
        document.querySelectorAll('.article-card').forEach(c => ссылкиНаСтранице.add(c.getAttribute('href')));
        
        ИГРЫ.forEach(игра => {
            if (ссылкиНаСтранице.has(игра.link)) return; // уже есть на странице
            
            const всеТексты = [
                ...игра.tags.map(т => т.toLowerCase()),
                игра.name.toLowerCase(),
                игра.category.toLowerCase()
            ];
            
            let общийСчёт = 0;
            let найдено = 0;
            let точное = false;
            
            слова.forEach(слово => {
                let лучший = 0;
                всеТексты.forEach(текст => {
                    if (текст.includes(слово)) {
                        const счёт = 0.9 + (слово.length / текст.length) * 0.1;
                        if (счёт > лучший) {
                            лучший = счёт;
                            if (текст === слово) точное = true;
                        }
                    }
                    if (!текст.includes(' ') && текст.length >= 3 && слово.length >= 3) {
                        const п = похожесть(текст, слово);
                        if (п > лучший) лучший = п;
                    }
                });
                if (лучший > 0.72) {
                    общийСчёт += лучший;
                    найдено++;
                }
            });
            
            if (найдено > 0) {
                результаты.push({
                    name: игра.name,
                    category: игра.category,
                    link: игра.link,
                    счёт: общийСчёт / слова.length,
                    точное
                });
            }
        });
        
        // Сортируем
        результаты.sort((a, b) => {
            if (a.точное && !b.точное) return -1;
            if (!a.точное && b.точное) return 1;
            return b.счёт - a.счёт;
        });
        
        return результаты;
    }
    
    // ==========================================
    // ОТРИСОВКА
    // ==========================================
    
    function отрисовать(результаты, запрос) {
        const box = document.getElementById('searchResults');
        if (запрос.length < 1) { box.innerHTML = ''; return; }
        if (результаты.length === 0) {
            box.innerHTML = `<div style="color: #718096; padding: 12px; text-align: center;">Ничего не найдено по запросу "${запрос}"</div>`;
            return;
        }
        const топ = результаты.slice(0, 20);
        box.innerHTML = топ.map(r => {
            const метка = r.точное ? '' : ' <span style="color:#718096;font-size:11px;">(похоже)</span>';
            return `
                <a href="${r.link}" class="search-item">
                    <div class="item-name">${r.name}${метка}</div>
                    <div class="item-cat">${r.category}</div>
                </a>
            `;
        }).join('');
    }
    
    // ==========================================
    // ЗАПУСК
    // ==========================================
    
    function запустить() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        let таймер = null;
        input.addEventListener('input', function() {
            clearTimeout(таймер);
            таймер = setTimeout(function() {
                const запрос = input.value.trim();
                const результаты = искать(запрос);
                отрисовать(результаты, запрос);
            }, 150);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', запустить);
    } else {
        запустить();
    }
    
    window.ПОИСК = { искать, похожесть, левенштейн, левенштейнКлавиатура };
    
})();