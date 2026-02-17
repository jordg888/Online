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
                
                // Створюємо активність онлайн
                Lampa.Component.add('kozak_online', Lampa.Component.get('online'));
                
                var activity = {
                    title: 'Козак ТВ',
                    component: 'kozak_online',
                    movie: movie,
                    page: 1
                };

                // ВАЖЛИВО: ми не даємо прямий URL, а налаштовуємо джерело так, 
                // як це роблять плагіни, що працюють через bbe.lme.isroot.in
                activity.onRender = function(object) {
                    // Якщо в системі є фільтр, додаємо вибір балансерів
                    if(object.filter) {
                        object.filter.set('source', [
                            {title: 'Усі джерела', source: 'all', selected: true},
                            {title: 'Ashdi (UA)', source: 'ashdi'},
                            {title: 'VideoCDN', source: 'vcdn'}
                        ]);

                        object.filter.onSelect = function(item) {
                            object.search(item.source);
                        };
                    }
                };

                // Формуємо правильний запит до "Бандери"
                activity.url = 'https://bbe.lme.isroot.in/api/v2/search?source=all&title=' + encodeURIComponent(movie.title || movie.name) + '&tmdb_id=' + (movie.id || '');

                Lampa.Activity.push(activity);
            });
        };
    }

    var timer = setInterval(function(){
        if(window.Lampa && Lampa.Component && Lampa.Component.get('online')) {
            clearInterval(timer);
            new KozakTiv().init();
        }
    }, 500);
})();
