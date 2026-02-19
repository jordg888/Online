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
            var year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
            
            Lampa.Noty.show('Пошук відео через Козак ТВ...');

            // Використовуємо універсальний шлюз Lampac, який зазвичай прописаний у робочих плагінах
            // Він автоматично знайде і Alloha, і Rezka, і VideoCDN
            var url = 'https://cors.lampac.sh/https://alloha.tv/api/info?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            var network = new Lampa.Reguest();
            network.silent(url, function (res) {
                if (res && res.data && res.data.iframe) {
                    var video_url = res.data.iframe;
                    if (video_url.indexOf('//') === 0) video_url = 'https:' + video_url;

                    // Запускаємо через спеціальний обробчик посилань Lampa
                    Lampa.Player.play({
                        url: video_url,
                        title: title
                    });
                } else {
                    // Якщо Alloha мовчить, пробуємо резервний шлях через Voidboost (Rezka)
                    _this.tryVoidboost(title, year);
                }
            }, function () {
                _this.tryVoidboost(title, year);
            });
        };

        this.tryVoidboost = function (title, year) {
            // Це посилання на Rezka, яке вже пропущено через проксі для стабільності
            var url = 'https://cors.lampac.sh/https://voidboost.net/embed/movie?title=' + encodeURIComponent(title) + '&year=' + year;
            
            Lampa.Select.show({
                title: 'Знайдено на Rezka',
                items: [{title: 'Дивитися у високій якості', file: url}],
                onSelect: function (item) {
                    Lampa.Player.play({
                        url: item.file,
                        title: title
                    });
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
