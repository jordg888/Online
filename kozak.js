(function () {
    'use strict';

    function KozakPlugin() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                var render = e.object.activity.render();
                var container = render.find('.full-start-new__buttons, .full-start__buttons');
                
                if (container.length && !container.find('.kozak-button').length) {
                    var btn = $('<div class="full-start__button selector kozak-button" style="background: #e67e22; color: #fff;"><span>КОЗАК ТВ</span></div>');
                    
                    btn.on('click', function () {
                        openKozakMenu(e.data.movie);
                    });

                    container.append(btn);
                }
            }
        });
    }

    function openKozakMenu(movie) {
        // Створюємо завантажувач
        Lampa.Select.show({
            title: 'Вибір джерела (UA)',
            items: [
                {
                    title: 'Балансер: Енеїда / UA-Kino',
                    subtitle: 'Найкраща якість та озвучка',
                    source: 'vjs'
                },
                {
                    title: 'Балансер: Ashdi',
                    subtitle: 'Тільки українська мова',
                    source: 'ashdi'
                }
            ],
            onSelect: function (item) {
                var url = '';
                if (item.source === 'vjs') {
                    url = 'https://vjs.su/embed/tmdb/' + movie.id;
                } else {
                    url = 'https://ashdi.vip/emb/' + movie.id;
                }

                // Запуск вбудованого iframe плеєра
                Lampa.Component.add('iframe', {
                    title: movie.title || movie.name,
                    url: url,
                    clean: true,
                    onBack: function() {
                        Lampa.Activity.backward();
                    }
                });
            },
            onBack: function () {
                Lampa.Select.close();
            }
        });
    }

    if (window.Lampa) KozakPlugin();
    else window.addEventListener('lampa_ready', KozakPlugin);
})();
