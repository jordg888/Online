(function() {
    'use strict';
    
    var config = {
        name: 'My Balancer Plugin',
        version: '1.0.2',
        sourceKey: 'my_balancer',
        // ВАШ URL (виправлено)
        apiBase: 'https://vercel-proxy-phi-ecru-56.vercel.app/api'
    };
    
    function MyBalancerPlugin() {
        
        this.init = function() {
            console.log(config.name + ' v' + config.version + ' завантажено');
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
            // Завантажуємо список балансерів з вашого API
            loadBalancersFromAPI(movieData, function(balancers) {
                var modal = new Lampa.Modal({
                    title: 'Вибір балансера',
                    content: createModalContent(movieData, balancers)
                });
                modal.show();
            });
        }
        
        function loadBalancersFromAPI(movieData, callback) {
            // Тут ми будемо робити запит до вашого API
            // Поки що використаємо тестові дані
            var testBalancers = [
                { id: 'uaflix', name: 'Uaflix' },
                { id: 'animeon', name: 'AnimeON' },
                { id: 'bamboo', name: 'Bamboo' },
                { id: 'mikai', name: 'Mikai' }
            ];
            callback(testBalancers);
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
                      '</style>';
            
            html += '<div class="movie-info">' +
                   '<div><strong>' + (movieData.title || movieData.name || 'Невідомо') + '</strong></div>' +
                   (movieData.year ? '<div>Рік: ' + movieData.year + '</div>' : '') +
                   '</div>';
            
            html += '<div class="my-balancer-list">';
            balancers.forEach(function(b) {
                html += '<div class="my-balancer-item" data-id="' + b.id + '" onclick="window.selectedBalancer=\'' + b.id + '\'; document.querySelector(\'.my-play-btn\').classList.add(\'active\'); document.querySelector(\'.my-play-btn\').removeAttribute(\'disabled\'); this.classList.add(\'selected\'); document.querySelectorAll(\'.my-balancer-item\').forEach(el => { if(el !== this) el.classList.remove(\'selected\'); })">' + b.name + '</div>';
            });
            html += '</div>';
            
            html += '<div class="my-filter-item">' +
                   '<input type="checkbox" id="new-episode" style="width: 20px; height: 20px;">' +
                   '<label for="new-episode" style="font-size: 16px;">Тільки нові серії</label>' +
                   '</div>';
            
            // Кнопка відтворення з викликом вашого API
            html += '<button class="my-play-btn" disabled onclick="playWithBalancer(\'' + 
                   JSON.stringify(movieData).replace(/'/g, "\\'") + '\')">Дивитися</button>';
            
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
                    
                    // Тут буде запит до вашого API
                    alert('Запит до API: ' + config.apiBase + '/search?balancer=' + balancerId + 
                          '&movie=' + encodeURIComponent(movieData.title || movieData.name) +
                          '&new=' + newEpisode);
                    
                    // Пізніше замінимо на реальний запит:
                    /*
                    fetch(config.apiBase + '/search?balancer=' + balancerId + 
                          '&movie=' + encodeURIComponent(movieData.title || movieData.name) +
                          '&new=' + newEpisode)
                        .then(response => response.json())
                        .then(data => {
                            if (data.url) {
                                Lampa.Player.play({ url: data.url, title: movieData.title });
                            }
                        });
                    */
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
