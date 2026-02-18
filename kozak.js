(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;
        var network = new Lampa.Reguest();

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
            var button = $('<div class="full-start__button selector lampa-kozak-button" style="border: 2px solid #ffde1a !important;"><span style="font-weight: bold;">КОЗАК ТВ</span></div>');
            button.on('hover:enter click', function() { _this.open(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(button);
        };

        this.open = function (movie) {
            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online',
                movie: movie,
                page: 1,
                onRender: function(object) {
                    // ПРИМУСОВО МАЛЮЄМО ФІЛЬТРИ ОДРАЗУ
                    var filter_data = {
                        source: [
                            {title: 'Ashdi (UA)', source: 'ashdi', selected: true},
                            {title: 'VideoCDN', source: 'vcdn'}
                        ]
                    };

                    // Встановлюємо фільтри в інтерфейс
                    object.filter.set(filter_data);

                    // Функція обробки вибору
                    object.filter.onSelect = function(type, item) {
                        if(type === 'source') {
                            _this.startSearch(object, movie, item.source);
                        }
                    };

                    // Запускаємо пошук для джерела за замовчуванням
                    _this.startSearch(object, movie, 'ashdi');
                }
            });
        };

        this.startSearch = function(object, movie, source) {
            object.loading(true);
            object.draw([]); // Очищуємо попередні результати

            var base = source === 'ashdi' 
                ? 'https://ashdi.vip/api/video?title=' 
                : 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';
            
            var url = 'https://corsproxy.io/?' + encodeURIComponent(base + encodeURIComponent(movie.title || movie.name));

            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                timeout: 10000, // Чекаємо до 10 секунд (як у check.sh)
                success: function(res) {
                    var data = res.data || res;
                    if (data && data.length) {
                        var items = data.map(function(i) {
                            return {
                                title: i.title || movie.title,
                                file: i.file || i.iframe_src || i.url,
                                quality: i.quality || 'HD',
                                info: source.toUpperCase()
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
