(function() {
    'use strict';
    
    console.log('⚡ Мій плагін: завантаження...');
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.8',
        apiBase: 'https://api-plug-lime.vercel.app/api'
    };
    
    function MyBalancerPlugin() {
        var _this = this;
        
        this.init = function() {
            console.log('✅ Плагін ініціалізовано');
            
            Lampa.Listener.follow('full', function(event) {
                if (event.type === 'complite') {
                    setTimeout(function() {
                        try {
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
            var container = $(html);
            
            if (container.find('.my-balancer-btn').length) {
                return;
            }
            
            var button = $('<div class="full-start__button selector my-balancer-btn">' +
                                '<div style="font-size: 24px; margin-right: 5px;">⚖️</div>' +
                                '<span>Балансер</span>' +
                           '</div>');
            
            // Обробка натискання
            button.on('hover:enter click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('👆 Кнопку натиснуто!');
                _this.openBalancerModal(data.movie || data);
            });
            
            // Стилі
            var style = '<style>' +
                '.my-balancer-btn { display: flex !important; align-items: center; justify-content: center; cursor: pointer; } ' +
                '.my-balancer-btn:hover { opacity: 0.8; } ' +
                '</style>';
            
            if (!$('style#my-balancer-style').length) {
                $('head').append('<style id="my-balancer-style">' + style + '</style>');
            }
            
            // Додаємо кнопку
            var buttonsContainer = container.find('.full-start-new__buttons, .full-start__buttons');
            if (buttonsContainer.length) {
                var neighbors = buttonsContainer.find('.selector');
                if (neighbors.length >= 2) {
                    button.insertAfter(neighbors.eq(1));
                } else {
                    buttonsContainer.append(button);
                }
                console.log('✅ Кнопку додано');
            }
        };
        
        this.openBalancerModal = function(movieData) {
            console.log('📱 openBalancerModal викликано для:', movieData);
            
            // КРОК 1: Показуємо повідомлення
            Lampa.Noty.show('Крок 1: Починаємо...');
            
            // КРОК 2: Спробуємо простий alert
            setTimeout(function() {
                Lampa.Noty.hide();
                alert('Тест: Кнопка працює! Фільм: ' + (movieData.title || movieData.name));
            }, 1000);
        };
    }
    
    if (window.Lampa) {
        new MyBalancerPlugin().init();
        console.log('🎯 Плагін зареєстровано');
    }
})();
