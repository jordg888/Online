(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite' || e.type === 'ready') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #e67e22 !important; color: #fff !important; border-radius: 8px; margin-top: 10px; display: flex; align-items: center; justify-content: center; height: 3.5em; cursor: pointer;"><span>КОЗАК ТВ: ДИВИТИСЬ</span></div>');
            
            btn.on('click', function () {
                _this.search(data.movie);
            });

            var container = $(html).find('.full-start-new__buttons, .full-start__buttons, .full-start__btns');
            if (container.length > 0) container.append(btn);
            else $(html).find('.full-start__description').after(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            var year = movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : '');
            
            Lampa.Noty.show('Шукаю плеєри для: ' + title);

            // Використовуємо Kinobox API (не потребує токенів)
            // Шукаємо за назвою та роком для точності
            var search_url = 'https://kinobox.tv/api/players?title=' + encodeURIComponent(title) + (year ? '&year=' + year : '');

            $.ajax({
                url: search_url,
                method: 'GET',
                dataType: 'json',
                success: function(res) {
                    // Kinobox повертає масив знайдених плеєрів
                    if (res && res.length > 0) {
                        // Беремо перший знайдений робочий плеєр (зазвичай він найстабільніший)
                        var video = res[0].iframeUrl || res[0].link;

                        if (video) {
                            if (video.indexOf('//') === 0) video = 'https:' + video;
                            
                            Lampa.Noty.show('Знайдено ' + res.length + ' варіантів. Запускаю...');
                            
                            Lampa.Player.play({
                                url: video,
                                title: title
                            });
                        } else {
                            Lampa.Noty.show('Посилання на відео порожнє');
                        }
                    } else {
                        Lampa.Noty.show('Нічого не знайдено в базах');
                    }
                },
                error: function() {
                    Lampa.Noty.show('Помилка мережі або блокування');
                }
            });
        };
    }

    if (window.Lampa) {
        new KozakTiv().init();
    }
})();
