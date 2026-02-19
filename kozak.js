(function () {
    'use strict';

    function KozakTiv() {
        var _this = this;

        this.init = function () {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite' || e.type === 'ready') {
                    _this.render(e.data, e.object.activity.render());
                }
            });
        };

        this.render = function (data, html) {
            $('.lampa-kozak-btn').remove();
            var btn = $('<div class="full-start__button selector lampa-kozak-btn" style="background: #e67e22 !important; color: #fff !important; border-radius: 5px; font-weight: bold;"><span>ДИВИТИСЬ (KOZAK)</span></div>');
            
            btn.on('click', function () { 
                console.log('Kozak:', 'Кнопку натиснуто для:', data.movie.title);
                _this.search(data.movie); 
            });
            
            $(html).find('.full-start-new__buttons, .full-start__buttons').append(btn);
        };

        this.search = function (movie) {
            var title = movie.title || movie.name;
            Lampa.Noty.show('Пошук відео...');
            
            // Використовуємо Alloha через native-запит (він обходить CORS)
            var url = 'https://api.alloha.tv/?token=044417740f9350436d7a71888e5d61&name=' + encodeURIComponent(title);
            
            console.log('Kozak:', 'Запит до API:', url);

            Lampa.Reguest.native(url, function(res) {
                console.log('Kozak:', 'Отримано відповідь:', res);
                
                // Перевіряємо структуру відповіді Alloha
                var video_url = '';
                if (res.data && res.data.iframe_url) video_url = res.data.iframe_url;
                else if (res.data && res.data.iframe) video_url = res.data.iframe;
                else if (res.iframe) video_url = res.iframe;

                if (video_url) {
                    if (video_url.indexOf('//') === 0) video_url = 'https:' + video_url;
                    
                    Lampa.Player.play({
                        url: video_url,
                        title: title
                    });
                } else {
                    Lampa.Noty.show('Відео не знайдено в базі');
                }
            }, function(err) {
                console.error('Kozak Error:', err);
                Lampa.Noty.show('Помилка мережі');
            });
        };
    }

    if (window.Lampa) new KozakTiv().init();
})();
