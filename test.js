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
                var movie = object.movie || {};

                // Пошук контенту
                this.search = function() {
                    var url = API_URL + '/search?title=' + encodeURIComponent(movie.title || '');
                    
                    // ТЕСТОВІ ДАНІ (якщо API не працює)
                    var testData = {
                        results: [
                            {id: 'uaflix', name: 'Uaflix'},
                            {id: 'animeon', name: 'AnimeON'},
                            {id: 'bamboo', name: 'Bamboo'},
                            {id: 'mikai', name: 'Mikai'}
                        ]
                    };
                    
                    // Показуємо тестові дані
                    setTimeout(function() {
                        var items = [];
                        for (var i = 0; i < testData.results.length; i++) {
                            var item = testData.results[i];
                            items.push({
                                title: item.name,
                                info: 'Балансер',
                                data: item
                            });
                        }
                        
                        component.draw(items, {
                            onEnter: function(item) {
                                alert('Вибрано: ' + item.title);
                            }
                        });
                    }, 500);
                };

                this.reset = function() {
                    component.reset();
                };

                this.destroy = function() {
                    // Нічого не робимо
                };
            };
        }
    });

    console.log('✅ Плагін-джерело зареєстровано');
})();
