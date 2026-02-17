(function () {
    'use strict';

    function startKozak() {
        // 1. Слухаємо відкриття картки фільму
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                // Видаляємо стару кнопку, якщо вона є
                $('.lampa-kozak-btn').remove();

                // 2. Створюємо нову кнопку
                var button = $('<div class="full-start__button selector lampa-kozak-btn"><span>Козак ТВ</span></div>');

                // 3. Логіка натискання
                button.on('hover:enter click', function () {
                    var movie = e.data.movie;
                    
                    // Відкриваємо вікно онлайн
                    Lampa.Activity.push({
                        title: 'Козак ТВ',
                        component: 'online',
                        movie: movie,
                        page: 1,
                        onRender: function(object) {
                            // --- ТУТ МЕХАНІКА ФІЛЬТРІВ ---
                            // Створюємо кнопку "Джерело" зверху
                            object.filter.set('source', [
                                {title: 'Ashdi', source: 'ashdi', selected: true},
                                {title: 'VideoCDN', source: 'vcdn'}
                            ]);

                            // Що робити, коли змінили фільтр
                            object.filter.onSelect = function(item) {
                                object.search(item.source);
                            };

                            // Функція пошуку контенту
                            object.search = function(source) {
                                object.loading(true);
                                var src = source || 'ashdi';
                                var url = src === 'ashdi' 
                                    ? 'https://ashdi.vip/api/video?title=' 
                                    : 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';
                                
                                // Використовуємо надійний CORS шлюз
                                var final_url = 'https://corsproxy.io/?' + encodeURIComponent(url + encodeURIComponent(movie.title || movie.name));

                                $.ajax({
                                    url: final_url,
                                    method: 'GET',
                                    dataType: 'json',
                                    success: function(res) {
                                        var data = res.data || res;
                                        if (data && data.length) {
                                            var items = data.map(function(i) {
                                                return {
                                                    title: i.title || movie.title,
                                                    file: i.file || i.iframe_src || i.url,
                                                    quality: i.quality || 'HD'
                                                };
                                            });
                                            object.draw(items, {
                                                onEnter: function(item) {
                                                    Lampa.Player.play({url: item.file, title: item.title});
                                                }
                                            });
                                        } else {
                                            object.empty();
                                        }
                                        object.loading(false);
                                    },
                                    error: function() {
                                        object.doesNotAnswer();
                                    }
                                });
                            };

                            // Запускаємо перший пошук
                            object.search();
                        }
                    });
                });

                // 4. Додаємо кнопку в інтерфейс
                $(e.object.activity.render()).find('.full-start-new__buttons, .full-start__buttons').append(button);
            }
        });
    }

    // Запуск плагіна
    if (window.Lampa) {
        startKozak();
    }
})();
