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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border-radius: 6px;"><span>КОЗАК ТВ</span></div>');
            btn.on('hover:enter click', function () { _this.search(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            var year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
            
            // Створюємо список джерел для перевірки
            var sources = [
                {
                    name: 'Джерело 1 (Alloha)',
                    url: 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title)
                },
                {
                    name: 'Джерело 2 (VCDN Proxy)',
                    url: 'https://cors.lampac.sh/https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title)
                }
            ];

            Lampa.Select.show({
                title: 'Оберіть канал Козак ТВ',
                items: sources.map(function(s) { return {title: s.name, source: s}; }),
                onSelect: function (item) {
                    _this.fetchData(item.source, title);
                },
                onBack: function () { Lampa.Controller.toggle('content'); }
            });
        };

        this.fetchData = function (source, title) {
            Lampa.Noty.show('Шукаємо відео...');
            var network = new Lampa.Reguest();
            
            network.silent(source.url, function (res) {
                var items = [];
                // Обробка Alloha
                if (res && res.data && res.data.iframe) {
                    items.push({title: res.data.name || title, file: res.data.iframe});
                }
                // Обробка VideoCDN
                var vcdnData = res.data || res;
                if (Array.isArray(vcdnData)) {
                    vcdnData.forEach(function(i) {
                        items.push({title: i.title || title, file: i.iframe_src || i.file});
                    });
                }

                if (items.length) {
                    Lampa.Select.show({
                        title: 'Знайдено відео',
                        items: items.map(function(i) { return {title: i.title, file: i.file}; }),
                        onSelect: function (selected) {
                            var video = selected.file;
                            if (video.indexOf('//') === 0) video = 'https:' + video;
                            Lampa.Player.play({ url: video, title: selected.title });
                        }
                    });
                } else {
                    Lampa.Noty.show('Це джерело не знайшло фільм');
                }
            }, function () {
                Lampa.Noty.show('Помилка з’єднання зі шлюзом');
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
