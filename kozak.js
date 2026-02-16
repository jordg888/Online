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
                var movie = data.movie;
                var title = movie.title || movie.name;

                // Створюємо компонент з табами зверху
                Lampa.Component.add('kozak_mod', function(object) {
                    var network = new Lampa.Reguest();
                    var scroll = new Lampa.Scroll({mask: true, over: true});
                    var files = new Lampa.Explorer(object);
                    var results = [];
                    
                    this.create = function() {
                        var _this = this;
                        // Вибір балансерів зверху
                        var filter = new Lampa.Filter(object);
                        filter.render().find('.filter__sort').remove(); // Прибираємо сортування
                        
                        filter.onSelect = function(item) {
                            _this.search(item.source);
                        };

                        filter.set('source', [
                            {title: 'Ashdi (UA)', source: 'ashdi', selected: true},
                            {title: 'VideoCDN', source: 'vcdn'},
                            {title: 'Резерв', source: 'rezerv'}
                        ]);

                        this.search('ashdi'); // Стартуємо з Ashdi
                        
                        scroll.append(filter.render());
                        scroll.append(files.render());
                        return scroll.render();
                    };

                    this.search = function(source_type) {
                        files.clear();
                        Lampa.Select.show({title: 'Шукаємо...'});
                        
                        var base_url = '';
                        if(source_type === 'ashdi') base_url = 'https://ashdi.vip/api/video?title=';
                        else if(source_type === 'vcdn') base_url = 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';
                        else base_url = 'https://videocdn.tv/api/movies?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';

                        var final_url = api_proxy + encodeURIComponent(base_url + encodeURIComponent(title));

                        network.silent(final_url, function(json) {
                            Lampa.Select.close();
                            var items = json.data || (Array.isArray(json) ? json : []);
                            
                            if (items.length > 0) {
                                items.forEach(function(item) {
                                    var card = Lampa.Template.get('button', {title: item.title || item.name || 'Відео'});
                                    card.on('hover:enter', function() {
                                        var v_url = item.iframe_src || item.url;
                                        if (v_url) {
                                            if (!v_url.startsWith('http')) v_url = 'https:' + v_url;
                                            Lampa.Player.play({ url: v_url, title: item.title || title });
                                        }
                                    });
                                    files.append(card);
                                });
                            } else {
                                Lampa.Noty.show('Нічого не знайдено на цьому джерелі');
                            }
                        }, function() {
                            Lampa.Select.close();
                            Lampa.Noty.show('Помилка сервера');
                        });
                    };

                    this.render = function() { return this.create(); };
                });

                Lampa.Activity.push({
                    title: 'Козак ТВ',
                    component: 'kozak_mod',
                    movie: movie,
                    page: 1
                });
            });
        };
    }
    if (window.Lampa) new KozakTiv().init();
})();
