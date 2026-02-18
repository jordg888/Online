(function() {
    'use strict';

    // ========== ВАШІ НАЛАШТУВАННЯ ==========
    var API_URL = 'https://api-plug-lime.vercel.app/api';  // ваш Vercel API
    var PLUGIN_NAME = 'My Balancer';
    var PLUGIN_KEY = 'my_balancer';
    // ========================================

    console.log(PLUGIN_NAME + ': завантаження...');

    var Network = Lampa.Reguest;

    function createPlugin() {
        return function(component, object) {
            var network = new Network();
            var movie = object.movie || {};
            
            console.log(PLUGIN_NAME + ': пошук для', movie.title);

            // ========== ОСНОВНА ЛОГІКА ==========
            this.search = function() {
                var url = API_URL + '/search?title=' + encodeURIComponent(movie.title || '') +
                         (movie.year ? '&year=' + movie.year : '') +
                         (movie.imdb_id ? '&imdb_id=' + movie.imdb_id : '');

                network.silent(url, function(json) {
                    if (json && json.results && json.results.length) {
                        // Показуємо список балансерів
                        component.draw(json.results.map(function(item) {
                            return {
                                id: item.id,
                                title: item.name,
                                info: 'Балансер',
                                year: movie.year,
                                data: item
                            };
                        }), {
                            onEnter: function(item) {
                                getVideo(item.id, movie);
                            }
                        });
                    } else {
                        component.empty();
                    }
                }, function() {
                    component.doesNotAnswer();
                });
            };

            function getVideo(balancerId, movieData) {
                var url = API_URL + '/video?balancer=' + balancerId +
                         '&title=' + encodeURIComponent(movieData.title || '') +
                         (movieData.year ? '&year=' + movieData.year : '');

                network.silent(url, function(json) {
                    if (json && json.url) {
                        Lampa.Player.play({
                            url: json.url,
                            title: movieData.title,
                            quality: json.qualitys || {},
                            subtitles: json.subtitles || []
                        });
                    } else {
                        component.pushError('Не вдалося отримати відео');
                    }
                });
            }

            this.reset = function() {
                component.reset();
                network.clear();
            };

            this.destroy = function() {
                network.clear();
            };
        };
    }

    // ========== КНОПКА В КАРТЦІ ==========
    function addCardButton() {
        var container = $('.full-start__buttons, .full-start-new__buttons').first();
        
        if (container.length && !$('.my-balancer-card-btn').length) {
            var button = $('<div class="full-start__button selector my-balancer-card-btn">' +
                           '<div style="font-size: 24px;">⚖️</div>' +
                           '<span>Балансер</span>' +
                           '</div>');
            
            container.append(button);
            
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

    // ========== РЕЄСТРАЦІЯ ==========
    if (window.Lampa && Lampa.Provider) {
        Lampa.Provider.add({
            name: PLUGIN_KEY,
            title: PLUGIN_NAME,
            create: createPlugin()
        });
        console.log('✅ Джерело зареєстровано');
    }

    // Додаємо кнопку
    setTimeout(function() {
        setInterval(function() {
            if (Lampa.Page.current() && Lampa.Page.current().name === 'card') {
                addCardButton();
            }
        }, 1000);
    }, 2000);

})();
