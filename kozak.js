(function () {
    'use strict';

    function KozakPlugin() {
        // Спроба номер 1: Через стандартний Listener
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' || e.type === 'ready') {
                addButton(e.object.activity.render(), e.data);
            }
        });

        // Спроба номер 2: Пряма ін'єкція в рендер (для надійності)
        var originalRender = Lampa.Component.get('full').prototype.create;
        Lampa.Component.get('full').prototype.create = function() {
            var render = originalRender.apply(this, arguments);
            addButton(this.render(), this.data);
            return render;
        };

        function addButton(html, data) {
            if (!html || !data || !data.movie) return;
            
            // Перевіряємо, чи ми вже не додали кнопку
            if ($(html).find('.kozak-button').length > 0) return;

            var btn = $('<div class="full-start__button selector kozak-button"><span>КОЗАК ТВ</span></div>');

            btn.on('click', function () {
                var video_url = 'https://vjs.su/embed/tmdb/' + data.movie.id;
                
                Lampa.Component.add('iframe', {
                    title: 'Козак ТВ',
                    url: video_url,
                    clean: true,
                    onBack: function() {
                        Lampa.Activity.backward();
                    }
                });
            });

            // Шукаємо місце для кнопки
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.length) {
                container.append(btn);
            }
        }
    }

    // Безпечний запуск
    if (window.Lampa) {
        KozakPlugin();
    } else {
        // Якщо Lampa ще не завантажилася, чекаємо
        window.addEventListener('lampa_ready', KozakPlugin);
    }
})();
