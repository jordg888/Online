(function() {
    'use strict';
    
    console.log('⚡ Мій плагін: завантаження...');
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.6',
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
            
            // Створюємо кнопку (додаємо обидві події)
            var button = $('<div class="full-start__button selector my-balancer-btn">' +
                                '<div style="font-size: 24px; margin-right: 5px;">⚖️</div>' +
                                '<span>Балансер</span>' +
                           '</div>');
            
            // Додаємо обробник подій (ЯК У WIKIFIND)
            button.on('hover:enter click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('👆 Кнопку натиснуто!');
                _this.openBalancerModal(data.movie || data);
            });
            
            var style = '<style>' +
                '.my-balancer-btn { display: flex !important; align-items: center; justify-content: center; cursor: pointer; } ' +
                '.my-balancer-btn:hover { opacity: 0.8; } ' +
                '.my-balancer-btn div { width: 1.6em; height: 1.6em; object-fit: contain; margin-right: 5px; } ' +
                '</style>';
            
            if (!$('style#my-balancer-style').length) {
                $('head').append('<style id="my-balancer-style">' + style + '</style>');
            }
            
            var buttonsContainer = container.find('.full-start-new__buttons, .full-start__buttons');
            
            if (buttonsContainer.length) {
                var neighbors = buttonsContainer.find('.selector');
                if (neighbors.length >= 2) {
                    button.insertAfter(neighbors.eq(1));
                } else {
                    buttonsContainer.append(button);
                }
                console.log('✅ Кнопку додано з обробником подій');
            }
        };
        
        this.openBalancerModal = function(movieData) {
            console.log('📱 Відкриваємо модальне вікно для:', movieData);
            
            // Показуємо сповіщення що кнопка працює
            Lampa.Noty.show('Завантаження балансерів...');
            
            // ТЕПЕР ДОДАМО ТЕСТОВЕ МОДАЛЬНЕ ВІКНО
            var modal = new Lampa.Modal({
                title: 'Вибір балансера',
                content: '<div style="padding: 20px; text-align: center;">' +
                         '<p>Фільм: <b>' + (movieData.title || movieData.name || 'Невідомо') + '</b></p>' +
                         '<p>Виберіть балансер:</p>' +
                         '<div style="margin: 20px 0;">' +
                         '<button class="selector" style="width: 100%; margin: 5px 0;" onclick="alert(\'Вибрано Uaflix\')">Uaflix</button>' +
                         '<button class="selector" style="width: 100%; margin: 5px 0;" onclick="alert(\'Вибрано AnimeON\')">AnimeON</button>' +
                         '<button class="selector" style="width: 100%; margin: 5px 0;" onclick="alert(\'Вибрано Bamboo\')">Bamboo</button>' +
                         '<button class="selector" style="width: 100%; margin: 5px 0;" onclick="alert(\'Вибрано Mikai\')">Mikai</button>' +
                         '</div>' +
                         '<label><input type="checkbox" id="new-episode"> Тільки нові серії</label>' +
                         '</div>'
            });
            
            modal.show();
        };
    }
    
    if (window.Lampa) {
        new MyBalancerPlugin().init();
        console.log('🎯 Плагін зареєстровано');
    }
})();
