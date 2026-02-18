(function() {
    'use strict';

    // ========== ВАШІ ДАНІ ==========
    var API_URL = 'https://api-plug-lime.vercel.app/api';
    var PLUGIN_NAME = 'My Balancer';
    var PLUGIN_KEY = 'my_balancer';
    // ===============================

    console.log(PLUGIN_NAME + ': завантаження...');

    // ТОЧНА КОПІЯ СТРУКТУРИ BANDERA
    Lampa.Provider.add({
        name: PLUGIN_KEY,
        title: PLUGIN_NAME,
        create: function() {
            return function(component, object) {
                var network = new Lampa.Reguest();
                var movie = object.movie || {};

                // ПОШУК - як у Bandera
                this.search = function() {
                    var url = API_URL + '/search?title=' + encodeURIComponent(movie.title || '');
                    
                    // Тестові дані, якщо API не працює
                    var items = [
                        { title: 'Uaflix', info: 'Балансер' },
                        { title: 'AnimeON', info: 'Балансер' },
                        { title: 'Bamboo', info: 'Балансер' },
                        { title: 'Mikai', info: 'Балансер' }
                    ];
                    
                    component.draw(items, {
                        onEnter: function(item) {
                            Lampa.Noty.show('Вибрано: ' + item.title);
                            setTimeout(Lampa.Noty.hide, 2000);
                        }
                    });
                };

                // ОБОВ'ЯЗКОВІ МЕТОДИ
                this.reset = function() {
                    component.reset();
                    network.clear();
                };

                this.destroy = function() {
                    network.clear();
                };
            };
        }
    });

    console.log('✅ Плагін зареєстровано');
})();
