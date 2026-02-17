(function() {
    'use strict';
    
    // Налаштування плагіна
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.0',
        sourceKey: 'my_balancer',
        apiBase: 'https://your-vercel-app.vercel.app/api' // Тимчасово, змінимо пізніше
    };
    
    // Головний клас плагіна
    function MyBalancerPlugin() {
        
        // Ініціалізація
        this.init = function() {
            console.log(config.name + ' v' + config.version + ' завантажено');
            this.setupCardButton();
        };
        
        // Додавання кнопки в картку фільму
        this.setupCardButton = function() {
            Lampa.Listener.follow('card', function(event) {
                if (event.type === 'render' && event.card) {
                    addButtonToCard(event.card, event.data);
                }
            });
        };
        
        // Функція додавання кнопки
        function addButtonToCard(cardElement, movieData) {
            // Перевіряємо, чи вже є наша кнопка
            if (cardElement.find('.my-balancer-button').length > 0) return;
            
            // Створюємо кнопку
            var button = $('<div class="my-balancer-button selector--light">' +
                           '<div class="selector__icon">⚖️</div>' +
                           '<div class="selector__value">Вибрати балансер</div>' +
                           '</div>');
            
            // Додаємо обробник кліку
            button.on('click', function() {
                openBalancerModal(movieData);
            });
            
            // Знаходимо місце для вставки (після кнопки "Дивитися")
            var target = cardElement.find('[data-action="watch"]').parent();
            if (target.length) {
                target.after(button);
            } else {
                // Якщо не знайшли, додаємо в кінець
                cardElement.find('.card__content').append(button);
            }
        }
        
        // Функція відкриття модального вікна
        function openBalancerModal(movieData) {
            // Створюємо модальне вікно
            var modal = new Lampa.Modal({
                title: 'Вибір балансера',
                content: createModalContent(movieData)
            });
            
            modal.show();
        }
        
        // Створення вмісту модального вікна
        function createModalContent(movieData) {
            // Тут буде HTML для модалки
            var html = '<div class="my-balancer-modal">' +
                      '<style>' +
                      '.my-balancer-modal { padding: 20px; }' +
                      '.balancer-list { margin: 15px 0; }' +
                      '.balancer-item { padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 5px; cursor: pointer; }' +
                      '.balancer-item.selected { background: #ff5722; }' +
                      '.balancer-item:hover { background: rgba(255,87,34,0.5); }' +
                      '.filter-item { margin: 15px 0; }' +
                      '.filter-item label { margin-left: 10px; }' +
                      '.play-button { width: 100%; padding: 15px; background: #ff5722; color: white; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; }' +
                      '.play-button:hover { background: #ff7043; }' +
                      '</style>';
            
            // Список балансерів (поки статичний, потім будемо завантажувати)
            var balancers = [
                { id: 'balancer1', name: 'Балансер 1' },
                { id: 'balancer2', name: 'Балансер 2' },
                { id: 'balancer3', name: 'Балансер 3' }
            ];
            
            html += '<div class="balancer-list">';
            balancers.forEach(function(b) {
                html += '<div class="balancer-item" data-id="' + b.id + '">' + b.name + '</div>';
            });
            html += '</div>';
            
            // Фільтр "Нова серія"
            html += '<div class="filter-item">' +
                   '<input type="checkbox" id="new-episode-filter">' +
                   '<label for="new-episode-filter">Тільки нові серії</label>' +
                   '</div>';
            
            // Кнопка відтворення
            html += '<button class="play-button" disabled>Оберіть балансер</button>';
            
            html += '</div>';
            
            return html;
        }
    }
    
    // Реєструємо плагін
    if (typeof Lampa !== 'undefined' && Lampa.Plugin) {
        Lampa.Plugin.add(new MyBalancerPlugin());
        console.log('Плагін успішно зареєстровано');
    }
})();
