(function() {
    'use strict';

    var API_URL = 'https://api-plug-lime.vercel.app/api';
    var PLUGIN_NAME = 'My Balancer';
    var PLUGIN_KEY = 'my_balancer';

    console.log(PLUGIN_NAME + ': завантаження...');

    // ==================== ДЖЕРЕЛО (як у Bandera) ====================
    if (window.Lampa && Lampa.Provider) {
        Lampa.Provider.add({
            name: PLUGIN_KEY,
            title: PLUGIN_NAME,
            create: function() {
                return function(component, object) {
                    var network = new Lampa.Reguest();
                    var movie = object.movie || {};

                    this.search = function() {
                        var url = API_URL + '/search?title=' + encodeURIComponent(movie.title || '');
                        
                        network.silent(url, function(json) {
                            if (json && json.results) {
                                component.draw(json.results.map(function(item) {
                                    return {
                                        title: item.name,
                                        info: 'Балансер',
                                        data: item
                                    };
                                }), {
                                    onEnter: function(item) {
                                        getVideo(item.data.id, movie);
                                    }
                                });
                            } else {
                                component.empty();
                            }
                        }, function() {
                            component.doesNotAnswer();
                        });
                    };

                    function getVideo(balancerId, movie) {
                        var url = API_URL + '/video?balancer=' + balancerId + 
                                 '&title=' + encodeURIComponent(movie.title || '');
                        
                        network.silent(url, function(json) {
                            if (json && json.url) {
                                Lampa.Player.play({
                                    url: json.url,
                                    title: movie.title
                                });
                            }
                        });
                    }
                };
            }
        });
    }

    // ==================== КНОПКА В КАРТЦІ ====================
    setTimeout(function() {
        // Додаємо кнопку в картку
        function addButton() {
            var container = $('.full-start__buttons, .full-start-new__buttons').first();
            
            if (container.length && !$('.my-source-btn').length) {
                var button = $('<div class="full-start__button selector my-source-btn">' +
                               '<div style="font-size: 24px;">⚖️</div>' +
                               '<span>Балансер</span>' +
                               '</div>');
                
                container.append(button);
                
                // Відкриваємо джерело при натисканні
                button.on('hover:enter click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    var page = Lampa.Page.current();
                    if (page && page.data) {
                        Lampa.Page.open('source', {
                            source: PLUGIN_KEY,
                            movie: page.data.movie || page.data
                        });
                    }
                });
            }
        }

        // Перевіряємо кожну секунду
        setInterval(function() {
            if (Lampa.Page.current() && Lampa.Page.current().name === 'card') {
                addButton();
            }
        }, 1000);
    }, 2000);
})();
