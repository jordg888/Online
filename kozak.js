(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border: 1px solid #fff;"><span>КОЗАК ТВ</span></div>');
            btn.on('hover:enter click', function () { _this.open(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.open = function (movie) {
            var title = movie.title || movie.name;
            
            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online',
                movie: movie,
                page: 1,
                onRender: function(object) {
                    object.search = function() {
                        object.loading(true);

                        // Використовуємо дзеркало з найменшою дистанцією до балансерів
                        var url = 'https://cors.lampac.sh/https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);

                        var network = new Lampa.Reguest();
                        
                        // Ця частина імітує реальний Lampac-клієнт
                        network.silent(url, function (res) {
                            var data = res.data || res;
                            if (data && (data.length || data.data)) {
                                var results = data.data || data;
                                var items = results.map(function (i) {
                                    return {
                                        title: i.title || title,
                                        file: i.iframe_src || i.file,
                                        quality: '1080p',
                                        info: 'Online'
                                    };
                                });
                                object.draw(items, {
                                    onEnter: function (item) {
                                        var video = item.file;
                                        if (video.indexOf('//') === 0) video = 'https:' + video;
                                        Lampa.Player.play({ url: video, title: item.title });
                                    }
                                });
                            } else {
                                // Якщо порожньо, робимо останню спробу через інший шлюз
                                object.empty(); 
                            }
                            object.loading(false);
                        }, function () {
                            Lampa.Noty.show('Помилка доступу до шлюзу');
                            object.loading(false);
                        }, false, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                            }
                        });
                    };
                    object.search();
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
