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
                    }, 200);
                }
            });
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var _this = this;
            // Створюємо кнопку в стилі "Козак ТВ"
            var button = $('<div class="full-start__button selector lampa-kozak-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:10px;vertical-align:middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#ffde1a"/></svg><span style="vertical-align:middle;">Козак ТВ (UA)</span></div>');
            
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);

            button.on('hover:enter click', function() {
                // Виклик системного вікна з повною підтримкою балансерів
                Lampa.Activity.push({
                    title: 'Козак ТВ',
                    component: 'online', 
                    movie: data.movie,
                    page: 1,
                    // Використовуємо універсальний шлюз, який обходить блокування
                    url: 'https://corsproxy.io/?' + encodeURIComponent('https://api.vokino.tv/v2/online')
                });
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
