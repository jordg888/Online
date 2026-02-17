(function() {
    'use strict';
    
    console.log('⚡ Мій плагін: завантаження...');
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.7',
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
            
            // Правильна обробка подій для Lampa
            button.on('hover:enter', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('👆 Кнопку натиснуто (hover:enter)!');
                _this.openBalancerModal(data.movie || data);
            });
            
            // Додаємо звичайний click як запасний варіант
            button.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('👆 Кнопку натиснуто (click)!');
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
                console.log('✅ Кнопку додано');
            }
        };
        
        this.openBalancerModal = function(movieData) {
            console.log('📱 Відкриваємо модальне вікно для:', movieData);
            
            Lampa.Noty.show('Завантаження балансерів...');
            
            // Запит до API для отримання списку балансерів
            fetch(config.apiBase + '/search')
                .then(response => response.json())
                .then(data => {
                    Lampa.Noty.hide();
                    
                    if (data.success && data.results) {
                        // Створюємо HTML для модального вікна
                        var contentHTML = '<div style="padding: 20px;">' +
                            '<div style="margin-bottom: 15px;">' +
                                '<b>' + (movieData.title || movieData.name || 'Невідомо') + '</b>' +
                                (movieData.year ? ' (' + movieData.year + ')' : '') +
                            '</div>';
                        
                        // Додаємо список балансерів
                        contentHTML += '<div class="my-balancer-list" style="margin: 15px 0;">';
                        data.results.forEach(function(b) {
                            contentHTML += '<div class="my-balancer-item selector" style="padding: 12px; margin: 5px 0; background: rgba(255,87,34,0.2); border-radius: 8px;" data-id="' + b.id + '">' + b.name + '</div>';
                        });
                        contentHTML += '</div>';
                        
                        // Додаємо фільтр "Нова серія"
                        contentHTML += '<div style="margin: 15px 0;">' +
                            '<label class="selector" style="display: flex; align-items: center; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">' +
                                '<input type="checkbox" id="new-episode" style="width: 20px; height: 20px; margin-right: 10px;"> Тільки нові серії' +
                            '</label>' +
                        '</div>';
                        
                        // Додаємо кнопку "Дивитися"
                        contentHTML += '<button class="selector" id="play-btn" style="width: 100%; padding: 15px; background: #ff5722; color: white; border: none; border-radius: 8px; font-size: 18px; margin-top: 10px;" disabled>Оберіть балансер</button>';
                        
                        // Статус
                        contentHTML += '<div id="modal-status" style="text-align: center; margin-top: 10px;"></div>';
                        
                        contentHTML += '</div>';
                        
                        // Створюємо модальне вікно
                        var modal = new Lampa.Modal({
                            title: 'Вибір балансера',
                            content: contentHTML
                        });
                        
                        modal.show();
                        
                        // Додаємо обробники подій після відкриття модалки
                        setTimeout(function() {
                            var selectedId = null;
                            
                            // Обробка вибору балансера
                            $('.my-balancer-item').on('hover:enter click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                $('.my-balancer-item').removeClass('selected');
                                $(this).addClass('selected');
                                selectedId = $(this).data('id');
                                $('#play-btn').prop('disabled', false);
                                console.log('Вибрано балансер:', selectedId);
                            });
                            
                            // Обробка кнопки "Дивитися"
                            $('#play-btn').on('hover:enter click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                if (!selectedId) return;
                                
                                var newEpisode = $('#new-episode').is(':checked');
                                $('#modal-status').html('⏳ Пошук відео...');
                                
                                var url = config.apiBase + '/search?balancer=' + selectedId + 
                                         '&movie=' + encodeURIComponent(movieData.title || movieData.name);
                                
                                if (movieData.year) url += '&year=' + movieData.year;
                                if (newEpisode) url += '&newEpisode=true';
                                
                                fetch(url)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success && data.url) {
                                            Lampa.Modal.close();
                                            Lampa.Player.play({
                                                url: data.url,
                                                title: movieData.title || movieData.name,
                                                quality: data.qualitys || {}
                                            });
                                        } else {
                                            $('#modal-status').html('❌ Не вдалося отримати відео');
                                        }
                                    })
                                    .catch(() => {
                                        $('#modal-status').html('❌ Помилка з\'єднання');
                                    });
                            });
                        }, 100);
                    }
                })
                .catch(error => {
                    Lampa.Noty.hide();
                    console.error('Помилка API:', error);
                    Lampa.Noty.show('Помилка завантаження балансерів');
                });
        };
    }
    
    if (window.Lampa) {
        new MyBalancerPlugin().init();
        console.log('🎯 Плагін зареєстровано');
    }
})();
