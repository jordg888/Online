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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #27ae60 !important; color: #fff !important; border-radius: 5px; margin-top: 10px; width: 100%; text-align: center;"><span>КОЗАК ТВ</span></div>');
            
            btn.on('click', function () {
                _this.search(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.length > 0) container.append(btn);
            else $(html).append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Шукаю: ' + title);

            // Використовуємо https протокол обов'язково
            var api_url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            // Використовуємо Lampa.Reguest.native як основний метод, бо він вже у тебе "завівся"
            // Але додаємо обробку помилки блокування
            if (window.Lampa && Lampa.Reguest && Lampa.Reguest.native) {
                Lampa.Reguest.native(api_url, function(res) {
                    var video = res.data ? (res.data.iframe_url || res.data.iframe) : (res.iframe_url || res.iframe);
                    if (video) {
                        if (video.indexOf('//') === 0) video = 'https:' + video;
                        Lampa.Player.play({ url: video, title: title });
                    } else {
                        Lampa.Noty.show('Нічого не знайдено');
                    }
                }, function(err) {
                    // Якщо ERR_BLOCKED_BY_CLIENT, показуємо підказку
                    console.error('Kozak Blocked:', err);
                    Lampa.Noty.show('Запит заблоковано браузером. Вимкніть AdBlock');
                });
            }
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
