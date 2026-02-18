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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border-radius: 5px;"><span>КОЗАК ТВ</span></div>');
            
            btn.on('hover:enter click', function () {
                _this.search(data.movie);
            });
            
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            // Використовуємо універсальний шлюз, який часто прописаний в check.sh
            var url = 'https://cors.lampac.sh/https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);

            Lampa.Select.show({
                title: 'Пошук: ' + title,
                items: [{title: 'Шукаємо джерела...', any: true}],
                onSelect: function() {},
                onBack: function() { Lampa.Controller.toggle('content'); }
            });

            // Використовуємо вбудований метод Lampa для запитів, він краще обходить CORS
            var network = new Lampa.Reguest();
            network.silent(url, function (res) {
                var items = [];
                var data = res.data || res;

                if (data && data.length) {
                    data.forEach(function (i) {
                        items.push({
                            title: i.title || title,
                            subtitle: 'Якість: ' + (i.quality || '1080p'),
                            file: i.iframe_src || i.file
                        });
                    });

                    Lampa.Select.show({
                        title: 'Знайдено на Козак ТВ',
                        items: items,
                        onSelect: function (item) {
                            // Перевіряємо протокол посилання
                            var video_url = item.file;
                            if (video_url.indexOf('//') === 0) video_url = 'https:' + video_url;
                            
                            Lampa.Player.play({ url: video_url, title: item.title });
                        }
                    });
                } else {
                    Lampa.Noty.show('Бази порожні для цього фільму');
                    Lampa.Select.close();
                }
            }, function () {
                Lampa.Noty.show('Шлюз не відповідає. Спробуйте пізніше.');
                Lampa.Select.close();
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
