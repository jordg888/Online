(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border: 2px solid #fff;"><span>КОЗАК ТВ</span></div>');
            btn.on('hover:enter click', function () { _this.open(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.open = function (movie) {
            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online',
                movie: movie,
                page: 1,
                onRender: function(object) {
                    object.search = function() {
                        object.loading(true);
                        var title = movie.title || movie.name;
                        
                        // Використовуємо стабільний шлюз, який ми бачили в check.sh
                        var url = 'http://golampaua.mooo.com/lite/online?id=' + movie.id + '&title=' + encodeURIComponent(title);

                        // Використовуємо тунель, щоб обійти порожню сторінку
                        Lampa.NativeWsClient.send('proxy', { url: url, method: 'GET' }, function(res) {
                            object.loading(false);
                            if (res && res.length) {
                                var items = res.map(function(i) {
                                    return {
                                        title: i.name || i.title || title,
                                        file: i.url || i.video || i.file,
                                        quality: i.quality || 'HD',
                                        info: 'Козак ТВ'
                                    };
                                });
                                object.draw(items, {
                                    onEnter: function(item) {
                                        Lampa.Player.play({url: item.file, title: item.title});
                                    }
                                });
                            } else {
                                object.empty(); // Малює системне вікно "Порожньо"
                            }
                        }, function() {
                            object.loading(false);
                            object.empty();
                            Lampa.Noty.show('Помилка з’єднання. Перевірте Парсер.');
                        });
                    };
                    object.search();
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
