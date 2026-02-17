(function () {
    'use strict';

    function KozakTiv() {
        var network = new Lampa.Reguest();

        this.init = function () {
            var _this = this;
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
            var _this = this;
            var button = $('<div class="full-start__button selector lampa-kozak-button" style="border: 1px solid #ffde1a !important;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:10px;vertical-align:middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#ffde1a"/></svg><span style="vertical-align:middle;">Козак ТВ</span></div>');
            
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);

            button.on('hover:enter click', function() {
                _this.open(data.movie);
            });
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
                    // 1. СТВОРЮЄМО ФІЛЬТРИ (Сенс: Користувач може змінити джерело)
                    object.filter.set('source', [
                        {title: 'Ashdi (UA)', source: 'ashdi', selected: true},
                        {title: 'VideoCDN', source: 'vcdn'}
                    ]);

                    // 2. ОБРОБКА ВИБОРУ (Сенс: Перехоплюємо клік на фільтр)
                    object.filter.onSelect = function(item) {
                        current_source = item.source;
                        object.search(); 
                    };

                    // 3. ПОШУК (Сенс: Йдемо за даними)
                    object.search = function() {
                        object.loading(true);
                        
                        // Використовуємо шлях, який перевіряв твій скрипт check.sh
                        var api_url = current_source === 'ashdi' 
                            ? 'https://ashdi.vip/api/video?title=' + encodeURIComponent(movie.title || movie.name)
                            : 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(movie.title || movie.name);

                        // Проксі для обходу блокувань
                        var final_url = 'https://corsproxy.io/?' + encodeURIComponent(api_url);

                        network.silent(final_url, function(res) {
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

                                // Малюємо контент
                                object.draw(items, {
                                    onEnter: function(i) {
                                        Lampa.Player.play({url: i.file, title: i.title});
                                    }
                                });
                            } else {
                                object.empty();
                            }
                            object.loading(false);
                        }, function() {
                            object.doesNotAnswer();
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
