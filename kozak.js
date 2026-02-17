(function() {
    'use strict';
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.4',
        sourceKey: 'my_balancer',
        apiBase: 'https://api-plug-lime.vercel.app/api'
    };
    
    function MyBalancerPlugin() {
        
        this.init = function() {
            console.log(config.name + ' v' + config.version + ' завантажено');
            console.log('API URL:', config.apiBase);
            
            // Пробуємо різні способи додати кнопку
            this.setupCardButton();
            this.setupAlternative();
            
            // Періодично перевіряємо чи з'явилася картка
            this.checkForCard();
        };
        
        // Спосіб 1: Через подію card
        this.setupCardButton = function() {
            Lampa.Listener.follow('card', function(event) {
                console.log('Card event:', event.type);
                
                if (event.type == 'render') {
                    // Даємо час на рендер
                    setTimeout(function() {
                        addButtonToCard(event.card);
                    }, 500);
                }
            });
        };
        
        // Спосіб 2: Через зміну сторінки
        this.setupAlternative = function() {
            Lampa.Listener.follow('full', function(event) {
                console.log('Full event:', event.type);
                
                if (event.type == 'complite') {
                    var page = Lampa.Page.current();
                    console.log('Current page:', page ? page.name : 'unknown');
                    
                    if (page && page.name == 'card') {
                        setTimeout(function() {
                            var card = $('.card');
                            console.log('Card found:', card.length > 0);
                            if (card.length) {
                                addButtonToCard(card);
                            }
                        }, 500);
                    }
                }
            });
        };
        
        // Спосіб 3: Періодична перевірка
        this.checkForCard = function() {
            var checkInterval = setInterval(function() {
                var page = Lampa.Page.current();
                if (page && page.name == 'card') {
                    var card = $('.card');
                    if (card.length && !card.find('.my-balancer-btn').length) {
                        console.log('Додаємо кнопку через інтервал');
                        addButtonToCard(card);
                    }
                }
            }, 1000);
            
            // Зупиняємо через 30 секунд
            setTimeout(function() {
                clearInterval(checkInterval);
            }, 30000);
        };
        
        function addButtonToCard(card) {
            // Перевіряємо чи вже є кнопка
            if (card.find('.my-balancer-btn').length > 0) {
                console.log('Кнопка вже є');
                return;
            }
            
            // Отримуємо дані фільму
            var movieData = Lampa.Page.current().data || {};
            console.log('Дані фільму:', movieData);
            
            // Створюємо кнопку
            var button = $('<div class="my-balancer-btn selector--light" style="margin: 15px; cursor: pointer; border: 2px solid #ff5722; border-radius: 8px;">' +
                           '<div style="display: flex; align-items: center; padding: 10px;">' +
                           '<div style="font-size: 24px; margin-right: 10px;">⚖️</div>' +
                           '<div style="font-size: 16px;">Вибрати балансер</div>' +
                           '</div>' +
                           '</div>');
            
            button.on('click', function() {
                openBalancerModal(movieData);
            });
            
            // Шукаємо місце для вставки
            var placeToInsert = card.find('.card__info, .card-info, .info-block, .card__content');
            
            if (placeToInsert.length) {
                console.log('Вставляємо в знайдене місце');
                placeToInsert.first().append(button);
            } else {
                console.log('Вставляємо в кінець картки');
                card.append(button);
            }
            
            console.log('Кнопку додано!');
        }
        
        function openBalancerModal(movieData) {
            console.log('Відкриваємо модальне вікно');
            
            Lampa.Loader.show();
            
            fetch(config.apiBase + '/search')
                .then(response => response.json())
                .then(data => {
                    Lampa.Loader.hide();
                    
                    if (data.success && data.results) {
                        // Створюємо модальне вікно
                        var modal = new Lampa.Modal({
                            title: 'Вибір балансера',
                            content: createModalContent(movieData, data.results)
                        });
                        
                        modal.show();
                    } else {
                        Lampa.Notify.show('Не вдалося завантажити балансери');
                    }
                })
                .catch(error => {
                    Lampa.Loader.hide();
                    console.error('Помилка:', error);
                    Lampa.Notify.show('Помилка з\'єднання з API');
                });
        }
        
        function createModalContent(movieData, balancers) {
            var html = '<div style="padding: 20px;">' +
                      '<style>' +
                      '.balancer-item { padding: 15px; margin: 8px 0; background: rgba(255,87,34,0.2); border-radius: 8px; cursor: pointer; }' +
                      '.balancer-item.selected { background: #ff5722; }' +
                      '.play-button { width: 100%; padding: 15px; background: #ff5722; color: white; border: none; border-radius: 8px; font-size: 18px; margin-top: 20px; }' +
                      '.play-button:disabled { opacity: 0.5; }' +
                      '</style>';
            
            // Інформація про фільм
            html += '<div style="margin-bottom: 20px;">' +
                   '<strong>' + (movieData.title || movieData.name || 'Невідомо') + '</strong>' +
                   (movieData.year ? ' (' + movieData.year + ')' : '') +
                   '</div>';
            
            // Список балансерів
            html += '<div id="balancer-list">';
            balancers.forEach(function(b) {
                html += '<div class="balancer-item" data-id="' + b.id + '">' + b.name + '</div>';
            });
            html += '</div>';
            
            // Фільтр
            html += '<div style="margin: 15px 0;">' +
                   '<label><input type="checkbox" id="new-episode"> Тільки нові серії</label>' +
                   '</div>';
            
            // Кнопка
            html += '<button id="play-btn" class="play-button" disabled>Оберіть балансер</button>';
            
            // Статус
            html += '<div id="status" style="text-align: center; margin-top: 10px;"></div>';
            
            html += '</div>';
            
            // Додаємо скрипт для обробки
            setTimeout(function() {
                var selectedId = null;
                
                $('.balancer-item').on('click', function() {
                    $('.balancer-item').removeClass('selected');
                    $(this).addClass('selected');
                    selectedId = $(this).data('id');
                    $('#play-btn').prop('disabled', false);
                });
                
                $('#play-btn').on('click', function() {
                    if (!selectedId) return;
                    
                    var newEpisode = $('#new-episode').is(':checked');
                    $('#status').html('⏳ Пошук відео...');
                    
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
                                    title: movieData.title || movieData.name
                                });
                            } else {
                                $('#status').html('❌ Не вдалося отримати відео');
                            }
                        })
                        .catch(() => {
                            $('#status').html('❌ Помилка з\'єднання');
                        });
                });
            }, 100);
            
            return html;
        }
    }
    
    // Реєструємо плагін
    if (typeof Lampa !== 'undefined' && Lampa.Plugin) {
        Lampa.Plugin.add(new MyBalancerPlugin());
        console.log('Плагін зареєстровано');
    }
})();
