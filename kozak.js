(function () {
    'use strict';

    function KozakTiv() {
        // Можеш замінити це посилання на власну іконку (SVG або PNG)
        var ICON_KOZAK = 'https://yarikrazor-star.github.io/lmp/wiki.svg'; 
        var api_proxy = 'https://vercel-proxy-blue-six.vercel.app/api?url=';

        this.init = function () {
            var _this = this;
            // Слухаємо подію завершення рендеру картки фільму
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    // Невелика затримка для стабільності
                    setTimeout(function() {
                        try {
                            _this.render(e.data, e.object.activity.render());
                        } catch (err) {
                            console.log('Kozak: Error rendering button', err);
                        }
                    }, 200);
                }
            });
            
            // Реєструємо компонент для відображення результатів
            Lampa.Component.add('kozak_search', _this.component);
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var _this = this;
            var container = $(html);
            if (container.find('.lampa-kozak-button').length) return;

            // Створюємо кнопку
            var button = $('<div class="full-start__button selector lampa-kozak-button">' +
                                '<img src="' + ICON_KOZAK + '" style="width: 1.6em; height: 1.6em; margin-right: 5px; object-fit: contain;">' +
                                '<span>Козак ТВ</span>' +
                            '</div>');

            // Шукаємо контейнер для кнопок
            var buttons_container = container.find('.full-start-new__buttons, .full-start__buttons');
            
            // Вставляємо кнопку (наприклад, після другої існуючої кнопки)
            var neighbors = buttons_container.find('.selector');
            if (neighbors.length >= 2) {
                button.insertAfter(neighbors.eq(1));
            } else {
                buttons_container.append(button);
            }

            // Дія при натисканні
            button.on('hover:enter click', function() {
                Lampa.Activity.push({
                    title: 'Козак ТВ',
                    component: 'kozak_search',
                    movie: data.movie,
                    page: 1
                });
            });
        };

        // Компонент, який відкривається при натисканні на кнопку
        this.component = function(object) {
            var network = new Lampa.Reguest();
            var scroll = new Lampa.Scroll({mask: true, over: true});
            var files = new Lampa.Explorer(object);
            
            this.create = function() {
                var _this = this;
                var title = object.movie.title || object.movie.name;
                
                // Твій запит через Vercel
                var search_url = 'https://videocdn.tv/api/movies?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);
                var final_url = api_proxy + encodeURIComponent(search_url);

                Lampa.Select.show({title: 'Шукаємо на Козак ТВ...'});

                network.silent(final_url, function(json) {
                    Lampa.Select.close();
                    if (json.data && json.data.length > 0) {
                        json.data.forEach(function(item) {
                            var card = Lampa.Template.get('button', {title: item.title});
                            card.on('hover:enter', function() {
                                Lampa.Noty.show('Знайдено ID: ' + item.id);
                                // Тут можна викликати плеєр
                            });
                            files.append(card);
                        });
                    } else {
                        files.append(Lampa.Template.get('empty'));
                    }
                    scroll.append(files.render());
                }, function() {
                    Lampa.Select.close();
                    Lampa.Noty.show('Помилка проксі');
                    files.append(Lampa.Template.get('empty'));
                    scroll.append(files.render());
                });

                return scroll.render();
            };

            this.render = function() {
                return this.create();
            };
        };
    }

    // Запуск плагіна
    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
