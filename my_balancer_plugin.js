(function() {
    'use strict';
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.1',
        sourceKey: 'my_balancer'
    };
    
    function MyBalancerPlugin() {
        
        this.init = function() {
            console.log(config.name + ' v' + config.version + ' завантажено');
            this.setupCardButton();
        };
        
        this.setupCardButton = function() {
            // Слідкуємо за рендером картки
            Lampa.Listener.follow('card', function(event) {
                if (event.type == 'render') {
                    // Даємо час на повний рендер картки
                    setTimeout(function() {
                        addButtonToCard(event.card);
                    }, 300);
                }
            });
            
            // Альтернативний спосіб - слідкуємо за змінами в DOM
            Lampa.Listener.follow('full', function(event) {
                if (event.type == 'complite' && Lampa.Page.current().name == 'card') {
                    setTimeout(function() {
                        var card = $('.card');
                        if (card.length) addButtonToCard(card);
                    }, 300);
                }
            });
        };
        
        function addButtonToCard(card) {
            // Перевіряємо чи є вже кнопка
            if (card.find('.my-balancer-btn').length > 0) return;
            
            // Отримуємо дані фільму
            var movieData = Lampa.Page.current().data || {};
            
            // Створюємо кнопку
            var button = $('<div class="my-balancer-btn selector--light" style="margin-top: 10px;">' +
                           '<div class="selector__icon">⚖️</div>' +
                           '<div class="selector__value">Вибрати балансер</div>' +
                           '</div>');
            
            button.on('click', function() {
                openBalancerModal(movieData);
            });
            
            // Шукаємо місце для вставки - після блоку з інформацією
            var infoBlock = card.find('.card__info');
            if (infoBlock.length) {
                infoBlock.append(button);
            } else {
                // Якщо не знайшли, додаємо в кінець картки
                card.append(button);
            }
            
            console.log('Кнопку додано', movieData);
        }
        
        function openBalancerModal(movieData) {
            console.log('Відкриваємо модалку для:', movieData);
            
            var modal = new Lampa.Modal({
                title: 'Вибір балансера',
                content: createModalContent(movieData)
            });
            
            modal.show();
        }
        
        function createModalContent(movieData) {
            var html = '<div class="my-balancer-modal" style="padding: 20px;">' +
                      '<style>' +
                      '.my-balancer-list { margin: 15px 0; }' +
                      '.my-balancer-item { padding: 12px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; transition: 0.2s; }' +
                      '.my-balancer-item:hover { background: rgba(255,87,34,0.3); }' +
                      '.my-balancer-item.selected { background: #ff5722; }' +
                      '.my-filter-item { margin: 20px 0; display: flex; align-items: center; }' +
                      '.my-filter-item input { margin-right: 10px; width: 20px; height: 20px; }' +
                      '.my-play-btn { width: 100%; padding: 15px; background: #ff5722; color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; opacity: 0.5; }' +
                      '.my-play-btn.active { opacity: 1; }' +
                      '.my-play-btn.active:hover { background: #ff7043; }' +
                      '.movie-info { margin-bottom: 20px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; }' +
                      '</style>';
            
            // Інформація про фільм
            html += '<div class="movie-info">' +
                   '<div><strong>' + (movieData.title || movieData.name || 'Невідомо') + '</strong></div>' +
                   (movieData.year ? '<div>Рік: ' + movieData.year + '</div>' : '') +
                   '</div>';
            
            // Список балансерів (тимчасово статичний)
            var balancers = [
                { id: 'bal1', name: 'Uaflix' },
                { id: 'bal2', name: 'AnimeON' },
                { id: 'bal3', name: 'Bamboo' },
                { id: 'bal4', name: 'Mikai' }
            ];
            
            html += '<div class="my-balancer-list">';
            balancers.forEach(function(b) {
                html += '<div class="my-balancer-item" data-id="' + b.id + '" onclick="window.selectedBalancer=\'' + b.id + '\'; document.querySelector(\'.my-play-btn\').classList.add(\'active\'); document.querySelector(\'.my-play-btn\').removeAttribute(\'disabled\'); this.classList.add(\'selected\'); document.querySelectorAll(\'.my-balancer-item\').forEach(el => { if(el !== this) el.classList.remove(\'selected\'); })">' + b.name + '</div>';
            });
            html += '</div>';
            
            // Фільтр "Нова серія"
            html += '<div class="my-filter-item">' +
                   '<input type="checkbox" id="new-episode" style="width: 20px; height: 20px;">' +
                   '<label for="new-episode" style="font-size: 16px;">Тільки нові серії</label>' +
                   '</div>';
            
            // Кнопка відтворення
            html += '<button class="my-play-btn" disabled onclick="alert(\'Вибрано: \' + (window.selectedBalancer || \'нічого\') + \', Нова серія: \' + document.getElementById(\'new-episode\').checked)">Дивитися</button>';
            
            html += '</div>';
            
            return html;
        }
    }
    
    if (typeof Lampa !== 'undefined' && Lampa.Plugin) {
        Lampa.Plugin.add(new MyBalancerPlugin());
        console.log('Плагін успішно зареєстровано');
    }
})();
