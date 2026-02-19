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
            // Створюємо кнопку з максимальною сумісністю стилів
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #27ae60 !important; color: #fff !important; border-radius: 8px; margin-top: 10px; display: flex; align-items: center; justify-content: center; height: 3.5em; cursor: pointer;"><span>КОЗАК ТВ</span></div>');
            
            btn.on('click', function () {
                _this.search(data.movie);
            });

            // Шукаємо куди вставити (перебираємо всі варіанти контейнерів)
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons, .full-start__btns');
            
            if (container.length > 0) {
                container.append(btn);
            } else {
                // Якщо не знайшли спец. контейнер, тулимо після опису
                $(html).find('.full-start__description').after(btn);
            }
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Шукаю на Козаку: ' + title);

            var api_url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            // Використовуємо найнадійніший метод запиту для твоєї збірки
            var network = Lampa.Reguest || Lampa.Network || Lampa.Request;
            
            if (network && typeof network.native === 'function') {
                network.native(api_url, function(res) {
                    var video = res.data ? (res.data.iframe_url || res.data.iframe) : (res.iframe_url || res.iframe);
                    if (video) {
                        if (video.indexOf('//') === 0) video = 'https:' + video;
                        Lampa.Player.play({ url: video, title: title });
                    } else {
                        Lampa.Noty.show('Відео не знайдено в базі');
                    }
                }, function() {
                    Lampa.Noty.show('Помилка запиту до API');
                });
            } else {
                // Резервний метод через прямий AJAX
                $.getJSON(api_url, function(res) {
                    var video = res.data ? (res.data.iframe_url || res.data.iframe) : (res.iframe_url || res.iframe);
                    if (video) {
                        if (video.indexOf('//') === 0) video = 'https:' + video;
                        Lampa.Player.play({ url: video, title: title });
                    }
                }).fail(function() {
                    Lampa.Noty.show('Браузер заблокував запит (CORS)');
                });
            }
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
