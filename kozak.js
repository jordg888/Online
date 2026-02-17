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
                // ПЕРЕЛОМНИЙ МОМЕНТ: 
                // Ми не даємо посилання, ми викликаємо внутрішній пошук Лампи через робочий балансер
                Lampa.Component.add('kozak_online', Lampa.Component.get('online'));
                
                var movie = data.movie;
                var url = 'https://api.vokino.tv/v2/online'; // Використовуємо стабільне API Vokino

                Lampa.Activity.push({
                    title: 'Козак ТВ',
                    component: 'kozak_online',
                    movie: movie,
                    page: 1,
                    url: url
                });
            });
        };
    }

    // Чекаємо, поки Лампа повністю завантажиться, щоб підключити всі модулі
    var timer = setInterval(function(){
        if(window.Lampa && Lampa.Component) {
            clearInterval(timer);
            new KozakTiv().init();
        }
    }, 500);
})();
