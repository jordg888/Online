(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border: 2px solid #fff;"><span>КОЗАК ТВ</span></div>');
            btn.on('hover:enter click', function () { _this.search(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            var clean_title = title.replace(/[:]/g, '');
            
            Lampa.Noty.show('Пошук на Козак ТВ...');

            // Використовуємо Alloha як основне джерело (воно стабільніше для плеєра)
            var url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(clean_title);

            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (res) {
                    var items = [];
                    
                    if (res && res.data && res.data.iframe) {
                        items.push({
                            title: 'Дивитися (Канал 1)',
                            subtitle: 'Якість: Авто',
                            file: res.data.iframe
                        });
                    }

                    // Додаємо Rezka як Канал 2 через спеціальний шлюз
                    items.push({
                        title: 'Дивитися (Канал 2)',
                        subtitle: 'Джерело: Rezka',
                        file: 'https://voidboost.net/embed/movie?title=' + encodeURIComponent(clean_title)
                    });

                    Lampa.Select.show({
                        title: 'Оберіть канал для: ' + title,
                        items: items,
                        onSelect: function (item) {
                            var video = item.file;
                            if (video.indexOf('//') === 0) video = 'https:' + video;
                            
                            // Використовуємо Lampa.Player.play з додатковими параметрами
                            Lampa.Player.play({
                                url: video,
                                title: title,
                                // Додаємо цей блок, щоб плеєр не вибивав помилку
                                callback: function() {
                                    Lampa.Controller.toggle('player');
                                }
                            });
                        }
                    });
                },
                error: function () {
                    Lampa.Noty.show('Помилка з’єднання з базою');
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
