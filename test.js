(function() {
    'use strict';

    var API_URL = 'https://api-plug-lime.vercel.app/api';
    var PLUGIN_NAME = 'My Balancer';
    var PLUGIN_KEY = 'my_balancer';

    console.log(PLUGIN_NAME + ': завантаження...');

    // ==== КОПІЮЄМО СТРУКТУРУ З BANDERA ====
    function createV2() {
        return function(component, object) {
            var network = new Lampa.Reguest();
            var movie = object.movie || {};
            
            console.log('Пошук для:', movie.title);

            // Пошук балансерів
            this.search = function() {
                var url = API_URL + '/search?title=' + encodeURIComponent(movie.title || '');
                
                network.silent(url, function(json) {
                    if (json && json.results) {
                        var items = [];
                        for (var i = 0; i < json.results.length; i++) {
                            items.push({
                                title: json.results[i].name,
                                info: 'Балансер',
                                data: json.results[i]
                            });
                        }
                        component.draw(items, {
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

            // Отримання відео
            function getVideo(id, movieData) {
                var url = API_URL + '/video?balancer=' + id + '&title=' + encodeURIComponent(movieData.title || '');
                
                network.silent(url, function(json) {
                    if (json && json.url) {
                        Lampa.Player.play({
                            url: json.url,
                            title: movieData.title,
                            quality: json.qualitys || {}
                        });
                    } else {
                        component.pushError('Немає відео');
                    }
                });
            }

            // Обов'язкові функції
            this.reset = function() {
                component.reset();
                network.clear();
            };

            this.destroy = function() {
                network.clear();
            };
        };
    }

    // Реєструємо плагін
    if (window.Lampa && Lampa.Provider) {
        Lampa.Provider.add({
            name: PLUGIN_KEY,
            title: PLUGIN_NAME,
            create: createV2()
        });
        console.log('✅ Плагін зареєстровано');
    }

})();
