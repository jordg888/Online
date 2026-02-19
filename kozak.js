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
            // Замість того, щоб шукати самим, ми відкриваємо стандартне вікно пошуку Lampa
            // Але з підставленими параметрами від нашого "Козака"
            Lampa.Component.add('kozak_online', function (object, exam) {
                var network = new Lampa.Reguest();
                var scroll = new Lampa.Scroll({mask: true, over: true});
                var files = new Lampa.Explorer(object);

                object.create = function () {
                    var title = movie.title || movie.name;
                    // Використовуємо універсальний шлях Lampac, який точно працює в Україні
                    var url = 'https://cors.lampac.sh/https://alloha.tv/api/info?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

                    network.silent(url, function (res) {
                        if (res && res.data && res.data.iframe) {
                            var video = res.data.iframe;
                            if (video.indexOf('//') === 0) video = 'https:' + video;
                            
                            // Створюємо елемент списку
                            var card = Lampa.Template.get('online_item', {
                                title: 'Дивитися через Козак ТВ',
                                quality: 'HD'
                            });

                            card.on('hover:enter click', function () {
                                Lampa.Player.play({ url: video, title: title });
                            });

                            scroll.append(card);
                        } else {
                            scroll.append('<div class="empty">На жаль, за прямим посиланням нічого не знайдено. Спробуйте через розділ "Онлайн" у меню.</div>');
                        }
                        object.loading(false);
                    }, function () {
                        object.loading(false);
                        Lampa.Noty.show('Помилка сервера. Спробуйте змінити Парсер у налаштуваннях.');
                    });

                    return scroll.render();
                };
            });

            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'kozak_online',
                movie: movie,
                page: 1
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
