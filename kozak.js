(function() {
    'use strict';
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.3',
        sourceKey: 'my_balancer',
        // ВАШ РОБОЧИЙ API
        apiBase: 'https://api-plug-lime.vercel.app/api'
    };
    
    function MyBalancerPlugin() {
        
        this.init = function() {
            console.log(config.name + ' v' + config.version + ' завантажено');
            console.log('API URL:', config.apiBase);
            this.setupCardButton();
        };
        
        this.setupCardButton = function() {
            Lampa.Listener.follow('card', function(event) {
                if (event.type == 'render') {
                    setTimeout(function() {
                        addButtonToCard(event.card);
                    }, 300);
                }
            });
            
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
            if (card.find('.my-balancer-btn').length > 0) return;
            
            var movieData = Lampa.Page.current().data || {};
            
            var button = $('<div class="my-balancer-btn selector--light" style="margin-top: 10px;">' +
                           '<div class="selector__icon">⚖️</div>' +
                           '<div class="selector__value">Вибрати балансер</div>' +
                           '</div>');
            
            button.on('click', function() {
                openBalancerModal(movieData);
            });
            
            var infoBlock = card.find('.card__info');
            if (infoBlock.length) {
                infoBlock.append(button);
            } else {
                card.append(button);
            }
        }
        
        function openBalancerModal(movieData) {
            // Показуємо завантаження
            Lampa.Loader.show();
            
            // Завантажуємо список балансерів з вашого API
            fetch(config.apiBase + '/search')
                .then(response => response.json())
                .then(data => {
                    Lampa.Loader.hide();
                    if (data.success && data.results) {
                        var modal = new Lampa.Modal({
                            title: 'Вибір балансера',
                            content: createModalContent(movieData, data.results)
                        });
                        modal.show();
                    }
                })
                .catch(error => {
                    Lampa.Loader.hide();
                    console.error('Помилка завантаження балансерів:', error);
                    Lampa.Notify.show('Помилка завантаження балансерів');
                });
        }
        
        function createModalContent(movieData, balancers) {
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
                      '.loading-small { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,.3); border-radius: 50%; border-top-color: #fff; animation: spin 1s ease-in-out infinite; margin-left: 10px; }' +
                      '@keyframes spin { to { transform: rotate(360deg); } }' +
                      '</style>';
            
            // Інформація про фільм
            html += '<div class="movie-info">' +
                   '<div><strong>' + (movieData.title || movieData.name || 'Невідомо') + '</strong></div>' +
                   (movieData.year ? '<div>Рік: ' + movieData.year + '</div>' : '') +
                   '</div>';
            
            // Список балансерів з API
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
            html += '<button class="my-play-btn" disabled onclick="playWithBalancer(\'' + 
                   JSON.stringify(movieData).replace(/'/g, "\\'") + '\')">Дивитися</button>';
            
            html += '<div id="player-status" style="text-align: center; margin-top: 10px;"></div>';
            
            html += '</div>';
            
            // Додаємо глобальну функцію для відтворення
            if (!window.playWithBalancer) {
                window.playWithBalancer = function(movieDataStr) {
                    var movieData = JSON.parse(movieDataStr);
                    var balancerId = window.selectedBalancer;
                    var newEpisode = document.getElementById('new-episode').checked;
                    
                    if (!balancerId) {
                        alert('Оберіть балансер!');
                        return;
                    }
                    
                    // Показуємо статус завантаження
                    document.getElementById('player-status').innerHTML = '<span class="loading-small"></span> Пошук відео...';
                    
                    // Запит до API для отримання відео
                    var apiUrl = config.apiBase + '/search?balancer=' + balancerId + 
                                 '&movie=' + encodeURIComponent(movieData.title || movieData.name);
                    
                    if (movieData.year) {
                        apiUrl += '&year=' + movieData.year;
                    }
                    
                    if (newEpisode) {
                        apiUrl += '&newEpisode=true';
                    }
                    
                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success && data.url) {
                                // Закриваємо модальне вікно
                                Lampa.Modal.close();
                                
                                // Відтворюємо відео
                                Lampa.Player.play({
                                    url: data.url,
                                    title: movieData.title || movieData.name,
                                    quality: data.qualitys || {},
                                    subtitles: data.subtitles || []
                                });
                            } else {
                                document.getElementById('player-status').innerHTML = 'Не вдалося отримати відео';
                            }
                        })
                        .catch(error => {
                            console.error('Помилка:', error);
                            document.getElementById('player-status').innerHTML = 'Помилка з\'єднання';
                        });
                };
            }
            
            return html;
        }
    }
    
    if (typeof Lampa !== 'undefined' && Lampa.Plugin) {
        Lampa.Plugin.add(new MyBalancerPlugin());
        console.log('Плагін успішно зареєстровано');
    }
})();
