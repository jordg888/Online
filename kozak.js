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
                        var movie = e.data.movie;
                        
                        Lampa.Select.show({
                            title: 'Вибір джерела (UA)',
                            items: [
                                { title: 'Енеїда / UA-Kino (VJS)', id: 'vjs' },
                                { title: 'Ashdi (Тільки UA)', id: 'ashdi' }
                            ],
                            onSelect: function (item) {
                                // Пряме формування URL
                                var embedUrl = (item.id === 'vjs') 
                                    ? 'https://vjs.su/embed/tmdb/' + movie.id 
                                    : 'https://ashdi.vip/emb/' + movie.id;

                                // Видаляємо Select з екрану примусово
                                Lampa.Select.close();

                                // Запуск плеєра через push
                                Lampa.Activity.push({
                                    url: embedUrl,
                                    title: 'Козак ТВ',
                                    component: 'iframe',
                                    page: 1
                                });
                            },
                            onBack: function () {
                                // Просто закриваємо меню без додаткових команд
                                Lampa.Select.close();
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
