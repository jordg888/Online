(function() {
    'use strict';

    // ========== НАЛАШТУВАННЯ ==========
    var API_URL = 'https://api-plug-lime.vercel.app/api';
    var PLUGIN_NAME = 'My Balancer';
    var PLUGIN_KEY = 'my_balancer';
    // =================================

    console.log(PLUGIN_NAME + ': завантаження...');

    // Створюємо провайдер
    Lampa.Provider.add({
        name: PLUGIN_KEY,
        title: PLUGIN_NAME,
        create: function() {
            return function(component, object) {
                var network = new Lampa.Reguest();
                var movie = object.movie || {};

                // Пошук контенту
                this.search = function() {
                    var url = API_URL + '/search?title=' + encodeURIComponent(movie.title || '');
                    
                    if (movie.year) url += '&year=' + movie.year;
                    if (movie.imdb_id) url += '&imdb_id=' + movie.imdb_id;

                    network.silent(url, function(json) {
                        if (json && json.results && json.results.length) {
                            var items = [];
                            for (var i = 0; i < json.results.length; i++) {
                                var item = json.results[i];
                                items.push({
                                    id: item.id,
                                    title: item.name,
                                    info: 'Балансер',
                                    year: movie.year,
                                    data: item
                                });
                            }
                            component.draw(items, {
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

                // Отримання відео
                function getVideo(balancerId, movieData) {
                    var url = API_URL + '/video?balancer=' + balancerId +
                             '&title=' + encodeURIComponent(movieData.title || '');
                    
                    if (movieData.year) url += '&year=' + movieData.year;

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

                // Скидання
                this.reset = function() {
                    component.reset();
                    network.clear();
                };

                // Знищення
                this.destroy = function() {
                    network.clear();
                };
            };
        }
    });

    console.log('✅ Плагін-джерело зареєстровано');
})();
