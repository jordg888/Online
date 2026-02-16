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
            var list_container = $('<div style="padding: 20px;"></div>');
            var title = object.movie.title || object.movie.name;
            
            this.create = function() {
                var _this = this;
                
                // Створюємо заголовок і кнопки балансерів
                var head = $('<div style="margin-bottom: 20px;">' +
                                '<h2 style="margin-bottom: 15px;">Оберіть балансер:</h2>' +
                                '<div style="display: flex; gap: 10px;" class="kozak-nav"></div>' +
                             '</div>');
                
                var btn_ashdi = $('<div class="selector" style="padding: 15px 25px; background: rgba(255,255,255,0.1); border-radius: 8px;">Ashdi (UA)</div>');
                var btn_vcdn = $('<div class="selector" style="padding: 15px 25px; background: rgba(255,255,255,0.1); border-radius: 8px;">VideoCDN</div>');

                btn_ashdi.on('hover:enter click', function() { _this.load('ashdi'); });
                btn_vcdn.on('hover:enter click', function() { _this.load('vcdn'); });

                head.find('.kozak-nav').append(btn_ashdi).append(btn_vcdn);
                list_container.append(head);
                
                // Місце для результатів
                var results_box = $('<div class="kozak-results" style="margin-top: 20px;"></div>');
                list_container.append(results_box);

                scroll.append(list_container);
                return scroll.render();
            };

            this.load = function(type) {
                var box = list_container.find('.kozak-results');
                box.empty().append('<div style="padding: 20px;">Пошук...</div>');
                
                var base = type === 'ashdi' 
                    ? 'https://ashdi.vip/api/video?title=' 
                    : 'https://videocdn.tv/api/short?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=';
                
                var url = api_proxy + encodeURIComponent(base + encodeURIComponent(title));

                $.ajax({
                    url: url,
                    method: 'GET',
                    timeout: 10000,
                    success: function(response) {
                        box.empty();
                        try {
                            // Якщо прийшов текст замість JSON, спробуємо його розпарсити
                            var json = (typeof response === 'string') ? JSON.parse(response) : response;
                            var items = json && json.data ? json.data : (Array.isArray(json) ? json : []);
                            
                            if (items && items.length > 0) {
                                items.forEach(function(item) {
                                    if (!item) return;
                                    var name = item.title || item.name || 'Дивитися відео';
                                    var card = $('<div class="selector" style="padding: 15px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; border-left: 4px solid #fff;">' + name + '</div>');
                                    
                                    card.on('hover:enter click', function() {
                                        var link = item.iframe_src || item.url;
                                        if (link) {
                                            if (!link.startsWith('http')) link = 'https:' + link;
                                            Lampa.Player.play({ url: link, title: name });
                                        }
                                    });
                                    box.append(card);
                                });
                                // Обов'язково вмикаємо навігацію для нових елементів
                                Lampa.Controller.enable('content');
                            } else {
                                box.append('<div style="padding: 20px; color: #aaa;">Нічого не знайдено на цьому балансері</div>');
                            }
                        } catch (e) {
                            box.append('<div style="padding: 20px; color: red;">Сервер повернув невірні дані</div>');
                        }
                    },
                    error: function() {
                        box.empty().append('<div style="padding: 20px; color: red;">Помилка проксі. Перевірте Vercel.</div>');
                    }
                });
            };

            this.render = function() { return this.create(); };
        });
    }
    if (window.Lampa) new KozakTiv().init();
})();
