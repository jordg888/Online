(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            // Слухаємо відкриття картки фільму
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite' || e.type === 'ready') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            
            // Створюємо кнопку в стилі Лампи
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #27ae60 !important; color: #fff !important; border-radius: 5px; margin-top: 10px;"><span>КОЗАК ТВ</span></div>');
            
            btn.on('click', function () {
                console.log('Kozak:', 'Пошук відео для:', data.movie.title || data.movie.name);
                _this.search(data.movie);
            });

            // Додаємо кнопку до загального блоку
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.length > 0) {
                container.append(btn);
            } else {
                $(html).append(btn);
            }
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Шукаю на серверах...');

            // Використовуємо Alloha API через native-запит
            // Він автоматично пройде через твій робочий сокет kurwa-bober
            var api_url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

            Lampa.Reguest.native(api_url, function(res) {
                console.log('Kozak: Відповідь отримана', res);
                
                var video_url = "";
                if (res.data) {
                    video_url = res.data.iframe_url || res.data.iframe;
                }

                if (video_url) {
                    // Якщо посилання починається з //, додаємо https:
                    if (video_url.indexOf('//') === 0) video_url = 'https:' + video_url;
                    
                    Lampa.Noty.show('Запускаю плеєр...');
                    Lampa.Player.play({
                        url: video_url,
                        title: title
                    });
                } else {
                    Lampa.Noty.show('Відео не знайдено');
                }
            }, function(err) {
                console.error('Kozak Error:', err);
                Lampa.Noty.show('Помилка запиту');
            });
        };
    }

    // Запуск плагіна
    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
