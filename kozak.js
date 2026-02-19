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
            // Яскраво-жовта кнопка для привернення уваги
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #f1c40f !important; color: #000 !important; border-radius: 8px; margin-top: 10px; display: flex; align-items: center; justify-content: center; height: 3.5em; cursor: pointer; font-weight: bold;"><span>КОЗАК ТВ: FORCE START</span></div>');
            
            btn.on('click', function () {
                _this.search(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons, .full-start__btns');
            if (container.length > 0) container.append(btn);
            else $(html).find('.full-start__description').after(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            // Використовуємо пряме посилання на плеєр, яке зазвичай обходить SES
            var video_url = 'https://vjs.su/embed/tmdb/' + movie.id;

            Lampa.Noty.show('Обхід захисту SES...');

            // Замість компонента iframe, створюємо пряму команду на відкриття
            var activity = Lampa.Activity.active();
            
            Lampa.Component.add('iframe', {
                title: 'Козак ТВ: ' + title,
                url: video_url,
                clean: true,
                onBack: function(){
                    Lampa.Activity.backward();
                }
            });
            
            // Додатково пробуємо "проштовхнути" фокус, якщо SES його блокує
            setTimeout(function(){
                Lampa.Controller.toggle('content');
            }, 500);
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
