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
            var clean_title = title.replace(/[:]/g, ''); // Деякі бази не люблять двокрапки
            
            Lampa.Noty.show('Пошук у базах...');

            // Використовуємо Alloha через corsproxy, оскільки ти кажеш, що проксі не потрібен
            var url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(clean_title);

            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                timeout: 5000,
                success: function (res) {
                    if (res && res.data && res.data.iframe) {
                        var items = [{
                            title: res.data.name || title,
                            subtitle: 'Якість: HD',
                            file: res.data.iframe
                        }];

                        Lampa.Select.show({
                            title: 'Знайдено на Козак ТВ',
                            items: items,
                            onSelect: function (item) {
                                var video = item.file;
                                if (video.indexOf('//') === 0) video = 'https:' + video;
                                Lampa.Player.play({ url: video, title: item.title });
                            }
                        });
                    } else {
                        // Якщо Alloha не знайшла, спробуємо резерв (Rezka) через прямий плеєр
                        _this.playDirect(clean_title);
                    }
                },
                error: function () {
                    _this.playDirect(clean_title);
                }
            });
        };

        this.playDirect = function(title) {
            var rezka_url = 'https://voidboost.net/embed/movie?title=' + encodeURIComponent(title);
            Lampa.Select.show({
                title: 'Резервне джерело',
                items: [{title: 'Дивитися на Rezka', file: rezka_url}],
                onSelect: function(item) {
                    Lampa.Player.play({ url: item.file, title: title });
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
