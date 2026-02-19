(function () {
    'use strict';

    function KozakInit() {
        console.log('[Kozak] Plugin started');

        // Використовуємо вбудований метод Lampa для слухання подій
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                // Додаємо невелику затримку, щоб DOM встиг відрендеритись
                setTimeout(function() {
                    injectButton(e);
                }, 10);
            }
        });
    }

    function injectButton(e) {
        // Перевіряємо, чи ми на сторінці фільму і чи є об'єкт рендеру
        var render = e.object.activity.render();
        if (!render) return;

        // Шукаємо контейнер для кнопок (через ванільний JS для надійності)
        var container = render[0].querySelector('.full-start-new__buttons, .full-start__buttons');
        
        if (container && !container.querySelector('.kozak-button')) {
            // Створюємо кнопку
            var btn = document.createElement('div');
            btn.className = 'full-start__button selector kozak-button';
            btn.innerHTML = '<span>КОЗАК ТВ</span>';
            
            // Стиль (якщо раптом CSS не підхопиться)
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            btn.style.marginLeft = '10px';

            btn.addEventListener('click', function () {
                var movie = e.data.movie;
                var videoUrl = 'https://vjs.su/embed/tmdb/' + movie.id;
                
                // Виклик вбудованого плеєра/iframe Lampa
                Lampa.Component.add('iframe', {
                    title: 'Козак ТВ: ' + (movie.title || movie.name),
                    url: videoUrl,
                    clean: true
                });
            });

            container.appendChild(btn);
            console.log('[Kozak] Button injected for ID:', e.data.movie.id);
        }
    }

    // Перевірка наявності Lampa перед ініціалізацією
    if (window.Lampa) {
        KozakInit();
    } else {
        window.addEventListener('lampa_ready', KozakInit);
    }
})();
