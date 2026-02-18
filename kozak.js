(function () {
    'use strict';

    function KozakPlugin() {
        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    var html = $(e.object.activity.render());
                    var location = html.find('.full-start-new__buttons, .full-start__buttons');
                    
                    if (!location.find('.kozak-go').length) {
                        var btn = $('<div class="full-start__button selector kozak-go" style="background: #ffde1a !important; color: #000 !important; font-weight: bold;"><span>КОЗАК ТВ</span></div>');
                        btn.on('hover:enter click', function () {
                            Lampa.Component.add('kozak_component', KozakComponent); // Реєструємо компонент
                            Lampa.Activity.push({
                                title: 'Козак ТВ',
                                component: 'kozak_component', // Викликаємо свій компонент
                                movie: e.data.movie,
                                page: 1
                            });
                        });
                        location.append(btn);
                    }
                }
            });
        };
    }

    function KozakComponent(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({mask: true, over: true});
        var files = new Lampa.Explorer(object);
        var filter = new Lampa.Filter(object);
        var results = [];

        this.create = function () {
            var _this = this;

            // 1. МАЛЮЄМО ФІЛЬТРИ (ВИБІР ДЖЕРЕЛА)
            filter.onSelect = function (type, item) {
                _this.search(item.source);
            };

            filter.set({
                source: [
                    {title: 'VideoCDN', source: 'vcdn', selected: true},
                    {title: 'Ashdi (UA)', source: 'ashdi'},
                    {title: 'KinoBase', source: 'kbase'}
                ]
            });

            // 2. ГОТУЄМО ЕКРАН
            this.build = function () {
                scroll.minus();
                scroll.append(Lampa.Template.get('loader')); // Показуємо завантаження
                this.search('vcdn'); // Стартуємо з VideoCDN
                return files.render();
            };

            // 3. ФУНКЦІЯ ПОШУКУ
            this.search = function (source) {
                var title = object.movie.title || object.movie.name;
                var url = '';

                if (source === 'vcdn') url = 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);
                if (source === 'ashdi') url = 'https://ashdi.vip/api/video?title=' + encodeURIComponent(title);
                if (source === 'kbase') url = 'https://kinobase.org/api/v1/search?title=' + encodeURIComponent(title);

                var proxy = 'https://corsproxy.io/?' + encodeURIComponent(url);

                network.silent(proxy, function (res) {
                    var data = res.data || res;
                    scroll.clear();
                    
                    if (data && data.length) {
                        data.forEach(function (item) {
                            var card = Lampa.Template.get('online_item', {
                                title: item.title || title,
                                quality: 'HD'
                            });
                            
                            card.on('hover:enter click', function () {
                                Lampa.Player.play({
                                    url: item.file || item.iframe_src || item.url,
                                    title: item.title || title
                                });
                            });
                            scroll.append(card);
                        });
                    } else {
                        scroll.append('<div class="empty">Нічого не знайдено в ' + source.toUpperCase() + '</div>');
                    }
                    Lampa.Controller.enable('content');
                }, function () {
                    scroll.clear();
                    scroll.append('<div class="empty">Помилка мережі</div>');
                });
            };

            return this.build();
        };

        this.render = function () {
            return scroll.render();
        };
    }

    if (window.Lampa) {
        new KozakPlugin().init();
    }
})();
