(function() {
    'use strict';

    var PLUGIN_KEY = 'my_balancer';
    var PLUGIN_NAME = 'My Balancer';

    // ==================== ТІЛЬКИ ДЖЕРЕЛО ====================
    if (window.Lampa && Lampa.Provider) {
        Lampa.Provider.add({
            name: PLUGIN_KEY,
            title: PLUGIN_NAME,
            create: function() {
                return function(component, object) {
                    this.search = function() {
                        component.draw([
                            {title: 'Uaflix', info: 'Балансер'},
                            {title: 'AnimeON', info: 'Балансер'},
                            {title: 'Bamboo', info: 'Балансер'}
                        ], {
                            onEnter: function(item) {
                                alert('Вибрано: ' + item.title);
                            }
                        });
                    };
                };
            }
        });
    }

    // ==================== ТІЛЬКИ КНОПКА ====================
    setTimeout(function() {
        setInterval(function() {
            var container = $('.full-start__buttons').first();
            if (container.length && !$('.my-source-btn').length) {
                var button = $('<div class="full-start__button selector my-source-btn">' +
                               '<div>⚖️</div>' +
                               '<span>Balancer</span>' +
                               '</div>');
                container.append(button);
                
                button.on('click', function() {
                    var page = Lampa.Page.current();
                    if (page && page.data) {
                        Lampa.Page.open('source', {
                            source: PLUGIN_KEY,
                            movie: page.data.movie || page.data
                        });
                    }
                });
            }
        }, 1000);
    }, 2000);
})();
