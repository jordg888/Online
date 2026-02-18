(function () {
    'use strict';

    var hostkey = 'golampaua.mooo.com';

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
            btn.on('hover:enter click', function () { _this.search(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            
            // Показуємо вікно очікування
            Lampa.Select.show({
                title: 'Пошук: ' + title,
                items: [{title: 'Встановлення захищеного з’єднання...', any: true}],
                onSelect: function() {},
                onBack: function() { Lampa.Controller.toggle('content'); }
            });

            // Використовуємо шлях з твого робочого плагіна
            var url = 'http://' + hostkey + '/lite/online?id=' + movie.id + 
                      '&title=' + encodeURIComponent(title) + 
                      '&original_title=' + encodeURIComponent(movie.original_title || '') +
                      '&year=' + (movie.release_date || '').slice(0,4);

            var network = new Lampa.Reguest();
            
            // Спеціальний заголовок для імітації Lampac-клієнта
            var headers = {
                'X-Kit-AesGcm': Lampa.Storage.get('aesgcmkey', '')
            };

            network.silent(url, function (res) {
                if (res && res.length) {
                    var items = res.map(function (i) {
                        return {
                            title: i.name || i.title || title,
                            subtitle: i.quality || 'HD (UA/RU)',
                            file: i.url || i.video || i.file
                        };
                    });

                    Lampa.Select.show({
                        title: 'Знайдено в мережі Козак ТВ',
                        items: items,
                        onSelect: function (item) {
                            Lampa.Player.play({ url: item.file, title: item.title });
                        }
                    });
                } else {
                    Lampa.Noty.show('На жаль, у захищених базах нічого не знайдено');
                    Lampa.Select.close();
                }
            }, function () {
                Lampa.Noty.show('Помилка тунелювання. Спробуйте ввімкнути Proxy в налаштуваннях.');
                Lampa.Select.close();
            }, false, {headers: headers});
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
