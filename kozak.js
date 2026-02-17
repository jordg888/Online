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
            var button = $('<div class="full-start__button selector lampa-kozak-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:10px;vertical-align:middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#ffde1a"/></svg><span style="vertical-align:middle;">Козак ТВ (UA)</span></div>');
            
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);

            button.on('hover:enter click', function() {
                var movie = data.movie;
                
                // Вказуємо Лампі використовувати стандартний компонент онлайн
                var component = Lampa.Storage.get('online_component', 'online');
                
                Lampa.Activity.push({
                    title: 'Козак ТВ: ' + (movie.title || movie.name),
                    component: component,
                    movie: movie,
                    page: 1,
                    // Ми використовуємо ПРЯМИЙ вхід у базу BanderaOnline через їхній API-шлюз
                    url: 'https://bbe.lme.isroot.in/api/v2/search?source=all&tmdb_id=' + (movie.id || '') + '&title=' + encodeURIComponent(movie.title || movie.name)
                });
            });
        };
    }

    // Чекаємо готовності системи
    var timer = setInterval(function(){
        if(window.Lampa && Lampa.Component) {
            clearInterval(timer);
            new KozakTiv().init();
        }
    }, 500);
})();
