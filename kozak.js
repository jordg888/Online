(function () {
    'use strict';

    function KozakPlugin() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                var render = e.object.activity.render();
                var container = render.find('.full-start-new__buttons, .full-start__buttons');
                
                if (container.length && !container.find('.kozak-button').length) {
                    var btn = $('<div class="full-start__button selector kozak-button" style="background: #e67e22; color: #fff; margin-bottom: 10px;"><span>КОЗАК ТВ</span></div>');
                    
                    btn.on('click', function () {
                        openKozakMenu(e.data.movie);
                    });

                    container.append(btn);
                }
            }
        });
    }

    function openKozakMenu(movie) {
        Lampa.Select.show({
            title: 'Вибір джерела (UA)',
            items: [
                {
                    title: 'Енеїда / UA-Kino (VJS)',
                    subtitle: 'Меню вибору якості та озвучки',
                    id: 'vjs'
                },
                {
                    title: 'Ashdi (Тільки UA)',
                    subtitle: 'Прямий запуск',
                    id: 'ashdi'
                }
            ],
            onSelect: function (item) {
                var embedUrl = '';
                var type = movie.number_of_seasons ? 'tv' : 'movie'; // Перевірка чи це серіал
                var id = movie.id;

                if (item.id === 'vjs') {
                    embedUrl = 'https://vjs.su/embed/tmdb/' + id;
                } else {
                    embedUrl = 'https://ashdi.vip/emb/' + id;
                }

                console.log('[Kozak] Opening URL:', embedUrl);

                // Закриваємо меню перед відкриттям плеєра
                Lampa.Select.close();

                // Використовуємо Activity.push для гарантованого відкриття
                Lampa.Activity.push({
                    url: embedUrl,
                    title: 'Козак ТВ: ' + (movie.title || movie.name),
                    component: 'iframe',
                    page: 1
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
