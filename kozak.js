(function () {
    'use strict';

    function KozakTiv() {
        var ICON_KOZAK = 'https://raw.githubusercontent.com/jordg888/Online/main/kozak.svg'; 
        var api_proxy = 'https://vercel-proxy-blue-six.vercel.app/api?url=';

        this.init = function () {
            var _this = this;
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    setTimeout(function() {
                        try { _this.render(e.data, e.object.activity.render()); } catch (err) {}
                    }, 200);
                }
            });
            Lampa.Component.add('kozak_search', _this.component);
        };

        this.cleanup = function() {
            $('.lampa-kozak-button').remove();
        };

        this.render = function (data, html) {
            var _this = this;
            var container = $(html);
            if (container.find('.lampa-kozak-button').length) return;

            var button = $('<div class="full-start__button selector lampa-kozak-button">' +
                                '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; vertical-align: middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="white"/></svg>' +
                                '<span style="vertical-align: middle;">Козак ТВ</span>' +
                            '</div>');

            var buttons_container = container.find('.full-start-new__buttons, .full-start__buttons');
            var neighbors = buttons_container.find('.selector');
            
            if (neighbors.length >= 2) button.insertAfter(neighbors.eq(1));
            else buttons_container.append(button);

            button.on('hover:enter click', function() {
                Lampa.Activity.push({
                    title: 'Козак ТВ',
                    component: 'kozak_search',
                    movie: data.movie
                });
            });
        };

        this.component = function(object) {
            var network = new Lampa.Reguest();
            var scroll = new Lampa.Scroll({mask: true, over: true});
            var files = new Lampa.Explorer(object);
            
            this.create = function() {
                var _this = this;
                var title = object.movie.title || object.movie.name;
                // Використовуємо короткий метод API для швидкого пошуку
                var search_url = 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);
                var final_url = api_proxy + encodeURIComponent(search_url);

                Lampa.Select.show({title: 'Пошук на Козак ТВ...'});

                network.silent(final_url, function(json) {
                    Lampa.Select.close();
                    
                    // ФІКС: Глибока перевірка наявності масиву даних
                    var items = [];
                    if (json) {
                        if (Array.isArray(json.data)) items = json.data;
                        else if (Array.isArray(json)) items = json;
                    }

                    if (items.length > 0) {
                        items.forEach(function(item) {
                            var card = Lampa.Template.get('button', {title: item.title || item.name || 'Дивитися'});
                            card.on('hover:enter', function() {
                                var video_url = item.iframe_src || item.url;
                                if (video_url) {
                                    if (!video_url.startsWith('http')) video_url = 'https:' + video_url;
                                    Lampa.Player.play({
                                        url: video_url,
                                        title: item.title || title
                                    });
                                } else {
                                    Lampa.Noty.show('Відео не знайдено');
                                }
                            });
                            files.append(card);
                        });
                    } else {
                        Lampa.Noty.show('Нічого не знайдено');
                        files.append(Lampa.Template.get('empty'));
                    }
                    scroll.append(files.render());
                }, function() {
                    Lampa.Select.close();
                    Lampa.Noty.show('Помилка запиту через Vercel');
                    files.append(Lampa.Template.get('empty'));
                    scroll.append(files.render());
                });

                return scroll.render();
            };

            this.render = function() { return this.create(); };
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
