(function () {
    'use strict';

    function KozakTiv() {
        this.init = function () {
            var _this = this;
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    setTimeout(function() {
                        _this.render(e.data, e.object.activity.render());
                    }, 300);
                }
            });
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var _this = this;
            var button = $('<div class="full-start__button selector lampa-kozak-button" style="background: #ffde1a !important; color: #000 !important;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:10px;vertical-align:middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#000"/></svg><span style="vertical-align:middle; font-weight: bold;">ДИВИТИСЬ (КОЗАК ТВ)</span></div>');
            
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);

            button.on('hover:enter click', function() {
                var movie = data.movie;
                // Викликаємо системний онлайн-компонент
                Lampa.Component.add('kozak_online', Lampa.Component.get('online'));
                
                Lampa.Activity.push({
                    title: 'Козак ТВ',
                    component: 'kozak_online',
                    movie: movie,
                    page: 1,
                    // Використовуємо стабільний універсальний шлюз
                    url: 'https://vokino.tv/api/v2/online'
                });
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
