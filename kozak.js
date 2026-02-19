(function () {
    'use strict';

    function KozakPlugin() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                var render = e.object.activity.render();
                // Шукаємо контейнер для кнопок
                var container = render.find('.full-start-new__buttons, .full-start__buttons');
                
                if (container.length && !container.find('.kozak-button').length) {
                    // Створюємо кнопку з примусовими стилями для видимості
                    var btn = $('<div class="full-start__button selector kozak-button" style="background: #24b47e; color: #fff; opacity: 1 !important; display: flex !important;"><span>КОЗАК ТВ</span></div>');
                    
                    btn.on('click', function () {
                        // Викликаємо пошук по всіх встановлених балансерах
                        Lampa.Component.add('online', {
                            title: e.data.movie.title || e.data.movie.name,
                            url: '',
                            movie: e.data.movie,
                            onBack: function() {
                                Lampa.Activity.backward();
                            }
                        });
                    });

                    container.append(btn);
                }
            }
        });
    }

    if (window.Lampa) KozakPlugin();
    else window.addEventListener('lampa_ready', KozakPlugin);
})();
