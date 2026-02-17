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
                    }, 400);
                }
            });
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var _this = this;
            // Створюємо кнопку Козак ТВ
            var button = $('<div class="full-start__button selector lampa-kozak-button" style="border: 1px solid #ffde1a !important; background: rgba(255, 222, 26, 0.1) !important;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:10px;vertical-align:middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="#ffde1a"/></svg><span style="vertical-align:middle; font-weight: bold; color: #ffde1a;">КОЗАК ТВ</span></div>');
            
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);

            button.on('hover:enter click', function() {
                // ШУКАЄМО РОБОЧИЙ ПЛАГІН
                // Зазвичай Bandera реєструє себе в системі як 'online' або через спеціальний Listener
                var found = false;
                
                // Спроба 1: Виклик через стандартний компонент, але з міткою Bandera
                if (Lampa.Component.get('online')) {
                    Lampa.Activity.push({
                        title: 'Козак ТВ',
                        component: 'online',
                        movie: data.movie,
                        page: 1,
                        source: 'bandera' // Деякі версії розуміють це як сигнал працювати через цей шлюз
                    });
                    found = true;
                }

                // Спроба 2: Якщо перша не спрацювала, імітуємо натискання на кнопку "Онлайн"
                if (!found) {
                    var online_btn = $(html).find('.full-start__button').filter(function() {
                        return $(this).text().toLowerCase().indexOf('онлайн') > -1 || $(this).text().toLowerCase().indexOf('bandera') > -1;
                    });
                    
                    if (online_btn.length) {
                        online_btn.trigger('click');
                    } else {
                        Lampa.Noty.show('Будь ласка, увімкніть плагін Bandera в налаштуваннях');
                    }
                }
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
