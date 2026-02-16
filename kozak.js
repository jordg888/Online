(function () {
    'use strict';

    function KozakTiv() {
        var ICON_KOZAK = 'https://raw.githubusercontent.com/jordg888/Online/main/kozak.svg'; // Можете замінити на свою
        var api_proxy = 'https://vercel-proxy-blue-six.vercel.app/';

        this.init = function () {
            var _this = this;
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    _this.cleanup();
                    setTimeout(function() {
                        try {
                            _this.render(e.data, e.object.activity.render());
                        } catch (err) {}
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
                                '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="white"/></svg>' +
                                '<span>Козак ТВ</span>' +
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
                var search_url = 'https://videocdn.tv/api/movies?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + encodeURIComponent(title);
                var final_url = api_proxy + '?url=' + encodeURIComponent(search_url);

                Lampa.Select.show({title: 'Пошук...'});

                network.silent(final_url, function(json) {
                    Lampa.Select.close();
                    // БЕЗПЕЧНА ПЕРЕВІРКА: тепер не "впаде"
                    if (json && json.data && Array.isArray(json.data)) {
                        json.data.forEach(function(item) {
                            var card = Lampa.Template.get('button', {title: item.title});
                            card.on('hover:enter', function() {
                                if (item.iframe_src) {
                                    Lampa.Player.play({
                                        url: 'https:' + item.iframe_src,
                                        title: item.title
                                    });
                                }
                            });
                            files.append(card);
                        });
                    } else {
                        Lampa.Noty.show('Нічого не знайдено або помилка сервера');
                        files.append(Lampa.Template.get('empty'));
                    }
                    scroll.append(files.render());
                }, function() {
                    Lampa.Select.close();
                    Lampa.Noty.show('Сервер 404: Перевірте папки на GitHub');
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
