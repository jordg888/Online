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
            btn.on('hover:enter click', function () { _this.search(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('З’єднуємося через резервний шлюз...');

            // Використовуємо пряме посилання на плеєр-балансер (Voidboost/Rezka)
            // Це джерело найменше блокується в Україні
            var video_url = 'https://voidboost.net/embed/movie?title=' + encodeURIComponent(title);
            
            // Замість складних перевірок, ми одразу кажемо Лампі: "Грай це"
            // Внутрішній плеєр сам спробує "пробити" шлях
            Lampa.Player.play({
                url: video_url,
                title: title
            });

            // Паралельно перевіряємо Alloha через інший проксі, якщо Rezka не піде
            setTimeout(function() {
                var alt_url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);
                var network = new Lampa.Reguest();
                network.silent(alt_url, function(res) {
                    if (res && res.data && res.data.iframe) {
                        Lampa.Noty.show('Знайдено додаткове джерело!');
                    }
                });
            }, 2000);
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
