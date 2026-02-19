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
                    id: 'vjs'
                },
                {
                    title: 'Ashdi (Тільки UA)',
                    id: 'ashdi'
                }
            ],
            onSelect: function (item) {
                var embedUrl = (item.id === 'vjs') 
                    ? 'https://vjs.su/embed/tmdb/' + movie.id 
                    : 'https://ashdi.vip/emb/' + movie.id;

                // 1. Спочатку закриваємо меню БЕЗ виклику зворотних функцій
                Lampa.Select.close();

                // 2. Створюємо компонент вручну (це найнадійніший метод)
                var activity = {
                    component: 'iframe',
                    title: 'Козак ТВ',
                    url: embedUrl,
                    page: 1
                };

                // 3. Штовхаємо в стек
                Lampa.Activity.push(activity);
            },
            onBack: function () {
                // Просто закриваємо без зайвих команд
                Lampa.Select.close();
            }
        });
    }

    if (window.Lampa) KozakPlugin();
    else window.addEventListener('lampa_ready', KozakPlugin);
})();
