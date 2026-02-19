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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #3498db !important; color: #fff !important; border-radius: 5px;"><span>UAFLIX ТВ</span></div>');
            
            btn.on('hover:enter click', function () {
                _this.search(data.movie);
            });
            
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('З’єднання з UAFlix...');

            // Використовуємо UAFlix через проксі для стабільності
            var url = 'https://cors.lampac.sh/https://uaflix.tv/api/films?title=' + encodeURIComponent(title);

            var network = new Lampa.Reguest();
            network.silent(url, function (res) {
                // UAFlix зазвичай повертає масив об'єктів
                if (res && res.length) {
                    var items = res.map(function(i) {
                        return {
                            title: i.title || title,
                            subtitle: i.quality || '720p/1080p',
                            file: i.link || i.iframe || i.file
                        };
                    });

                    Lampa.Select.show({
                        title: 'Результати UAFlix',
                        items: items,
                        onSelect: function (item) {
                            var video = item.file;
                            if (video.indexOf('//') === 0) video = 'https:' + video;
                            Lampa.Player.play({ url: video, title: item.title });
                        }
                    });
                } else {
                    Lampa.Noty.show('UAFlix: Фільм не знайдено');
                }
            }, function (err) {
                // Виводимо конкретну помилку в сповіщення
                console.log('Kozak Error:', err);
                Lampa.Noty.show('Помилка UAFlix: ' + (err.status || 'Мережа'));
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
