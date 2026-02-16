(function () {
    'use strict';

    function KozakComponent(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({mask: true, over: true});
        var files = new Lampa.Explorer(object);
        var api_url = 'https://vercel-proxy-blue-six.vercel.app/api?url=';
        
        this.create = function () {
            var _this = this;
            var movie = object.movie;
            var title = movie.title || movie.name;
            var movie_title = encodeURIComponent(title);
            
            // Тестовий запит до VideoCDN через твій проксі
            var search_url = 'https://videocdn.tv/api/movies?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + movie_title;
            var final_url = api_url + encodeURIComponent(search_url);

            this.loading(true);

            network.silent(final_url, function (json) {
                _this.loading(false);
                if (json.data && json.data.length > 0) {
                    json.data.forEach(function (item) {
                        var card = Lampa.Template.get('button', {title: item.title});
                        card.on('hover:enter', function () {
                            Lampa.Noty.show('Знайдено: ' + item.title);
                        });
                        files.append(card);
                    });
                } else {
                    files.append(Lampa.Template.get('empty'));
                }
                scroll.append(files.render());
            }, function () {
                _this.loading(false);
                Lampa.Noty.show('Помилка проксі Vercel');
                files.append(Lampa.Template.get('empty'));
                scroll.append(files.render());
            });

            return scroll.render();
        };

        this.loading = function (status) {
            if (status) Lampa.Select.show({title: 'Пошук...'});
            else Lampa.Select.close();
        };

        this.render = function () {
            return this.create();
        };
    }

    function startKozak() {
        console.log('Kozak Plugin: Ready');
        
        // Реєструємо компонент
        Lampa.Component.add('kozak_plugin', KozakComponent);

        // Слухаємо відкриття картки фільму
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'render') {
                var btn = $('<div class="full-start__button selector"><span>Козак ТВ</span></div>');
                
                btn.on('hover:enter', function () {
                    Lampa.Activity.push({
                        title: 'Козак ТВ',
                        component: 'kozak_plugin',
                        movie: e.object.movie,
                        page: 1
                    });
                });

                // Додаємо в початок списку кнопок
                e.render.find('.full-start__buttons').append(btn);
            }
        });
    }

    // Запуск
    if (window.appready) startKozak();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') startKozak(); });

})();
