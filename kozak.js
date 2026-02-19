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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #e67e22 !important; color: #fff !important; border-radius: 5px;"><span>UAFLIX (ПРЯМИЙ)</span></div>');
            btn.on('hover:enter click', function () { _this.search(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Спроба прямого підключення...');

            // Використовуємо інший безкоштовний проксі-шлюз, який зазвичай не блокують
            var url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://uaflix.tv/api/films?title=' + title);

            $.getJSON(url, function (data) {
                // allorigins повертає дані в полі contents як рядок
                var res = JSON.parse(data.contents);
                
                if (res && res.length) {
                    var items = res.map(function(i) {
                        return {
                            title: i.title || title,
                            file: i.link || i.iframe
                        };
                    });

                    Lampa.Select.show({
                        title: 'Знайдено на UAFlix',
                        items: items,
                        onSelect: function (item) {
                            Lampa.Player.play({ url: item.file, title: item.title });
                        }
                    });
                } else {
                    Lampa.Noty.show('Фільм не знайдено');
                }
            }).fail(function() {
                Lampa.Noty.show('Прямий доступ заблоковано провайдером');
                // Остання надія - спробувати через внутрішній сокет, який я бачу у тебе в логах (kurwa-bober.ninja)
                _this.trySocket(title);
            });
        };

        this.trySocket = function(title) {
            // Використовуємо той самий сокет, який у тебе працює в логах!
            Lampa.NativeWsClient.send('proxy', {
                url: 'https://uaflix.tv/api/films?title=' + encodeURIComponent(title),
                method: 'GET'
            }, function(res) {
                if (res && res.length) {
                    Lampa.Noty.show('Знайдено через Сокет!');
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
