(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;
        // Твоя адреса на Vercel
        var api_host = 'https://host-vercel-theta.vercel.app/api/online';

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    setTimeout(function() {
                        _this.render(e.data, e.object.activity.render());
                    }, 400);
                }
            });
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var button = $('<div class="full-start__button selector lampa-kozak-button" style="border: 2px solid #ffde1a !important; background: rgba(255, 222, 26, 0.2) !important;"><span style="font-weight: bold; color: #fff;">КОЗАК ТВ</span></div>');
            
            button.on('hover:enter click', function() {
                _this.open(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);
        };

        this.open = function (movie) {
            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online',
                movie: movie,
                page: 1,
                onRender: function(object) {
                    // Малюємо фільтр (Сенс плагіна)
                    object.filter.set({
                        source: [
                            {title: 'Всі джерела', source: 'all', selected: true}
                        ]
                    });

                    object.search = function() {
                        object.loading(true);
                        
                        // Звертаємося до твого Vercel
                        var url = api_host + '?title=' + encodeURIComponent(movie.title || movie.name);

                        $.ajax({
                            url: url,
                            method: 'GET',
                            dataType: 'json',
                            timeout: 15000,
                            success: function(res) {
                                if (res && res.length) {
                                    var items = res.map(function(item) {
                                        return {
                                            title: item.title,
                                            file: item.file,
                                            quality: item.quality || 'HD',
                                            info: item.info || 'UA'
                                        };
                                    });

                                    object.draw(items, {
                                        onEnter: function(i) {
                                            Lampa.Player.play({url: i.file, title: i.title});
                                        }
                                    });
                                } else {
                                    object.empty();
                                }
                                object.loading(false);
                            },
                            error: function() {
                                object.doesNotAnswer();
                                object.loading(false);
                            }
                        });
                    };

                    object.search();
                }
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
