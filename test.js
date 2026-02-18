(function() {
    'use strict';

    var API_URL = 'https://api-plug-lime.vercel.app/api';
    var PLUGIN_NAME = 'My Balancer';
    var PLUGIN_KEY = 'my_balancer';

    console.log(PLUGIN_NAME + ': завантаження...');

    // ТОЧНА КОПІЯ СТРУКТУРИ BANDERA
    function createPlugin() {
        return function(component, object) {
            var network = new Lampa.Reguest();
            var movie = object.movie || {};
            
            // ПОШУК
            this.search = function() {
                var items = [
                    { title: 'Uaflix', info: 'Балансер 1' },
                    { title: 'AnimeON', info: 'Балансер 2' },
                    { title: 'Bamboo', info: 'Балансер 3' }
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

    // РЕЄСТРАЦІЯ
    Lampa.Provider.add({
        name: PLUGIN_KEY,
        title: PLUGIN_NAME,
        create: createPlugin()
    });

    console.log('✅ Плагін зареєстровано');

})();
