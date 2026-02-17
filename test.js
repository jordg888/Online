(function() {
    'use strict';
    
    console.log('🔥 Фінальна версія');
    
    function BalancerPlugin() {
        this.init = function() {
            console.log('Плагін ініціалізовано');
            this.waitForCard();
        };
        
        this.waitForCard = function() {
            // Перевіряємо кожну секунду, чи відкрита картка
            setInterval(function() {
                var page = Lampa.Page.current();
                if (page && page.name === 'card') {
                    this.addButton();
                }
            }.bind(this), 1000);
        };
        
        this.addButton = function() {
            // Якщо кнопка вже є - не додаємо ще одну
            if ($('.my-final-btn').length) return;
            
            console.log('Додаємо кнопку в картку');
            
            // Шукаємо контейнер з кнопками
            var container = $('.full-start__buttons, .full-start-new__buttons').first();
            
            if (container.length) {
                // Створюємо кнопку
                var button = $('<div class="selector full-start__button my-final-btn">' +
                               '<div style="font-size: 20px; margin-right: 5px;">⚖️</div>' +
                               '<span>Балансер</span>' +
                               '</div>');
                
                // Додаємо обробник
                button.on('click', function() {
                    alert('Працює!');
                });
                
                // Додаємо в кінець контейнера
                container.append(button);
                console.log('✅ Кнопку додано в картку');
            }
        };
    }
    
    new BalancerPlugin().init();
})();
