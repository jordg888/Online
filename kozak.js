(function () {
    'use strict';

    function KozakTiv() {
        var network = new Lampa.Reguest(); // Системний метод запитів

        this.init = function () {
            Lampa.Listener.follow('full', (e) => {
                if (e.type === 'complite') this.render(e.data, e.object.activity.render());
            });
        };

        this.render = function (data, html) {
            var button = $('<div class="full-start__button selector"><span>Козак ТВ</span></div>');
            button.on('hover:enter click', () => this.open(data.movie));
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(button);
        };

        this.open = function (movie) {
            var _this = this;
            var current_source = 'ashdi'; // Джерело за замовчуванням

            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online',
                movie: movie,
                page: 1,
                onRender: function(object) {
                    // --- ТУТ СТВОРЮЮТЬСЯ ФІЛЬТРИ ---
                    object.filter.set('source', [
                        {title: 'Ashdi (UA)', source: 'ashdi', selected: true},
                        {title: 'VideoCDN', source: 'vcdn'}
                    ]);

                    // Подія при зміні фільтра
                    object.filter.onSelect = function(item) {
                        current_source = item.source;
                        object.search(); // Перезапуск пошуку
                    };

                    // Функція самого пошуку
                    object.search = function() {
                        object.loading(true);
                        var url = '';
                        
                        if(current_source === 'ashdi') {
                            url = 'https://ashdi.vip/api/video?title=' + encodeURIComponent(movie.title || movie.name);
                        } else {
                            url = 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(movie.title || movie.name);
                        }

                        // Використовуємо проксі, щоб не було "Пусто" через блокування
                        var proxied_url = 'https://corsproxy.io/?' + encodeURIComponent(url);

                        network.silent(proxied_url, function(res) {
                            if (res && (res.length || res.data)) {
                                var raw_data = res.data || res;
                                // Перетворюємо в зрозумілий для Lampa формат
                                var items = raw_data.map(function(item) {
                                    return {
                                        title: item.title || movie.title,
                                        file: item.file || item.iframe_src || item.url,
                                        quality: item.quality || '720p',
                                        info: current_source.toUpperCase()
                                    };
                                });

                                object.draw(items, {
                                    onEnter: (item) => Lampa.Player.play({url: item.file, title: item.title})
                                });
                            } else {
                                object.empty();
                            }
                            object.loading(false);
                        }, function() {
                            object.doesNotAnswer();
                        });
                    };

                    object.search(); // Запускаємо перший пошук при відкритті
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
