(function () {
    'use strict';

    function Kozak(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({mask: true, over: true});
        var files = new Lampa.Explorer(object);
        var api_proxy = 'https://vercel-proxy-blue-six.vercel.app/api?url=';
        
        this.create = function () {
            var _this = this;
            var title = object.movie.title || object.movie.name;
            
            // Формуємо запит до балансера через твій Vercel
            // Використовуємо VideoCDN як базовий приклад
            var search_url = 'https://videocdn.tv/api/movies?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);
            var final_url = api_proxy + encodeURIComponent(search_url);

            this.loading(true);

            network.silent(final_url, function (json) {
                _this.loading(false);
                if (json.data && json.data.length > 0) {
                    json.data.forEach(function (item) {
                        var card = Lampa.Template.get('button', {title: item.title});
                        
                        card.on('hover:enter', function () {
                            Lampa.Noty.show('Посилання знайдено: ' + item.title);
                            // Тут можна викликати плеєр Lampa
                        });
                        
                        files.append(card);
                    });
                } else {
                    files.append(Lampa.Template.get('empty'));
                }
                scroll.append(files.render());
            }, function () {
                _this.loading(false);
                Lampa.Noty.show('Помилка сервера Vercel');
                files.append(Lampa.Template.get('empty'));
                scroll.append(files.render());
            });

            return scroll.render();
        };

        this.loading = function (status) {
            if (status) Lampa.Select.show({title: 'Пошук на Козак ТВ...'});
            else Lampa.Select.close();
        };

        this.render = function () {
            return this.create();
        };
    }

    // Головна функція ініціалізації
    function startPlugin() {
        // Реєструємо компонент
        Lampa.Component.add('kozak_online', Kozak);

        // Додаємо кнопку в картку фільму (метод з оригіналу)
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'render') {
                var button = $('<div class="full-start__button selector"><span>Козак ТВ</span></div>');
                
                button.on('hover:enter', function () {
                    Lampa.Activity.push({
                        title: 'Козак ТВ',
                        component: 'kozak_online',
                        movie: e.object.movie,
                        page: 1
                    });
                });

                // Вставляємо кнопку в блок кнопок
                var container = e.render.find('.full-start__buttons');
                if (container.length) {
                    container.append(button);
                }
            }
        });
    }

    // Очікуємо завантаження системи
    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') startPlugin();
    });

})();
