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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #8e44ad !important; color: #fff !important; border-radius: 8px; margin-top: 10px; display: flex; align-items: center; justify-content: center; height: 3.5em; cursor: pointer;"><span>КОЗАК ТВ: COLLAPS</span></div>');
            
            btn.on('click', function () {
                _this.search(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons, .full-start__btns');
            if (container.length > 0) container.append(btn);
            else $(html).find('.full-start__description').after(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            
            // Collaps часто працює без VPN і блокувань
            var video_url = 'https://api.mdb.to/embed/tmdb/' + movie.id;

            Lampa.Noty.show('Запит до Collaps...');

            Lampa.Component.add('iframe', {
                title: 'Козак ТВ: ' + title,
                url: video_url,
                clean: true
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
