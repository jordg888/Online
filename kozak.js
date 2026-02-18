(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    setTimeout(function() {
                        _this.render(e.data, e.object.activity.render());
                    }, 400);
                }
            });
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var button = $('<div class="full-start__button selector lampa-kozak-button" style="border: 2px solid #ffde1a !important; background: rgba(255, 222, 26, 0.2) !important;"><span style="font-weight: bold; color: #fff;">КОЗАК ТВ (Multi)</span></div>');
            button.on('hover:enter click', function() { _this.open(data.movie); });
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(button);
        };

        this.open = function (movie) {
            Lampa.Activity.push({
                title: 'Козак ТВ',
                component: 'online',
                movie: movie,
                page: 1,
                onRender: function(object) {
                    // Фільтр для вигляду
                    object.filter.set({ source: [{title: 'Всі джерела', source: 'all', selected: true}] });

                    object.search = function() {
                        object.loading(true);
                        var title = movie.title || movie.name;
                        var results = [];
                        var count = 0;

                        // Список джерел для прямого опитування
                        var sources = [
                            { name: 'VCDN', url: 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title) },
                            { name: 'Ashdi', url: 'https://ashdi.vip/api/video?title=' + encodeURIComponent(title) },
                            { name: 'KBase', url: 'https://kinobase.org/api/v1/search?title=' + encodeURIComponent(title) }
                        ];

                        sources.forEach(function(src) {
                            // Використовуємо corsproxy, щоб обійти CORS, але запит іде від твого IP
                            var final_url = 'https://corsproxy.io/?' + encodeURIComponent(src.url);

                            $.ajax({
                                url: final_url,
                                method: 'GET',
                                dataType: 'json',
                                success: function(res) {
                                    var data = res.data || res;
                                    if (data && data.length) {
                                        data.forEach(function(item) {
                                            results.push({
                                                title: item.title || title,
                                                file: item.file || item.iframe_src || item.url,
                                                quality: 'HD',
                                                info: src.name
                                            });
                                        });
                                    }
                                    checkEnd();
                                },
                                error: function() { checkEnd(); }
                            });
                        });

                        function checkEnd() {
                            count++;
                            if (count === sources.length) {
                                if (results.length > 0) {
                                    object.draw(results, {
                                        onEnter: function(i) { Lampa.Player.play({url: i.file, title: i.title}); }
                                    });
                                } else {
                                    object.empty();
                                }
                                object.loading(false);
                            }
                        }
                    };
                    object.search();
                }
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
