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
            btn.on('hover:enter click', function () { _this.search(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            // Використовуємо спеціалізований шлюз для обходу гео-блокувань
            var base_url = 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);
            var proxy_url = 'https://api.allorigins.win/get?url=' + encodeURIComponent(base_url);

            Lampa.Select.show({
                title: 'Пошук: ' + title,
                items: [{title: 'Обхід блокування (EU Proxy)...', any: true}],
                onSelect: function() {},
                onBack: function() { Lampa.Controller.toggle('content'); }
            });

            var network = new Lampa.Reguest();
            network.silent(proxy_url, function (res) {
                // allorigins повертає дані у полі contents як рядок
                try {
                    var response = JSON.parse(res.contents);
                    var data = response.data || response;

                    if (data && data.length) {
                        var items = data.map(function (i) {
                            return {
                                title: i.title || title,
                                subtitle: 'Джерело: VideoCDN',
                                file: i.iframe_src || i.file
                            };
                        });

                        Lampa.Select.show({
                            title: 'Знайдено через шлюз',
                            items: items,
                            onSelect: function (item) {
                                var video = item.file;
                                if (video.indexOf('//') === 0) video = 'https:' + video;
                                Lampa.Player.play({ url: video, title: item.title });
                            }
                        });
                    } else {
                        Lampa.Noty.show('Фільм не знайдено в базі');
                        Lampa.Select.close();
                    }
                } catch (e) {
                    Lampa.Noty.show('Помилка дешифрування даних');
                    Lampa.Select.close();
                }
            }, function () {
                Lampa.Noty.show('Сервер у Польщі/Європі не відповідає');
                Lampa.Select.close();
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
