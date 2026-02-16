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
            var button = $('<div class="full-start__button selector lampa-kozak-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:10px;vertical-align:middle;"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="white"/></svg><span style="vertical-align:middle;">Козак ТВ</span></div>');
            var container = $(html).find('.full-start-new__buttons, .full-start__buttons');
            if (container.find('.lampa-kozak-button').length) return;
            container.append(button);

            button.on('hover:enter click', function() {
                Lampa.Activity.push({
                    title: 'Козак ТВ',
                    component: 'kozak_mod',
                    movie: data.movie
                });
            });
        };

        Lampa.Component.add('kozak_mod', function(object) {
            var scroll = new Lampa.Scroll({mask: true, over: true});
            var container = $('<div class="kozak-list"></div>');
            var title = object.movie.title || object.movie.name;
            
            this.create = function() {
                var _this = this;
                
                // Створюємо перемикач балансерів вручну
                var tabs = $('<div class="kozak-tabs" style="display:flex; padding: 10px; gap: 10px;"></div>');
                var sources = [
                    { name: 'Ashdi (UA)', id: 'ashdi' },
                    { name: 'VideoCDN', id: 'vcdn' }
                ];

                sources.forEach(function(s) {
                    var tab = $('<div class="selector tab-button" style="padding: 10px 20px; background: rgba(255,255,255,0.1); border-radius: 5px;">' + s.name + '</div>');
                    tab.on('hover:enter click', function() {
                        _this.load(s.id);
                    });
                    tabs.append(tab);
                });

                scroll.append(tabs);
                scroll.append(container);

                this.load('ashdi'); // Перший запуск
                return scroll.render();
            };

            this.load = function(type) {
                container.empty();
                Lampa.Select.show({title: 'Шукаємо...'});
                
                var base = type === 'ashdi' 
                    ? 'https://ashdi.vip/api/video?title=' 
                    : 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';
                
                var url = api_proxy + encodeURIComponent(base + encodeURIComponent(title));

                $.ajax({
                    url: url,
                    method: 'GET',
                    success: function(json) {
                        Lampa.Select.close();
                        var items = json && json.data ? json.data : (Array.isArray(json) ? json : []);
                        
                        if (items.length > 0) {
                            items.forEach(function(item) {
                                var name = item.title || item.name || 'Відео';
                                var card = $('<div class="selector button-card" style="padding: 15px; margin: 5px; background: rgba(255,255,255,0.05); border-radius: 10px;">' + name + '</div>');
                                card.on('hover:enter click', function() {
                                    var link = item.iframe_src || item.url;
                                    if (link) {
                                        if (!link.startsWith('http')) link = 'https:' + link;
                                        Lampa.Player.play({ url: link, title: name });
                                    }
                                });
                                container.append(card);
                            });
                            // Оновлюємо контролер, щоб кнопки стали клікабельними
                            Lampa.Controller.enable('content');
                        } else {
                            Lampa.Noty.show('Нічого не знайдено');
                        }
                    },
                    error: function() {
                        Lampa.Select.close();
                        Lampa.Noty.show('Помилка проксі');
                    }
                });
            };

            this.render = function() { return this.create(); };
        });
    }
    if (window.Lampa) new KozakTiv().init();
})();
