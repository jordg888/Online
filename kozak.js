(function () {
    'use strict';

    function KozakPlugin() {
        var _this = this;

        this.init = function () {
            // Підписуємось на відкриття картки фільму
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite' || e.type === 'ready') {
                    _this.addButton(e.data, e.object.activity.render());
                }
            });
        };

        this.addButton = function (data, html) {
            // Очищуємо стару кнопку, якщо вона була
            $(html).find('.kozak-button').remove();

            // Створюємо стандартну кнопку Lampa
            var btn = $('<div class="full-start__button selector kozak-button"><span>КОЗАК ТВ</span></div>');

            btn.on('click', function () {
                _this.openPlayer(data.movie);
            });

            // Шукаємо контейнер для кнопок (сумісність з різними версіями)
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.length) {
                container.append(btn);
            } else {
                $(html).find('.full-start__description').after(btn);
            }
        };

        this.openPlayer = function (movie) {
            // Формуємо URL плеєра (TMDB ID)
            var video_url = 'https://vjs.su/embed/tmdb/' + movie.id;

            // Використовуємо вбудований метод Lampa для відкриття iframe
            // Це найнадійніший спосіб, який підтримується всіма версіями
            Lampa.Component.add('iframe', {
                title: 'Козак ТВ: ' + (movie.title || movie.name),
                url: video_url,
                clean: true,
                onBack: function() {
                    Lampa.Activity.backward();
                }
            });
        };
    }

    // Запуск плагіна
    if (window.Lampa) {
        var kozak = new KozakPlugin();
        kozak.init();
    }
})();
