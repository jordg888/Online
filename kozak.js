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

                        // Використовуємо один з найнадійніших шлюзів, згаданих у check.sh
                        var url = 'https://cors.lampac.sh/https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);

                        var network = new Lampa.Reguest();
                        
                        // Параметри запиту, що імітують Lampac
                        network.silent(url, function (res) {
                            var data = res.data || res;
                            if (data && data.length) {
                                var items = data.map(function (i) {
                                    return {
                                        title: i.title || title,
                                        file: i.iframe_src || i.file,
                                        quality: '1080p',
                                        info: 'VideoCDN (UA Proxy)'
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
                                object.empty();
                            }
                            object.loading(false);
                        }, function () {
                            // Якщо VideoCDN лежить, пробуємо запасний варіант (Alloha)
                            _this.tryAlloha(title, object);
                        });
                    };
                    object.search();
                }
            });
        };

        this.tryAlloha = function(title, object) {
            var url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);
            var network = new Lampa.Reguest();
            network.silent(url, function(res) {
                if (res && res.data && res.data.iframe) {
                    object.draw([{
                        title: res.data.name || title,
                        file: res.data.iframe,
                        quality: 'HD',
                        info: 'Alloha (UA Proxy)'
                    }], {
                        onEnter: function(item) { Lampa.Player.play({url: item.file, title: item.title}); }
                    });
                } else {
                    object.empty();
                }
                object.loading(false);
            }, function() {
                object.empty();
                object.loading(false);
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
