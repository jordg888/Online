(function () {
    'use strict';

    console.log('Kozak:', 'Скрипт запущено, версія 3.1.6');

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            console.log('Kozak:', 'Ініціалізація слухача...');
            Lampa.Listener.follow('full', function (e) {
                console.log('Kozak:', 'Подія full спрацювала:', e.type);
                if (e.type === 'complite' || e.type === 'ready') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            console.log('Kozak:', 'Малюю кнопку для:', data.movie.title || data.movie.name);
            $('.lampa-kozak-btn').remove();
            
            // Спробуємо додати в різні місця, щоб точно спрацювало
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #27ae60 !important; color: #fff !important; margin-top: 10px; border-radius: 5px; text-align: center; padding: 10px; cursor: pointer;"><span>КОЗАК ТВ (SOCKET)</span></div>');
            
            btn.on('click', function () {
                console.log('Kozak:', 'КНОПКУ НАТИСНУТО!');
                _this.search(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons, .full-start__btns');
            if (container.length > 0) {
                container.append(btn);
                console.log('Kozak:', 'Кнопку додано в контейнер');
            } else {
                console.log('Kozak:', 'Контейнер для кнопок не знайдено! Пробую додати в кінець сторінки.');
                $(html).append(btn);
            }
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Шукаю через UAFlix...');

            // Використовуємо UAFlix через твій робочий сокет
            var api_url = 'https://uaflix.tv/api/films?title=' + encodeURIComponent(title);
            console.log('Kozak:', 'Запит до UAFlix через сокет:', api_url);

            Lampa.NativeWsClient.send('proxy', {
                url: api_url,
                method: 'GET'
            }, function(res) {
                console.log('Kozak:', 'Відповідь від сокета:', res);
                if (res && res.length) {
                    var items = res.map(function(i) {
                        return {
                            title: i.title || title,
                            file: i.link || i.iframe
                        };
                    });

                    Lampa.Select.show({
                        title: 'UAFlix Результати',
                        items: items,
                        onSelect: function (item) {
                            console.log('Kozak:', 'Граю файл:', item.file);
                            Lampa.Player.play({ url: item.file, title: item.title });
                        }
                    });
                } else {
                    Lampa.Noty.show('UAFlix: Нічого не знайдено');
                }
            }, function(err) {
                console.error('Kozak Socket Error:', err);
                Lampa.Noty.show('Помилка сокета');
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    } else {
        console.error('Kozak:', 'Lampa не знайдена!');
    }
})();
