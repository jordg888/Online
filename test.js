(function() {
    'use strict';
    
    console.log('⚡ Мій плагін: завантаження...');
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.9',
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
            
            button.on('hover:enter click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('👆 Кнопку натиснуто!');
                _this.openBalancerModal(data.movie || data);
            });
            
            var style = '<style>' +
                '.my-balancer-btn { display: flex !important; align-items: center; justify-content: center; cursor: pointer; } ' +
                '.my-balancer-btn:hover { opacity: 0.8; } ' +
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
                console.log('✅ Кнопку додано');
            }
        };
        
        this.openBalancerModal = function(movieData) {
            console.log('📱 Відкриваємо модальне вікно для:', movieData);
            
            // Показуємо повідомлення що завантажуємо
            Lampa.Noty.show('Завантаження...');
            
            // Створюємо просте модальне вікно
            var modalContent = '<div style="padding: 20px; text-align: center;">' +
                '<div style="margin-bottom: 20px;">' +
                    '<h3>' + (movieData.title || movieData.name || 'Фільм') + '</h3>' +
                    (movieData.year ? '<p>Рік: ' + movieData.year + '</p>' : '') +
                '</div>' +
                
                '<div class="my-balancer-list" style="margin: 20px 0;">' +
                    '<div class="selector balancer-item" style="padding: 15px; margin: 5px 0; background: rgba(255,87,34,0.2); border-radius: 8px;" data-id="uaflix">Uaflix</div>' +
                    '<div class="selector balancer-item" style="padding: 15px; margin: 5px 0; background: rgba(255,87,34,0.2); border-radius: 8px;" data-id="animeon">AnimeON</div>' +
                    '<div class="selector balancer-item" style="padding: 15px; margin: 5px 0; background: rgba(255,87,34,0.2); border-radius: 8px;" data-id="bamboo">Bamboo</div>' +
                    '<div class="selector balancer-item" style="padding: 15px; margin: 5px 0; background: rgba(255,87,34,0.2); border-radius: 8px;" data-id="mikai">Mikai</div>' +
                '</div>' +
                
                '<div style="margin: 20px 0;">' +
                    '<label class="selector" style="display: flex; align-items: center; justify-content: center; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">' +
                        '<input type="checkbox" id="new-episode" style="width: 20px; height: 20px; margin-right: 10px;"> Тільки нові серії' +
                    '</label>' +
                '</div>' +
                
                '<button class="selector" id="play-btn" style="width: 100%; padding: 15px; background: #ff5722; color: white; border: none; border-radius: 8px; font-size: 18px; margin-top: 10px;" disabled>Оберіть балансер</button>' +
                
                '<div id="modal-status" style="text-align: center; margin-top: 10px;"></div>' +
            '</div>';
            
            // Ховаємо повідомлення
            Lampa.Noty.hide();
            
            // Створюємо і показуємо модальне вікно
            var modal = new Lampa.Modal({
                title: 'Вибір балансера',
                content: modalContent
            });
            
            modal.show();
            
            // Додаємо обробники подій після появи модального вікна
            setTimeout(function() {
                var selectedId = null;
                
                // Обробка вибору балансера
                $('.balancer-item').on('hover:enter click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    $('.balancer-item').removeClass('selected').css('background', 'rgba(255,87,34,0.2)');
                    $(this).addClass('selected').css('background', '#ff5722');
                    selectedId = $(this).data('id');
                    $('#play-btn').prop('disabled', false);
                    $('#modal-status').html('Вибрано: ' + $(this).text());
                });
                
                // Обробка кнопки "Дивитися"
                $('#play-btn').on('hover:enter click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (!selectedId) return;
                    
                    var newEpisode = $('#new-episode').is(':checked') ? 'так' : 'ні';
                    $('#modal-status').html('⏳ Шукаємо відео...');
                    
                    // Тут буде запит до API
                    setTimeout(function() {
                        $('#modal-status').html('✅ Демо: вибрано ' + selectedId + ', нова серія: ' + newEpisode);
                    }, 1000);
                });
            }, 100);
        };
    }
    
    if (window.Lampa) {
        new MyBalancerPlugin().init();
        console.log('🎯 Плагін зареєстровано');
    }
})();
