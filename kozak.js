(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        // 1. Ініціалізація: стежимо за відкриттям картки фільму
        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        // 2. Рендеринг кнопки (повертаємо її на екран)
        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove(); // Чистимо старі кнопки
            
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border-radius: 5px; font-weight: bold;"><span>КОЗАК ТВ</span></div>');
            
            btn.on('hover:enter click', function () {
                _this.search(data.movie);
            });
            
            // Додаємо кнопку в блок кнопок на сторінці фільму
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        // 3. Пошук (через просте спливаюче вікно)
        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Шукаємо відео...');

            // Використовуємо Alloha через стабільний проксі, щоб уникнути помилки відтворення
            var url = 'https://cors.lampac.sh/https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            var network = new Lampa.Reguest();
            network.silent(url, function (res) {
                if (res && res.data && res.data.iframe) {
                    var video = res.data.iframe;
                    if (video.indexOf('//') === 0) video = 'https:' + video;

                    Lampa.Select.show({
                        title: 'Знайдено на Козак ТВ',
                        items: [{title: 'Дивитися: ' + title, file: video}],
                        onSelect: function (item) {
                            Lampa.Player.play({
                                url: item.file,
                                title: title
                            });
                        }
                    });
                } else {
                    Lampa.Noty.show('На жаль, відео не знайдено');
                }
            }, function () {
                Lampa.Noty.show('Помилка сервера. Спробуйте пізніше.');
            });
        };
    }

    // Запуск плагіна
    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
