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
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #ffde1a !important; color: #000 !important; border: 2px solid #fff;"><span>КОЗАК ТВ</span></div>');
            btn.on('hover:enter click', function () { _this.openPage(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.openPage = function (movie) {
            var title = movie.title || movie.name;
            
            // Створюємо власну активність (сторінку)
            Lampa.Activity.push({
                title: 'Козак ТВ: ' + title,
                component: 'kozak_search', 
                movie: movie,
                onRender: function(object) {
                    var scroll = new Lampa.Scroll({mask: true, over: true});
                    var files = new Lampa.Explorer(object);
                    
                    // Малюємо індикатор завантаження
                    scroll.append(Lampa.Template.get('loader'));
                    
                    var url = 'https://cors.lampac.sh/https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);

                    var network = new Lampa.Reguest();
                    network.silent(url, function (res) {
                        scroll.clear(); // Прибираємо завантаження
                        
                        if (res && res.data && res.data.iframe) {
                            var item = Lampa.Template.get('online_item', {
                                title: res.data.name || title,
                                quality: 'HD'
                            });

                            item.on('hover:enter click', function () {
                                var video = res.data.iframe;
                                if (video.indexOf('//') === 0) video = 'https:' + video;
                                Lampa.Player.play({ url: video, title: title });
                            });

                            scroll.append(item);
                        } else {
                            scroll.append('<div class="empty">Нічого не знайдено в базі Козак ТВ</div>');
                        }
                        Lampa.Controller.enable('content');
                    }, function () {
                        scroll.clear();
                        scroll.append('<div class="empty">Помилка мережі (Перевірте проксі)</div>');
                    });

                    return scroll.render();
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
