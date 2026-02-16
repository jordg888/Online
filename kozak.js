(function () {
    'use strict';
    function KozakTiv() {
        var api_proxy = 'https://vercel-proxy-blue-six.vercel.app/api?url=';
        
        this.init = function () {
            var _this = this;
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    setTimeout(function() { _this.render(e.data, e.object.activity.render()); }, 200);
                }
            });
        };

        this.cleanup = function() { $('.lampa-kozak-button').remove(); };

        this.render = function (data, html) {
            var _this = this;
            var button = $('<div class="full-start__button selector lampa-kozak-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:10px;vertical-align:middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="white"/></svg><span style="vertical-align:middle;">Козак ТВ</span></div>');
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);

            button.on('hover:enter click', function() {
                var items = [
                    {
                        title: 'Балансер: Ashdi (UA)',
                        source: 'https://ashdi.vip/api/video?title='
                    },
                    {
                        title: 'Балансер: VideoCDN',
                        source: 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title='
                    },
                    {
                        title: 'Балансер: Резерв',
                        source: 'https://videocdn.tv/api/movies?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title='
                    }
                ];

                Lampa.Select.show({
                    title: 'Оберіть джерело',
                    items: items,
                    onSelect: function(item) {
                        var search_url = item.source + encodeURIComponent(data.movie.title || data.movie.name);
                        Lampa.Activity.push({
                            title: 'Козак ТВ: ' + (data.movie.title || data.movie.name),
                            component: 'online',
                            movie: data.movie,
                            url: api_proxy + encodeURIComponent(search_url)
                        });
                    },
                    onBack: function() {
                        Lampa.Controller.toggle('full_start');
                    }
                });
            });
        };
    }
    if (window.Lampa) new KozakTiv().init();
})();
