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
            // Використовуємо Alloha - він часто працює без додаткових шлюзів
            var url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            Lampa.Select.show({
                title: 'Пошук: ' + title,
                items: [{title: 'З'єднуємося з базою...', any: true}],
                onSelect: function() {},
                onBack: function() { Lampa.Controller.toggle('content'); }
            });

            var network = new Lampa.Reguest();
            network.silent(url, function (res) {
                if (res && res.data && res.data.iframe) {
                    var items = [{
                        title: res.data.name || title,
                        subtitle: 'Знав за назвою (ALLOHA)',
                        file: res.data.iframe
                    }];

                    Lampa.Select.show({
                        title: 'Результати знайдено',
                        items: items,
                        onSelect: function (item) {
                            var video = item.file;
                            if (video.indexOf('//') === 0) video = 'https:' + video;
                            Lampa.Player.play({ url: video, title: item.title });
                        }
                    });
                } else {
                    Lampa.Noty.show('База Alloha не знайшла цей фільм');
                    Lampa.Select.close();
                }
            }, function () {
                // Якщо і це не працює - пробуємо останній шанс через інший проксі
                _this.tryBackup(title);
            });
        };

        this.tryBackup = function(title) {
            var backup_url = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + title);
            var network = new Lampa.Reguest();
            network.silent(backup_url, function(res) {
                var data = res.data || res;
                if (data && data.length) {
                    Lampa.Select.show({
                        title: 'Резервний канал',
                        items: data.map(function(i){ return {title: i.title, file: i.iframe_src, subtitle: 'VideoCDN'}; }),
                        onSelect: function(item) { Lampa.Player.play({url: item.file, title: item.title}); }
                    });
                } else {
                    Lampa.Noty.show('Всі шлюзи заблоковані провайдером');
                    Lampa.Select.close();
                }
            }, function() {
                Lampa.Noty.show('Повна блокада мережі');
                Lampa.Select.close();
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
