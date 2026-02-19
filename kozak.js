(function () {
    'use strict';

    function KozakPlugin() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    var render = e.object.activity.render();
                    var container = render.find('.full-start-new__buttons, .full-start__buttons');
                    
                    if (container.length && !container.find('.kozak-button').length) {
                        var btn = $('<div class="full-start__button selector kozak-button"><span>КОЗАК ТВ (UA)</span></div>');
                        
                        btn.on('click', function () {
                            var movie = e.data.movie;
                            
                            // Викликаємо вікно вибору балансерів через універсальний онлайн-модуль
                            Lampa.Component.add('online', {
                                title: movie.title || movie.name,
                                url: '', 
                                movie: movie,
                                // Цей метод змушує Лампу шукати по всіх активних плагінах онлайн-перегляду
                                onBack: function() {
                                    Lampa.Activity.backward();
                                }
                            });
                        });

                        container.append(btn);
                    }
                }, 100);
            }
        });
    }

    if (window.Lampa) KozakPlugin();
    else window.addEventListener('lampa_ready', KozakPlugin);
})();
