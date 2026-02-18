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
            var original = movie.original_title || movie.original_name || title;
            
            Lampa.Noty.show('Шукаємо на Rezka та Alloha...');

            // Використовуємо комбінований пошук (Українська + Англійська назви)
            var url = 'https://cors.lampac.sh/https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title) + '&origname=' + encodeURIComponent(original);

            var network = new Lampa.Reguest();
            network.silent(url, function (res) {
                if (res && res.data && res.data.iframe) {
                    var video = res.data.iframe;
                    if (video.indexOf('//') === 0) video = 'https:' + video;
                    
                    Lampa.Player.play({
                        url: video,
                        title: res.data.name || title
                    });
                } else {
                    // Якщо Alloha мовчить, пробуємо Rezka через інший шлюз
                    _this.tryRezka(title, original);
                }
            }, function () {
                _this.tryRezka(title, original);
            });
        };

        this.tryRezka = function(title, original) {
            // Спроба через Rezka (найпопулярніше в UA)
            var rezka_url = 'https://cors.lampac.sh/https://voidboost.net/embed/movie?title=' + encodeURIComponent(title);
            var network = new Lampa.Reguest();
            network.silent(rezka_url, function(res) {
                // Rezka часто повертає просто iframe, тому перевіряємо наявність тексту
                if (res && res.indexOf('iframe') > -1) {
                    Lampa.Player.play({ url: rezka_url, title: title });
                } else {
                    Lampa.Noty.show('Фільм не знайдено в жодній базі');
                }
            }, function() {
                Lampa.Noty.show('Помилка мережі. Перевірте проксі у Лампі.');
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
