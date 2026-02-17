(function() {
    'use strict';
    
    console.log('⚡ Мій плагін: завантаження...');
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.1.0',
        apiBase: 'https://api-plug-lime.vercel.app/api'
    };
    
    function MyBalancerPlugin() {
        var _this = this;
        
        this.init = function() {
            console.log('✅ Плагін ініціалізовано');
            
            // Додаємо кнопку в картку (як у WikiFind)
            this.setupCardButton();
        };
        
        this.setupCardButton = function() {
            Lampa.Listener.follow('full', function(event) {
                if (event.type === 'complite' && Lampa.Page.current().name === 'card') {
                    setTimeout(function() {
                        try {
                            _this.addButtonToCard();
                        } catch (err) {
                            console.log('Помилка:', err);
                        }
                    }, 300);
                }
            });
        };
        
        this.addButtonToCard = function() {
            // Перевіряємо чи вже є кнопка
            if ($('.my-balancer-btn').length) return;
            
            console.log('📌 Додаємо кнопку...');
            
            // Створюємо кнопку (як у WikiFind)
            var button = $('<div class="full-start__button selector my-balancer-btn">' +
                                '<div style="font-size: 24px; margin-right: 5px;">⚖️</div>' +
                                '<span>Балансер</span>' +
                           '</div>');
            
            // Додаємо обробник подій (як у WikiFind)
            button.on('hover:enter click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('👆 Кнопку натиснуто!');
                _this.openModal();
            });
            
            // Стилі
            var style = '<style>' +
                '.my-balancer-btn { display: flex !important; align-items: center; justify-content: center; cursor: pointer; } ' +
                '.my-balancer-btn:hover { opacity: 0.8; } ' +
                '</style>';
            
            if (!$('style#my-balancer-style').length) {
                $('head').append('<style id="my-balancer-style">' + style + '</style>');
            }
            
            // Знаходимо контейнер з кнопками
            var buttonsContainer = $('.full-start-new__buttons, .full-start__buttons');
            
            if (buttonsContainer.length) {
                var neighbors = buttonsContainer.find('.selector');
                if (neighbors.length >= 2) {
                    button.insertAfter(neighbors.eq(1));
                } else {
                    buttonsContainer.append(button);
                }
                console.log('✅ Кнопку додано!');
            }
        };
        
        this.openModal = function() {
            console.log('📱 Відкриваємо модальне вікно');
            
            // Отримуємо дані фільму
            var movieData = Lampa.Page.current().data || {};
            
            // Просте модальне вікно (як у Bandera)
            var modal = new Lampa.Modal({
                title: 'Вибір балансера',
                content: '<div style="padding: 20px;">' +
                    '<p><b>' + (movieData.title || movieData.name) + '</b></p>' +
                    '<div class="selector" style="padding: 15px; margin: 10px 0; background: #ff5722; border-radius: 8px;" onclick="Lampa.Modal.close()">Uaflix</div>' +
                    '<div class="selector" style="padding: 15px; margin: 10px 0; background: #ff5722; border-radius: 8px;" onclick="Lampa.Modal.close()">AnimeON</div>' +
                    '<div class="selector" style="padding: 15px; margin: 10px 0; background: #ff5722; border-radius: 8px;" onclick="Lampa.Modal.close()">Bamboo</div>' +
                    '</div>'
            });
            
            modal.show();
        };
    }
    
    // Запускаємо плагін
    if (window.Lampa) {
        new MyBalancerPlugin().init();
        console.log('🎯 Плагін зареєстровано');
    }
})();
