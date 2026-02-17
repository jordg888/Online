(function () {
    'use strict';

    function KozakTiv() {
        this.init = function () {
            var _this = this;
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    // Додаємо кнопку через таймер, щоб встиг відмалюватися основний інтерфейс
                    setTimeout(function() {
                        _this.render(e.data, e.object.activity.render());
                    }, 300);
                }
            });
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var _this = this;
            var button = $('<div class="full-start__button selector lampa-kozak-button"><span>Козак ТВ</span></div>');
            
            button.on('hover:enter click', function() {
                _this.open(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);
        };

        this.open = function (movie) {
            var _this = this;
            var current_source = 'ashdi';

            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online',
                movie: movie,
                page: 1,
                onRender: function(object) {
                    // РЕЄСТРУЄМО ФІЛЬТРИ (ВИБІР ДЖЕРЕЛА)
                    object.filter.set('source', [
                        {title: 'Ashdi (UA)', source: 'ashdi', selected: true},
                        {title: 'VideoCDN', source: 'vcdn'}
                    ]);

                    // ЛОГІКА ПЕРЕМИКАННЯ ФІЛЬТРІВ
                    object.filter.onSelect = function(item) {
                        current_source = item.source;
                        object.search(); 
                    };

                    // ФУНКЦІЯ ПОШУКУ
                    object.search = function() {
                        object.loading(true);
                        var base_url = current_source === 'ashdi' 
                            ? 'https://ashdi.vip/api/video?title=' 
                            : 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';
                        
                        var query_url = 'https://corsproxy.io/?' + encodeURIComponent(base_url + encodeURIComponent(movie.title || movie.name));

                        $.ajax({
                            url: query_url,
                            method: 'GET',
                            dataType: 'json',
                            success: function(res) {
                                var raw = res.data || res;
                                if (raw && raw.length) {
                                    var items = raw.map(function(item) {
                                        return {
                                            title: item.title || movie.title,
                                            file: item.file || item.iframe_src || item.url,
                                            quality: item.quality || 'HD',
                                            info: current_source.toUpperCase()
                                        };
                                    });

                                    object.draw(items, {
                                        onEnter: function(item) {
                                            Lampa.Player.play({url: item.file, title: item.title});
                                        }
                                    });
                                } else {
                                    object.empty();
                                }
                                object.loading(false);
                            },
                            error: function() {
                                object.doesNotAnswer();
                            }
                        });
                    };

                    object.search(); // Запуск при відкритті
                }
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
