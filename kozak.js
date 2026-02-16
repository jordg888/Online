(function() {
  'use strict';

  var LampaProxy = {
    // Твоя адреса на Vercel
    api_url: 'https://vercel-proxy-blue-six.vercel.app/api?url=',
    
    // Приклад балансера (VideoCDN) - пізніше додамо більше
    balansers: [
      {
        name: 'VideoCDN',
        url: 'https://videocdn.tv/api/short?api_token=YOU_TOKEN_HERE' // Тут потрібен токен (можна знайти в мережі або отримати свій)
      }
    ]
  };

  function Component(object) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({mask: true, over: true});
    var files = new Lampa.Explorer(object);
    
    this.initialize = function() {
      var _this = this;
      
      // Формуємо запит до балансера через твій Vercel
      // Для тесту спробуємо пошук по назві
      var movie_title = encodeURIComponent(object.movie.title || object.movie.name);
      var search_url = 'https://videocdn.tv/api/movies?api_token=3i40v5i7z6CcU4SHe627S74y704mIu62&title=' + movie_title;
      
      // Кінцевий URL, який йде на твій сервер
      var final_url = LampaProxy.api_url + encodeURIComponent(search_url);

      network.silent(final_url, function(json) {
        if (json.data && json.data.length > 0) {
           _this.buildList(json.data);
        } else {
           _this.empty();
        }
      }, function() {
        _this.empty();
      });
    };

    this.buildList = function(data) {
      var _this = this;
      // Логіка побудови списку файлів (спрощена для тесту)
      data.forEach(function(item) {
        var tpl = Lampa.Template.get('button', {title: item.title});
        tpl.on('hover:enter', function() {
            // Тут буде запуск плеєра
            Lampa.Player.play({
                url: 'https:' + item.iframe_src, // Це лише приклад, потрібен парсинг прямих посилань
                title: item.title
            });
        });
        files.append(tpl);
      });
      
      scroll.append(files.render());
      this.render = function() { return scroll.render(); };
    };

    this.empty = function() {
        files.append(Lampa.Template.get('empty'));
        scroll.append(files.render());
    };
  }

  // Реєстрація плагіна в Lampa
  function startPlugin() {
    window.plugin_my_proxy_ready = true;
    
    Lampa.Component.add('my_proxy_balanser', Component);
    
    // Додаємо кнопку "Мій Проксі" в картку фільму
    Lampa.Listener.follow('full', function(e) {
      if (e.type == 'render') {
        var button = $('<div class="full-start__button selector"><span>Мій Проксі</span></div>');
        button.on('hover:enter', function() {
          Lampa.Activity.push({
            url: '',
            title: 'Результати пошуку',
            component: 'my_proxy_balanser',
            movie: e.object.movie,
            page: 1
          });
        });
        e.render.find('.full-start__buttons').append(button);
      }
    });
  }

  if (window.appready) startPlugin();
  else Lampa.Listener.follow('app', function(e) { if (e.type == 'ready') startPlugin(); });

})();
