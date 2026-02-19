(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite' || e.type === 'ready') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #27ae60 !important; color: #fff !important; border-radius: 5px; margin-top: 10px;"><span>КОЗАК ТВ</span></div>');
            
            btn.on('click', function () {
                _this.search(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.length > 0) container.append(btn);
            else $(html).append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Шукаю через ' + title + '...');

            var api_url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            // Шукаємо робочий метод запиту в надрах Лампи
            // Спробуємо по черзі всі відомі варіанти
            var network = Lampa.Network || Lampa.Reguest || Lampa.Request;
            var sendNative = network ? (network.native || network.get) : null;

            if (typeof sendNative === 'function') {
                sendNative(api_url, function(res) {
                    console.log('Kozak: Знайдено!', res);
                    var video_url = res.data ? (res.data.iframe_url || res.data.iframe) : (res.iframe_url || res.iframe);

                    if (video_url) {
                        if (video_url.indexOf('//') === 0) video_url = 'https:' + video_url;
                        Lampa.Player.play({ url: video_url, title: title });
                    } else {
                        Lampa.Noty.show('Відео не знайдено');
                    }
                }, function() {
                    Lampa.Noty.show('Помилка мережі (API)');
                });
            } else {
                // Якщо Лампа забарикадувала всі двері, спробуємо старий добрий jQuery (але може бути CORS)
                console.log('Kozak: Використовую запасний метод (jQuery)');
                $.ajax({
                    url: api_url,
                    dataType: 'json',
                    success: function(res) {
                        var video_url = res.data ? (res.data.iframe_url || res.data.iframe) : (res.iframe_url || res.iframe);
                        if (video_url) {
                            if (video_url.indexOf('//') === 0) video_url = 'https:' + video_url;
                            Lampa.Player.play({ url: video_url, title: title });
                        }
                    },
                    error: function() {
                        Lampa.Noty.show('Не вдалося виконати запит');
                    }
                });
            }
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
