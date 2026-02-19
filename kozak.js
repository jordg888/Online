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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #e67e22 !important; color: #fff !important; border-radius: 8px; margin-top: 10px; display: flex; align-items: center; justify-content: center; height: 3.5em; cursor: pointer;"><span>КОЗАК ТВ: ГРАТИ</span></div>');
            
            btn.on('click', function () {
                _this.search(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons, .full-start__btns');
            if (container.length > 0) container.append(btn);
            else $(html).find('.full-start__description').after(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            // Створюємо пряме посилання на віджет Kinobox
            // Це найнадійніший спосіб, який не блокується по CORS
            var kinobox_url = 'https://kinobox.tv/embed/tmdb/' + movie.id;

            Lampa.Noty.show('Запускаю Козак-Плеєр...');

            // Викликаємо вбудований плеєр Lampa з посиланням на віджет
            Lampa.Player.play({
                url: kinobox_url,
                title: title
            });
            
            // На випадок, якщо потрібен вибір джерела всередині плеєра
            Lampa.Noty.show('Якщо не вантажить, перевірте з\'єднання');
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
