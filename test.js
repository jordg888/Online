(function() {
    'use strict';
    
    console.log('⚡ Мій плагін: завантаження...');
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.5',
        apiBase: 'https://api-plug-lime.vercel.app/api'
    };
    
    function MyBalancerPlugin() {
        var _this = this;
        
        this.init = function() {
            console.log('✅ Плагін ініціалізовано');
            
            // Слідкуємо за подією full (як у WikiFind)
            Lampa.Listener.follow('full', function(event) {
                if (event.type === 'complite') {
                    console.log('📺 Отримано подію full: complite');
                    
                    // Чекаємо трохи, поки з'явиться картка
                    setTimeout(function() {
                        try {
                            // Отримуємо HTML картки (як у WikiFind)
                            var html = event.object.activity.render();
                            _this.render(event.data, html);
                        } catch (err) {
                            console.log('Помилка рендеру:', err);
                        }
                    }, 200);
                }
            });
        };
        
        this.render = function(data, html) {
            console.log('🎨 Рендеримо кнопку...');
            
            var container = $(html);
            
            // Перевіряємо чи вже є наша кнопка
            if (container.find('.my-balancer-btn').length) {
                console.log('Кнопка вже є');
                return;
            }
            
            // Створюємо кнопку (як у WikiFind)
            var button = $('<div class="full-start__button selector my-balancer-btn">' +
                                '<div style="font-size: 24px; margin-right: 5px;">⚖️</div>' +
                                '<span>Балансер</span>' +
                           '</div>');
            
            // Додаємо стилі (як у WikiFind)
            var style = '<style>' +
                '.my-balancer-btn { display: flex !important; align-items: center; justify-content: center; } ' +
                '.my-balancer-btn div { width: 1.6em; height: 1.6em; object-fit: contain; margin-right: 5px; } ' +
                '</style>';
            
            if (!$('style#my-balancer-style').length) {
                $('head').append('<style id="my-balancer-style">' + style + '</style>');
            }
            
            // Знаходимо контейнер з кнопками (як у WikiFind)
            var buttonsContainer = container.find('.full-start-new__buttons, .full-start__buttons');
            
            if (buttonsContainer.length) {
                // Додаємо кнопку після другої кнопки (як у WikiFind)
                var neighbors = buttonsContainer.find('.selector');
                if (neighbors.length >= 2) {
                    button.insertAfter(neighbors.eq(1));
                } else {
                    buttonsContainer.append(button);
                }
                
                console.log('✅ Кнопку додано!');
            } else {
                console.log('❌ Контейнер кнопок не знайдено');
            }
            
            // Додаємо обробник кліку
            button.on('click', function() {
                _this.openBalancerModal(data.movie || data);
            });
        };
        
        this.openBalancerModal = function(movieData) {
            console.log('📱 Відкриваємо модальне вікно для:', movieData);
            alert('Кнопка працює! Фільм: ' + (movieData.title || movieData.name));
            
            // Тут буде ваш код з модальним вікном...
        };
    }
    
    // Запускаємо плагін (як у WikiFind)
    if (window.Lampa) {
        new MyBalancerPlugin().init();
        console.log('🎯 Плагін зареєстровано');
    }
})();
