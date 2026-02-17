(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

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
            var button = $('<div class="full-start__button selector lampa-kozak-button" style="border: 2px solid #ffde1a !important; background: rgba(255, 222, 26, 0.1) !important;"><span style="font-weight: bold; color: #ff9d00;">КОЗАК ТВ</span></div>');
            
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
                    // Додаємо фільтр вибору джерела (Сенс плагіна)
                    object.filter.set('source', [
                        {title: 'Ashdi (UA)', source: 'ashdi', selected: true},
                        {title: 'VideoCDN', source: 'vcdn'}
                    ]);

                    object.filter.onSelect = function(item) {
                        object.search(item.source);
                    };

                    object.search = function(source) {
                        object.loading(true);
                        var current = source || 'ashdi';
                        
                        // Використовуємо адреси, які перевіряє скрипт check.sh
                        var api = current === 'ashdi' 
                            ? 'https://ashdi.vip/api/video?title=' 
                            : 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';
                        
                        var query = api + encodeURIComponent(movie.title || movie.name);
                        
                        // Спроба №1: Прямий запит через CORS-шлюз
                        $.ajax({
                            url: 'https://corsproxy.io/?' + encodeURIComponent(query),
                            method: 'GET',
                            dataType: 'json',
                            success: function(res) {
                                var list = res.data || res;
                                if (list && list.length) {
                                    object.draw(_this.prepare(list, movie, current), {
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
                            }
                        });
                    };
                    object.search();
                }
            });
        };

        this.prepare = function(list, movie, src) {
            return list.map(function(item) {
                return {
                    title: item.title || movie.title,
                    file: item.file || item.iframe_src || item.url,
                    quality: item.quality || 'HD',
                    info: src.toUpperCase()
                };
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
