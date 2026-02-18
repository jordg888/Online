(function() {
    'use strict';

    // ==================== ВАШІ ДАНІ ====================
    var API_URL = 'https://api-plug-lime.vercel.app/api';
    var PLUGIN_NAME = 'My Balancer Plugin';
    var PLUGIN_KEY = 'my_balancer';
    // ====================================================

    console.log(PLUGIN_NAME + ': завантаження...');

    // Головна функція плагіна (як у Bandera)
    function createPlugin() {
        return function(component, object) {
            var network = new Lampa.Reguest();
            var movieData = object.movie || {};
            
            console.log(PLUGIN_NAME + ': ініціалізація для', movieData.title);

            // ==================== ПОШУК ====================
            this.search = function(object, data) {
                console.log('Пошук...');
                
                // Запит до вашого API
                var url = API_URL + '/search?title=' + encodeURIComponent(movieData.title || '');
                
                network.silent(url, function(json) {
                    if (json && json.results) {
                        // Показуємо список балансерів
                        component.draw(json.results.map(function(item) {
                            return {
                                title: item.name,
                                info: 'Балансер',
                                data: item
                            };
                        }), {
                            onEnter: function(item) {
                                // Вибрано балансер
                                getVideo(item.data.id, movieData);
                            }
                        });
                    } else {
                        component.empty();
                    }
                }, function() {
                    component.doesNotAnswer();
                });
            };

            // ==================== ОТРИМАННЯ ВІДЕО ====================
            function getVideo(balancerId, movie) {
                var url = API_URL + '/video?balancer=' + balancerId + 
                         '&title=' + encodeURIComponent(movie.title || '') +
                         '&year=' + (movie.year || '');
                
                network.silent(url, function(json) {
                    if (json && json.url) {
                        Lampa.Player.play({
                            url: json.url,
                            title: movie.title,
                            quality: json.qualitys || {}
                        });
                    } else {
                        component.pushError('Не вдалося отримати відео');
                    }
                });
            }

            // ==================== ОБОВ'ЯЗКОВІ ФУНКЦІЇ ====================
            this.reset = function() {
                component.reset();
                network.clear();
            };

            this.destroy = function() {
                network.clear();
            };
        };
    }

    // ==================== РЕЄСТРАЦІЯ ПЛАГІНА ====================
    if (window.Lampa && Lampa.Provider) {
        Lampa.Provider.add({
            name: PLUGIN_KEY,
            title: PLUGIN_NAME,
            create: createPlugin()
        });
        console.log('✅ Плагін зареєстровано');
    }
})();
