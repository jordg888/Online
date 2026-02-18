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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important;"><span>КОЗАК ТВ</span></div>');
            
            btn.on('hover:enter click', function () {
                _this.search(data.movie);
            });
            
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            // Використовуємо дзеркала, які перевіряє ваш скрипт check.sh
            var url = 'https://corsproxy.io/?' + encodeURIComponent('https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + title);

            Lampa.Select.show({
                title: 'Пошук: ' + title,
                items: [{title: 'Зачекайте, шукаємо в базах...', any: true}],
                onSelect: function() {},
                onBack: function() { Lampa.Controller.toggle('content'); }
            });

            $.ajax({
                url: url,
                method: 'GET',
                success: function (res) {
                    var items = [];
                    var data = res.data || res;

                    if (data && data.length) {
                        data.forEach(function (i) {
                            items.push({
                                title: i.title || title,
                                subtitle: i.quality || '1080p',
                                file: i.iframe_src || i.file
                            });
                        });

                        Lampa.Select.show({
                            title: 'Результати Козак ТВ',
                            items: items,
                            onSelect: function (item) {
                                Lampa.Player.play({ url: item.file, title: item.title });
                            }
                        });
                    } else {
                        Lampa.Noty.show('Нічого не знайдено на VideoCDN');
                    }
                },
                error: function () {
                    Lampa.Noty.show('Помилка з’єднання з сервером');
                }
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
