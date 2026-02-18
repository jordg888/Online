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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border: 1px solid #fff;"><span>КОЗАК ТВ</span></div>');
            btn.on('hover:enter click', function () { _this.open(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.open = function (movie) {
            var title = movie.title || movie.name;
            
            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online', // Використовуємо системний компонент, але з нашим тунелем
                movie: movie,
                page: 1,
                onRender: function(object) {
                    object.search = function() {
                        object.loading(true);
                        
                        // Параметри запиту до робочого шлюзу з твого прикладу
                        var url = 'http://golampaua.mooo.com/lite/online';
                        var query = '?id=' + movie.id + '&title=' + encodeURIComponent(title) + '&year=' + (movie.release_date || '').slice(0,4);

                        // Використовуємо NativeWsClient - це "бронебійний" метод
                        Lampa.NativeWsClient.send('proxy', {
                            url: url + query,
                            method: 'GET'
                        }, function(res) {
                            if (res && res.length) {
                                var items = res.map(function(i) {
                                    return {
                                        title: i.name || i.title || title,
                                        file: i.url || i.video || i.file,
                                        quality: i.quality || 'HD',
                                        info: 'UA/INT'
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
                        }, function() {
                            Lampa.Noty.show('Тунель заблоковано. Увімкніть Proxy в налаштуваннях Лампи!');
                            object.loading(false);
                        });
                    };
                    object.search();
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
