(function() {
    'use strict';

    var API_URL = 'https://api-plug-lime.vercel.app/api';
    var PLUGIN_NAME = 'My Balancer';
    var PLUGIN_KEY = 'my_balancer';

    // Копіюємо структуру з Bandera
    Lampa.Provider.add({
        name: PLUGIN_KEY,
        title: PLUGIN_NAME,
        create: function() {
            return function(component, object) {
                var network = new Lampa.Reguest();
                var movie = object.movie || {};
                
                // Основний пошук
                this.search = function() {
                    var url = API_URL + '/search?title=' + encodeURIComponent(movie.title || '');
                    
                    network.silent(url, function(json) {
                        if (json && json.results) {
                            var items = [];
                            for (var i = 0; i < json.results.length; i++) {
                                items.push({
                                    title: json.results[i].name,
                                    info: 'Балансер'
                                });
                            }
                            component.draw(items, {
                                onEnter: function(item) {
                                    Lampa.Noty.show('Вибрано: ' + item.title);
                                }
                            });
                        }
                    });
                };

                // Обов'язкові методи
                this.reset = function() {
                    component.reset();
                };

                this.destroy = function() {
                    network.clear();
                };
            };
        }
    });

    // Додаємо кнопку в картку (якщо це можливо)
    setTimeout(function() {
        setInterval(function() {
            var container = $('.full-start__buttons, .full-start-new__buttons').first();
            if (container.length && !$('.my-balancer-source-btn').length) {
                var btn = $('<div class="full-start__button selector">' +
                           '<div>⚖️</div>' +
                           '<span>Балансер</span>' +
                           '</div>');
                container.append(btn);
                btn.on('click', function() {
                    var page = Lampa.Page.current();
                    if (page && page.data) {
                        Lampa.Page.open('source', {
                            source: PLUGIN_KEY,
                            movie: page.data.movie || page.data
                        });
                    }
                });
            }
        }, 2000);
    }, 3000);

})();
