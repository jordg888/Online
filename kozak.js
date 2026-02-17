(function () {
    'use strict';

    function KozakTiv() {
        // Ми використовуємо відкритий CORS-проксі для стабільності
        var proxy = 'https://corsproxy.io/?'; 

        this.init = function () {
            Lampa.Listener.follow('full', (e) => {
                if (e.type === 'complite') {
                    this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            var button = $('<div class="full-start__button selector"><span>Козак ТВ</span></div>');
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            
            button.on('hover:enter click', () => {
                this.open(data.movie);
            });
            container.append(button);
        };

        this.open = function (movie) {
            // Створюємо порожню активність (екран)
            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online', // Використовуємо вбудований завантажувач
                movie: movie,
                page: 1,
                onRender: (object) => {
                    // Ось тут відбувається магія пошуку
                    var url = proxy + encodeURIComponent('https://ashdi.vip/api/video?title=' + (movie.title || movie.name));
                    
                    $.ajax({
                        url: url,
                        method: 'GET',
                        success: (res) => {
                            // Перевіряємо, чи є дані
                            if (res && res.length) {
                                // Перетворюємо дані балансера у формат LAMPA
                                var items = res.map(item => ({
                                    title: item.title || movie.title,
                                    file: item.file || item.url, // Посилання на відео
                                    quality: item.quality || '720p',
                                    info: 'Козак ТВ'
                                }));
                                
                                // Малюємо список
                                object.draw(items, {
                                    onEnter: (item) => {
                                        Lampa.Player.play({
                                            url: item.file,
                                            title: item.title
                                        });
                                    }
                                });
                                object.loading(false);
                            } else {
                                object.empty(); // Покаже "Тут порожньо", якщо масив пустий
                            }
                        },
                        error: () => {
                            object.doesNotAnswer(); // Покаже помилку мережі
                        }
                    });
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
