(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;
        // Використовуємо стабільний шлюз для отримання списку джерел
        var gateway = 'http://golampaua.mooo.com/lite/withsearch';

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
                    // ФІЛЬТРИ: Беремо логіку з твого нового плагіна
                    var filter_items = {
                        source: [
                            {title: 'Ashdi (UA)', source: 'ashdi', selected: true},
                            {title: 'VideoCDN', source: 'vcdn'},
                            {title: 'Rezka', source: 'rezka'},
                            {title: 'KinoBase', source: 'kinobase'}
                        ]
                    };

                    object.filter.set(filter_items);

                    object.filter.onSelect = function(type, item) {
                        if (type === 'source') {
                            _this.search(object, movie, item.source);
                        }
                    };

                    // Перший запуск
                    _this.search(object, movie, 'ashdi');
                }
            });
        };

        this.search = function (object, movie, balanser) {
            object.loading(true);
            
            // Використовуємо метод формування запиту як у Lampac
            var query = 'id=' + movie.id + 
                        '&title=' + encodeURIComponent(movie.title || movie.name) + 
                        '&serial=' + (movie.number_of_seasons ? 1 : 0);

            // Пряме звернення до балансера через проксі-шлюз
            var url = 'https://corsproxy.io/?' + encodeURIComponent('https://' + balanser + '.vip/api/video?' + query);
            
            // Якщо VideoCDN, змінюємо шлях
            if (balanser === 'vcdn') {
                url = 'https://corsproxy.io/?' + encodeURIComponent('https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&' + query);
            }

            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function(res) {
                    var data = res.data || res;
                    if (data && data.length) {
                        var items = data.map(function(i) {
                            return {
                                title: i.title || movie.title,
                                file: i.file || i.iframe_src || i.url,
                                quality: i.quality || 'HD',
                                info: balanser.toUpperCase()
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
                    object.loading(false);
                }
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
